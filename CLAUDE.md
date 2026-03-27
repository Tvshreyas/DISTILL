# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product Identity

Distill is a **thinking development and reflection tool**. Users capture their own perspective after consuming content (books, videos, articles, podcasts). It is NOT a note-taking app, journaling app, AI summarizer, or content blocker.

**Core loop:** Start Session → Consume Content (externally) → Write Reflection → Library grows → Past reflections resurface at intervals.

**Positioning:** "Stop absorbing. Start thinking."

**Full PRD:** `distill_master_document (2).md` at repo root. Always consult for detailed requirements, acceptance criteria, and exact copy.

---

## Tech Stack

- **Next.js 15.5** (App Router) + **React 19** + **TypeScript strict**
- **Tailwind CSS v4** (CSS-native: `@import "tailwindcss"` in `globals.css`, NO `tailwind.config.js`)
- **Convex** (TypeScript-native backend, real-time database, no SQL)
- **Clerk** for authentication (email + password, magic links, social login)
- **Stripe** for payments (checkout sessions, billing portal, webhooks)
- **Sonner** for toast notifications
- **Lucide React** for icons
- **PostHog** for analytics (optional, requires `NEXT_PUBLIC_POSTHOG_KEY`)
- **isomorphic-dompurify** for input sanitization
- **No ORM**, no global state library, no AI in V1

---

## Repository Layout

```
repo root/
├── CLAUDE.md                              # This file — project instructions
├── distill_master_document (2).md         # Full PRD
├── .planning/                             # GSD project management
│   ├── PROJECT.md, ROADMAP.md, REQUIREMENTS.md
└── distill/                               # ← THE APP (cd here)
    ├── app/                # Next.js App Router
    │   ├── layout.tsx      # Root layout (Clerk, Convex, PostHog, Toaster, CookieBanner)
    │   ├── globals.css     # Tailwind v4 + custom scrollbar + glassmorphism
    │   ├── sitemap.ts      # Dynamic sitemap generation
    │   ├── dashboard/      # Protected dashboard pages
    │   │   ├── page.tsx            # Main dashboard (client component)
    │   │   ├── loading.tsx         # Dashboard loading spinner
    │   │   ├── error.tsx           # Dashboard error boundary
    │   │   ├── library/            # Reflection library
    │   │   ├── session/            # Session flow (new, [id])
    │   │   └── settings/           # User settings + billing
    │   └── api/            # API routes (Stripe only)
    ├── components/         # Reusable UI components
    │   ├── ConvexClientProvider.tsx   # Convex + Clerk integration
    │   ├── PostHogProvider.tsx        # Analytics (graceful fallback)
    │   ├── CookieBanner.tsx           # GDPR compliance banner
    │   ├── ReflectionCapture.tsx      # Main reflection form
    │   ├── UpgradeModal.tsx           # Free tier upgrade prompt
    │   └── ...
    ├── convex/             # Convex backend
    │   ├── schema.ts       # Database schema (6 tables)
    │   ├── profiles.ts     # Profile queries/mutations
    │   ├── sessions.ts     # Session CRUD + free tier enforcement
    │   ├── reflections.ts  # Reflection CRUD + search
    │   ├── crons.ts        # Scheduled jobs (monthly reset, auto-abandon, purge)
    │   └── ...
    ├── hooks/              # Custom React hooks (useAutoSave)
    ├── lib/                # Shared utilities
    │   ├── sanitize.ts     # DOMPurify wrapper
    │   ├── constants.ts    # FREE_TIER_LIMIT, FREE_TIER_NUDGE, rate limits
    │   └── ...
    ├── middleware.ts        # Clerk auth guard + CSP + rate limiting
    ├── next.config.ts       # Security headers
    └── public/             # Static assets
        ├── manifest.json   # PWA manifest with shortcuts
        ├── robots.txt      # Search engine directives
        └── og-image.svg    # OpenGraph social preview
```

**Path alias:** `@/*` resolves to `distill/*` (e.g., `@/lib/sanitize` → `distill/lib/sanitize.ts`).

---

## Build & Development Commands

All commands run from `distill/`:

```bash
cd distill

npm run dev              # Next.js dev server (localhost:3000)
npx convex dev           # Convex dev server (run in separate terminal)
npm run build            # Production build — must pass with zero errors
npm run lint             # ESLint (eslint-config-next)
npm test                 # Vitest unit tests
```

---

## Architecture Patterns

### Convex Client Setup

`components/ConvexClientProvider.tsx` wraps the app with `ConvexReactClient` + `ClerkProvider` + `ConvexProviderWithClerk`.

