import express from "express";
import {
  signup,
  login,
  upload,
  getProfile,
  updateProfile,
  uploadProfilePicture,
  uploadProfileImage,
} from "../Controllers/auth.js";

const router = express.Router();

router.post("/signup", upload.single("cv"), signup);
router.post("/login", login);
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);
router.put("/profile-image/:id", uploadProfileImage.single("profileImage"), uploadProfilePicture);

export default router;