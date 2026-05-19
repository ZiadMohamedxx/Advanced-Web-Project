/**
 * Voice Commands Configuration - Complete Command Registry
 * All available commands with flexible patterns and synonyms
 */

import type { CommandConfig } from "@/voice/commandParser";
import {
  navigateToUrl,
  scroll,
  readPageContent,
  readSelectedText,
  pauseResumeSpeech,
  stopSpeech,
  openAccessibilityPanel,
  modifyFontScale,
  toggleHighContrast,
  toggleDarkMode,
  searchForQuery,
  searchJobsWithQuery,
  goBack,
  refreshPage,
} from "@/voice/actions";

export const navigationCommands: Record<string, CommandConfig> = {
  navigate_home: {
    intent: "NAVIGATE_HOME",
    category: "Navigation",
    description: "Navigate to home page",
    minConfidence: 60,
    patterns: [
      { keywords: ["home"], actionWords: ["go", "open", "back", "return"], minConfidence: 60 },
      { keywords: ["homepage"], minConfidence: 65 },
      // Arabic patterns
      { keywords: ["بيت", "رئيسية"], actionWords: ["روح", "افتح", "رجع"], minConfidence: 60 },
      { keywords: ["بيت"], minConfidence: 65 },
    ],
    handler: () => navigateToUrl("/"),
  },
  navigate_jobs: {
    intent: "NAVIGATE_JOBS",
    category: "Navigation",
    description: "Navigate to jobs page",
    minConfidence: 60,
    patterns: [
      { keywords: ["jobs"], actionWords: ["open", "go", "show", "take", "view", "find"], minConfidence: 60 },
      { keywords: ["job", "listings"], minConfidence: 65 },
      // Arabic patterns
      { keywords: ["وظائف"], actionWords: ["افتح", "روح", "اظهر", "شوف"], minConfidence: 60 },
      { keywords: ["وظيفة", "عروض"], minConfidence: 65 },
    ],
    handler: () => navigateToUrl("/jobs"),
  },
  navigate_profile: {
    intent: "NAVIGATE_PROFILE",
    category: "Navigation",
    description: "Navigate to profile page",
    minConfidence: 60,
    patterns: [
      { keywords: ["profile"], actionWords: ["open", "go", "show", "view"], minConfidence: 60 },
      { keywords: ["account"], minConfidence: 65 },
      // Arabic patterns
      { keywords: ["بروفايل", "ملفي"], actionWords: ["افتح", "روح", "اظهر"], minConfidence: 60 },
      { keywords: ["حساب"], minConfidence: 65 },
    ],
    handler: () => navigateToUrl("/profile"),
  },
  navigate_about: {
    intent: "NAVIGATE_ABOUT",
    category: "Navigation",
    description: "Navigate to about page",
    minConfidence: 65,
    patterns: [
      { keywords: ["about"], actionWords: ["open", "go", "show"], minConfidence: 65 },
      // Arabic patterns
      { keywords: ["عنا", "حول"], actionWords: ["افتح", "روح", "اظهر"], minConfidence: 65 },
    ],
    handler: () => navigateToUrl("/about"),
  },
};

export const scrollingCommands: Record<string, CommandConfig> = {
  scroll_down: {
    intent: "SCROLL_DOWN",
    category: "Scrolling",
    description: "Scroll down",
    minConfidence: 60,
    patterns: [
      { keywords: ["scroll", "down"], minConfidence: 60 },
      { keywords: ["down"], actionWords: ["scroll"], minConfidence: 65 },
      // Arabic patterns
      { keywords: ["انزل", "تحت"], minConfidence: 60 },
      { keywords: ["تحت"], actionWords: ["انزل"], minConfidence: 65 },
    ],
    handler: () => scroll("down", 300),
  },
  scroll_up: {
    intent: "SCROLL_UP",
    category: "Scrolling",
    description: "Scroll up",
    minConfidence: 60,
    patterns: [
      { keywords: ["scroll", "up"], minConfidence: 60 },
      { keywords: ["up"], actionWords: ["scroll"], minConfidence: 65 },
      // Arabic patterns
      { keywords: ["اطلع", "فوق"], minConfidence: 60 },
      { keywords: ["فوق"], actionWords: ["اطلع"], minConfidence: 65 },
    ],
    handler: () => scroll("up", 300),
  },
  scroll_top: {
    intent: "SCROLL_TOP",
    category: "Scrolling",
    description: "Scroll to top",
    minConfidence: 65,
    patterns: [
      { keywords: ["top"], actionWords: ["go", "scroll"], minConfidence: 65 },
      // Arabic patterns
      { keywords: ["أعلى"], actionWords: ["روح", "انزل"], minConfidence: 65 },
    ],
    handler: () => scroll("top"),
  },
  scroll_bottom: {
    intent: "SCROLL_BOTTOM",
    category: "Scrolling",
    description: "Scroll to bottom",
    minConfidence: 65,
    patterns: [
      { keywords: ["bottom"], actionWords: ["go", "scroll"], minConfidence: 65 },
      // Arabic patterns
      { keywords: ["آخر", "نهاية"], actionWords: ["روح", "انزل"], minConfidence: 65 },
    ],
    handler: () => scroll("bottom"),
  },
};

