/**
 * AI Intent Interpreter
 * Uses OpenAI API to understand natural language and extract structured intent
 */

export interface IntentResult {
  intent: string;
  action: string;
  params: Record<string, any>;
  confidence: number;
  rawResponse?: any;
}

const API_BASE_URL = "http://localhost:4000";

/**
 * Interpret user speech using OpenAI API
 * Converts natural language into structured intent + action + params
 */
export async function interpretWithAI(text: string): Promise<IntentResult | null> {
  try {
    if (!text.trim()) {
      return null;
    }

    // Call backend endpoint that uses OpenAI
    const response = await fetch(`${API_BASE_URL}/voice/interpret`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.warn("AI interpretation failed:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data as IntentResult;
  } catch (error) {
    console.error("AI interpreter error:", error);
    return null;
  }
}

/**
 * Parse AI response and validate structure
 */
export function validateIntentResult(result: any): result is IntentResult {
  return (
    result &&
    typeof result.intent === "string" &&
    typeof result.action === "string" &&
    typeof result.params === "object" &&
    typeof result.confidence === "number" &&
    result.confidence >= 0 &&
    result.confidence <= 100
  );
}

/**
 * Get readable description of interpreted intent
 */
export function describeIntent(result: IntentResult): string {
  const actions: Record<string, string> = {
    "navigate": `Navigate to ${result.params.url || result.params.page || "page"}`,
    "scroll": `Scroll ${result.params.direction || ""}`,
    "read": `Read ${result.params.target || "content"}`,
    "toggle": `Toggle ${result.params.feature || "feature"}`,
    "click": `Click ${result.params.text || "element"}`,
    "search": `Search for "${result.params.query || ""}"`,
    "fill": `Fill and submit form`,
    "control": `Control ${result.params.feature || "feature"}`,
  };

  return actions[result.action] || `Execute ${result.intent}`;
}
