import { useRef, useState } from "react";
import {
  Mic,
  Square,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Keyboard,
  Command,
} from "lucide-react";
import { interpretWithAI } from "@/voice/aiInterpreter";
import { executeIntent } from "@/voice/executionEngine";
import { matchWithFallback } from "@/voice/fallbackMatcher";
import { contextManager } from "@/voice/contextManager";

const API_BASE_URL = "http://localhost:4000";

type VoiceMode = "dictation" | "command";

export default function SpeechToTextControls() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isProcessingRef = useRef(false);
  const lastCommandTimeRef = useRef<number>(0);

  const [mode, setMode] = useState<VoiceMode>("dictation");
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [transcript, setTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const supportsMediaRecording =
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function" &&
    typeof MediaRecorder !== "undefined";

  const startRecording = async () => {
    if (!supportsMediaRecording) {
      setStatus("Unavailable");
      setErrorMessage(
        "Audio recording is not available in this browser or context. Use Google Chrome on localhost or HTTPS."
      );
      return;
    }

    try {
      setErrorMessage("");
      setStatus("Requesting microphone access...");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const preferredMimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
      ];

      const selectedMimeType =
        preferredMimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) ||
        "";

      const mediaRecorder = new MediaRecorder(
        stream,
        selectedMimeType ? { mimeType: selectedMimeType } : undefined
      );

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstart = () => {
        setIsRecording(true);
        setStatus(
          mode === "dictation"
            ? "Recording for dictation..."
            : "Recording for voice command..."
        );
        setTranscript("");
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);

        if (isProcessingRef.current) {
          return;
        }
        isProcessingRef.current = true;

        try {
          setStatus("Uploading audio...");

          const blobType =
            chunksRef.current[0]?.type || selectedMimeType || "audio/webm";
          const audioBlob = new Blob(chunksRef.current, { type: blobType });

          if (audioBlob.size === 0) {
            setStatus("Stopped");
            setErrorMessage("No audio was recorded.");
            cleanupStream();
            return;
          }

          await uploadAudio(audioBlob);
        } finally {
          isProcessingRef.current = false;
          cleanupStream();
        }
      };

      mediaRecorder.onerror = () => {
        setIsRecording(false);
        setStatus("Error");
        setErrorMessage("Recording failed while capturing audio.");
        cleanupStream();
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
    } catch (error: any) {
      setIsRecording(false);
      setStatus("Error");
      setErrorMessage(
        error?.message || "Could not access microphone. Please allow permission."
      );
      cleanupStream();
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    setStatus("Stopping...");
    mediaRecorderRef.current.stop();
  };

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const uploadAudio = async (audioBlob: Blob) => {
    try {
      setIsUploading(true);
      setErrorMessage("");

      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch(`${API_BASE_URL}/accessibility/transcribe`, {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 120)}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Transcription failed.");
      }

      const text = data.text || "";
      setTranscript(text);

      if (mode === "command") {
        await processVoiceCommand(text);
      } else {
        setStatus("✅ Dictation complete");
      }
    } catch (error: any) {
      setStatus("❌ Error");
      setErrorMessage(error?.message || "Failed to transcribe audio.");
    } finally {
      setIsUploading(false);
    }
  };

  const processVoiceCommand = async (text: string) => {
    try {
      // Debounce check
      const now = Date.now();
      if (now - lastCommandTimeRef.current < 1000) {
        setStatus("⏱️ Please wait before the next command");
        return;
      }
      lastCommandTimeRef.current = now;

      setStatus("🤖 Processing with AI...");

      // Try AI interpretation first
      let interpretedCommand = await interpretWithAI(text);

      // If AI fails or low confidence, use fallback
      if (!interpretedCommand || interpretedCommand.confidence < 50) {
        console.log("⚠️ AI failed, using fallback matcher");
        setStatus("⚠️ AI failed, using fallback...");
        interpretedCommand = await matchWithFallback(text);
      }

      if (!interpretedCommand) {
        setStatus("❓ Command not recognized");
        setErrorMessage("Could not understand the command. Try again.");
        return;
      }

      // Execute the interpreted command
      const executionResult = await executeIntent(interpretedCommand);

      // Update context
      contextManager.updateContext(
        text,
        interpretedCommand.action,
        interpretedCommand.params,
        executionResult.success
      );

      if (executionResult.success) {
        setStatus(
          `✅ ${executionResult.message} (${interpretedCommand.confidence}%)`
        );
      } else {
        setStatus(`⚠️ ${executionResult.message}`);
        setErrorMessage(executionResult.message);
      }
    } catch (error: any) {
      console.error("Command processing error:", error);
      setStatus("❌ Failed to process command");
      setErrorMessage(String(error));
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
        <p className="text-sm font-semibold text-foreground">Voice Mode</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Choose whether voice input should write text or trigger commands.
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setMode("dictation")}
            disabled={isRecording || isUploading}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
              mode === "dictation"
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-background text-foreground hover:bg-primary/5"
            } disabled:opacity-50`}
          >
            <Keyboard className="h-4 w-4" />
            Dictation
          </button>

          <button
            type="button"
            onClick={() => setMode("command")}
            disabled={isRecording || isUploading}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
              mode === "command"
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-background text-foreground hover:bg-primary/5"
            } disabled:opacity-50`}
          >
            <Command className="h-4 w-4" />
            Command
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={startRecording}
          disabled={isRecording || isUploading || !supportsMediaRecording}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          <Mic className="h-4 w-4" />
          {isRecording ? "Recording..." : "Start Recording"}
        </button>

        <button
          type="button"
          onClick={stopRecording}
          disabled={!isRecording}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-primary/5 disabled:opacity-50"
        >
          <Square className="h-4 w-4" />
          Stop
        </button>
      </div>

      {!supportsMediaRecording && (
        <div className="flex items-start gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            This browser context does not expose microphone recording. Open the app in Google Chrome using localhost or HTTPS.
          </span>
        </div>
      )}

      <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Status
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm text-foreground">
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : status.includes("✅") || status.includes("✓") ? (
            <CheckCircle2 className="h-4 w-4 text-primary" />
          ) : null}
          <span>{status}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Transcript
        </p>
        {mode === "dictation" ? (
          <p className="mt-2 min-h-[72px] text-sm leading-6 text-foreground">
            {transcript || "Start recording, then stop to generate transcript."}
          </p>
        ) : (
          <p className="mt-2 min-h-[72px] text-sm leading-6 text-muted-foreground">
            {transcript
              ? `Command recognized: "${transcript}"`
              : "Start recording a command, then stop to execute it."}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Current Mode Behavior
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground">
          {mode === "dictation"
            ? "Voice will be converted into normal text for writing, search, or form filling."
            : "Voice will be interpreted as a command using AI-powered natural language understanding and executed immediately."}
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
