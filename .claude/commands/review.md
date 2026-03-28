Review the current uncommitted changes against Distill's security and quality standards.

## Review process:

### 1. Get the diff

Run `git diff` and `git diff --cached` to see all changes.

### 2. Security review (highest priority)

For every changed file, check:

- [ ] All Supabase queries have `.eq('user_id', session.user.id)`
- [ ] No mass assignment (`const body = await req.json()` → insert(body))
- [ ] No `dangerouslySetInnerHTML` with user content
- [ ] No secrets in client code (NEXT*PUBLIC* containing SECRET/SERVICE_ROLE)
- [ ] API routes have auth guard as first check
- [ ] Error responses don't leak internal details
- [ ] NOT_FOUND and FORBIDDEN return identical shapes (no IDOR info leak)

### 3. Pattern compliance

- [ ] Server Components used by default (no unnecessary "use client")
- [ ] Tailwind only — no custom CSS
- [ ] All 4 states handled (loading/empty/error/success)
- [ ] No praise language or medical claims in copy
- [ ] No `any` types in TypeScript
- [ ] Input sanitization on user-provided strings

### 4. Performance

- [ ] No unnecessary client-side data fetching (should be server)
- [ ] No N+1 queries
- [ ] Images use next/image
- [ ] Large lists use pagination or infinite scroll

### 5. Report

Print a review summary:

- **Critical** (must fix before commit): security issues, IDOR risks
- **Warning** (should fix): pattern violations, missing states
- **Note** (nice to have): style improvements

Include file:line references for every finding.
