import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export type DisabilityType =
  | "none"
  | "visual"
  | "hearing"
  | "motor"
  | "cognitive";

export type AccessibilitySettings = {
  highContrast: boolean;
  reducedMotion: boolean;
  focusHighlight: boolean;
  largeText: boolean;
  largeTargets: boolean;
  simpleMode: boolean;
  fontScale: number;
  disabilityType: DisabilityType;
  ttsEnabled: boolean;
  speechRate: number;
};

type AccessibilityContextType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  applyPreset: (type: DisabilityType) => void;
  resetSettings: () => void;
};

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  focusHighlight: true,
  largeText: false,
  largeTargets: false,
  simpleMode: false,
  fontScale: 1,
  disabilityType: "none",
  ttsEnabled: false,
  speechRate: 1,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(
  undefined
);

export function AccessibilityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem("accessibility-settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("accessibility-settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.style.setProperty("--app-font-scale", settings.fontScale.toString());

    body.classList.toggle("a11y-high-contrast", settings.highContrast);
    body.classList.toggle("a11y-reduced-motion", settings.reducedMotion);
    body.classList.toggle("a11y-focus-highlight", settings.focusHighlight);
    body.classList.toggle("a11y-large-text", settings.largeText);
    body.classList.toggle("a11y-large-targets", settings.largeTargets);
    body.classList.toggle("a11y-simple-mode", settings.simpleMode);
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyPreset = (type: DisabilityType) => {
    if (type === "visual") {
      setSettings({
        highContrast: true,
        reducedMotion: true,
        focusHighlight: true,
        largeText: true,
        largeTargets: false,
        simpleMode: false,
        fontScale: 1.2,
        disabilityType: "visual",
        ttsEnabled: true,
        speechRate: 1,
      });
      return;
    }

    if (type === "hearing") {
      setSettings({
        highContrast: false,
        reducedMotion: false,
        focusHighlight: true,
        largeText: false,
        largeTargets: false,
        simpleMode: false,
        fontScale: 1,
        disabilityType: "hearing",
        ttsEnabled: false,
        speechRate: 1,
      });
      return;
    }

    if (type === "motor") {
      setSettings({
        highContrast: false,
        reducedMotion: true,
        focusHighlight: true,
        largeText: true,
        largeTargets: true,
        simpleMode: false,
        fontScale: 1.1,
        disabilityType: "motor",
        ttsEnabled: false,
        speechRate: 1,
      });
      return;
    }

    if (type === "cognitive") {
      setSettings({
        highContrast: false,
        reducedMotion: true,
        focusHighlight: true,
        largeText: true,
        largeTargets: false,
        simpleMode: true,
        fontScale: 1.12,
        disabilityType: "cognitive",
        ttsEnabled: true,
        speechRate: 0.95,
      });
      return;
    }

    setSettings({
      ...defaultSettings,
      disabilityType: "none",
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const value = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      settings,
      updateSetting,
      applyPreset,
      resetSettings,
    }),
    [isOpen, settings]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);

  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }

  return context;
}