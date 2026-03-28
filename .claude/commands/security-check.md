Run the full Distill pre-deploy security checklist. Execute each step and report pass/fail clearly.

## Steps to execute:

### 1. Build check

Run `npm run build` and confirm zero TypeScript errors.

### 2. Lint check

Run `npm run lint` and confirm zero ESLint errors.

### 3. Unit tests

Run `npm test` and confirm all pass.

### 4. Service role key leak check

Run `grep -r "SERVICE_ROLE" .next/` — must return empty. If anything is found, this is a critical failure — stop and fix before deploying.

### 5. Secret in public env check

Run `grep -r "NEXT_PUBLIC_" .env.local | grep -E "SECRET|SERVICE_ROLE"` — must return empty.

### 6. Dependency audit

Run `npm audit --audit-level=high` — no high or critical vulnerabilities allowed.

### 7. Source maps check

Verify `productionBrowserSourceMaps: false` is set in `next.config.js`.

### 8. Security headers check

Verify all required headers are present in `next.config.js`:

- Content-Security-Policy (with frame-ancestors 'none')
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

### 9. RLS verification

Query Supabase to confirm RLS is enabled on ALL public tables:

```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

Every row must show `rowsecurity = true`.

### 10. .env in .gitignore

Confirm `.env*` and `.env.local` are listed in `.gitignore`.

### 11. IDOR spot check

Review any recently modified API routes to confirm every Supabase query includes `.eq('user_id', session.user.id)`.

## Output format:

Print a checklist with ✅ PASS or ❌ FAIL for each item. If any item fails, provide the specific fix needed before proceeding with deployment.