export const ttsCommands: Record<string, CommandConfig> = {
  read_page: {
    intent: "READ_PAGE",
    category: "Reading",
    description: "Read entire page content aloud",
    minConfidence: 55,
    patterns: [
      { keywords: ["read", "page"], minConfidence: 55 },
      { keywords: ["read"], actionWords: ["page", "this", "all"], minConfidence: 60 },
      // Arabic patterns
      { keywords: ["اقرا", "صفحة"], minConfidence: 55 },
      { keywords: ["اقرا"], actionWords: ["صفحة", "هذي", "كل"], minConfidence: 60 },
    ],
    handler: () => readPageContent(),
  },
  read_selected: {
    intent: "READ_SELECTED",
    category: "Reading",
    description: "Read highlighted text aloud",
    minConfidence: 60,
    patterns: [
      { keywords: ["read", "selected"], minConfidence: 60 },
      { keywords: ["read", "highlighted"], minConfidence: 60 },
      // Arabic patterns
      { keywords: ["اقرا", "محدد"], minConfidence: 60 },
    ],
    handler: () => readSelectedText(),
  },
  pause_reading: {
    intent: "PAUSE_READING",
    category: "Reading",
    description: "Pause reading",
    minConfidence: 55,
    patterns: [
      { keywords: ["pause"], minConfidence: 55 },
      // Arabic patterns
      { keywords: ["وقف"], minConfidence: 55 },
    ],
    handler: () => pauseResumeSpeech(),
  },
  resume_reading: {
    intent: "RESUME_READING",
    category: "Reading",
    description: "Resume reading",
    minConfidence: 55,
    patterns: [
      { keywords: ["resume"], minConfidence: 55 },
      { keywords: ["continue"], minConfidence: 60 },
      // Arabic patterns
      { keywords: ["كمل"], minConfidence: 55 },
      { keywords: ["استمر"], minConfidence: 60 },
    ],
    handler: () => pauseResumeSpeech(),
  },
  stop_reading: {
    intent: "STOP_READING",
    category: "Reading",
    description: "Stop reading",
    minConfidence: 50,
    patterns: [
      { keywords: ["stop"], actionWords: ["reading", "audio"], minConfidence: 50 },
      { keywords: ["stop", "reading"], minConfidence: 50 },
      // Arabic patterns
      { keywords: ["وقف"], actionWords: ["القراية", "الصوت"], minConfidence: 50 },
      { keywords: ["وقف", "القراية"], minConfidence: 50 },
    ],
    handler: () => stopSpeech(),
  },
};

export const accessibilityCommands: Record<string, CommandConfig> = {
  open_accessibility: {
    intent: "OPEN_ACCESSIBILITY",
    category: "Accessibility",
    description: "Open accessibility panel",
    minConfidence: 60,
    patterns: [
      { keywords: ["accessibility"], actionWords: ["open"], minConfidence: 60 },
      { keywords: ["settings"], minConfidence: 65 },
      // Arabic patterns
      { keywords: ["اكسيسيبيلتي", "الوصول"], actionWords: ["افتح"], minConfidence: 60 },
      { keywords: ["اعدادات"], minConfidence: 65 },
    ],
    handler: () => openAccessibilityPanel(),
  },
  increase_text: {
    intent: "INCREASE_TEXT",
    category: "Accessibility",
    description: "Increase text size",
    minConfidence: 55,
    patterns: [
      { keywords: ["increase", "text"], minConfidence: 55 },
      { keywords: ["larger", "font"], minConfidence: 60 },
      { keywords: ["bigger"], minConfidence: 65 },
      // Arabic patterns
      { keywords: ["زود", "نص"], minConfidence: 55 },
      { keywords: ["أكبر", "خط"], minConfidence: 60 },
    ],
    handler: () => modifyFontScale(0.1),
  },
  decrease_text: {
    intent: "DECREASE_TEXT",
    category: "Accessibility",
    description: "Decrease text size",
    minConfidence: 55,
    patterns: [
      { keywords: ["decrease", "text"], minConfidence: 55 },
      { keywords: ["smaller", "font"], minConfidence: 60 },
      // Arabic patterns
      { keywords: ["قلل", "نص"], minConfidence: 55 },
      { keywords: ["أصغر", "خط"], minConfidence: 60 },
    ],
    handler: () => modifyFontScale(-0.1),
  },
  toggle_dark_mode: {
    intent: "TOGGLE_DARK_MODE",
    category: "Accessibility",
    description: "Toggle dark mode",
    minConfidence: 50,
    patterns: [
      { keywords: ["dark", "mode"], minConfidence: 50, synonyms: { "dark": ["night", "dark"], "mode": ["mode", "theme"] } },
      { keywords: ["night", "mode"], minConfidence: 50, synonyms: { "night": ["dark", "night"], "mode": ["mode", "theme"] } },
      { keywords: ["dark"], minConfidence: 55, actionWords: ["on", "enable"] },
      { keywords: ["night"], minConfidence: 55, actionWords: ["on", "enable"] },
      // Arabic patterns
      { keywords: ["ليل", "وضع"], minConfidence: 50 },
      { keywords: ["ليلي"], minConfidence: 50 },
      { keywords: ["ليل"], minConfidence: 55, actionWords: ["شغل", "فعل"] },
    ],
    handler: () => toggleDarkMode(),
  },
  toggle_contrast: {
    intent: "TOGGLE_CONTRAST",
    category: "Accessibility",
    description: "Toggle high contrast",
    minConfidence: 60,
    patterns: [
      { keywords: ["contrast"], minConfidence: 60 },
      { keywords: ["high", "contrast"], minConfidence: 60 },
      // Arabic patterns
      { keywords: ["تباين"], minConfidence: 60 },
      { keywords: ["عالي", "تباين"], minConfidence: 60 },
    ],
    handler: () => toggleHighContrast(),
  },
};

