Audit all user-facing copy in Distill against the legally binding copy restrictions from the PRD.

## Scan for violations:

### 1. NEVER USE — Flag these as violations

Search across all `.tsx`, `.ts` files for:

- Medical/psychological claims: "reduces anxiety", "treats addiction", "improves mental health", "heals your attention", "therapeutic", "healing", "wellness", "self-care", "mindfulness"
- Praise language: "Great thinking!", "You're becoming a better thinker!", "Amazing insight!", "Well done!", "Awesome!", "Great job!", "Fantastic!"
- Feature marketing framing: "Unlock premium features", "Go Pro today!", "Upgrade now!"

### 2. REQUIRED — Verify these exist

- Disclaimer text present on: landing page, onboarding Screen 1, Terms of Service
- Required disclaimer: "Distill is a thinking tool, not a therapeutic or medical intervention..."
- Identity framing used: "thinking tool", "your perspective", "your own thinking"
- Neutral confirmations: "Saved." not "Great job!"
- Factual streak messaging: "Your streak reset. Ready to start again?"

### 3. Tone check

- All error messages are friendly but not condescending
- No technical jargon shown to users
- No excessive celebration on success states

### 4. Report

List every violation with file:line and the exact offending text, plus the correct replacement.
