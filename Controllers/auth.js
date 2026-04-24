import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/user.js";
import multer from "multer";
import fs from "fs";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";


import Application from "../Models/application.js";
import Job from "../Models/job.js";

export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 🔥 If candidate → delete applications
    if (user.role === "candidate") {
      await Application.deleteMany({ candidate: id });
    }

    // 🔥 If corporate → delete jobs + applications
    if (user.role === "corporate") {
      const jobs = await Job.find({ employer: id });

      const jobIds = jobs.map((job) => job._id);

      await Application.deleteMany({ job: { $in: jobIds } });
      await Job.deleteMany({ employer: id });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "Profile deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// CV upload folder
const cvUploadDir = "uploads/cvs";
if (!fs.existsSync(cvUploadDir)) {
  fs.mkdirSync(cvUploadDir, { recursive: true });
}

// Profile image upload folder
const profileUploadDir = "uploads/profiles";
if (!fs.existsSync(profileUploadDir)) {
  fs.mkdirSync(profileUploadDir, { recursive: true });
}

// CV storage
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, cvUploadDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});

// Profile image storage
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileUploadDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});

export const upload = multer({
  storage: cvStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"));
    }
  },
});

export const uploadProfileImage = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const buildUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    disabilityType: user.disabilityType,
    preferredAccommodations: user.preferredAccommodations,
    cvPath: user.cvPath,
    companyName: user.companyName,
    contactFirstName: user.contactFirstName,
    contactLastName: user.contactLastName,
    industry: user.industry,
    companySize: user.companySize,
    profileImage: user.profileImage,
  };
};

const signup = async (req, res) => {
  try {
    const {
      role,
      name,
      email,
      password,
      phone,
      disabilityType,
      preferredAccommodations,
      companyName,
      contactFirstName,
      contactLastName,
      industry,
      companySize,
    } = req.body;

    if (!role || !email || !password) {
      return res.status(400).json({ message: "Please provide role, email and password" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;

    if (role === "candidate") {
      if (!name) {
        return res.status(400).json({ message: "Please provide your name" });
      }

      newUser = await User.create({
        role,
        name,
        email,
        password: hashedPassword,
        phone: phone || "",
        disabilityType: disabilityType || "",
        preferredAccommodations: preferredAccommodations || "",
        cvPath: req.file ? req.file.path : null,
      });
    } else if (role === "corporate") {
      if (!companyName || !contactFirstName || !contactLastName) {
        return res.status(400).json({ message: "Please provide company name and contact name" });
      }

      newUser = await User.create({
        role,
        name: companyName,
        email,
        password: hashedPassword,
        phone: phone || "",
        companyName,
        contactFirstName,
        contactLastName,
        industry: industry || "",
        companySize: companySize || "",
      });
    } else {
      return res.status(400).json({ message: `Unknown role: ${role}` });
    }

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: buildUserResponse(newUser),
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      user: buildUserResponse(user),
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      phone,
      disabilityType,
      preferredAccommodations,
      companyName,
      contactFirstName,
      contactLastName,
      industry,
      companySize,
    } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (user.role === "candidate") {
      if (disabilityType !== undefined) {
        user.disabilityType = disabilityType;
      }

      if (preferredAccommodations !== undefined) {
        user.preferredAccommodations = preferredAccommodations;
      }
    }

    if (user.role === "corporate") {
      if (companyName !== undefined) {
        user.companyName = companyName;
        user.name = name ; 
      }

      if (contactFirstName !== undefined) {
        user.contactFirstName = contactFirstName;
      }

      if (contactLastName !== undefined) {
        user.contactLastName = contactLastName;
      }

      if (industry !== undefined) {
        user.industry = industry;
      }

      if (companySize !== undefined) {
        user.companySize = companySize;
      }
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    user.profileImage = req.file.path;
    await user.save();

    res.status(200).json({
      message: "Profile image uploaded successfully",
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    const resetUrl = `http://localhost:8080/reset-password/${resetToken}`;

await sendEmail({
  to: user.email,
  subject: "Reset Your Password - InclusiveHire",
  html: `
    <div style="font-family: Arial; padding: 20px;">
      <h2>Reset Your Password</h2>
      <p>Hello ${user.name},</p>
      <p>You requested to reset your password.</p>

      <a href="${resetUrl}" 
         style="display:inline-block;padding:10px 20px;
         background:#2563eb;color:#fff;text-decoration:none;
         border-radius:6px;margin-top:10px;">
         Reset Password
      </a>

      <p style="margin-top:20px;">If you didn’t request this, ignore this email.</p>
    </div>
  `,
});

    res.status(200).json({ message: "Email sent" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password updated" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export { signup, login, getProfile, updateProfile, uploadProfilePicture };