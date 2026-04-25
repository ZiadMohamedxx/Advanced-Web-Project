import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Square, Pause, TextCursorInput } from "lucide-react";
import { useAccessibility } from "@/hooks/useAccessibility";

function getReadablePageText() {
  const main = document.querySelector("main");
  if (!main) return document.body.innerText || "";

  const cloned = main.cloneNode(true) as HTMLElement;
  cloned.querySelectorAll("script, style, noscript").forEach((node) => {
    node.remove();
  });

  return cloned.innerText.replace(/\s+/g, " ").trim();
}

function getCurrentSelectionText() {
  if (typeof window === "undefined") return "";
  return window.getSelection()?.toString().trim() || "";
}

function isSelectionInsideAccessibilityPanel() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;
  const node =
    container.nodeType === Node.ELEMENT_NODE
      ? (container as Element)
      : container.parentElement;

  return !!node?.closest('[role="dialog"]');
}

export default function TextToSpeechControls() {
  const { settings, updateSetting } = useAccessibility();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  const lastValidSelectionRef = useRef("");
  const supported = useMemo(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    []
  );

  useEffect(() => {
    if (!supported) return;

    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;

    const updateSelectionState = () => {
      const text = getCurrentSelectionText();

      if (!text) return;
      if (isSelectionInsideAccessibilityPanel()) return;

      lastValidSelectionRef.current = text;
      setSelectedText(text);
    };

    document.addEventListener("selectionchange", updateSelectionState);
    document.addEventListener("mouseup", updateSelectionState);
    document.addEventListener("keyup", updateSelectionState);

    return () => {
      synth.cancel();
      synth.onvoiceschanged = null;
      document.removeEventListener("selectionchange", updateSelectionState);
      document.removeEventListener("mouseup", updateSelectionState);
      document.removeEventListener("keyup", updateSelectionState);
    };
  }, [supported]);

  const speakText = (text: string) => {
    if (!supported || !text) return;

    const synth = window.speechSynthesis;
    const voices = synth.getVoices();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;

    const preferredVoice =
      voices.find((voice) => voice.lang?.toLowerCase().startsWith("en")) ||
      voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    synth.cancel();

    window.setTimeout(() => {
      synth.speak(utterance);
    }, 80);
  };

  const handleReadPage = () => {
    const text = getReadablePageText();
    speakText(text);
  };

  const handleReadSelected = () => {
    const liveSelection = getCurrentSelectionText();
    const textToRead =
      liveSelection || lastValidSelectionRef.current || selectedText;

    if (!textToRead) return;

    setSelectedText(textToRead);
    lastValidSelectionRef.current = textToRead;
    speakText(textToRead);
  };

  const handleStop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    if (!supported) return;

    const synth = window.speechSynthesis;
    if (!isSpeaking) return;

    if (synth.paused) {
      synth.resume();
      setIsPaused(false);
    } else {
      synth.pause();
      setIsPaused(true);
    }
  };

  if (!supported) {
    return (
      <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
        <p className="text-sm font-semibold text-foreground">Text to Speech</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Your browser does not support speech synthesis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handleReadPage}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <Play className="h-4 w-4" />
          Read Page
        </button>

        <button
          type="button"
          onClick={handleReadSelected}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-primary/5"
        >
          <TextCursorInput className="h-4 w-4" />
          Read Selected
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handleStop}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-primary/5"
        >
          <Square className="h-4 w-4" />
          Stop
        </button>

        <button
          type="button"
          onClick={handlePauseResume}
          disabled={!isSpeaking}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Pause className="h-4 w-4" />
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div>

      <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Reading Speed
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Adjust the reading pace.
            </p>
          </div>

          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
            {settings.speechRate.toFixed(2)}x
          </span>
        </div>

        <input
          type="range"
          min="0.7"
          max="1.5"
          step="0.05"
          value={settings.speechRate}
          onChange={(e) => updateSetting("speechRate", Number(e.target.value))}
          className="w-full accent-primary"
          aria-label="Adjust reading speed"
        />

        {!voicesLoaded && (
          <p className="mt-2 text-xs text-muted-foreground">
            Loading speech voices...
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Selected Text
        </p>
        <p className="mt-2 line-clamp-4 text-sm leading-6 text-foreground">
          {selectedText || "Select any text from the page, then press Read Selected."}
        </p>
      </div>
    </div>
  );
}