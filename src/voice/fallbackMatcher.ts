/**
 * Fallback Matcher
 * Lightweight keyword-based fallback system for when AI is unavailable
 */

import { parseCommand } from "@/voice/commandParser";
import { allVoiceCommands } from "@/voice/voiceConfig";
import type { IntentResult } from "@/voice/aiInterpreter";

/**
 * Use fallback rule-based matching
 */
export async function matchWithFallback(text: string): Promise<IntentResult | null> {
  try {
    const parsedCommand = parseCommand(text, allVoiceCommands);

    if (!parsedCommand || parsedCommand.confidence < 50) {
      return null;
    }

    // Convert parsed command to intent result format
    const result: IntentResult = {
      intent: parsedCommand.config.intent,
      action: mapIntentToAction(parsedCommand.config.intent),
      params: extractParams(parsedCommand.config.intent, text),
      confidence: parsedCommand.confidence,
    };

    return result;
  } catch (error) {
    console.error("Fallback matcher error:", error);
    return null;
  }
}

/**
 * Map command intent to action type
 */
function mapIntentToAction(intent: string): string {
  const mapping: Record<string, string> = {
    "NAVIGATE_HOME": "navigate",
    "NAVIGATE_JOBS": "navigate",
    "NAVIGATE_PROFILE": "navigate",
    "NAVIGATE_ABOUT": "navigate",
    "NAVIGATE_CANDIDATE_PORTAL": "navigate",
    "NAVIGATE_EMPLOYER_PORTAL": "navigate",
    "NAVIGATE_POST_JOB": "navigate",
    "NAVIGATE_SIGNIN": "navigate",
    "NAVIGATE_SIGNUP": "navigate",
    "SCROLL_DOWN": "scroll",
    "SCROLL_UP": "scroll",
    "SCROLL_TOP": "scroll",
    "SCROLL_BOTTOM": "scroll",
    "READ_PAGE": "read",
    "READ_SELECTED": "read",
    "PAUSE_READING": "pause",
    "RESUME_READING": "resume",
    "STOP_READING": "stop_reading",
    "OPEN_ACCESSIBILITY": "open_accessibility",
    "INCREASE_TEXT": "control_font",
    "DECREASE_TEXT": "control_font",
    "TOGGLE_DARK_MODE": "toggle",
    "TOGGLE_CONTRAST": "toggle",
    "SEARCH_JOBS": "search",
    "REFRESH_PAGE": "refresh",
    "GO_BACK": "go_back",
  };

  return mapping[intent] || "unknown";
}

/**
 * Extract parameters from intent
 */
function extractParams(intent: string, text: string): Record<string, any> {
  const params: Record<string, any> = {};

  // Navigation
  if (intent.startsWith("NAVIGATE_")) {
    const page = intent.replace("NAVIGATE_", "").toLowerCase();
    const urlMap: Record<string, string> = {
      "home": "/",
      "jobs": "/jobs",
      "profile": "/profile",
      "about": "/about",
      "candidate_portal": "/candidate-portal",
      "employer_portal": "/employer-portal",
      "post_job": "/post-job",
      "signin": "/signin",
      "signup": "/signup",
    };
    params.url = urlMap[page] || "/";
    params.page = page;
    params.label = page;
  }

  // Scrolling
  if (intent.includes("SCROLL_")) {
    const direction = intent.replace("SCROLL_", "").toLowerCase();
    const directionMap: Record<string, string> = {
      "down": "down",
      "up": "up",
      "top": "top",
      "bottom": "bottom",
    };
    params.direction = directionMap[direction] || "down";
  }

  // Reading
  if (intent === "READ_SELECTED") {
    params.target = "selected";
  } else if (intent === "READ_PAGE") {
    params.target = "page";
  }

  // Font size
  if (intent === "INCREASE_TEXT") {
    params.direction = "increase";
  } else if (intent === "DECREASE_TEXT") {
    params.direction = "decrease";
  }

  // Toggle
  if (intent === "TOGGLE_DARK_MODE") {
    params.feature = "dark_mode";
  } else if (intent === "TOGGLE_CONTRAST") {
    params.feature = "contrast";
  }

  // Search - extract query from text
  if (intent === "SEARCH_JOBS") {
    const match = text.match(/search\s+(?:for\s+)?(.+?)(?:\s+jobs?)?$/i);
    if (match) {
      params.query = match[1].trim();
    }
  }

  return params;
}
