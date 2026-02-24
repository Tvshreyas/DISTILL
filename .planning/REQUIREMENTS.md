# Requirements: Distill

**Defined:** 2026-02-24
**Core Value:** User can write their own perspective immediately after consuming content, and resurface it later to see how their thinking evolved.

---

## v1 Requirements

### Authentication (AUTH)

- [ ] **AUTH-01**: User can request magic link via email on the sign-in page
- [ ] **AUTH-02**: User is authenticated on magic link click and redirected safely (no open redirect — only allow paths starting with `/`)
- [ ] **AUTH-03**: Auth session persists across browser refresh via httpOnly cookie (`@supabase/ssr`)
- [ ] **AUTH-04**: All `/dashboard/*` routes redirect unauthenticated users to `/sign-in`
- [ ] **AUTH-05**: `/sign-in` redirects already-authenticated users directly to `/dashboard`

### Onboarding (ONBD)

- [ ] **ONBD-01**: Screen 1 shows "You've consumed a lot. How much of it became yours?" + required disclaimer visible
- [ ] **ONBD-02**: Screen 2 shows one-sentence mechanism explanation + example reflection card
- [ ] **ONBD-03**: Screen 3 shows session form ("What have you recently finished?") — skip NOT allowed
- [ ] **ONBD-04**: User writes first reflection before account creation — stored in localStorage with device token (crypto.randomUUID)
- [ ] **ONBD-05**: After first reflection: "Save it — enter your email and we'll send you a link" (not "Sign up")
- [ ] **ONBD-06**: On magic link click, anonymous localStorage data migrates to DB idempotently (localStorage cleared before API call; never double-migrates)
- [ ] **ONBD-07**: Anonymous session expires after 7 days
- [ ] **ONBD-08**: `onboarding_completed = true` set after first reflection migration
- [ ] **ONBD-09**: Skip allowed on Screens 1–2 only; Screen 3 and reflection screen have no skip

### Sessions (SESS)

- [ ] **SESS-01**: User can start a session with required title (max 200 chars) and content type (book/video/article/podcast/other)
- [ ] **SESS-02**: User can optionally add consume reason (max 140 chars)
- [ ] **SESS-03**: Only 1 active session per user — new session attempt shows: "Complete or abandon [current title] first?"
- [ ] **SESS-04**: Active session banner shown on dashboard while a session is open
- [ ] **SESS-05**: Session persists if app closed — shown as active on return
- [ ] **SESS-06**: Retroactive session allowed (consumed first, flagged `is_retroactive=true`) — no penalty
- [ ] **SESS-07**: Session auto-abandons after 8 hours with no reflection submitted
- [ ] **SESS-08**: User can manually abandon a session

### Reflections (REFL)

- [ ] **REFL-01**: User can write a reflection (minimum 1 char, maximum 3000 chars) — never block short entries
- [ ] **REFL-02**: Three rotating prompts shown (randomised per session open): "What's one thing you disagree with or would challenge?", "What does this make you want to do, make, or change?", "What question does this leave you with?"
- [ ] **REFL-03**: Prompt is guidance only — user can write freely without following it
- [ ] **REFL-04**: Live character counter displayed during writing
- [ ] **REFL-05**: Reflection auto-saves as draft every 3 seconds (maximum 3 seconds of text lost on crash)
- [ ] **REFL-06**: Draft preserved if user navigates away mid-reflection (localStorage)
- [ ] **REFL-07**: Optional thinking shift rating (1–5) on submission
- [ ] **REFL-08**: Submission shows word count and neutral confirmation ("Your reflection is saved." / "Added to your library.") — no praise language
- [ ] **REFL-09**: Free tier reflection count shown before user starts typing — never block after they've written
- [ ] **REFL-10**: Submitting reflection marks session as complete and updates streak
- [ ] **REFL-11**: User can edit a past reflection — "Edited [date]" stamp shown on the card
- [ ] **REFL-12**: User can soft-delete a reflection — confirmation shown: "Permanently deleted in 30 days"

### Library (LIB)

