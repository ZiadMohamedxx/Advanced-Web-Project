// Normalize voice input: lowercase, trim, remove punctuation
export const normalizeCommand = (input: string): string => {
  return input
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:"'()]/g, "")
    .replace(/\s+/g, " ");
};

// Command aliases - map variations to canonical commands
const commandAliases: Record<string, string> = {
  // Home aliases
  "open home": "go home",
  "home page": "go home",

  // Jobs aliases
  "jobs page": "open jobs",
  "show jobs": "open jobs",

  // Profile aliases
  "my profile": "open profile",
  "profile page": "open profile",

  // About aliases
  "open about page": "open about",

  // Candidate portal aliases
  "candidate portal": "open candidate portal",

  // Employer portal aliases
  "employer portal": "open employer portal",

  // Scroll top aliases
  "go to top": "scroll top",
  "top of page": "scroll top",

  // Scroll bottom aliases
  "go to bottom": "scroll bottom",
  "bottom of page": "scroll bottom",

  // Read aliases
  "read page": "read this page",
  "start reading": "read this page",

  // Stop reading aliases
  "stop": "stop reading",

  // Refresh aliases
  "reload": "refresh page",
  "reload page": "refresh page",

  // Accessibility aliases
  "open accessibility": "open accessibility panel",
  "close accessibility": "close accessibility panel",

  // Help is already canonical
};

// Resolve alias to canonical command
const resolveCommand = (normalized: string): string => {
  return commandAliases[normalized] || normalized;
};

// Exact command handlers
const commandHandlers: Record<string, () => Promise<{ success: boolean; message: string }>> = {
  // Navigation
  "open jobs": async () => {
    window.location.pathname = "/jobs";
    return { success: true, message: "Opened jobs" };
  },
  "go home": async () => {
    window.location.pathname = "/";
    return { success: true, message: "Going home" };
  },
  "open profile": async () => {
    window.location.pathname = "/profile";
    return { success: true, message: "Opened profile" };
  },
  "open about": async () => {
    window.location.pathname = "/about";
    return { success: true, message: "Opened about" };
  },
  "open candidate portal": async () => {
    window.location.pathname = "/jobs";
    return { success: true, message: "Opened candidate portal" };
  },
  "open employer portal": async () => {
    window.location.pathname = "/employer";
    return { success: true, message: "Opened employer portal" };
  },

  // Scroll
  "scroll down": async () => {
    window.scrollBy({ top: 300, behavior: "smooth" });
    return { success: true, message: "Scrolled down" };
  },
  "scroll up": async () => {
    window.scrollBy({ top: -300, behavior: "smooth" });
    return { success: true, message: "Scrolled up" };
  },
  "scroll top": async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return { success: true, message: "Scrolled to top" };
  },
  "scroll bottom": async () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    return { success: true, message: "Scrolled to bottom" };
  },

  // Accessibility
  "dark mode on": async () => {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
    return { success: true, message: "Dark mode enabled" };
  },
  "dark mode off": async () => {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
    return { success: true, message: "Dark mode disabled" };
  },
  "high contrast on": async () => {
    document.body.classList.add("a11y-high-contrast");
    return { success: true, message: "High contrast enabled" };
  },
  "high contrast off": async () => {
    document.body.classList.remove("a11y-high-contrast");
    return { success: true, message: "High contrast disabled" };
  },

  // Text-to-speech
  "read this page": async () => {
    const text = document.body.innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
    return { success: true, message: "Reading page" };
  },
  "pause reading": async () => {
    window.speechSynthesis.pause();
    return { success: true, message: "Paused reading" };
  },
  "resume reading": async () => {
    window.speechSynthesis.resume();
    return { success: true, message: "Resumed reading" };
  },
  "stop reading": async () => {
    window.speechSynthesis.cancel();
    return { success: true, message: "Stopped reading" };
  },

  // Utility
  "refresh page": async () => {
    window.location.reload();
    return { success: true, message: "Refreshing page" };
  },
  "go back": async () => {
    window.history.back();
    return { success: true, message: "Going back" };
  },
  "help": async () => {
    // Dispatch custom event to open help modal
    window.dispatchEvent(new CustomEvent("openCommandCheatSheet"));
    return { success: true, message: "Opened help" };
  },

  // Accessibility Panel
  "open accessibility panel": async () => {
    // Dispatch event for accessibility panel to open
    document.body.dispatchEvent(new CustomEvent("open-accessibility"));
    return { success: true, message: "Opened accessibility panel" };
  },
  "close accessibility panel": async () => {
    // Dispatch event for accessibility button - toggle closed
    const event = new CustomEvent("close-accessibility");
    document.body.dispatchEvent(event);
    return { success: true, message: "Closed accessibility panel" };
  },
};

// Execute exact command match
export const executeExactCommand = async (
  normalizedInput: string
): Promise<{ success: boolean; message: string; command?: string }> => {
  const canonicalCommand = resolveCommand(normalizedInput);
  const handler = commandHandlers[canonicalCommand];

  if (!handler) {
    return {
      success: false,
      message: "Command not recognized",
    };
  }

  try {
    const result = await handler();
    return {
      ...result,
      command: canonicalCommand,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to execute command",
    };
  }
};

// Get all available commands for display
export const getAvailableCommands = () => {
  return {
    navigation: [
      "open jobs",
      "go home",
      "open profile",
      "open about",
      "open candidate portal",
      "open employer portal",
    ],
    scroll: ["scroll down", "scroll up", "scroll top", "scroll bottom"],
    accessibility: [
      "dark mode on",
      "dark mode off",
      "high contrast on",
      "high contrast off",
    ],
    reading: ["read this page", "pause reading", "resume reading", "stop reading"],
    utility: ["refresh page", "go back", "help"],
  };
};
