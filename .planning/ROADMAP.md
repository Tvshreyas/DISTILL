# Roadmap: Distill

## Overview

Seven phases deliver a thinking development and reflection tool from secure infrastructure to a polished installable PWA. Phase 1 lays the foundation: project scaffold, database schema with RLS, auth, security headers, and monitoring. Phase 2 completes the anonymous-first onboarding flow. Phase 3 delivers the core loop end-to-end: sessions and reflection capture. Phase 4 builds the personal library and streak tracking so reflections compound over time. Phase 5 adds spaced resurfacing and Pro-only layers — the mechanism that surfaces how thinking evolves. Phase 6 implements Stripe monetisation and account management. Phase 7 ships the PWA, making Distill installable and offline-capable.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Project scaffold, database schema + RLS, magic link auth, security headers, monitoring
- [ ] **Phase 2: Onboarding** - Anonymous-first 4-screen onboarding, first reflection before account creation, migration to DB on sign-in
- [ ] **Phase 3: Core Loop** - Session start, reflection capture with auto-save, submission and streak update
- [ ] **Phase 4: Library + Streaks** - Personal library with search/filter/pagination, streak tracking and milestone markers
- [ ] **Phase 5: Resurfacing + Layers** - Spaced resurfacing queue at 3d/7d/30d/90d, Pro-only layer editor
- [ ] **Phase 6: Monetisation + Account** - Stripe checkout, webhooks, free tier enforcement, settings and data export
- [ ] **Phase 7: PWA** - Installable manifest, service worker, offline draft queue via IndexedDB

## Phase Details

### Phase 1: Foundation
**Goal**: The secure infrastructure exists — project runs locally, database schema is live with RLS on all tables, magic link auth works end-to-end, security headers and monitoring are in place, and public pages ship
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06, INFRA-07, INFRA-08, INFRA-09, INFRA-10
**Success Criteria** (what must be TRUE):
  1. A user can request a magic link on `/sign-in`, click it, and land on `/dashboard` with an authenticated session persisted in an httpOnly cookie
  2. An unauthenticated request to `/dashboard` redirects to `/sign-in`; an authenticated request to `/sign-in` redirects to `/dashboard`
  3. All 6 database tables exist with RLS enabled — a direct Supabase query without `.eq('user_id')` returns no rows
  4. The landing page (`/`), privacy (`/privacy`), and terms (`/terms`) pages load with the required legal disclaimer visible
  5. CSP, X-Frame-Options, X-Content-Type-Options headers are present on every response; `productionBrowserSourceMaps` is false
**Plans**: TBD

Plans:
- [ ] 01-01: Project scaffold — Next.js 15.5 + React 19 + TypeScript strict + Tailwind v4 + Supabase local setup
- [ ] 01-02: Database schema migrations (6 tables) + RLS policies + triggers + pg_cron jobs
- [ ] 01-03: Magic link auth — sign-in page, callback route, middleware auth guard, session persistence
- [ ] 01-04: Security headers, CSP, source maps off, Sentry + PostHog setup, standard API error format, rate limiting middleware
- [ ] 01-05: Landing page, privacy page, terms page with required disclaimers; screen state system (skeleton/empty/error/success)

### Phase 2: Onboarding
**Goal**: A new user can complete the 4-screen onboarding flow, write their first reflection anonymously, enter their email, click the magic link, and find their reflection saved in their new account
**Depends on**: Phase 1
**Requirements**: ONBD-01, ONBD-02, ONBD-03, ONBD-04, ONBD-05, ONBD-06, ONBD-07, ONBD-08, ONBD-09
**Success Criteria** (what must be TRUE):
  1. A visitor can skip Screens 1-2 but cannot skip Screens 3-4; the reflection screen has no skip option
  2. A visitor writes a reflection on Screen 4 and it is stored in localStorage with a device token before any account exists
  3. After entering email and clicking the magic link, the anonymous localStorage reflection appears in the user's dashboard library with no duplication
  4. If the anonymous session is older than 7 days the localStorage data is expired and the user starts fresh
  5. `onboarding_completed` is set to true after successful migration; the migration is idempotent (localStorage cleared before API call, re-running produces no duplicate reflection)
