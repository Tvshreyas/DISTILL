---
name: Security Review
description: Run a security review checklist on any code change before it ships
---

# Security Review

Run this checklist on every PR or significant code change.

## Automated Checks

```bash
npm run build          # Zero TypeScript errors
npm run lint           # Zero ESLint errors
npm audit --audit-level=high   # No high/critical vulns
grep -r "SERVICE_ROLE" .next/  # Must return EMPTY
grep -r "NEXT_PUBLIC_" .env.local | grep -E "SECRET|SERVICE_ROLE"  # Must return EMPTY
```

## Code Review Checklist

### Authentication & Authorization

- [ ] Every API route starts with auth check (`getSession()`)
- [ ] Every DB query scoped to `session.user.id`
- [ ] 404 returned for wrong-user access (not 403 — no info leak)
- [ ] Nested resources verify full ownership chain

### Input Handling

- [ ] Request body destructured (no `...body` spread)
- [ ] All text inputs sanitized via `sanitizeContent()`
- [ ] No `dangerouslySetInnerHTML` with user content
- [ ] `__proto__`, `constructor`, `prototype` keys blocked

### Data Privacy

- [ ] No reflection content in logs, Sentry, or PostHog
- [ ] No user content in error messages
- [ ] Sentry `sendDefaultPii: false`
- [ ] PostHog `autocapture: false`

### Stripe

- [ ] Webhook signature verified with `constructEvent()`
- [ ] Idempotency check against `processed_webhook_events`
- [ ] Event ID inserted before DB mutations

### Infrastructure

- [ ] `SERVICE_ROLE_KEY` used only in server code
- [ ] `productionBrowserSourceMaps: false`
- [ ] CSP headers present in `next.config.js`
- [ ] Rate limiting on mutation endpoints
- [ ] Auth callback validates redirect URL (no open redirect)

### Database

- [ ] RLS enabled on all tables: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`
- [ ] New tables have `auth.uid() = user_id` policy
- [ ] Soft deletes used (not hard deletes)
- [ ] Migrations tested with `npx supabase db reset`
