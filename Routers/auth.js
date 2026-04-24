import express from "express";
import { forgotPassword, resetPassword } from "../Controllers/auth.js";
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
const router = express.Router();

router.post("/signup", upload.single("cv"), signup);
router.post("/login", login);
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);
router.put("/profile-image/:id", uploadProfileImage.single("profileImage"), uploadProfilePicture);
router.delete("/profile/:id", authMiddleware, deleteProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;