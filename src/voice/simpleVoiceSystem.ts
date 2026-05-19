/**
 * Voice System - Simplified, Reliable, Accessible
 * Pure client-side voice recognition with simple JSON-based intent matching
 * Supports English and Arabic commands
 */

import { extractSearchQuery, normalizeCommand, isArabic } from "@/voice/arabicNormalization";

// Simple command mapping for immediate execution
export const VOICE_COMMANDS = {
  // Navigation - English
  "jobs": { intent: "NAVIGATE", target: "/jobs" },
  "job": { intent: "NAVIGATE", target: "/jobs" },
  "home": { intent: "NAVIGATE", target: "/" },
  "profile": { intent: "NAVIGATE", target: "/profile" },
  "account": { intent: "NAVIGATE", target: "/profile" },
  "about": { intent: "NAVIGATE", target: "/about" },
  "employer": { intent: "NAVIGATE", target: "/employer-portal" },
  "candidate": { intent: "NAVIGATE", target: "/candidate-portal" },

  // Navigation - Arabic
  "وظائف": { intent: "NAVIGATE", target: "/jobs" },
  "وظيفة": { intent: "NAVIGATE", target: "/jobs" },
  "بيت": { intent: "NAVIGATE", target: "/" },
  "رئيسية": { intent: "NAVIGATE", target: "/" },
  "بروفايل": { intent: "NAVIGATE", target: "/profile" },
  "ملفي": { intent: "NAVIGATE", target: "/profile" },
  "حساب": { intent: "NAVIGATE", target: "/profile" },
  "عنا": { intent: "NAVIGATE", target: "/about" },
  "حول": { intent: "NAVIGATE", target: "/about" },

  // Actions - English
  "dark mode": { intent: "ACTION", target: "toggleDark" },
  "dark": { intent: "ACTION", target: "toggleDark" },
  "light mode": { intent: "ACTION", target: "toggleLight" },
  "contrast": { intent: "ACTION", target: "toggleContrast" },
  "accessibility": { intent: "ACTION", target: "openAccessibility" },
  "settings": { intent: "ACTION", target: "openAccessibility" },
  "scroll down": { intent: "ACTION", target: "scrollDown" },
  "scroll up": { intent: "ACTION", target: "scrollUp" },
  "back": { intent: "ACTION", target: "goBack" },
  "refresh": { intent: "ACTION", target: "refresh" },
  "read page": { intent: "ACTION", target: "readPage" },

  // Actions - Arabic
  "ليل": { intent: "ACTION", target: "toggleDark" },
  "ليلي": { intent: "ACTION", target: "toggleDark" },
  "نهار": { intent: "ACTION", target: "toggleLight" },
  "تباين": { intent: "ACTION", target: "toggleContrast" },
  "اكسيسيبيلتي": { intent: "ACTION", target: "openAccessibility" },
  "الوصول": { intent: "ACTION", target: "openAccessibility" },
  "انزل": { intent: "ACTION", target: "scrollDown" },
  "اطلع": { intent: "ACTION", target: "scrollUp" },
  "رجع": { intent: "ACTION", target: "goBack" },
  "ريفريش": { intent: "ACTION", target: "refresh" },
  "اقرا": { intent: "ACTION", target: "readPage" },
} as const;

// Filler words to ignore
const FILLER_WORDS = [
  "the", "a", "an", "and", "or", "to", "in", "on", "at", "for", "with", "please", "can", "you",
  "في", "على", "من", "إلى", "هذا", "ذلك", "هي", "هو",
];

/**
 * Parse voice input into simple JSON intent
 * Supports both English and Arabic
 */
export function parseVoiceInput(text: string): { intent: "NAVIGATE" | "ACTION" | "SEARCH"; target?: string; query?: string } | null {
  const normalized = normalizeCommand(text).trim();

  // Try exact matches first
  if (VOICE_COMMANDS[normalized as keyof typeof VOICE_COMMANDS]) {
    return VOICE_COMMANDS[normalized as keyof typeof VOICE_COMMANDS];
  }

  // Try substring matches (e.g., "open jobs" → "jobs")
  for (const [command, intent] of Object.entries(VOICE_COMMANDS)) {
    if (normalized.includes(normalizeCommand(command))) {
      return intent as any;
    }
  }

  // Check for voice job search (must come before filler word removal)
  const searchQuery = extractSearchQuery(text);
  if (searchQuery && searchQuery.length > 0) {
    const lowerQuery = normalizeCommand(searchQuery);
    // Check if this looks like a job search
    if (
      normalized.includes("search") || normalized.includes("find") || normalized.includes("دور") ||
      normalized.includes("ابحث") || normalized.includes("هات") || normalized.includes("أظهر")
    ) {
      return { intent: "SEARCH", query: searchQuery };
    }
  }

  // Fallback: try to match with filler word removal
  const words = normalized.split(" ").filter(w => !FILLER_WORDS.includes(w));
  for (const word of words) {
    if (VOICE_COMMANDS[word as keyof typeof VOICE_COMMANDS]) {
      return VOICE_COMMANDS[word as keyof typeof VOICE_COMMANDS];
    }
  }

  return null;
}