export const utilityCommands: Record<string, CommandConfig> = {
  refresh_page: {
    intent: "REFRESH_PAGE",
    category: "Utilities",
    description: "Refresh the page",
    minConfidence: 65,
    patterns: [
      { keywords: ["refresh"], minConfidence: 65 },
      { keywords: ["reload"], minConfidence: 65 },
      // Arabic patterns
      { keywords: ["ريفريش"], minConfidence: 65 },
      { keywords: ["اعادة"], minConfidence: 65 },
    ],
    handler: () => refreshPage(),
  },
  go_back: {
    intent: "GO_BACK",
    category: "Navigation",
    description: "Go back to previous page",
    minConfidence: 60,
    patterns: [
      { keywords: ["back"], actionWords: ["go"], minConfidence: 60 },
      { keywords: ["previous"], minConfidence: 65 },
      // Arabic patterns
      { keywords: ["رجع"], actionWords: ["روح"], minConfidence: 60 },
      { keywords: ["سابق"], minConfidence: 65 },
    ],
    handler: () => goBack(),
  },
};

export const searchCommands: Record<string, CommandConfig> = {
  search_jobs: {
    intent: "SEARCH_JOBS",
    category: "Search",
    description: "Search for jobs with query",
    minConfidence: 50,
    patterns: [
      { keywords: ["search"], minConfidence: 50 },
      { keywords: ["find"], minConfidence: 55 },
      // Arabic patterns
      { keywords: ["دور"], minConfidence: 50 },
      { keywords: ["ابحث"], minConfidence: 55 },
    ],
    handler: () => true,
  },
  voice_search_jobs: {
    intent: "VOICE_SEARCH_JOBS",
    category: "Search",
    description: "Search jobs with voice query",
    minConfidence: 50,
    patterns: [
      { keywords: ["search", "jobs"], minConfidence: 50, actionWords: ["for", "find"] },
      { keywords: ["find", "jobs"], minConfidence: 55 },
      { keywords: ["frontend"], minConfidence: 50 },
      { keywords: ["backend"], minConfidence: 50 },
      { keywords: ["react"], minConfidence: 50 },
      { keywords: ["remote"], minConfidence: 55 },
      { keywords: ["onsite"], minConfidence: 55 },
      { keywords: ["hybrid"], minConfidence: 55 },
      { keywords: ["ai"], minConfidence: 55 },
      { keywords: ["python"], minConfidence: 50 },
      { keywords: ["javascript"], minConfidence: 50 },
      // Arabic patterns
      { keywords: ["دور", "وظايف", "شغل"], minConfidence: 50, actionWords: ["على"] },
      { keywords: ["هات", "وظايف"], minConfidence: 55 },
      { keywords: ["فرونت"], minConfidence: 50 },
      { keywords: ["باك"], minConfidence: 50 },
      { keywords: ["ريموت"], minConfidence: 55 },
      { keywords: ["ذكاء"], minConfidence: 55 },
    ],
    handler: () => true,
  },
};

export const allVoiceCommands: Record<string, CommandConfig> = {
  ...navigationCommands,
  ...scrollingCommands,
  ...ttsCommands,
  ...accessibilityCommands,
  ...utilityCommands,
  ...searchCommands,
};

export const getAllCommandsByCategory = () => ({
  Navigation: navigationCommands,
  Scrolling: scrollingCommands,
  Reading: ttsCommands,
  Accessibility: accessibilityCommands,
  Utilities: utilityCommands,
  Search: searchCommands,
});
