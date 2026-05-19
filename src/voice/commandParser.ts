/**
 * Voice Command Parser - Enhanced with Synonym Support and Arabic
 * Smart pattern matching with confidence scoring and synonym support
 */

import { normalizeCommand, isArabic, extractSearchQuery } from "@/voice/arabicNormalization";

export interface CommandPattern {
  keywords: string[];
  synonyms?: Record<string, string[]>;
  actionWords?: string[];
  phraseBonus?: string[];
  minConfidence?: number;
}

export interface CommandConfig {
  intent: string;
  patterns: CommandPattern[];
  handler: () => void;
  description: string;
  category: string;
  minConfidence?: number;
}

export interface ParsedCommand {
  intent: string;
  confidence: number;
  config: CommandConfig;
  matchedPattern?: CommandPattern;
}

export const CONFIDENCE_THRESHOLD = 70;

const FILLER_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of",
  "me", "i", "you", "we", "it", "is", "are", "am", "please", "just", "only",
  "very", "really", "quite", "can", "could", "would", "should", "will", "do",
  "does", "did", "up", "down", "out", "in", "about", "on", "off", "enable",
  "disable", "activate", "deactivate",
  // Arabic filler words
  "في", "على", "من", "إلى", "هذا", "ذلك", "هي", "هو", "نعم", "لا",
]);

const GLOBAL_SYNONYMS: Record<string, string[]> = {
  "dark": ["night", "dark"],
  "night": ["dark", "night"],
  "mode": ["mode", "theme"],
  "theme": ["mode", "theme"],
  "read": ["read", "speak", "say"],
  "scroll": ["scroll", "move"],
  "text": ["text", "font", "size"],
};

export function getSynonyms(keyword: string): Set<string> {
  const synonyms = new Set<string>([keyword]);
  if (GLOBAL_SYNONYMS[keyword]) {
    GLOBAL_SYNONYMS[keyword].forEach(syn => synonyms.add(syn));
  }
  return synonyms;
}

export function normalizeText(text: string): string {
  const normalized = normalizeCommand(text);

  return normalized
    .split(/\s+/)
    .filter((word) => !FILLER_WORDS.has(word) && word.length > 0)
    .join(" ");
}

function extractTokens(text: string): string[] {
  return text.split(/\s+/).filter((word) => word.length > 0);
}

function keywordMatchesSynonyms(tokens: Set<string>, keyword: string): boolean {
  const synonyms = getSynonyms(keyword);
  return Array.from(synonyms).some(syn => tokens.has(syn));
}

function scorePattern(
  tokens: Set<string>,
  pattern: CommandPattern,
  originalText: string
): number {
  let score = 0;

  const allKeywordsPresent = pattern.keywords.every((keyword) =>
    keywordMatchesSynonyms(tokens, keyword)
  );

  if (!allKeywordsPresent) {
    return 0;
  }

  score = 60;

  if (pattern.actionWords && pattern.actionWords.length > 0) {
    const hasActionWord = pattern.actionWords.some((action) =>
      keywordMatchesSynonyms(tokens, action)
    );
    if (hasActionWord) {
      score += 20;
    }
  }

  if (pattern.phraseBonus && pattern.phraseBonus.length > 0) {
    const hasExactPhrase = pattern.phraseBonus.some((phrase) =>
      originalText.toLowerCase().includes(phrase.toLowerCase())
    );
    if (hasExactPhrase) {
      score += 15;
    }
  }

  if (pattern.keywords.length > 1) {
    score += 5;
  }

  return Math.min(score, 100);
}

export function parseCommand(
  text: string,
  commands: Record<string, CommandConfig>
): ParsedCommand | null {
  const normalized = normalizeText(text);

  if (normalized.length === 0) {
    return null;
  }

  const tokens = new Set(extractTokens(normalized));

  let bestMatch: ParsedCommand | null = null;
  let bestScore = CONFIDENCE_THRESHOLD;

  for (const [, config] of Object.entries(commands)) {
    const commandThreshold = config.minConfidence || CONFIDENCE_THRESHOLD;

    for (const pattern of config.patterns) {
      const patternThreshold = pattern.minConfidence || commandThreshold;
      const score = scorePattern(tokens, pattern, text);

      if (score > bestScore && score >= patternThreshold) {
        bestScore = score;
        bestMatch = {
          intent: config.intent,
          confidence: score,
          config,
          matchedPattern: pattern,
        };
      }
    }
  }

  return bestMatch;
}