- [ ] **LIB-01**: User can view all reflections in reverse chronological order
- [ ] **LIB-02**: Each card shows: content type icon, title, date, first 2 lines of reflection, thinking shift rating (if given), layer count
- [ ] **LIB-03**: Filter by content type: All / Book / Video / Article / Podcast / Other
- [ ] **LIB-04**: Full-text search across reflection content (PostgreSQL FTS via `to_tsvector('english', content)`)
- [ ] **LIB-05**: Search highlights matching terms in results
- [ ] **LIB-06**: Infinite scroll, 20 entries per page
- [ ] **LIB-07**: Skeleton loading cards shown during fetch — no blank screen
- [ ] **LIB-08**: Empty state: example reflection card + "Start your first session" CTA
- [ ] **LIB-09**: User can view full reflection with all layers in chronological order

### Resurfacing (SURF)

- [ ] **SURF-01**: 4 resurfacing queue entries created per reflection via DB trigger (3d, 7d, 30d, 90d from creation date)
- [ ] **SURF-02**: Pending resurfacing items checked on app open — max 1 surfacing shown per app-open
- [ ] **SURF-03**: Resurfacing card shows user's OWN reflection text only — never the original content
- [ ] **SURF-04**: "View changed" response opens layer editor (Pro only — free users see upgrade prompt)
- [ ] **SURF-05**: "Still relevant" response marks queue entry as `surfaced` — no edit, no layer
- [ ] **SURF-06**: "Dismiss" response marks queue entry as `dismissed` — no further resurfacing at this interval

### Layers (LAYR)

- [ ] **LAYR-01**: Pro users can add a layer (new perspective, max 3000 chars) to a resurfaced reflection
- [ ] **LAYR-02**: Layers display chronologically below the original reflection, with date stamp
- [ ] **LAYR-03**: Full ownership chain verified server-side before layer creation (queue entry → reflection → user)

### Streak (STRK)

- [ ] **STRK-01**: Streak increments when user submits at least 1 reflection per calendar day in their timezone
- [ ] **STRK-02**: Streak resets if no reflection submitted on the previous calendar day
- [ ] **STRK-03**: Streak message on reset is factual only: "Your streak reset. Ready to start again?" — no shaming
- [ ] **STRK-04**: Pro users get 1 automatic streak freeze per month (applied on first missed day)
- [ ] **STRK-05**: Settings shows streak freeze status: "0 of 1 used this month"
- [ ] **STRK-06**: Dashboard shows 7-day grid (presence only, no count) and current streak count
- [ ] **STRK-07**: `longest_streak` tracked across all time
- [ ] **STRK-08**: Private milestone markers at: 1st, 10th, 50th, 100th reflection; 30-day and 365-day streak — never social

### Monetisation (MNTZ)

- [ ] **MNTZ-01**: Free users capped at 10 reflections/month — enforced server-side only (never trust client)
- [ ] **MNTZ-02**: Soft nudge shown at 8/10 reflections remaining
- [ ] **MNTZ-03**: Hard block at 10/10 — upgrade modal shown, draft text fully preserved
- [ ] **MNTZ-04**: `reflection_count_this_month` resets to 0 on 1st of month via pg_cron (midnight UTC)
- [ ] **MNTZ-05**: `streak_freeze_used_this_month` resets to 0 on 1st of month via pg_cron
- [ ] **MNTZ-06**: Stripe checkout creates Pro subscription — USD pricing: $8/mo or $72/yr; INR pricing: ₹249/mo or ₹1,999/yr
- [ ] **MNTZ-07**: Indian pricing auto-detected via Vercel Edge `req.geo.country`
- [ ] **MNTZ-08**: Stripe webhook updates `plan`, `subscription_status`, `subscription_period_end` on all lifecycle events
- [ ] **MNTZ-09**: Webhook idempotency enforced via `processed_webhook_events` table (check before processing, insert before mutating)
- [ ] **MNTZ-10**: Webhook signature verified via `stripe.webhooks.constructEvent`

### Settings & Account (ACCT)

