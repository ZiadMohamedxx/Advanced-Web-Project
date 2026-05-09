/**
 * Utility Command Handlers
 * General utility commands: navigation history, refresh, search, etc.
 */

import { CommandConfig } from "./navigation";

export const utilityCommands: Record<string, CommandConfig> = {
  go_back: {
    aliases: ["go back", "back"],
    handler: () => {
      window.history.back();
    },
    description: "Go to previous page",
  },

  refresh: {
    aliases: ["refresh", "reload"],
    handler: () => {
      window.location.reload();
    },
    description: "Refresh the page",
  },

  search: {
    aliases: ["search for", "find"],
    handler: () => {
      // Focus search input if available
      const searchInput = document.querySelector(
        'input[type="search"], input[placeholder*="search" i]'
      ) as HTMLInputElement;

      if (searchInput) {
        searchInput.focus();
      }
    },
    description: "Focus search input",
  },

  clear_search: {
    aliases: ["clear search"],
    handler: () => {
      const searchInput = document.querySelector(
        'input[type="search"], input[placeholder*="search" i]'
      ) as HTMLInputElement;

      if (searchInput) {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
    },
    description: "Clear search input",
  },

  open_menu: {
    aliases: ["open menu", "open navigation", "toggle menu"],
    handler: () => {
      // Try to find and click mobile menu button
      const menuButton = document.querySelector(
        '[data-testid="menu-button"], button[aria-label*="menu" i], .mobile-menu-button'
      ) as HTMLButtonElement;

      if (menuButton) {
        menuButton.click();
      }
    },
    description: "Open mobile menu",
  },
};