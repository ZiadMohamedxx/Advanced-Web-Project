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

/**
 * Interpret voice command using OpenAI API
 * Converts natural language into structured intent + action + params
 */
export const interpretVoiceCommand = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "No text provided",
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        message: "OpenAI API key not configured",
      });
    }

    console.log("🤖 Interpreting voice command:", text);

    const systemPrompt = `You are a voice command interpreter for a job search website. Your job is to understand natural language voice commands and convert them into structured JSON.

Analyze the user's voice input and return a JSON object with:
- intent: The high-level intent (e.g., "NAVIGATE", "SCROLL", "READ", "TOGGLE", "CLICK", "SEARCH")
- action: The specific action to take (e.g., "navigate", "scroll", "read", "toggle", "click", "search", "fill_form", "submit_form")
- params: Object containing action parameters
- confidence: Number from 0-100 indicating how confident you are

Examples:
1. "dark mode" → {"intent": "TOGGLE_DARK", "action": "toggle", "params": {"feature": "dark_mode"}, "confidence": 95}
2. "take me to jobs" → {"intent": "NAVIGATE_JOBS", "action": "navigate", "params": {"url": "/jobs", "label": "jobs"}, "confidence": 95}
3. "read this page" → {"intent": "READ_PAGE", "action": "read", "params": {"target": "page"}, "confidence": 90}
4. "click apply" → {"intent": "CLICK_APPLY", "action": "click", "params": {"text": "apply"}, "confidence": 85}
5. "search for python jobs" → {"intent": "SEARCH", "action": "search", "params": {"query": "python jobs"}, "confidence": 90}

Supported intents:
- NAVIGATE: Navigate to different pages (home, jobs, profile, about, etc.)
- SCROLL: Scroll page (up, down, top, bottom)
- READ: Read page content or selected text
- PAUSE/RESUME/STOP: Control TTS
- TOGGLE: Toggle features (dark_mode, contrast, accessibility)
- CLICK: Click buttons or links
- SEARCH: Search for jobs
- FILL_FORM: Fill form fields
- SUBMIT_FORM: Submit forms
- CONTROL_FONT: Increase/decrease font size
- REFRESH: Refresh page
- GO_BACK: Navigate back

Return ONLY valid JSON, no extra text.`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Interpret this voice command: "${text}"`,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content || "";
    console.log("🤖 AI Response:", content);

    // Parse JSON response
    let interpretedCommand;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      interpretedCommand = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return res.status(500).json({
        message: "Failed to parse AI interpretation",
        error: parseError.message,
      });
    }

    if (!interpretedCommand) {
      return res.status(400).json({
        message: "Could not interpret command",
        rawResponse: content,
      });
    }

    return res.status(200).json(interpretedCommand);
  } catch (error) {
    console.error("❌ Voice interpretation error:", error);

    return res.status(500).json({
      message: "Failed to interpret voice command",
      error: error?.message || String(error),
    });
  }
};