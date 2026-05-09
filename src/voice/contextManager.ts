/**
 * Context Manager
 * Manages command history and context for follow-up commands
 */

export interface CommandContext {
  lastCommand: string;
  lastAction: string;
  lastParams: Record<string, any>;
  lastPage: string;
  currentPage: string;
  conversationHistory: Array<{
    timestamp: number;
    input: string;
    action: string;
    success: boolean;
  }>;
}

class ContextManager {
  private context: CommandContext = {
    lastCommand: "",
    lastAction: "",
    lastParams: {},
    lastPage: "",
    currentPage: window.location.pathname,
    conversationHistory: [],
  };

  private readonly MAX_HISTORY = 10;

  /**
   * Update context after command execution
   */
  updateContext(
    input: string,
    action: string,
    params: Record<string, any>,
    success: boolean
  ): void {
    this.context.lastCommand = input;
    this.context.lastAction = action;
    this.context.lastParams = params;
    this.context.lastPage = this.context.currentPage;
    this.context.currentPage = window.location.pathname;

    this.context.conversationHistory.push({
      timestamp: Date.now(),
      input,
      action,
      success,
    });

    if (this.context.conversationHistory.length > this.MAX_HISTORY) {
      this.context.conversationHistory.shift();
    }
  }

  /**
   * Get context for AI to use in decision making
   */
  getContextForAI(): Partial<CommandContext> {
    return {
      lastCommand: this.context.lastCommand,
      lastAction: this.context.lastAction,
      currentPage: this.context.currentPage,
      lastPage: this.context.lastPage,
    };
  }

  /**
   * Check if this is a follow-up command
   */
  isFollowUp(input: string): boolean {
    const followUpKeywords = ["that", "this", "it", "there", "here", "first", "last", "next"];
    return followUpKeywords.some((keyword) => input.toLowerCase().includes(keyword));
  }

  /**
   * Get enriched prompt for AI with context
   */
  getEnrichedPrompt(userInput: string): string {
    let prompt = userInput;

    if (this.isFollowUp(userInput)) {
      prompt += `\n\nContext: Last command was "${this.context.lastCommand}" with action "${this.context.lastAction}". Current page: ${this.context.currentPage}`;
    }

    return prompt;
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.context.conversationHistory = [];
  }

  /**
   * Get full context
   */
  getContext(): CommandContext {
    return { ...this.context };
  }
}

export const contextManager = new ContextManager();
