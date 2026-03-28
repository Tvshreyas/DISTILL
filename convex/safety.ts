/**
 * Content safety — canonical implementation (keep in sync with lib/safety.ts)
 */

export type SafetySeverity = "block" | "warn" | "none";

export type SafetyResult = {
  isFlagged: boolean;
  severity: SafetySeverity;
  message?: string;
  // Legacy compatibility for reflections.ts (internal)
  safe: boolean;
  category: "A" | "B" | null;
};

// Category A: Hard Block (Safety & Legal compliance)
const BLOCK_PATTERNS = [
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

// Category B: Soft Nudge (Quality & Constructiveness)
const NUDGE_PATTERNS = [
  /\bi\s+will\s+(murder|kill)\s+you\b/i,
  /\byou\s+deserve\s+to\s+(suffer|die)\b/i,
  /\bi\s+hope\s+you\s+die\b/i,
  /\bi('m|\s+am)\s+going\s+to\s+kill\s+you\b/i,
  /\b(fuck you|piece of shit|you are worthless)\b/i,
];

export function checkContentSafety(content: string): SafetyResult {
  if (!content || content.trim().length === 0) {
    return { isFlagged: false, severity: "none", safe: true, category: null };
  }

  // Check for Hard Blocks (Category A)
  for (const pattern of BLOCK_PATTERNS) {
    if (pattern.test(content)) {
      return {
        isFlagged: true,
        severity: "block",
        message:
          "This content violates our safety guidelines and cannot be saved.",
        safe: false,
        category: "A",
      };
    }
  }

  // Check for Soft Nudges (Category B)
  for (const pattern of NUDGE_PATTERNS) {
    if (pattern.test(content)) {
      return {
        isFlagged: true,
        severity: "warn",
        message: "Your language seems a bit destructive.",
        safe: false,
        category: "B",
      };
    }
  }

  return { isFlagged: false, severity: "none", safe: true, category: null };
}
