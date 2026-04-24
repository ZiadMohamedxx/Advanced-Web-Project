import express from "express";
import fetch from "node-fetch";
import multer from "multer";
import FormData from "form-data";

const router = express.Router();
const upload = multer();

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);
    formData.append("apikey", process.env.OCR_API_KEY);
    formData.append("language", "eng");
    formData.append("isOverlayRequired", "false");

    const ocrRes = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: formData,
    });

    const data = await ocrRes.json();
    res.json(data);
  } catch (err) {
    console.error("OCR error:", err);
    res.status(500).json({ error: "OCR failed" });
  }
});

export default router;