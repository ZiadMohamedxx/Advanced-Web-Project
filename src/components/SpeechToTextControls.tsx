import { useEffect, useMemo, useRef, useState } from "react";
import { Mic, Square, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

export default function SpeechToTextControls() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("Idle");
  const [errorMessage, setErrorMessage] = useState("");
  const recognitionRef = useRef<any>(null);

  const RecognitionClass = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }, []);

  const supported = !!RecognitionClass;

  useEffect(() => {
    if (!RecognitionClass) return;

    const recognition = new RecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setStatus("Listening...");
      setErrorMessage("");
    };

    recognition.onresult = (event: any) => {
      let finalText = "";

      for (let i = 0; i < event.results.length; i++) {
        finalText += event.results[i][0].transcript + " ";
      }

      setTranscript(finalText.trim());
      setStatus("Receiving speech...");
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);

      const error = event?.error || "unknown";
      if (error === "not-allowed") {
        setErrorMessage("Microphone permission was denied.");
      } else if (error === "no-speech") {
        setErrorMessage("No speech was detected. Try speaking louder.");
      } else if (error === "audio-capture") {
        setErrorMessage("No microphone was found or it is unavailable.");
      } else {
        setErrorMessage(`Speech recognition error: ${error}`);
      }

      setStatus("Error");
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatus("Stopped");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [RecognitionClass]);

  const startListening = async () => {
    if (!recognitionRef.current) return;

    try {
      setErrorMessage("");
      setStatus("Requesting microphone access...");

      await navigator.mediaDevices.getUserMedia({ audio: true });

      setTranscript("");
      recognitionRef.current.start();
    } catch {
      setIsListening(false);
      setStatus("Error");
      setErrorMessage(
        "Could not access microphone. Please allow microphone permission."
      );
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setStatus("Stopped");
  };

  if (!supported) {
    return (
      <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
        <p className="text-sm font-semibold text-foreground">Speech to Text</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Your browser does not support speech recognition. Try Google Chrome.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={startListening}
          disabled={isListening}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          <Mic className="h-4 w-4" />
          Start
        </button>

        <button
          type="button"
          onClick={stopListening}
          disabled={!isListening}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-primary/5 disabled:opacity-50"
        >
          <Square className="h-4 w-4" />
          Stop
        </button>
      </div>

      <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Status
        </p>
        <p className="mt-2 text-sm font-medium text-foreground">{status}</p>
      </div>

      <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Transcript
        </p>
        <p className="mt-2 min-h-[72px] text-sm leading-6 text-foreground">
          {transcript || "Press Start and begin speaking."}
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