- [ ] **ACCT-01**: User can view and update timezone preference
- [ ] **ACCT-02**: User can view current plan and subscription status
- [ ] **ACCT-03**: Pro user can access Stripe customer portal to manage subscription
- [ ] **ACCT-04**: Pro user can export all reflection data as JSON (1 export per 24hr enforced server-side)
- [ ] **ACCT-05**: User can delete account — soft delete with 30-day window, then pg_cron purge

### PWA (PWA)

- [ ] **PWA-01**: App is installable via `manifest.json` on desktop and mobile browsers
- [ ] **PWA-02**: Service worker caches app shell for fast repeat loads
- [ ] **PWA-03**: Reflection drafts queued in IndexedDB when offline, synced on reconnect

### Infrastructure (INFRA)

- [ ] **INFRA-01**: All API routes return standard error format: `{ error: { code, message, field? } }`
- [ ] **INFRA-02**: Rate limiting enforced in middleware: POST /api/reflections (20/hr), POST /api/sessions (30/hr), GET /api/reflections search (60/min), Stripe (10/hr), global (200/10min per IP)
- [ ] **INFRA-03**: RLS enabled on all 6 tables — every Supabase query includes `.eq('user_id', session.user.id)`
- [ ] **INFRA-04**: Security headers set in `next.config.js`: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, frame-ancestors 'none'
- [ ] **INFRA-05**: `productionBrowserSourceMaps: false` in `next.config.js`
- [ ] **INFRA-06**: Landing page (`/`), Privacy (`/privacy`), and Terms (`/terms`) pages ship on launch day
- [ ] **INFRA-07**: Required legal disclaimer on landing page, onboarding Screen 1, and Terms of Service
- [ ] **INFRA-08**: Sentry error tracking with `beforeSend` hook scrubbing reflection content; `sendDefaultPii: false`
- [ ] **INFRA-09**: PostHog analytics with `autocapture: false`; never track reflection content or session titles
- [ ] **INFRA-10**: Every screen handles 4 states: Loading (skeleton), Empty (icon + CTA), Error (friendly + retry), Success (neutral)

---

## v2 Requirements

### Second Mind (MIND)
- **MIND-01**: RAG-based retrieval across user's reflection library ("What have I thought about X?")
- **MIND-02**: Semantic similarity using pgvector ivfflat index (create after 1000+ rows)
- **MIND-03**: Embeddings generated per reflection (vector(384), model TBD)

### Voice (VOICE)
- **VOICE-01**: Voice reflection capture with transcription
- **VOICE-02**: Transcription review before save

### Mobile (MOB)
- **MOB-01**: Native iOS app
- **MOB-02**: Native Android app

