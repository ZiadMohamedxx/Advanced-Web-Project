/**
 * Centralized Command Normalization and Execution
 * Single source of truth for all voice commands
 * Supports English and Arabic with exact-match registry
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TASK 1: CENTRALIZED NORMALIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Arabic character normalization map
const ARABIC_NORMALIZATIONS: Record<string, string> = {
  "أ": "ا",
  "إ": "ا",
  "آ": "ا",
  "ة": "ه",
  "ى": "ي",
};

// Arabic diacritics to remove
const ARABIC_DIACRITICS = /[\u064B-\u0652\u064E-\u0652]/g;

/**
 * Normalize text for command matching
 * Handles English and Arabic
 */
export const normalizeCommand = (input: string): string => {
  let normalized = input.toLowerCase().trim();

  // Remove English punctuation
  normalized = normalized.replace(/[.,!?;:"'()]/g, "");

  // Remove Arabic diacritics
  normalized = normalized.replace(ARABIC_DIACRITICS, "");

  // Normalize Arabic characters
  for (const [variant, base] of Object.entries(ARABIC_NORMALIZATIONS)) {
    normalized = normalized.replace(new RegExp(variant, "g"), base);
  }

  // Collapse multiple spaces
  normalized = normalized.replace(/\s+/g, " ");

  console.log("[VOICE] Original:", input);
  console.log("[VOICE] Normalized:", normalized);

  return normalized;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TASK 2: COMMAND ALIASES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Command aliases - map variations to canonical commands
// ENGLISH and ARABIC aliases both map to same canonical form
const commandAliases: Record<string, string> = {
  // ────── NAVIGATION ──────
  // English
  "open home": "navigate_home",
  "go home": "navigate_home",
  "home page": "navigate_home",
  "open home page": "navigate_home",

  // Arabic
  "افتح الصفحة الرئيسية": "navigate_home",
  "روح للرئيسية": "navigate_home",
  "روح للصفحة الرئيسية": "navigate_home",

  // Jobs
  // English
  "open jobs": "navigate_jobs",
  "go to jobs": "navigate_jobs",
  "jobs page": "navigate_jobs",
  "show jobs": "navigate_jobs",

  // Arabic
  "افتح الوظايف": "navigate_jobs",
  "روح للوظايف": "navigate_jobs",
  "صفحة الوظايف": "navigate_jobs",

  // Profile
  // English
  "open profile": "navigate_profile",
  "go to profile": "navigate_profile",
  "my profile": "navigate_profile",
  "profile page": "navigate_profile",

  // Arabic
  "افتح البروفايل": "navigate_profile",
  "افتح ملفي": "navigate_profile",
  "روح للبروفايل": "navigate_profile",

  // About
  // English
  "open about": "navigate_about",
  "go to about": "navigate_about",

  // Arabic
  "افتح عنا": "navigate_about",
  "روح لعنا": "navigate_about",

  // ────── SCROLLING ──────
  // English
  "scroll down": "scroll_down",
  "scroll": "scroll_down",

  // Arabic
  "انزل تحت": "scroll_down",
  "انزل": "scroll_down",

  // English
  "scroll up": "scroll_up",

  // Arabic
  "اطلع فوق": "scroll_up",
  "اطلع": "scroll_up",

  // English
  "scroll top": "scroll_top",
  "scroll to top": "scroll_top",
  "go to top": "scroll_top",

  // Arabic
  "روح لأعلى": "scroll_top",

  // English
  "scroll bottom": "scroll_bottom",
  "scroll to bottom": "scroll_bottom",

  // Arabic
  "روح لآخر": "scroll_bottom",

  // ────── READING ──────
  // English
  "read this page": "read_page",
  "read page": "read_page",
  "start reading": "read_page",

  // Arabic
  "اقرأ الصفحة": "read_page",
  "اقرا الصفحة": "read_page",

  // English
  "pause reading": "pause_reading",
  "pause": "pause_reading",

  // Arabic
  "وقف القراية": "pause_reading",
  "وقف": "pause_reading",

  // English
  "resume reading": "resume_reading",
  "continue reading": "resume_reading",

  // Arabic
  "كمل القراية": "resume_reading",
  "كمل": "resume_reading",

  // English
  "stop reading": "stop_reading",
  "stop": "stop_reading",

  // Arabic
  "اوقف القراية": "stop_reading",

  // ────── ACCESSIBILITY ──────
  // English - Dark Mode
  "dark mode on": "dark_mode_on",
  "enable dark mode": "dark_mode_on",
  "turn on dark mode": "dark_mode_on",

  // Arabic - Dark Mode
  "شغل الوضع الليلي": "dark_mode_on",
  "فعل الوضع الليلي": "dark_mode_on",
  "اشغل الوضع الليلي": "dark_mode_on",

  // English - Light Mode
  "dark mode off": "dark_mode_off",
  "disable dark mode": "dark_mode_off",
  "turn off dark mode": "dark_mode_off",

  // Arabic - Light Mode
  "اقفل الوضع الليلي": "dark_mode_off",
  "طفي الوضع الليلي": "dark_mode_off",

  // English - Contrast
  "high contrast on": "contrast_on",
  "enable contrast": "contrast_on",

  // Arabic - Contrast
  "شغل التباين": "contrast_on",

  // English
  "high contrast off": "contrast_off",
  "disable contrast": "contrast_off",

  // Arabic
  "اقفل التباين": "contrast_off",

  // English
  "open accessibility": "open_accessibility",
  "accessibility": "open_accessibility",
  "accessibility panel": "open_accessibility",

  // Arabic
  "افتح الوصول": "open_accessibility",
  "افتح اكسيسيبيلتي": "open_accessibility",

  // ────── UTILITY ──────
  // English
  "refresh page": "refresh",
  "refresh": "refresh",
  "reload": "refresh",

  // Arabic
  "اعمل ريفريش": "refresh",
  "ريفريش": "refresh",

  // English
  "go back": "go_back",
  "back": "go_back",

  // Arabic
  "ارجع": "go_back",
  "رجع": "go_back",

  // ────── SEARCH (NEW) ──────
  // English search patterns
  "search frontend jobs": "search_frontend",
  "find frontend jobs": "search_frontend",
  "search frontend": "search_frontend",
  "find frontend": "search_frontend",

  "search backend jobs": "search_backend",
  "find backend jobs": "search_backend",
  "search backend": "search_backend",
  "find backend": "search_backend",

  "search react jobs": "search_react",
  "find react jobs": "search_react",
  "search react": "search_react",

  "search remote jobs": "search_remote",
  "find remote jobs": "search_remote",
  "search remote": "search_remote",

  "search ai jobs": "search_ai",
  "find ai jobs": "search_ai",
  "search ai": "search_ai",

  // Arabic search patterns
  "دور على وظائف فرونت اند": "search_frontend",
  "هات وظائف فرونت اند": "search_frontend",
  "دور على فرونت": "search_frontend",

  "دور على وظائف باك اند": "search_backend",
  "هات وظائف باك اند": "search_backend",
  "دور على باك": "search_backend",

  "دور على شغل رياكت": "search_react",
  "هات وظائف رياكت": "search_react",

  "هات وظائف ريموت": "search_remote",
  "دور على ريموت": "search_remote",
  "وظائف ريموت": "search_remote",

  "وظائف ذكاء اصطناعي": "search_ai",
  "دور على ذكاء اصطناعي": "search_ai",
};

// Resolve alias to canonical command
const resolveCommand = (normalized: string): string => {
  const resolved = commandAliases[normalized];
  if (resolved) {
    console.log("[VOICE] Alias match:", normalized, "→", resolved);
  }
  return resolved || normalized;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TASK 3: COMMAND HANDLERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Exact command handlers
const commandHandlers: Record<string, () => Promise<{ success: boolean; message: string }>> = {
  // ────── NAVIGATION ──────
  "navigate_home": async () => {
    window.location.pathname = "/";
    return { success: true, message: "Going to home" };
  },

  "navigate_jobs": async () => {
    window.location.pathname = "/jobs";
    return { success: true, message: "Opening jobs page" };
  },

  "navigate_profile": async () => {
    window.location.pathname = "/profile";
    return { success: true, message: "Opening profile" };
  },

  "navigate_about": async () => {
    window.location.pathname = "/about";
    return { success: true, message: "Opening about page" };
  },

  // ────── SCROLLING ──────
  "scroll_down": async () => {
    window.scrollBy({ top: 300, behavior: "smooth" });
    return { success: true, message: "Scrolled down" };
  },

  "scroll_up": async () => {
    window.scrollBy({ top: -300, behavior: "smooth" });
    return { success: true, message: "Scrolled up" };
  },

  "scroll_top": async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return { success: true, message: "Scrolled to top" };
  },

  "scroll_bottom": async () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    return { success: true, message: "Scrolled to bottom" };
  },

  // ────── READING ──────
  "read_page": async () => {
    if (!("speechSynthesis" in window)) {
      return { success: false, message: "Speech synthesis not available" };
    }
    const text = document.body.innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
    return { success: true, message: "Reading page aloud" };
  },

  "pause_reading": async () => {
    if (!("speechSynthesis" in window)) {
      return { success: false, message: "Speech synthesis not available" };
    }
    window.speechSynthesis.pause();
    return { success: true, message: "Paused reading" };
  },

  "resume_reading": async () => {
    if (!("speechSynthesis" in window)) {
      return { success: false, message: "Speech synthesis not available" };
    }
    window.speechSynthesis.resume();
    return { success: true, message: "Resumed reading" };
  },

  "stop_reading": async () => {
    if (!("speechSynthesis" in window)) {
      return { success: false, message: "Speech synthesis not available" };
    }
    window.speechSynthesis.cancel();
    return { success: true, message: "Stopped reading" };
  },

  // ────── ACCESSIBILITY ──────
  "dark_mode_on": async () => {
    const html = document.documentElement;
    html.setAttribute("data-theme", "dark");
    document.body.classList.add("dark");
    localStorage.setItem("theme-preference", "dark");
    return { success: true, message: "Dark mode enabled" };
  },

  "dark_mode_off": async () => {
    const html = document.documentElement;
    html.setAttribute("data-theme", "light");
    document.body.classList.remove("dark");
    localStorage.setItem("theme-preference", "light");
    return { success: true, message: "Dark mode disabled" };
  },

  "contrast_on": async () => {
    document.body.classList.add("a11y-high-contrast");
    localStorage.setItem("contrast-enabled", "true");
    return { success: true, message: "High contrast enabled" };
  },

  "contrast_off": async () => {
    document.body.classList.remove("a11y-high-contrast");
    localStorage.setItem("contrast-enabled", "false");
    return { success: true, message: "High contrast disabled" };
  },

  "open_accessibility": async () => {
    document.body.dispatchEvent(new Event("open-accessibility"));
    return { success: true, message: "Opened accessibility panel" };
  },

  // ────── UTILITY ──────
  "refresh": async () => {
    window.location.reload();
    return { success: true, message: "Refreshing page" };
  },

  "go_back": async () => {
    window.history.back();
    return { success: true, message: "Going back" };
  },

  // ────── SEARCH (NEW) ──────
  "search_frontend": async () => {
    window.location.href = "/jobs?search=frontend";
    return { success: true, message: "Searching frontend jobs" };
  },

  "search_backend": async () => {
    window.location.href = "/jobs?search=backend";
    return { success: true, message: "Searching backend jobs" };
  },

  "search_react": async () => {
    window.location.href = "/jobs?search=react";
    return { success: true, message: "Searching React jobs" };
  },

  "search_remote": async () => {
    window.location.href = "/jobs?search=remote";
    return { success: true, message: "Searching remote jobs" };
  },

  "search_ai": async () => {
    window.location.href = "/jobs?search=ai";
    return { success: true, message: "Searching AI jobs" };
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TASK 5: EXECUTION ENGINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Execute exact command match
export const executeExactCommand = async (
  normalizedInput: string
): Promise<{ success: boolean; message: string; command?: string }> => {
  const canonicalCommand = resolveCommand(normalizedInput);
  const handler = commandHandlers[canonicalCommand as keyof typeof commandHandlers];

  console.log("[VOICE] Canonical:", canonicalCommand);
  console.log("[VOICE] Handler found:", !!handler);

  if (!handler) {
    return {
      success: false,
      message: "Command not recognized",
    };
  }

  try {
    const result = await handler();
    console.log("[VOICE] Executed:", canonicalCommand, result);
    return {
      ...result,
      command: canonicalCommand,
    };
  } catch (error) {
    console.error("[VOICE] Execution error:", error);
    return {
      success: false,
      message: "Failed to execute command",
    };
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TASK 4: DISPLAY ALL COMMANDS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Get all available commands for display (organized by category)
export const getAvailableCommands = () => {
  return {
    navigation: [
      "open jobs",
      "go home",
      "open profile",
      "open about",
      "افتح الوظايف",
      "روح للرئيسية",
      "افتح البروفايل",
      "افتح عنا",
    ],
    search: [
      "search frontend jobs",
      "search backend jobs",
      "search react jobs",
      "search remote jobs",
      "search ai jobs",
      "دور على وظائف فرونت اند",
      "دور على وظائف باك اند",
      "هات وظائف ريموت",
      "وظائف ذكاء اصطناعي",
    ],
    reading: [
      "read this page",
      "pause reading",
      "resume reading",
      "stop reading",
      "اقرأ الصفحة",
      "وقف القراية",
      "كمل القراية",
    ],
    accessibility: [
      "dark mode on",
      "dark mode off",
      "high contrast on",
      "high contrast off",
      "open accessibility",
      "شغل الوضع الليلي",
      "اقفل الوضع الليلي",
      "شغل التباين",
      "افتح الوصول",
    ],
    scrolling: [
      "scroll down",
      "scroll up",
      "scroll top",
      "scroll bottom",
      "انزل تحت",
      "اطلع فوق",
      "روح لأعلى",
    ],
    utility: [
      "refresh page",
      "go back",
      "اعمل ريفريش",
      "ارجع",
    ],
  };
};
