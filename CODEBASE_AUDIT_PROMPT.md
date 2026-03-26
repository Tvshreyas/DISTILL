# Distill — Full Codebase Audit & Fix Plan

## Objective

Do a **complete sweep** of the entire Distill codebase. Identify every flaw, broken feature, misconfiguration, dead code, and security issue. Then produce a prioritized fix plan.

## Instructions

Use **plan mode**. Do NOT make any code changes until the plan is approved.

### Phase 1: Research (Read Everything)

Audit every layer of the stack systematically. For each area below, read the relevant files, check for issues, and document findings.

#### 1. Environment & Configuration
- Read `.env.local`, `.env.example` — are all required vars present? Any secrets exposed? Any mismatches?
- Read `next.config.ts` or `next.config.js` — any deprecated options, missing redirects, or security gaps?
- Read `package.json` — any outdated/vulnerable dependencies? Any unused deps?
- Read `tsconfig.json` — any loose compiler options?
- Read `middleware.ts` — is CSP correct? Rate limiting working? Any bypasses?

#### 2. Authentication (Clerk)
- Read `convex/auth.config.ts` — does the JWT issuer domain match `.env.local`?
- Read `components/ConvexClientProvider.tsx` — is `ConvexProviderWithClerk` correctly wired?
- Read `app/layout.tsx` — is `ClerkProvider` configured properly?
- Read both auth pages (`app/(auth)/sign-in/` and `app/(auth)/sign-up/`) — any rendering issues?
- **Critical**: Verify a JWT template named "convex" exists (check if `applicationID: "convex"` in auth.config.ts has a matching template in Clerk dashboard — flag this if unclear)

#### 3. Database (Convex)
- Read `convex/schema.ts` — is the schema complete? Any missing indexes? Any fields that should be required but aren't?
- Read all files in `convex/` — check every mutation, query, and action for:
  - Missing auth checks (`ctx.auth.getUserIdentity()` returning null not handled)
  - Missing input validation
  - Race conditions
  - Inefficient queries (missing indexes for filtered fields)
  - Dead/unused functions

#### 4. API Routes
- Read all files in `app/api/` — check for:
  - Missing authentication
  - Missing input validation
  - Missing error handling
  - Rate limiting bypass
  - CORS issues

#### 5. Frontend Components
- Read `app/dashboard/` — all pages and layouts
- Read `components/` — check for:
  - Broken imports
  - Unused components
  - Missing error boundaries
  - Missing loading states
  - Accessibility issues (missing aria labels, keyboard navigation)
  - Hydration mismatches

#### 6. Styling & UI
- Read `app/globals.css` — any dead CSS rules? Conflicts?
- Check for inconsistent styling patterns (mixing approaches)
- Check responsive design — any hardcoded widths that break on mobile?

#### 7. Security
- Check for XSS vulnerabilities (dangerouslySetInnerHTML, unsanitized user input)
- Check CSP headers in middleware
- Check for exposed API keys or secrets in client-side code
- Check for CSRF protections
- Check input sanitization on all user-facing forms

#### 8. Performance
- Check for unnecessary re-renders (missing React.memo, useMemo, useCallback)
- Check for large bundle imports that should be lazy loaded
- Check image optimization
- Check for N+1 query patterns in Convex

#### 9. SEO & Meta
- Check all page metadata (titles, descriptions, OG tags)
- Check `robots.txt`, `sitemap.xml`
- Check canonical URLs
- Check structured data

#### 10. Deployment & DevOps
- Read `vercel.json` if it exists
- Check build configuration
- Check environment variable setup for production vs development
- Verify Convex deployment URL matches (dev vs prod)

### Phase 2: Create the Fix Plan

After reading everything, create an `implementation_plan.md` artifact with:

1. **Critical Issues** (app-breaking) — things that prevent login, crash the dashboard, lose data
2. **High Priority** (user-facing bugs) — broken UI, missing features, security holes
3. **Medium Priority** (technical debt) — dead code, inefficiencies, lint errors
4. **Low Priority** (nice-to-have) — performance optimizations, accessibility improvements

For each issue, include:
- File path
- Line number (if applicable)
- What's wrong
- How to fix it
- Estimated complexity (1-5)

### Phase 3: Get Approval

Present the plan. Do NOT start fixing anything until I say "go".

## Context

- **Stack**: Next.js 15 (App Router) + Clerk auth + Convex DB + Tailwind v4 + Vercel
- **Clerk**: Currently using `pk_test_` keys locally, `pk_live_` in production
- **Known issue**: JWT template for Convex may not be configured in Clerk dashboard
- **Known issue**: Convex deployment URL in `.env.local` may be mismatched (was changed recently)
- **Design**: Brutalist aesthetic — sharp edges, thick borders, hard shadows, paper background