**Plans**: TBD

Plans:
- [ ] 02-01: Onboarding multi-screen flow (Screens 1-4) with skip logic, disclaimer, example card, session form
- [ ] 02-02: Anonymous reflection storage in localStorage with device token, 7-day expiry
- [ ] 02-03: Post-magic-link migration — anonymous data migrated to DB idempotently, `onboarding_completed` set

### Phase 3: Core Loop
**Goal**: An authenticated user can start a session, consume content externally, return and write a reflection, submit it, and see their streak update — this is the product
**Depends on**: Phase 2
**Requirements**: SESS-01, SESS-02, SESS-03, SESS-04, SESS-05, SESS-06, SESS-07, SESS-08, REFL-01, REFL-02, REFL-03, REFL-04, REFL-05, REFL-06, REFL-07, REFL-08, REFL-09, REFL-10, REFL-11, REFL-12
**Success Criteria** (what must be TRUE):
  1. A user can start a session (title + content type required, consume reason optional); attempting to start a second session while one is active shows a conflict prompt
  2. The active session banner is visible on the dashboard; if the app is closed and reopened the session is still shown as active
  3. The reflection editor shows a live character counter, three rotating prompts (guidance only), and auto-saves every 3 seconds; closing and reopening the browser restores the draft from localStorage
  4. Submitting a reflection shows "Your reflection is saved." (neutral, no praise), displays the word count, and updates the user's streak
  5. A user can edit a past reflection (shown with "Edited [date]" stamp) and soft-delete one with a "Permanently deleted in 30 days" confirmation
**Plans**: TBD

Plans:
- [ ] 03-01: Session start flow — form, one-active-session constraint, active session banner, auto-abandon at 8h, manual abandon, retroactive flag
- [ ] 03-02: Reflection capture — editor, character counter, rotating prompts, thinking shift rating, auto-save to localStorage, draft persistence
- [ ] 03-03: Reflection submission — POST /api/reflections, free tier count display (pre-write), DB triggers (word count, session complete, resurfacing queue), neutral confirmation
- [ ] 03-04: Reflection edit and soft-delete — PATCH /api/reflections/[id], DELETE with 30-day window, "Edited [date]" stamp

### Phase 4: Library + Streaks
**Goal**: A user can browse, search, and filter all their past reflections, and see their streak history — the library proves that reflections compound over time
**Depends on**: Phase 3
**Requirements**: LIB-01, LIB-02, LIB-03, LIB-04, LIB-05, LIB-06, LIB-07, LIB-08, LIB-09, STRK-01, STRK-02, STRK-03, STRK-04, STRK-05, STRK-06, STRK-07, STRK-08
**Success Criteria** (what must be TRUE):
  1. The library shows all reflections in reverse chronological order; each card displays content type icon, title, date, first 2 lines, shift rating, and layer count
  2. A user can filter by content type and run a full-text search; matching terms are highlighted in results; skeleton cards display during loading
  3. The library uses infinite scroll (20/page); an empty library shows an example card with "Start your first session" CTA
  4. The dashboard 7-day grid and current streak count update the day after a reflection is submitted; if a day is missed the streak resets with a factual message
  5. Private milestone markers appear at 1st, 10th, 50th, 100th reflection and at 30-day and 365-day streaks; Pro users see streak freeze status ("0 of 1 used this month")
**Plans**: TBD

Plans:
- [ ] 04-01: Library page — grid, reflection cards, content type filter, skeleton/empty states
- [ ] 04-02: Search — PostgreSQL FTS endpoint, highlight matching terms, infinite scroll (20/page)
- [ ] 04-03: Full reflection view page — original text + layers in chronological order
- [ ] 04-04: Streak engine — timezone-aware calculation, 7-day grid, streak freeze (Pro), milestone markers, monthly pg_cron reset

