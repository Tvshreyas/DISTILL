Run a performance audit on the Distill codebase.

## Checks:

### 1. Bundle analysis
- Check if there are large dependencies that could be tree-shaken
- Look for client-side imports of server-only packages
- Check for duplicate dependencies

### 2. Rendering strategy audit
Review each route against the expected rendering strategy from CLAUDE.md:
| Route | Expected | Actual |
|-------|----------|--------|
| `/` | SSG | ? |
| `/sign-in` | Static | ? |
| `/onboarding` | Client | ? |
| `/dashboard` | SSR | ? |
| `/dashboard/library` | SSR + Client | ? |
| `/dashboard/library/[id]` | SSR | ? |
| `/dashboard/settings` | SSR | ? |

Flag any mismatches.

### 3. Database query patterns
- Look for N+1 queries (multiple sequential queries in a loop)
- Check for missing `.select()` column filtering (selecting * when not needed)
- Verify indexes exist for common query patterns (user_id, created_at)

### 4. Client-side performance
- Check for unnecessary re-renders (missing useMemo/useCallback where needed)
- Verify images use `next/image` with proper sizing
- Check for blocking resources in the critical path

### 5. PWA readiness
- Verify `manifest.json` exists with required fields
- Check service worker registration
- Verify offline fallback exists

### 6. Report
Print findings organized by impact (High/Medium/Low) with specific fix suggestions.
