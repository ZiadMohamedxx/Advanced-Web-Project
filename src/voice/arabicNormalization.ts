/**
 * Arabic Normalization Utility
 * Supports Arabic voice command matching
 * Removes diacritics, normalizes letters, handles punctuation
 */

// Arabic diacritics
const ARABIC_DIACRITICS = /[\u064B-\u0652\u064E-\u0652]/g;

// Common Arabic letter variations to normalize
const ARABIC_LETTER_VARIATIONS: Record<string, string> = {
  "ى": "ي",
  "ة": "ه",
  "أ": "ا",
  "إ": "ا",
  "آ": "ا",
};

/**
 * Normalize Arabic text for command matching
 * Removes diacritics and normalizes letter variations
 */
export const normalizeArabic = (text: string): string => {
  let normalized = text
    .toLowerCase()
    .trim()
    .replace(ARABIC_DIACRITICS, "") // Remove diacritics
    .replace(/[،؛:؟!]/g, ""); // Remove Arabic punctuation

  // Normalize letter variations
  for (const [variant, base] of Object.entries(ARABIC_LETTER_VARIATIONS)) {
    normalized = normalized.replace(new RegExp(variant, "g"), base);
  }

  // Normalize whitespace
  normalized = normalized.replace(/\s+/g, " ");

  return normalized;
};

/**
 * Check if text is likely Arabic
 */
export const isArabic = (text: string): boolean => {
  return /[\u0600-\u06FF]/.test(text);
};

/**
 * Normalize both Arabic and English text
 */
export const normalizeCommand = (input: string): string => {
  if (isArabic(input)) {
    return normalizeArabic(input);
  }
  return input
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:"'()]/g, "")
    .replace(/\s+/g, " ");
};

/**
 * Extract search query from Arabic voice command
 * Examples: "دور على وظائف فرونت اند" → "فرونت اند"
 */
export const extractSearchQueryArabic = (text: string): string => {
  const normalized = normalizeArabic(text);

  // Remove command prefixes
  const prefixes = ["دور على", "هات", "ابحث عن", "ابحث", "دور", "أظهر"];
  let query = normalized;

  for (const prefix of prefixes) {
    if (query.startsWith(normalizeArabic(prefix))) {
      query = query.substring(normalizeArabic(prefix).length).trim();
      break;
    }
  }

  return query;
};

/**
 * Extract search query from English voice command
 * Examples: "search frontend jobs" → "frontend"
 */
export const extractSearchQueryEnglish = (text: string): string => {
  const normalized = text
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:"'()]/g, "")
    .replace(/\s+/g, " ");

  // Remove command prefixes
  const prefixes = [
    "search for",
    "find",
    "search",
    "show",
    "look for",
  ];
  let query = normalized;

  for (const prefix of prefixes) {
    if (query.startsWith(prefix)) {
      query = query.substring(prefix.length).trim();
      break;
    }
  }

  // Remove common suffixes for jobs
  const suffixes = ["jobs", "positions", "openings"];
  for (const suffix of suffixes) {
    if (query.endsWith(suffix)) {
      query = query.substring(0, query.length - suffix.length).trim();
    }
  }

  return query;
};

/**
 * Extract search query from voice command (auto-detect language)
 */
export const extractSearchQuery = (text: string): string => {
  if (isArabic(text)) {
    return extractSearchQueryArabic(text);
  }
  return extractSearchQueryEnglish(text);
};
