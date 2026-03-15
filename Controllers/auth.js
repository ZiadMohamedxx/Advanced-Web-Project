import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/user.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// ─── Multer Setup ─────────────────────────────────────────────────────────────

const uploadDir = "uploads/cvs";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
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

// ─── Signup ───────────────────────────────────────────────────────────────────

const signup = async (req, res) => {
  try {
    const {
      role,
      name,
      email,
      password,
      phone,

      // candidate-only
      disabilityType,
      preferredAccommodations,

      // corporate-only
      companyName,
      contactFirstName,
      contactLastName,
      industry,
      companySize,
    } = req.body;  // ✅ req.body now works because multer parsed the multipart form

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
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

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
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export { signup, login };