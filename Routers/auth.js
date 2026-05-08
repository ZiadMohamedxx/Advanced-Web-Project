import express from "express";
import { forgotPassword, resetPassword } from "../Controllers/auth.js";
import { googleLogin } from "../Controllers/auth.js";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import User from "../Models/user.js";

import {
  signup,
  login,
  upload,
  getProfile,
  updateProfile,
  uploadProfilePicture,
  uploadProfileImage,
  deleteProfile
} from "../Controllers/auth.js";
import authMiddleware from "../Middleware/auth.js";
import passport from "passport";

const router = express.Router();
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);


router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/signin",
    session: false,
  }),
  async (req, res) => {

    // NEW USER
    if (req.user.isNewUser) {

      const userData = encodeURIComponent(
        JSON.stringify(req.user)
      );

      return res.redirect(
        `http://localhost:8080/signup?googleData=${userData}`
      );
    }

    // EXISTING USER
    const token = jwt.sign(
      {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userData = encodeURIComponent(
  JSON.stringify(req.user)
);

    res.redirect(
  `http://localhost:8080/auth/success?token=${token}&user=${userData}`
);
  }
);
router.post("/signup", upload.single("cv"), signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);
router.put("/profile-image/:id", uploadProfileImage.single("profileImage"), uploadProfilePicture);
router.delete("/profile/:id", authMiddleware, deleteProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;