/**
 * Execute parsed voice intent immediately
 */
export function executeVoiceIntent(parsed: { intent: "NAVIGATE" | "ACTION" | "SEARCH"; target?: string; query?: string }): boolean {
  try {
    if (parsed.intent === "NAVIGATE" && parsed.target) {
      window.location.href = parsed.target;
      return true;
    }

    if (parsed.intent === "SEARCH" && parsed.query) {
      // Navigate to jobs page with search query
      window.location.href = `/jobs?search=${encodeURIComponent(parsed.query)}`;
      return true;
    }

    if (parsed.intent === "ACTION") {
      return executeAction(parsed.target || "");
    }

    return false;
  } catch (error) {
    console.error("Execution error:", error);
    return false;
  }
}

/**
 * Execute simple actions
 */
function executeAction(action: string): boolean {
  try {
    switch (action) {
      case "toggleDark":
        toggleDarkMode();
        return true;
      case "toggleLight":
        toggleLightMode();
        return true;
      case "toggleContrast":
        toggleContrast();
        return true;
      case "openAccessibility":
        openAccessibility();
        return true;
      case "scrollDown":
        window.scrollBy({ top: 300, behavior: "smooth" });
        return true;
      case "scrollUp":
        window.scrollBy({ top: -300, behavior: "smooth" });
        return true;
      case "goBack":
        window.history.back();
        return true;
      case "refresh":
        window.location.reload();
        return true;
      case "readPage":
        readPageAloud();
        return true;
      default:
        return false;
    }
  } catch (error) {
    console.error("Action error:", error);
    return false;
  }
}

function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  html.setAttribute("data-theme", isDark ? "light" : "dark");
  localStorage.setItem("theme-preference", isDark ? "light" : "dark");
}

function toggleLightMode() {
  const html = document.documentElement;
  html.setAttribute("data-theme", "light");
  localStorage.setItem("theme-preference", "light");
}

function toggleContrast() {
  const settings = JSON.parse(localStorage.getItem("accessibility-settings") || "{}");
  settings.highContrast = !settings.highContrast;
  localStorage.setItem("accessibility-settings", JSON.stringify(settings));
  document.body.classList.toggle("a11y-high-contrast", settings.highContrast);
}

function openAccessibility() {
  document.body.dispatchEvent(new Event("open-accessibility"));
}

function readPageAloud() {
  if (!("speechSynthesis" in window)) return;

  const main = document.querySelector("main") || document.body;
  const clone = main.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("script, style, [aria-hidden='true']").forEach(n => n.remove());

  const text = clone.innerText.replace(/\s+/g, " ").trim();
  if (!text) return;

  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;

  const voices = synth.getVoices();
  if (voices.length > 0) {
    utterance.voice = voices.find(v => v.lang?.includes("en")) || voices[0];
  }

  synth.speak(utterance);
}

/**
 * Get user-friendly feedback message
 */
export function getVoiceFeedback(command: string, success: boolean): string {
  if (!success) {
    return isArabic(command)
      ? "أمر غير معروف. حاول: وظائف، بروفايل، ليل"
      : "Command not recognized. Try: jobs, profile, dark mode";
  }

  const normalized = normalizeCommand(command);
  const isAr = isArabic(command);

  if (normalized.includes("وظائف") || normalized.includes("وظيفة") || normalized.includes("jobs")) {
    return isAr ? "فتح صفحة الوظائف" : "Opening jobs page";
  }
  if (normalized.includes("بروفايل") || normalized.includes("ملفي") || normalized.includes("profile")) {
    return isAr ? "فتح ملفك الشخصي" : "Opening your profile";
  }
  if (normalized.includes("ليل") || normalized.includes("ليلي") || normalized.includes("dark")) {
    return isAr ? "تفعيل وضع الليل" : "Dark mode enabled";
  }
  if (normalized.includes("نهار") || normalized.includes("light")) {
    return isAr ? "تفعيل وضع النهار" : "Light mode enabled";
  }
  if (normalized.includes("تباين") || normalized.includes("contrast")) {
    return isAr ? "تبديل التباين العالي" : "High contrast toggled";
  }
  if (normalized.includes("اكسيسيبيلتي") || normalized.includes("الوصول") || normalized.includes("accessibility")) {
    return isAr ? "فتح إعدادات الوصول" : "Opening accessibility settings";
  }
  if (normalized.includes("scroll") || normalized.includes("انزل") || normalized.includes("اطلع")) {
    return isAr ? "تمرير الصفحة" : "Scrolling page";
  }
  if (normalized.includes("back") || normalized.includes("رجع")) {
    return isAr ? "الرجوع للخلف" : "Going back";
  }
  if (normalized.includes("read") || normalized.includes("اقرا")) {
    return isAr ? "قراءة الصفحة بصوت عالي" : "Reading page aloud";
  }

  return isAr ? "تم تنفيذ الأمر" : "Command executed";
}
