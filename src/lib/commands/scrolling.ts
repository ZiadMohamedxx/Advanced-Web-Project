/**
 * Scrolling Command Handlers
 * Commands for scrolling and navigating within the page
 */

import { CommandConfig } from "./navigation";

export const scrollingCommands: Record<string, CommandConfig> = {
  scroll_down: {
    aliases: ["scroll down"],
    handler: () => {
      window.scrollBy({ top: 500, behavior: "smooth" });
    },
    description: "Scroll down 500px",
  },

  scroll_up: {
    aliases: ["scroll up"],
    handler: () => {
      window.scrollBy({ top: -500, behavior: "smooth" });
    },
    description: "Scroll up 500px",
  },

  scroll_top: {
    aliases: ["scroll to top", "go to top", "top"],
    handler: () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    description: "Scroll to top of page",
  },

  scroll_bottom: {
    aliases: ["scroll to bottom", "go to bottom", "bottom"],
    handler: () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    },
    description: "Scroll to bottom of page",
  },
};