/**
 * Voice Command System - Main Handler
 * Manages all voice commands with a registry-based architecture
 * Supports modular command organization and dynamic help system
 */

import { navigationCommands } from "./commands/navigation";
import { scrollingCommands } from "./commands/scrolling";
import { filteringCommands } from "./commands/filtering";
import { accessibilityCommands } from "./commands/accessibility";
import { utilityCommands } from "./commands/utilities";
import type { CommandConfig } from "./commands/navigation";

/**
 * Combine all command modules into a single registry
 * Order matters for command matching - check in priority order
 */
const allCommands = {
  ...navigationCommands,
  ...filteringCommands,
  ...scrollingCommands,
  ...accessibilityCommands,
  ...utilityCommands,
};

/**
 * Execute a voice command based on transcribed text
 * Uses flexible alias matching with .includes() for natural language
 *
 * @param text - The transcribed voice text from the user
 * @returns Feedback message, or null if command not recognized
 */
export const handleVoiceCommand = (text: string): string | null => {
  const normalizedText = text.toLowerCase().trim();

  // Handle special "search for" command with dynamic query
  if (normalizedText.includes("search for")) {
    const query = normalizedText.replace("search for", "").trim();
    const searchInput = document.querySelector(
      'input[type="search"], input[placeholder*="search" i]'
    ) as HTMLInputElement;

    if (searchInput) {
      searchInput.value = query;
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      return `Searching for "${query}"`;
    }
    return "Search input not found on this page";
  }

  // Handle help/show commands command
  if (
    normalizedText.includes("help") ||
    normalizedText.includes("show commands") ||
    normalizedText.includes("what can i say")
  ) {
    showCommandHelp();
    return "Showing available commands";
  }

  // Try to match command aliases
  for (const [key, config] of Object.entries(allCommands)) {
    for (const alias of config.aliases) {
      if (normalizedText.includes(alias)) {
        try {
          config.handler();
          return `✓ ${config.description}`;
        } catch (error) {
          console.error(`Error executing command "${key}":`, error);
          return `✗ Failed to ${config.description}`;
        }
      }
    }
  }

  // Command not recognized
  return null;
};

/**
 * Get all available commands organized by category
 * Useful for generating help text, command lists, etc.
 */
export const getAllCommands = () => {
  return {
    Navigation: navigationCommands,
    Filtering: filteringCommands,
    Scrolling: scrollingCommands,
    Accessibility: accessibilityCommands,
    Utilities: utilityCommands,
  };
};

/**
 * Get current page-specific commands
 * Allows filtering what commands are available on each page
 */
export const getCurrentPageCommands = (): Record<string, CommandConfig> => {
  const path = window.location.pathname;
  const commands: Record<string, CommandConfig> = {
    ...navigationCommands,
    ...scrollingCommands,
    ...accessibilityCommands,
    ...utilityCommands,
  };

  // Add filtering commands if on jobs page
  if (path === "/jobs") {
    Object.assign(commands, filteringCommands);
  }

  return commands;
};

/**
 * Display help modal with all available commands
 * Shows commands organized by category
 */
export const showCommandHelp = () => {
  // Dispatch event so AccessibilityPanel or dedicated help component can display
  document.body.dispatchEvent(
    new CustomEvent("show-command-help", {
      detail: {
        commands: getAllCommands(),
      },
    })
  );
};

/**
 * Format commands for display (e.g., in a help modal)
 * Returns organized command list with descriptions
 */
export const formatCommandsForDisplay = () => {
  const categories = getAllCommands();
  let formatted = "";

  for (const [category, commands] of Object.entries(categories)) {
    formatted += `\n${category}:\n`;
    for (const [key, config] of Object.entries(commands)) {
      formatted += `  • ${config.aliases.join(" / ")} → ${config.description}\n`;
    }
  }

  return formatted;
};