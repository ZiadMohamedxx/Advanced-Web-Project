/**
 * Accessibility Command Handlers
 * Commands for accessibility features and settings
 */

import { CommandConfig } from "./navigation";

export const accessibilityCommands: Record<string, CommandConfig> = {
  open_accessibility: {
    aliases: ["open accessibility", "open accessibility panel", "accessibility"],
    handler: () => {
      document.body.dispatchEvent(new Event("open-accessibility"));
    },
    description: "Open accessibility panel",
  },

  open_settings: {
    aliases: ["open settings", "settings"],
    handler: () => {
      document.body.dispatchEvent(new Event("open-accessibility"));
    },
    description: "Open settings (accessibility panel)",
  },
};