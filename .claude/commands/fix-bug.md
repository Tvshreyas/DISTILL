Debug and fix a bug in Distill. Bug description: $ARGUMENTS

## Structured debugging process:

### 1. Reproduce

- Identify the exact user flow that triggers the bug
- Check if it's a client-side or server-side issue
- Look for error messages in console, terminal, or Supabase logs

### 2. Isolate

- Narrow down to the specific file(s) involved
- Check recent git changes: `git log --oneline -10` and `git diff HEAD~3`
- Search for related code patterns

### 3. Root cause analysis

- Read the relevant code carefully
- Check for common Distill pitfalls:
  - Missing `user_id` filter in Supabase queries (IDOR)
  - Missing auth guard in API route
  - Client/Server component mismatch (using hooks in Server Component)
  - Tailwind v4 syntax differences
  - Missing error/loading/empty state handling
  - Race conditions in free tier limit checks

### 4. Fix

- Make the minimal change needed
- Don't refactor surrounding code
- Preserve existing patterns and conventions

### 5. Verify

- Run `npm run type-check` — zero errors
- Run `npm run lint` — zero errors
- If the bug is in an API route, verify IDOR protection is intact
- If the bug touches auth, verify the safe redirect pattern

### 6. Report

- What was the bug
- Root cause
- What was changed and why
- Any related areas that should be checked
