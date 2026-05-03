/**
 * Execution Engine
 * Converts interpreted intents into direct function calls
 * No event-based architecture - pure direct execution
 */

import type { IntentResult } from "@/voice/aiInterpreter";
import {
  navigateToUrl,
  scroll,
  readPageContent,
  readSelectedText,
  pauseResumeSpeech,
  stopSpeech,
  toggleDarkMode,
  toggleHighContrast,
  modifyFontScale,
  refreshPage,
  goBack,
  searchForQuery,
  openAccessibilityPanel,
} from "@/voice/actions";
import {
  clickElementByText,
  clickElementBySelector,
  fillInputField,
  submitForm,
  findElementByFuzzyText,
} from "@/voice/domActions";

interface ExecutionResult {
  success: boolean;
  message: string;
  actionTaken?: string;
}

/**
 * Execute an interpreted intent with direct function calls
 */
export async function executeIntent(result: IntentResult): Promise<ExecutionResult> {
  try {
    const { action, params, intent } = result;

    console.log(`🎯 Executing: ${intent} (${action})`);

    // Navigation actions
    if (action === "navigate") {
      const url = params.url || params.page || "/";
      navigateToUrl(url);
      return {
        success: true,
        message: `Navigating to ${params.label || url}`,
        actionTaken: `navigate:${url}`,
      };
    }

    // Scrolling actions
    if (action === "scroll") {
      const direction = params.direction || "down";
      const amount = params.amount || 300;
      scroll(direction as "up" | "down" | "top" | "bottom", amount);
      return {
        success: true,
        message: `Scrolling ${direction}`,
        actionTaken: `scroll:${direction}`,
      };
    }

    // Reading/TTS actions
    if (action === "read") {
      const target = params.target || "page";
      if (target === "selected") {
        readSelectedText();
      } else {
        readPageContent();
      }
      return {
        success: true,
        message: `Reading ${target === "selected" ? "selected text" : "entire page"}`,
        actionTaken: `read:${target}`,
      };
    }

    if (action === "pause") {
      pauseResumeSpeech();
      return {
        success: true,
        message: "Paused reading",
        actionTaken: "pause",
      };
    }

    if (action === "resume") {
      pauseResumeSpeech();
      return {
        success: true,
        message: "Resumed reading",
        actionTaken: "resume",
      };
    }

    if (action === "stop_reading") {
      stopSpeech();
      return {
        success: true,
        message: "Stopped reading",
        actionTaken: "stop_reading",
      };
    }

    // Toggle actions
    if (action === "toggle") {
      const feature = params.feature || "";

      if (feature.includes("dark") || feature.includes("night")) {
        toggleDarkMode();
        return {
          success: true,
          message: "Toggled dark mode",
          actionTaken: "toggle:dark_mode",
        };
      }

      if (feature.includes("contrast")) {
        toggleHighContrast();
        return {
          success: true,
          message: "Toggled high contrast",
          actionTaken: "toggle:contrast",
        };
      }

      if (feature.includes("accessibility")) {
        openAccessibilityPanel();
        return {
          success: true,
          message: "Opened accessibility panel",
          actionTaken: "toggle:accessibility",
        };
      }
    }

    // Font size actions
    if (action === "control_font") {
      const direction = params.direction || "increase";
      const delta = direction === "increase" ? 0.1 : -0.1;
      modifyFontScale(delta);
      return {
        success: true,
        message: `Font size ${direction === "increase" ? "increased" : "decreased"}`,
        actionTaken: `control_font:${direction}`,
      };
    }

    // Click actions
    if (action === "click") {
      const text = params.text || "";
      const selector = params.selector;

      let success = false;
      if (selector) {
        success = clickElementBySelector(selector);
      } else if (text) {
        success = clickElementByText(text);
      } else {
        const element = findElementByFuzzyText(params.description || "");
        if (element) {
          element.click();
          success = true;
        }
      }

      if (success) {
        return {
          success: true,
          message: `Clicked on ${params.text || "element"}`,
          actionTaken: `click:${params.text}`,
        };
      } else {
        return {
          success: false,
          message: `Could not find element to click`,
        };
      }
    }

    // Search actions
    if (action === "search") {
      const query = params.query || "";
      const success = searchForQuery(query);
      if (success) {
        return {
          success: true,
          message: `Searching for "${query}"`,
          actionTaken: `search:${query}`,
        };
      }
    }

    // Form actions
    if (action === "fill_form") {
      const field = params.field || "";
      const value = params.value || "";
      const submit = params.submit !== false;
      const success = fillInputField(field, value, submit);
      if (success) {
        return {
          success: true,
          message: `Filled form field and ${submit ? "submitted" : "updated"}`,
          actionTaken: `fill_form:${field}`,
        };
      }
    }

    if (action === "submit_form") {
      const success = submitForm();
      if (success) {
        return {
          success: true,
          message: "Form submitted",
          actionTaken: "submit_form",
        };
      }
    }

    // Utility actions
    if (action === "refresh") {
      refreshPage();
      return {
        success: true,
        message: "Page refreshing",
        actionTaken: "refresh",
      };
    }

    if (action === "go_back") {
      goBack();
      return {
        success: true,
        message: "Going back",
        actionTaken: "go_back",
      };
    }

    if (action === "open_accessibility") {
      openAccessibilityPanel();
      return {
        success: true,
        message: "Opened accessibility panel",
        actionTaken: "open_accessibility",
      };
    }

    return {
      success: false,
      message: `Unknown action: ${action}`,
    };
  } catch (error) {
    console.error("Execution error:", error);
    return {
      success: false,
      message: `Execution failed: ${String(error)}`,
    };
  }
}

/**
 * Execute with fallback: tries AI first, then rule-based fallback
 */
export async function executeWithFallback(
  result: IntentResult | null,
  fallbackFn: () => Promise<ExecutionResult>
): Promise<ExecutionResult> {
  if (result && result.confidence >= 50) {
    return executeIntent(result);
  }
  return fallbackFn();
}