### Phase 5: Resurfacing + Layers
**Goal**: Past reflections resurface at spaced intervals so users confront how their thinking has evolved; Pro users can add a dated layer capturing the new perspective
**Depends on**: Phase 4
**Requirements**: SURF-01, SURF-02, SURF-03, SURF-04, SURF-05, SURF-06, LAYR-01, LAYR-02, LAYR-03
**Success Criteria** (what must be TRUE):
  1. On app open, at most one resurfacing card is shown; the card shows the user's own reflection text only (never the original content)
  2. A user can respond "Still relevant" (marks as surfaced), "Dismiss" (no further resurfacing at this interval), or "View changed" (opens layer editor for Pro)
  3. A free user clicking "View changed" sees an upgrade prompt, not the layer editor
  4. A Pro user can write a layer (max 3000 chars); the layer appears below the original reflection with a date stamp
  5. Layer creation is rejected by the server if the full ownership chain (queue entry → reflection → user) does not verify
**Plans**: TBD

Plans:
- [ ] 05-01: Resurfacing queue API and dashboard card — pending check on app open, max 1 shown, display own reflection text only
- [ ] 05-02: Resurfacing responses — "Still relevant", "Dismiss", "View changed" (Pro gate), queue status updates
- [ ] 05-03: Layer editor and storage — Pro-only layer creation, ownership chain verification, chronological display on full reflection view

### Phase 6: Monetisation + Account
**Goal**: Free tier enforces the 10/month limit at the server; Pro users pay via Stripe and immediately unlock layers, streak freeze, and data export; users can manage their account and delete it
**Depends on**: Phase 3
**Requirements**: MNTZ-01, MNTZ-02, MNTZ-03, MNTZ-04, MNTZ-05, MNTZ-06, MNTZ-07, MNTZ-08, MNTZ-09, MNTZ-10, ACCT-01, ACCT-02, ACCT-03, ACCT-04, ACCT-05
**Success Criteria** (what must be TRUE):
  1. A free user who submits reflection 8 sees a soft nudge; at reflection 10 the upgrade modal appears with draft text fully preserved; reflection 11 is blocked server-side regardless of client state
  2. A user in India is shown INR pricing (₹249/mo or ₹1,999/yr); a user elsewhere sees USD pricing ($8/mo or $72/yr)
  3. After completing Stripe checkout the user's plan updates to Pro within one webhook delivery; Stripe webhook events are idempotent (replayed events produce no duplicate state changes)
  4. A Pro user can export all their reflections as JSON at most once per 24 hours; a free user sees an upgrade prompt on the export button
  5. A user can delete their account; data is soft-deleted immediately and purged after 30 days via pg_cron
**Plans**: TBD

Plans:
- [ ] 06-01: Free tier enforcement — server-side reflection count check, soft nudge at 8/10, hard block at 10/10 with draft preservation, upgrade modal
- [ ] 06-02: Stripe integration — checkout session creation, PPP pricing via Vercel Edge geo, customer portal
- [ ] 06-03: Stripe webhooks — signature verification, idempotency table, plan/status/period_end updates on all lifecycle events
- [ ] 06-04: Settings page — timezone, plan status, subscription portal link, streak freeze display, data export (Pro), account deletion with 30-day window

### Phase 7: PWA
**Goal**: Distill is installable on desktop and mobile, loads instantly on repeat visits, and preserves reflection drafts when the user goes offline
**Depends on**: Phase 6
**Requirements**: PWA-01, PWA-02, PWA-03
**Success Criteria** (what must be TRUE):
  1. A browser on desktop or mobile shows the "Add to home screen" / install prompt; the installed app opens without browser chrome
  2. A returning user on a slow connection sees the app shell immediately from cache before the network responds
  3. A user who starts writing a reflection and then loses network connection does not lose their text; when connectivity returns the draft syncs to the server automatically
**Plans**: TBD

Plans:
- [ ] 07-01: PWA manifest, service worker (app shell caching), install prompt
- [ ] 07-02: IndexedDB offline draft queue — capture drafts offline, sync on reconnect

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/5 | Not started | - |
| 2. Onboarding | 0/3 | Not started | - |
| 3. Core Loop | 0/4 | Not started | - |
| 4. Library + Streaks | 0/4 | Not started | - |
| 5. Resurfacing + Layers | 0/3 | Not started | - |
| 6. Monetisation + Account | 0/4 | Not started | - |
| 7. PWA | 0/2 | Not started | - |
