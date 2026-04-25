import OpenAI from "openai";
import fs from "fs";
import os from "os";
import path from "path";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const transcribeAudio = async (req, res) => {
  let tempFilePath = null;

  try {
    console.log("🎤 OpenAI transcription request received");
    console.log("OPENAI KEY LOADED:", !!process.env.OPENAI_API_KEY);

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        message: "OPENAI_API_KEY is missing from .env",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No audio uploaded",
      });
    }

    const mimeType = req.file.mimetype || "audio/webm";

    const extension = mimeType.includes("wav")
      ? "wav"
      : mimeType.includes("mpeg") || mimeType.includes("mp3")
      ? "mp3"
      : mimeType.includes("mp4") || mimeType.includes("m4a")
      ? "m4a"
      : mimeType.includes("ogg")
      ? "ogg"
      : "webm";

    tempFilePath = path.join(os.tmpdir(), `audio-${Date.now()}.${extension}`);
    fs.writeFileSync(tempFilePath, req.file.buffer);

    const response = await client.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "gpt-4o-mini-transcribe",
    });

    return res.status(200).json({
      text: response.text || "",
    });
  } catch (error) {
    console.error("❌ OpenAI transcription error:", error);

    const message =
      error?.error?.message ||
      error?.message ||
      "Failed to transcribe audio";

    return res.status(500).json({
      message: "Failed to transcribe audio",
      error: message,
    });
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.error("Temp cleanup failed:", cleanupError);
      }
    }
  }
};