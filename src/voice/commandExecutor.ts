/**
 * Voice Command Executor
 * Handles execution of commands with special cases and event dispatching
 */


import { searchForQuery } from "./actions";
import type { ParsedCommand } from "./types";
/**
 * Execute a parsed command with special handling for certain command types
 * Returns true if executed, false otherwise
 */
export function executeCommand(
  parsedCommand: ParsedCommand,
  originalText: string
): boolean {
  const { intent, config } = parsedCommand;

  try {
    // Special handling for search commands
    if (intent === "SEARCH_JOBS") {
      const query = extractSearchQuery(originalText);
      if (query) {
        return searchForQuery(query);
      }
      return false;
    }

    // Default execution - handler returns boolean for success
   config.handler();
  return true;
  } catch (error) {
    console.error(`Error executing command "${intent}":`, error);
    return false;
  }
}

/**
 * Extract search query from voice input
 */
function extractSearchQuery(text: string): string {
  const patterns = [
    /search\s+(?:for\s+)?(.+)/i,
    /find\s+(.+)/i,
    /search\s+(?:for\s+)?(.+?)\s+(?:jobs?|positions?|roles?)/i,
    /look\s+(?:for\s+)?(.+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return "";
}

/**
 * Get user-friendly feedback message for a command
 */
export function getCommandFeedback(
  parsedCommand: ParsedCommand | null,
  confidence: number
): string {
  if (!parsedCommand) {
    return "❓ Command not recognized";
  }

  if (confidence < 70) {
    return `⚠️ Not confident (${confidence}%) - please repeat`;
  }

  return `✓ ${parsedCommand.config.description} (${confidence}%)`;
}

