// src/voice/types.ts

export interface ParsedCommand {
  intent: string;
  confidence: number;
  params?: Record<string, any>;
  config?: any;
}

export interface CommandResult {
  success: boolean;
  message?: string;
}



