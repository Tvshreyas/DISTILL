Run the full Distill deployment pipeline. This combines build, test, security, and deploy.

## Pipeline:

### Phase 1: Quality Gates (must all pass)

Run these checks in sequence — stop on first failure:

1. `npm run type-check` — zero TypeScript errors
2. `npm run lint` — zero ESLint errors
3. `npm run build` — successful production build
4. `npm test` — all unit tests pass

### Phase 2: Security Gates

5. `grep -r "SERVICE_ROLE" .next/` — must be empty
6. `grep -r "NEXT_PUBLIC_" .env.local | grep -E "SECRET|SERVICE_ROLE"` — must be empty
7. `npm audit --audit-level=high` — no high/critical vulns
8. Verify `productionBrowserSourceMaps: false` in `next.config.js`
9. Verify security headers in `next.config.js` (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)

### Phase 3: Database

10. Verify all tables have RLS enabled
11. Check for pending migrations not yet pushed

### Phase 4: Deploy (only if all gates pass)

12. Push migrations: `npx supabase db push`
13. Deploy: `vercel --prod`
14. Post-deploy: verify the production URL responds with 200

## Output:

Print a pipeline summary with timing for each step:

```
DEPLOY PIPELINE — Distill
═══════════════════════════
[1/14] Type check      ✅ 3.2s
[2/14] Lint            ✅ 1.8s
...
═══════════════════════════
Result: DEPLOYED / BLOCKED
```

If any step fails, stop immediately and explain the fix.
