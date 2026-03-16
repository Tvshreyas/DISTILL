// Content safety — client copy (keep in sync with convex/safety.ts)

export type SafetyResult = {
  safe: boolean;
  category: "A" | "B" | null;
};

// Category A: Hard block — self-harm instructions, extreme violence promotion, severe hate speech
const CATEGORY_A_PATTERNS: RegExp[] = [
  /\bkill\s+yourself\b/i,
  /\bend\s+your\s+life\b/i,
  /\bhow\s+to\s+suicide\b/i,
  /\byou\s+should\s+(commit\s+)?suicide\b/i,
  /\bgo\s+ahead\s+and\s+die\b/i,
  /\bthe\s+world\s+is\s+better\s+without\s+you\b/i,
  /\bshoot\s+up\s+a\s+school\b/i,
  /\bbomb\s+a\s+(mosque|church|synagogue|temple)\b/i,
  /\bshoot\s+up\s+a\s+(mosque|church|synagogue|temple)\b/i,
  /\bdeath\s+to\s+all\s+\w+/i,
  /\bgenocide\s+is\s+(good|justified|necessary|based)\b/i,
  /\b(kill|exterminate|eradicate)\s+all\s+(jews|muslims|christians|blacks|whites|gays|trans)\b/i,
  /\bethnic\s+cleansing\s+is\s+(good|justified|necessary|based)\b/i,
  /\bcut\s+yourself\b/i,
  /\bhang\s+yourself\b/i,
  /\bdrown\s+yourself\b/i,
];

// Category B: Soft nudge — directed violence threats, wishing harm
const CATEGORY_B_PATTERNS: RegExp[] = [
  /\bi\s+will\s+(murder|kill)\s+you\b/i,
  /\byou\s+deserve\s+to\s+(suffer|die)\b/i,
  /\bi\s+hope\s+you\s+die\b/i,
  /\bi('m|\s+am)\s+going\s+to\s+kill\s+you\b/i,
];

export function checkContentSafety(content: string): SafetyResult {
  for (const pattern of CATEGORY_A_PATTERNS) {
    if (pattern.test(content)) {
      return { safe: false, category: "A" };
    }
  }

  for (const pattern of CATEGORY_B_PATTERNS) {
    if (pattern.test(content)) {
      return { safe: false, category: "B" };
    }
  }

  return { safe: true, category: null };
}
