Test the complete Distill onboarding flow end-to-end.

This is the most critical user journey: anonymous user → first reflection → account creation → data migration.

## Test steps:

### 1. Anonymous flow

- Navigate to onboarding page
- Verify 4-screen flow works:
  - Screen 1: Welcome + disclaimer text present
  - Screen 2: Content type selection
  - Screen 3: First reflection capture (stored in localStorage)
  - Screen 4: Email input for magic link
- Verify anonymous session uses crypto.randomUUID device token
- Verify reflection is in localStorage with correct structure

### 2. Magic link flow

- Email is sent successfully
- Callback route handles verification
- Safe redirect: only internal paths, no open redirect (`//evil.com`)
- Account created in `profiles` table with `onboarding_completed = false`

### 3. Data migration

- localStorage reflection migrated to DB
- `onboarding_completed = true` after migration
- Migration is idempotent (running twice doesn't create duplicates)
- localStorage cleared BEFORE API call (prevent double-migrate)
- Triggers fire: word_count calculated, resurfacing scheduled, counts incremented

### 4. Edge cases

- What happens if magic link expires?
- What happens if localStorage is cleared before migration?
- What happens if user already has an account?
- What happens if migration API call fails? (should preserve localStorage for retry)
- What about 7-day anonymous session expiry?

### 5. Report

Pass/fail for each step with specific issues found.
