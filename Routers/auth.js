import express from "express";
import { signup, login, upload } from "../Controllers/auth.js";

const router = express.Router();

// ✅ upload.single("cv") must come before signup so multer parses the form first
router.post("/signup", upload.single("cv"), signup);
router.post("/login", login);

export default router;