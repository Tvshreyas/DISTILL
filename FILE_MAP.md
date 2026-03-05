# Distill — File Map

## Project Structure

```
distill/
├── app/
│   ├── layout.tsx                  # Root layout — fonts, providers, global CSS
│   ├── page.tsx                    # Landing page (/)
│   ├── globals.css                 # Global styles (Tailwind v4)
│   ├── favicon.ico
│   ├── (auth)/
│   │   └── sign-in/
│   │       └── page.tsx            # Magic link sign-in form
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts            # Auth callback — code exchange + onboarding redirect
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard layout (authenticated shell, nav with Link)
│   │   ├── page.tsx                # Dashboard home — streak grid, monthly count, resurfacing placeholder, active session
│   │   ├── library/
│   │   │   ├── page.tsx            # Library page — SSR initial fetch, delegates to LibraryView (SSR + Client)
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Full reflection view — content, session info, layers, edit/delete (SSR + Client)
│   │   └── session/
│   │       ├── new/
│   │       │   └── page.tsx        # Session start page — title, type, reason form (SSR)
│   │       └── [id]/
│   │           ├── page.tsx        # Active session — reflection capture (SSR + Client)
│   │           └── AbandonSessionButton.tsx  # Client: abandon confirmation
│   │
│   └── api/
│       ├── sessions/
│       │   ├── route.ts            # POST: create session (validates, checks active, sanitizes)
│       │   └── [id]/
│       │       └── route.ts        # PATCH: abandon session
│       ├── reflections/
│       │   ├── route.ts            # POST: submit reflection | GET: list with search + content_type filter + pagination
│       │   └── [id]/
│       │       └── route.ts        # GET: single reflection with layers | PATCH: edit content | DELETE: soft delete
│       ├── account/                # (placeholder)
│       ├── export/                 # (placeholder)
│       ├── resurfacing/
│       │   └── pending/            # (placeholder)
│       └── stripe/
│           ├── create-checkout/    # (placeholder)
│           ├── create-portal/      # (placeholder)
│           └── webhook/            # (placeholder)
│
├── components/
│   ├── SessionStartForm.tsx        # Client: session start form (title, type, reason)
│   ├── ReflectionCapture.tsx       # Client: reflection editor, auto-save, char counter, rating
│   ├── ActiveSessionBanner.tsx     # Server: active session link on dashboard
│   ├── LibraryView.tsx             # Client: search bar, content type filter tabs, reflection cards, load more
│   ├── ReflectionDetail.tsx        # Client: inline reflection edit (auto-save), soft delete with confirmation dialog
│   └── ui/                         # (placeholder for base UI primitives)
│
├── hooks/
│   └── useAutoSave.ts              # 3-second debounced auto-save hook
│
├── lib/
│   ├── sanitize.ts                 # DOMPurify wrapper — strips all HTML tags
│   └── supabase/
│       ├── client.ts               # Browser Supabase client (cookie-based)
│       └── server.ts               # Server Supabase client + service role client
│
├── types/
│   └── index.ts                    # Shared TypeScript types
│
├── supabase/
│   ├── config.toml                 # Supabase local config
│   └── migrations/
│       ├── 001_initial_schema.sql  # 6 tables: profiles, sessions, reflections, reflection_layers, resurfacing_queue, processed_webhook_events
│       ├── 002_rls_policies.sql    # RLS on all tables, auth.uid() scoping
│       ├── 003_triggers.sql        # 8 triggers: profile auto-create, updated_at, word count, counts, streaks, resurfacing, soft delete, session complete
│       └── 004_cron_jobs.sql       # Monthly reset, 30-day purge, stale session abandon
│
├── public/                         # Static assets
├── middleware.ts                   # Auth middleware — protects /dashboard/*, redirects
├── next.config.ts                  # Security headers (CSP, HSTS, X-Frame-Options)
├── package.json                    # Next.js 15.5, React 19, Tailwind v4, Supabase, DOMPurify
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── .env.local                      # Environment variables (gitignored)
├── CLAUDE.md                       # AI context file — project rules & architecture
└── FILE_MAP.md                     # ← You are here
```

## Rendering Strategy

| Route | Rendering | Why |
|-------|-----------|-----|
| `/` | SSG | Static landing page |
| `/sign-in` | Client | Interactive form |
| `/auth/callback` | Server (Route Handler) | Token exchange |
| `/dashboard` | SSR | User-specific data (streak, resurfacing, active session) |
| `/dashboard/session/new` | SSR | Redirects if active session exists |
| `/dashboard/session/[id]` | SSR + Client | Server fetches session/profile; client handles reflection editor |
| `/dashboard/library` | SSR + Client | Server fetches initial 20 reflections; client handles search, filter, load more |
| `/dashboard/library/[id]` | SSR + Client | Server fetches reflection + layers; client handles edit, delete |
| `/dashboard/settings` | SSR | User profile |

## Status

- **Week 1** ✅ Foundation & Auth
- **Week 2** ✅ Session Start + Reflection Capture
- **Week 3** ✅ Library + Dashboard Polish
- **Week 4** ⬜ Resurfacing System
- **Week 5** ⬜ Streaks + Settings
