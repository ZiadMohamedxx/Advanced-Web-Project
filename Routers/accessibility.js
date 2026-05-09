import express from "express";
import multer from "multer";
import { transcribeAudio, interpretVoiceCommand } from "../Controllers/accessibility.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

router.post("/transcribe", upload.single("audio"), transcribeAudio);
router.post("/interpret", interpretVoiceCommand);

export default router;