import { useAccessibility } from "@/hooks/useAccessibility";
import {
  Accessibility,
  Eye,
  Ear,
  Hand,
  Brain,
  RotateCcw,
  Check,
  Sparkles,
  SlidersHorizontal,
  X,
  Wand2,
  Volume2,
  Mic,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import TextToSpeechControls from "@/components/TextToSpeechControls";
import SpeechToTextControls from "@/components/SpeechToTextControls";

export default function AccessibilityPanel() {
  const {
    isOpen,
    setIsOpen,
    settings,
    applyPreset,
    updateSetting,
    resetSettings,
  } = useAccessibility();

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  const announce = (message: string) => {
    setAnnouncement(message);
    window.setTimeout(() => setAnnouncement(""), 1000);
  };

  const handlePreset = (
    type: "none" | "visual" | "hearing" | "motor" | "cognitive"
  ) => {
    applyPreset(type);
    announce(
      type === "none"
        ? "Default accessibility profile applied"
        : `${type} accessibility profile applied`
    );
  };

  const handleToggle = (
    key:
      | "highContrast"
      | "largeText"
      | "simpleMode"
      | "largeTargets"
      | "focusHighlight"
      | "reducedMotion",
    value: boolean,
    label: string
  ) => {
    updateSetting(key, value);
    announce(`${label} ${value ? "enabled" : "disabled"}`);
  };

  const handleFontScale = (value: number) => {
    updateSetting("fontScale", value);
    announce(`Font scale set to ${value.toFixed(2)} times`);
  };

  const handleReset = () => {
    resetSettings();
    announce("Accessibility settings reset to default");
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[9997] bg-black/25 backdrop-blur-[2px] transition-opacity"
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
      />

      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="accessibility-panel-title"
        aria-describedby="accessibility-panel-description"
        className="fixed right-4 top-20 z-[9998] w-[380px] max-w-[calc(100vw-16px)] md:right-6 md:top-24 md:w-[400px]"
      >
        <div className="overflow-hidden rounded-[28px] border border-white/40 bg-card/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
          <div className="max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="relative overflow-hidden border-b border-primary/10 px-5 pb-5 pt-5">
              <div className="absolute inset-0 bg-hero-gradient opacity-[0.10]" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

              <div className="relative">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/10">
                      <Accessibility className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                        <Sparkles className="h-3.5 w-3.5" />
                        Inclusive Experience
                      </div>

                      <h2
                        id="accessibility-panel-title"
                        className="text-lg font-semibold tracking-tight text-foreground"
                      >
                        Accessibility Tools
                      </h2>

                      <p
                        id="accessibility-panel-description"
                        className="mt-1 text-xs leading-5 text-muted-foreground"
                      >
                        Adjust reading, interaction, motion, and accessibility
                        preferences for a more comfortable experience.
                      </p>
                    </div>
                  </div>

                  <button
                    ref={closeButtonRef}
                    onClick={() => setIsOpen(false)}
                    aria-label="Close accessibility panel"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-background/80 text-foreground transition hover:bg-primary/5"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-primary/15 bg-primary/10 px-4 py-3">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Active Profile
                    </p>
                    <p className="mt-1 text-sm font-semibold capitalize text-foreground">
                      {settings.disabilityType === "none"
                        ? "Default"
                        : settings.disabilityType}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-primary/15 bg-background/80 px-4 py-3">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Font Scale
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {settings.fontScale.toFixed(2)}x
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-5">
              {/* Profiles */}
              <SectionHeader
                icon={<SlidersHorizontal className="h-4 w-4" />}
                title="Recommended Profiles"
                subtitle="Quick presets for common accessibility needs."
              />

              <div className="grid grid-cols-2 gap-2.5">
                <PresetCard
                  label="Visual"
                  subtitle="Low vision"
                  icon={<Eye className="h-4 w-4" />}
                  active={settings.disabilityType === "visual"}
                  onClick={() => handlePreset("visual")}
                />
                <PresetCard
                  label="Hearing"
                  subtitle="Visual cues"
                  icon={<Ear className="h-4 w-4" />}
                  active={settings.disabilityType === "hearing"}
                  onClick={() => handlePreset("hearing")}
                />
                <PresetCard
                  label="Motor"
                  subtitle="Easy actions"
                  icon={<Hand className="h-4 w-4" />}
                  active={settings.disabilityType === "motor"}
                  onClick={() => handlePreset("motor")}
                />
                <PresetCard
                  label="Cognitive"
                  subtitle="Low distraction"
                  icon={<Brain className="h-4 w-4" />}
                  active={settings.disabilityType === "cognitive"}
                  onClick={() => handlePreset("cognitive")}
                />
              </div>

              <button
                onClick={() => handlePreset("none")}
                aria-pressed={settings.disabilityType === "none"}
                className={`w-full rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  settings.disabilityType === "none"
                    ? "border-primary/20 bg-primary/12 text-primary shadow-sm"
                    : "border-border bg-background text-foreground hover:border-primary/15 hover:bg-primary/5"
                }`}
              >
                Default Profile
              </button>

              {/* Fine Controls */}
              <div className="rounded-[24px] border border-border/80 bg-background/70 p-4">
                <SectionHeader
                  icon={<Wand2 className="h-4 w-4" />}
                  title="Fine-Tuned Controls"
                  subtitle="Customize the interface one setting at a time."
                  compact
                />

                <div className="mt-4 space-y-2.5">
                  <ToggleCard
                    title="High Contrast"
                    description="Increase contrast for stronger readability."
                    checked={settings.highContrast}
                    onChange={(v) =>
                      handleToggle("highContrast", v, "High contrast")
                    }
                  />
                  <ToggleCard
                    title="Large Text"
                    description="Increase text size across the interface."
                    checked={settings.largeText}
                    onChange={(v) => handleToggle("largeText", v, "Large text")}
                  />
                  <ToggleCard
                    title="Simple Mode"
                    description="Reduce clutter and secondary visual elements."
                    checked={settings.simpleMode}
                    onChange={(v) =>
                      handleToggle("simpleMode", v, "Simple mode")
                    }
                  />
                  <ToggleCard
                    title="Large Targets"
                    description="Make buttons and controls easier to press."
                    checked={settings.largeTargets}
                    onChange={(v) =>
                      handleToggle("largeTargets", v, "Large targets")
                    }
                  />
                  <ToggleCard
                    title="Focus Highlight"
                    description="Show stronger keyboard focus indicators."
                    checked={settings.focusHighlight}
                    onChange={(v) =>
                      handleToggle("focusHighlight", v, "Focus highlight")
                    }
                  />
                  <ToggleCard
                    title="Reduce Motion"
                    description="Minimize animations and transitions."
                    checked={settings.reducedMotion}
                    onChange={(v) =>
                      handleToggle("reducedMotion", v, "Reduced motion")
                    }
                  />
                </div>
              </div>

              {/* Font Scale */}
              <div className="rounded-[24px] border border-border/80 bg-background/70 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Font Scale
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Increase or decrease overall reading size.
                    </p>
                  </div>

                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    {settings.fontScale.toFixed(2)}x
                  </span>
                </div>

                <input
                  type="range"
                  min="0.9"
                  max="1.4"
                  step="0.05"
                  value={settings.fontScale}
                  onChange={(e) => handleFontScale(Number(e.target.value))}
                  className="w-full accent-primary"
                  aria-label="Adjust font scale"
                />
              </div>

              {/* Reading */}
              <FeatureCard
                icon={<Volume2 className="h-4 w-4" />}
                title="Reading Assistance"
                subtitle="Read the full page or selected content aloud."
              >
                <TextToSpeechControls />
              </FeatureCard>

              {/* Voice */}
              <FeatureCard
                icon={<Mic className="h-4 w-4" />}
                title="Voice Input"
                subtitle="Convert speech into text when supported by the browser."
              >
                <SpeechToTextControls />
              </FeatureCard>

              {/* Reset */}
              <div className="border-t border-primary/10 pt-1">
                <button
                  onClick={handleReset}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/15 hover:bg-primary/5"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>

        <div aria-live="polite" className="sr-only">
          {announcement}
        </div>
      </div>
    </>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
  compact = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "" : "mb-1"}>
      <div className="flex items-center gap-2">
        <div className="text-primary">{icon}</div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <p
        className={`text-muted-foreground ${
          compact ? "mt-1 text-xs" : "mt-1 text-xs leading-5"
        }`}
      >
        {subtitle}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-primary/15 bg-gradient-to-br from-primary/[0.06] via-background to-accent/[0.04]">
      <div className="border-b border-primary/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="text-primary">{icon}</div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
}

function PresetCard({
  label,
  subtitle,
  icon,
  active,
  onClick,
}: {
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${label} profile`}
      className={`relative rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
        active
          ? "border-primary/20 bg-primary/12 shadow-[0_10px_25px_rgba(18,94,89,0.10)]"
          : "border-border bg-background hover:-translate-y-0.5 hover:border-primary/15 hover:bg-primary/5"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>

        {active && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Check className="h-3.5 w-3.5" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </button>
  );
}

function ToggleCard({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const id = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:border-primary/10 hover:bg-primary/[0.03]">
      <div className="min-w-0">
        <label
          htmlFor={id}
          className="cursor-pointer text-sm font-semibold text-foreground"
        >
          {title}
        </label>
        <p
          id={`${id}-description`}
          className="mt-0.5 text-xs leading-5 text-muted-foreground"
        >
          {description}
        </p>
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={`${id}-description`}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-14 shrink-0 rounded-full transition-all duration-200 ${
          checked
            ? "bg-primary shadow-[0_6px_18px_rgba(18,94,89,0.25)]"
            : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${
            checked ? "left-8" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}