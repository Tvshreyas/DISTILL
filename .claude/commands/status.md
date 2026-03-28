Show a comprehensive status overview of the Distill project.

## Gather and display:

### 1. Git status

- Current branch
- Uncommitted changes count
- Last 5 commits (one-line)
- Branches ahead/behind main

### 2. Codebase stats

- Total TypeScript files
- Total lines of code (approximate)
- Components count (files in `components/`)
- API routes count (files in `app/api/`)
- Migration count (files in `supabase/migrations/`)
- Test count (files in `tests/`)

### 3. Quality status

- TypeScript errors: run `npm run type-check 2>&1 | tail -5`
- Lint errors: run `npm run lint 2>&1 | tail -5`
- Build status: check if `.next` directory exists and is recent

### 4. Feature completion (based on files present)

Check which Distill features have code:
| Feature | Status |
|---------|--------|
| Landing page (`app/page.tsx`) | ? |
| Sign-in (`app/(auth)/sign-in/page.tsx`) | ? |
| Auth callback (`app/auth/callback/route.ts`) | ? |
| Onboarding (`app/onboarding/page.tsx`) | ? |
| Dashboard (`app/dashboard/page.tsx`) | ? |
| Library (`app/dashboard/library/page.tsx`) | ? |
| Reflection view (`app/dashboard/library/[id]/page.tsx`) | ? |
| Settings (`app/dashboard/settings/page.tsx`) | ? |
| Session API (`app/api/sessions/route.ts`) | ? |
| Reflection API (`app/api/reflections/route.ts`) | ? |
| Resurfacing API (`app/api/resurfacing/`) | ? |
| Stripe API (`app/api/stripe/`) | ? |
| Export API (`app/api/export/route.ts`) | ? |
| Middleware (`middleware.ts`) | ? |
| PWA manifest (`public/manifest.json`) | ? |
| Service worker (`public/sw.js`) | ? |

### 5. Print a clean summary dashboard
