# Distill

## What This Is

Distill is a thinking development and reflection tool. After consuming any content — a book, video, article, or podcast — users write their own perspective immediately after finishing. It is not a note-taking app, not a journaling app, and not an AI summariser. It captures what YOU think, not what the creator said. Over time, those reflections compound into a private library of your own mind that resurfaces at spaced intervals to track how your thinking evolves.

**Core loop:** Start Session → Consume Content (externally) → Write Reflection → Library grows → Past reflections resurface at 3d/7d/30d/90d intervals.

**Positioning:** "Stop absorbing. Start thinking."

## Core Value

The one thing that must work: a user can write their own perspective immediately after consuming content, and find it again later — resurface it — to see how their thinking has evolved.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can start a session before consuming content (title, content type, optional reason)
- [ ] User can write a reflection (1–3000 chars) after finishing content, with optional prompts
- [ ] Reflection auto-saves every 3 seconds as draft
- [ ] User completes onboarding and writes first reflection BEFORE creating an account (anonymous → authenticated migration)
- [ ] User has a personal library of all their reflections, searchable and filterable
- [ ] Past reflections resurface at 3d/7d/30d/90d intervals with "Has your view changed?" prompt
- [ ] Pro users can add layers (new perspective) to resurfaced reflections
- [ ] Streak tracking: consecutive days with at least one reflection, timezone-aware
- [ ] Free tier: 10 reflections/month; Pro tier: unlimited
- [ ] Stripe integration: $8/mo or $72/yr (global), ₹249/mo or ₹1,999/yr (India, PPP)
- [ ] PWA: installable, offline draft support via IndexedDB
- [ ] Magic link auth only — no passwords
- [ ] Privacy/Terms pages shipped on launch day
- [ ] Data export (Pro only, 1/24hr limit)
- [ ] Account deletion with 30-day soft delete window

### Out of Scope

- AI feedback / summaries / analysis of reflections — contradicts core philosophy; never in V1 or core product
- The Second Mind / RAG system — V2, needs 50+ reflections per user
- Voice reflection with transcription — V2
- Native mobile apps (iOS/Android) — PWA covers V1; native is V2
- Social features (sharing, following, likes, comments) — not core value
- Web clipper / browser extension — V2
- Content import (Readwise, Kindle, Notion) — V2
- Multi-language support — English only in V1
- Team or collaborative features — not core value

## Context

- **Full PRD:** `distill_master_document (2).md` at project root — contains exact copy, acceptance criteria, edge cases, and legal requirements. Always reference specific sections when implementing.
- **Legal constraint:** No medical/psychological claims in ANY copy. Specific forbidden language listed in PRD Section 1 and CLAUDE.md. Required disclaimer must appear on landing page, onboarding Screen 1, and Terms.
- **Auth model:** Magic links only via Supabase Auth. JWT in httpOnly cookies via @supabase/ssr. No localStorage JWT.
- **Onboarding:** User writes first reflection anonymously (localStorage) BEFORE creating account. Migration on magic link click must be idempotent.
- **Free tier enforcement:** Server-side only. 10/month. Soft nudge at 8/10. Upgrade modal preserves draft text.
- **Resurfacing:** 4 queue entries per reflection (3d, 7d, 30d, 90d), created by DB trigger on reflection insert.
- **Streak:** Calculated server-side using user's timezone from profiles.timezone. Pro users get 1 streak freeze/month.
- **Database:** 6 tables — profiles, sessions, reflections, reflection_layers, resurfacing_queue, processed_webhook_events. RLS enabled on ALL tables. This is non-negotiable.
- **Monitoring privacy:** Never log or send reflection content to Sentry, PostHog, or Vercel logs.

## Constraints

- **Tech Stack:** Next.js 15.5 (App Router) + React 19 + TypeScript strict + Tailwind CSS v4 (CSS-native, no tailwind.config.js) + Supabase (PostgreSQL 15) + Stripe + Vercel
- **Auth:** Magic links only — no passwords anywhere, no OAuth in V1
- **No ORM:** Supabase client directly — works perfectly with RLS
- **No global state:** React Server Components + hooks + URL state
- **No AI in V1:** Pure user text — pgvector column pre-created for V2 embeddings
- **Security:** IDOR prevention on every query (always .eq('user_id', session.user.id)), RLS on all tables, service role key server-only
- **Timeline:** 10-week MVP (8 weeks dev + 2 weeks QA)
- **Testing:** 80% coverage target on critical paths — Vitest (unit) + Playwright (E2E)
- **Mobile:** PWA only in V1 — manifest.json + service worker

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Magic links only | Zero friction — user gets value before account; no password reset flows | — Pending |
| No AI in V1 | Cost and complexity not justified; AI summaries contradict core philosophy | — Pending |
| Free tier at 10/month | Triggers upgrade at habit-forming moment | — Pending |
| PWA over native | Ships without native app overhead; covers V1 mobile | — Pending |
| Supabase direct (no ORM) | RLS integrates perfectly; fewer abstractions | — Pending |
| httpOnly cookies for JWT | No XSS token theft via localStorage | — Pending |
| Soft deletes | 30-day undo window; GDPR right to deletion via pg_cron purge | — Pending |
| Tailwind v4 CSS-native | Updated from PRD spec (v3.4.1) — aligns with Next.js 15.5 + React 19 | — Pending |

---
*Last updated: 2026-02-24 after initialization*
