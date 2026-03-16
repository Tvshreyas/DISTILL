# Signup Flow CRO Analysis — Distill

## The Biggest Finding

The `/start` page saves the user's pre-auth reflection to `localStorage` under the key `distill_onboarding`, but **nothing in the codebase ever reads it back**. Users write a full reflection before signing up, complete auth, go through 4 onboarding screens, arrive at an empty dashboard, and their reflection is silently lost. This is the single biggest conversion leak in the entire funnel.

## Current Flow: 12+ Interactions Across 6 Page Loads

```
Landing Page (/) → /start (4 steps) → /sign-up (Clerk) → /onboarding (4 steps) → /dashboard → /dashboard/session/new (form) → /dashboard/session/[id] (reflection)
```

## 7 Drop-Off Points Identified

### DROP-OFF 1 (HIGH): Conflicting CTAs on Landing Page
- `components/LandingPage.tsx` has 3 CTAs pointing to 3 different destinations: `/start`, `/sign-in`, and `/sign-up`. Two of three bypass the product trial on `/start`.
- **Fix:** Route all CTAs to `/start`. Add small "sign in" link for returning users.

### DROP-OFF 2 (MEDIUM): /start Asks Optional Question as Full Step
- `app/start/page.tsx` step 1 ("why are you consuming this?") is an optional field occupying an entire wizard step. It delays users from reaching the reflection textarea.
- **Fix:** Merge into step 0 as a collapsible `<details>` element. Reduce from 4 steps to 3.

### DROP-OFF 3 (MEDIUM): Forced Rating Before Signup
- `canAdvance()` returns `false` if `thinkingShiftRating` is null, blocking progress on an optional data point.
- **Fix:** Make the rating optional. Change CTA to "skip & sign up" when no rating selected.

### DROP-OFF 4 (HIGH): 4-Screen Onboarding Delivers Zero Value
- `app/onboarding/page.tsx` has 4 steps (welcome, how it works, timezone, motivational text). Users already experienced the product on `/start`. Timezone is auto-detected with no user input needed.
- **Fix:** Auto-complete onboarding with silent timezone capture. Zero clicks.

### DROP-OFF 5 (VERY HIGH): Lost localStorage Reflection + Empty Dashboard
- `app/dashboard/page.tsx` shows "0 days" streak and empty heatmap for new users. No guidance, no recovery of the reflection written on `/start`. The "Start Session" CTA is below the fold.
- **Fix:** Check for `distill_onboarding` in localStorage, show recovery banner, auto-restore the reflection.

### DROP-OFF 6 (MEDIUM): Duplicate Session Form
- `app/dashboard/session/new/page.tsx` + `components/SessionStartForm.tsx` ask for the exact same data (title, content type, reason) that was already collected on `/start`.
- **Fix:** If localStorage data exists, auto-create session and skip the form.

### DROP-OFF 7 (LOW): Plain Text Loading States
- Dashboard and new session use bare `<div>Loading...</div>` instead of skeleton UI.
- **Fix:** Create shared skeleton component.

## Key Copy Changes

| Location | Before | After | Reason |
|---|---|---|---|
| Hero CTA | "start your reflection journey" | "write your first reflection" | Concrete action vs. abstract concept |
| Nav CTA | "get early access" | "try it free" | Removes perceived waitlist friction |
| /start step 0 title | "what are you consuming?" | "what are you reflecting on?" | Active framing matches product identity |
| /start final CTA | "save & sign up" | "save my reflection" | Reduces commitment anxiety |
| Footer CTA | "start reflecting" | "write your first reflection" | Consistent with hero |

## Revised Flow: 6 Interactions Across 4 Pages (50% Reduction)

```
Landing (/) → /start (3 steps) → /sign-up → /onboarding (auto) → /dashboard (reflection restored)
```

## Priority Order

1. **P0:** Restore localStorage reflection after signup (the lost reflection is the biggest leak)
2. **P0:** Collapse onboarding to auto-redirect (4 wasted clicks)
3. **P0:** Unify all landing page CTAs to `/start`
4. **P1:** Remove /start step 1, merge into step 0
5. **P1:** Make thinking shift rating optional
6. **P1:** Auto-populate session from saved data
7. **P1:** First-visit dashboard empty state with clear CTA above the fold
8. **P1:** All copy changes
9. **P2:** Skeleton loading states