### Integrations (INTG)
- **INTG-01**: Readwise highlights import
- **INTG-02**: Kindle clippings import
- **INTG-03**: Notion export integration
- **INTG-04**: Browser extension for web articles

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| AI feedback on reflection quality | Contradicts core philosophy — Distill develops YOUR thinking, not AI's |
| AI-generated summaries of content | Directly opposite to the product's purpose |
| Social features (feed, likes, follows, sharing) | Not core value; never in core product per PRD |
| OAuth login (Google, GitHub) | Magic links sufficient for V1; reduces auth surface area |
| Passwords | Magic links only — explicit architectural decision |
| pgvector ivfflat index at migration time | Create manually after 1,000+ rows to avoid poor performance |
| Team/collaborative features | Not core value |
| Multi-language | English only in V1 |
| Web clipper / browser extension | V2 |
| Content import | V2 |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| AUTH-05 | Phase 1 | Pending |
| ONBD-01 | Phase 2 | Pending |
| ONBD-02 | Phase 2 | Pending |
| ONBD-03 | Phase 2 | Pending |
| ONBD-04 | Phase 2 | Pending |
| ONBD-05 | Phase 2 | Pending |
| ONBD-06 | Phase 2 | Pending |
| ONBD-07 | Phase 2 | Pending |
| ONBD-08 | Phase 2 | Pending |
| ONBD-09 | Phase 2 | Pending |
| SESS-01 | Phase 3 | Pending |
| SESS-02 | Phase 3 | Pending |
| SESS-03 | Phase 3 | Pending |
| SESS-04 | Phase 3 | Pending |
| SESS-05 | Phase 3 | Pending |
| SESS-06 | Phase 3 | Pending |
| SESS-07 | Phase 3 | Pending |
| SESS-08 | Phase 3 | Pending |
| REFL-01 | Phase 3 | Pending |
| REFL-02 | Phase 3 | Pending |
| REFL-03 | Phase 3 | Pending |
| REFL-04 | Phase 3 | Pending |
| REFL-05 | Phase 3 | Pending |
| REFL-06 | Phase 3 | Pending |
| REFL-07 | Phase 3 | Pending |
| REFL-08 | Phase 3 | Pending |
| REFL-09 | Phase 3 | Pending |
| REFL-10 | Phase 3 | Pending |
| REFL-11 | Phase 3 | Pending |
| REFL-12 | Phase 3 | Pending |
| LIB-01 | Phase 4 | Pending |
| LIB-02 | Phase 4 | Pending |
| LIB-03 | Phase 4 | Pending |
| LIB-04 | Phase 4 | Pending |
| LIB-05 | Phase 4 | Pending |
| LIB-06 | Phase 4 | Pending |
| LIB-07 | Phase 4 | Pending |
| LIB-08 | Phase 4 | Pending |
| LIB-09 | Phase 4 | Pending |
| STRK-01 | Phase 4 | Pending |
| STRK-02 | Phase 4 | Pending |
| STRK-03 | Phase 4 | Pending |
| STRK-04 | Phase 4 | Pending |
| STRK-05 | Phase 4 | Pending |
| STRK-06 | Phase 4 | Pending |
| STRK-07 | Phase 4 | Pending |
| STRK-08 | Phase 4 | Pending |
| SURF-01 | Phase 5 | Pending |
| SURF-02 | Phase 5 | Pending |
| SURF-03 | Phase 5 | Pending |
| SURF-04 | Phase 5 | Pending |
| SURF-05 | Phase 5 | Pending |
| SURF-06 | Phase 5 | Pending |
| LAYR-01 | Phase 5 | Pending |
| LAYR-02 | Phase 5 | Pending |
| LAYR-03 | Phase 5 | Pending |
| MNTZ-01 | Phase 6 | Pending |
| MNTZ-02 | Phase 6 | Pending |
| MNTZ-03 | Phase 6 | Pending |
| MNTZ-04 | Phase 6 | Pending |
| MNTZ-05 | Phase 6 | Pending |
| MNTZ-06 | Phase 6 | Pending |
| MNTZ-07 | Phase 6 | Pending |
| MNTZ-08 | Phase 6 | Pending |
| MNTZ-09 | Phase 6 | Pending |
| MNTZ-10 | Phase 6 | Pending |
| ACCT-01 | Phase 6 | Pending |
| ACCT-02 | Phase 6 | Pending |
| ACCT-03 | Phase 6 | Pending |
| ACCT-04 | Phase 6 | Pending |
| ACCT-05 | Phase 6 | Pending |
| PWA-01 | Phase 7 | Pending |
| PWA-02 | Phase 7 | Pending |
| PWA-03 | Phase 7 | Pending |
| INFRA-01 | Phase 1 | Pending |
| INFRA-02 | Phase 1 | Pending |
| INFRA-03 | Phase 1 | Pending |
| INFRA-04 | Phase 1 | Pending |
| INFRA-05 | Phase 1 | Pending |
| INFRA-06 | Phase 1 | Pending |
| INFRA-07 | Phase 1 | Pending |
| INFRA-08 | Phase 1 | Pending |
| INFRA-09 | Phase 1 | Pending |
| INFRA-10 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 88 total
- Mapped to phases: 88
- Unmapped: 0

**Note:** Previous traceability section listed 75 requirements. Recount after detailed phase mapping: 88 total (AUTH 5 + ONBD 9 + SESS 8 + REFL 12 + LIB 9 + SURF 6 + LAYR 3 + STRK 8 + MNTZ 10 + ACCT 5 + PWA 3 + INFRA 10).

---
*Requirements defined: 2026-02-24*
*Last updated: 2026-02-24 — traceability updated after roadmap creation; requirement count corrected to 88*
