import { useRef, useState } from "react";
import { Mic, Square, Loader2, X, HelpCircle } from "lucide-react";
import { normalizeCommand, executeExactCommand } from "@/voice/exactCommandMatcher";

const API_BASE_URL = "https://advanced-web-project-production-7144.up.railway.app";

type AssistantState = "idle" | "listening" | "processing" | "success" | "error";

export default function FloatingVoiceAssistant() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isProcessingRef = useRef(false);

  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<AssistantState>("idle");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const supportsMediaRecording =
    typeof window !== "undefined" &&
    navigator?.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== "undefined";

  const startRecording = async () => {
    if (!supportsMediaRecording) {
      setState("error");
      setErrorMessage("Microphone not available");
      return;
    }

    try {
      setErrorMessage("");
      setState("listening");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const preferredMimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
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
        if (event.data?.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstart = () => {
        setIsRecording(true);
        setStatus("🎤 Listening...");
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);

        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        try {
          setState("processing");
          setStatus("⚙️ Processing...");

          const blobType =
            chunksRef.current[0]?.type || selectedMimeType || "audio/webm";
          const audioBlob = new Blob(chunksRef.current, { type: blobType });

          if (audioBlob.size === 0) {
            setState("error");
            setErrorMessage("No audio recorded");
            cleanupStream();
            isProcessingRef.current = false;
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
        setState("error");
        setErrorMessage("Recording failed");
        cleanupStream();
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
    } catch (error: any) {
      setIsRecording(false);
      setState("error");
      setErrorMessage("Microphone access denied");
      cleanupStream();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const uploadAudio = async (audioBlob: Blob) => {
    try {
      setErrorMessage("");

      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch(`${API_BASE_URL}/accessibility/transcribe`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Transcription failed");
      }

      const text = data.text || "";
      setTranscript(text);
      await processCommand(text);
    } catch (error: any) {
      setState("error");
      setErrorMessage(error?.message || "Failed to transcribe");
    }
  };

  const processCommand = async (text: string) => {
    try {
      // Normalize and execute exact command match
      const normalized = normalizeCommand(text);
      const result = await executeExactCommand(normalized);

      setTranscript(result.command || text);

      if (result.success) {
        setState("success");
        setStatus(`✅ ${result.message}`);
        setTimeout(() => {
          setState("idle");
          setStatus("");
        }, 3000);
      } else {
        setState("error");
        setErrorMessage(result.message);
      }
    } catch (error: any) {
      setState("error");
      setErrorMessage("Failed to process command");
    }
  };

  const getButtonClasses = () => {
    const base =
      "rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ";
    const sizes = "h-16 w-16 text-white";

    switch (state) {
      case "listening":
        return (
          base +
          sizes +
          "bg-blue-500 hover:bg-blue-600 animate-pulse shadow-blue-500/50"
        );
      case "processing":
        return base + sizes + "bg-purple-500 hover:bg-purple-600";
      case "success":
        return base + sizes + "bg-green-500 hover:bg-green-600";
      case "error":
        return base + sizes + "bg-red-500 hover:bg-red-600";
      default:
        return (
          base +
          sizes +
          "bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
        );
    }
  };

  return (
    <>
      {/* Floating Button - Bottom Left */}
<button
  onClick={() => setIsOpen(!isOpen)}
  className={`fixed bottom-8 left-6 z-40 ${getButtonClasses()} 
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
  aria-label={isOpen ? "Close voice assistant" : "Open voice assistant"}
  title={
    state === "listening"
      ? "Listening..."
      : state === "processing"
        ? "Processing..."
        : "Click to open voice assistant"
  }
>
  {isRecording ? (
    <Square className="h-6 w-6" />
  ) : state === "processing" ? (
    <Loader2 className="h-6 w-6 animate-spin" />
  ) : (
    <Mic className="h-6 w-6" />
  )}
</button>

      {/* Expanded Panel - Right of Button */}
      {isOpen && (
        <div className="fixed left-28 top-1/2 -translate-y-1/2 z-40 w-80 rounded-2xl bg-background border border-border shadow-xl animate-in fade-in slide-in-from-left-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  state === "listening"
                    ? "bg-blue-500 animate-pulse"
                    : state === "processing"
                      ? "bg-purple-500 animate-spin"
                      : state === "success"
                        ? "bg-green-500"
                        : state === "error"
                          ? "bg-red-500"
                          : "bg-gray-400"
                }`}
              />
              <h3 className="text-sm font-semibold text-foreground">
                Voice Commands
              </h3>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                if (isRecording) stopRecording();
              }}
              className="p-1 hover:bg-background/80 rounded transition"
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Status */}
            {status && (
              <div className="text-xs font-medium text-muted-foreground bg-muted/30 rounded px-2 py-1.5">
                {status}
              </div>
            )}

            {/* Error */}
            {errorMessage && (
              <div className="text-xs text-destructive bg-destructive/10 rounded px-2 py-1.5 border border-destructive/20">
                {errorMessage}
              </div>
            )}

            {/* Transcript */}
            {transcript && (
              <div className="text-xs bg-muted/30 rounded px-2 py-1.5 max-h-20 overflow-y-auto">
                <p className="text-muted-foreground font-medium mb-1">
                  Recognized:
                </p>
                <p className="text-foreground font-mono">{transcript}</p>
              </div>
            )}

            {/* Recording Indicator */}
            {isRecording && (
              <div className="flex items-center gap-2 text-xs text-blue-600">
                <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" />
                  <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce delay-100" />
                  <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce delay-200" />
                </div>
                <span>Recording...</span>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-2 pt-2">
              {!isRecording ? (
                <>
                  <button
                    onClick={startRecording}
                    disabled={!supportsMediaRecording}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground rounded-lg px-3 py-2 text-xs font-medium transition"
                  >
                    <Mic className="h-3.5 w-3.5" />
                    Start
                  </button>
                  <button
                    onClick={() =>
                      window.dispatchEvent(new CustomEvent("openCommandCheatSheet"))
                    }
                    className="flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg px-3 py-2 text-xs font-medium transition"
                    title="Show all commands"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-2 text-xs font-medium transition"
                >
                  <Square className="h-3.5 w-3.5" />
                  Stop
                </button>
              )}
            </div>

            {/* Help Text */}
            <p className="text-[10px] text-muted-foreground text-center pt-1">
              Try: "dark mode on", "scroll down", "open jobs" or click ? for all commands
            </p>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setIsOpen(false);
            if (isRecording) stopRecording();
          }}
          aria-hidden="true"
        />
      )}
    </>
  );
}