- Client components use hooks: `useQuery()`, `useMutation()`, `useAction()` from `"convex/react"`
- Server-side: Server Components use `ConvexHttpClient` from `"convex/browser"`, authenticated via `getToken({ template: "convex" })`
- Auth in Convex functions: `const identity = await ctx.auth.getUserIdentity(); if (!identity) throw new Error("Unauthenticated");`
- UserId: `const userId = identity.subject;`

### Rendering Strategy

- **SSR** (default for dashboard): Server Components fetch data via `ConvexHttpClient`, redirect if unauthenticated
- **Client Components** (`"use client"`): Only for interactivity — forms, search, auto-save, delete confirmation
- **SSR + Client hybrid**: Server fetches initial data, passes to client component
- **SSG**: Landing page, legal pages

### Component Split Pattern

Pages are Server Components that fetch data. Interactive features are extracted into separate Client Components:
- `app/dashboard/session/new/page.tsx` (Server) → `components/SessionStartForm.tsx` (Client)
- `app/dashboard/session/[id]/page.tsx` (Server) → `components/ReflectionCapture.tsx` (Client)
- `app/dashboard/library/page.tsx` (Server) → `components/LibraryView.tsx` (Client)
- `app/dashboard/library/[id]/page.tsx` (Server) → `components/ReflectionDetail.tsx` (Client)

### Toast Notifications

Use `toast.success()` / `toast.error()` from `sonner` for user feedback. The `<Toaster>` is mounted in root layout with dark theme.

---

## Database (Convex Schema)

Schema defined in `convex/schema.ts` with 6 tables:

- **profiles** — user settings, plan, streak, reflection counts (indexed by `userId`)
- **sessions** — content consumption sessions with status tracking (indexed by `userId`, `userId+status`)
- **reflections** — user reflections with full-text search on content (indexed by `userId+isDeleted`, `sessionId`, search on `content`)
- **reflectionLayers** — added perspectives on past reflections (indexed by `reflectionId`)
- **resurfacingQueue** — spaced repetition queue for past reflections (indexed by `userId+dueDate`)
- **processedWebhookEvents** — Stripe webhook idempotency (indexed by `stripeEventId`)

**Key constraint:** Only 1 active session per user (enforced in Convex mutation logic).

### Cron Jobs (`convex/crons.ts`)

- **Monthly** (1st, 00:00 UTC): Reset `reflectionCountThisMonth` and `streakFreezeUsedThisMonth`
- **Hourly**: Auto-abandon sessions active > 8 hours
- **Daily** (02:00 UTC): Purge soft-deleted reflections older than 30 days (+ associated layers and queue entries)

---

## Security Rules (Non-Negotiable)

### IDOR Prevention (#1 Priority)
Every Convex query/mutation must filter by `userId` from `ctx.auth.getUserIdentity()`. When a resource doesn't exist OR belongs to another user, return identical null/error — never leak resource existence.

### No Mass Assignment
Always explicitly destructure fields from `args` validators. `userId` always comes from `identity.subject`, never from function arguments.

### Input Sanitization
All user strings go through `sanitizeContent()` (strips all HTML via DOMPurify). Never render reflection content as HTML.

### Free Tier Enforcement
3 Deep Sessions/month for free users (Quick Distills are unlimited). Enforced **server-side** in `reflections.create` mutation by counting completed deep sessions. Profile tracks `reflectionCountThisMonth`. Soft nudge at 2/3 (`FREE_TIER_NUDGE`), hard block at 3/3 (`FREE_TIER_LIMIT`). Session start page and dashboard show appropriate UI banners.

---

## Copy & Language Rules (Legally Required)

**Never use:** Medical claims ("reduces anxiety"), praise ("Great thinking!"), therapeutic framing ("wellness", "mindfulness"), feature marketing ("Go Pro today!")

**Always use:** Identity framing ("thinking tool", "your perspective"), neutral confirmations ("Saved."), factual streak messaging ("Your streak reset. Ready to start again?")

---

## Screen State Requirements

Every page and component must handle: **Loading** (skeleton UI or spinner), **Empty** (icon + explanation + CTA), **Error** (friendly message + retry), **Success** (neutral confirmation toast).

---

## Environment Variables

**Server-only** (never `NEXT_PUBLIC_`): `CLERK_SECRET_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRO_MONTHLY_PRICE_ID`, `STRIPE_PRO_ANNUAL_PRICE_ID`, `CONVEX_DEPLOYMENT`

**Client-safe** (`NEXT_PUBLIC_`): `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_POSTHOG_KEY` (optional), `NEXT_PUBLIC_POSTHOG_HOST` (optional)

---

## What NOT to Build in V1

No AI features, no "Second Mind" RAG, no voice reflection, no native apps (PWA only), no social features, no web clipper, no content import, no multi-language, no pgvector index.
