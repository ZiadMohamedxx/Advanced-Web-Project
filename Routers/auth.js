import express from "express";
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

export default router;