Scaffold a new Next.js App Router API route for Distill. Route details: $ARGUMENTS

## What to build:

Create the file at the correct path under `app/api/` based on the route description provided.

## Required structure for every API route:

### 1. Auth guard (always first)
```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = createClient()
const { data: { session } } = await supabase.auth.getSession()
if (!session) {
  return Response.json(
    { error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } },
    { status: 401 }
  )
}
```

### 2. Input validation + sanitization
- Destructure only the specific fields needed (no mass assignment)
- Sanitize all string inputs using `sanitizeContent()` from `@/lib/sanitize`
- Validate types, lengths, and allowed values
- Return `VALIDATION_ERROR` (400) for invalid input

### 3. Rate limiting comment
Add a comment indicating the rate limit for this endpoint (refer to CLAUDE.md rate limit table). Actual middleware handles enforcement.

### 4. Supabase query — always scoped to user
```typescript
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('user_id', session.user.id)  // REQUIRED — never omit
  .eq('id', resourceId)
```

### 5. Standard error responses
- Use error codes from CLAUDE.md: UNAUTHORIZED, FORBIDDEN, NOT_FOUND, VALIDATION_ERROR, FREE_TIER_LIMIT, RATE_LIMITED, SERVER_ERROR
- NOT_FOUND and FORBIDDEN return identical shapes (no info leak)
- Never expose internal error details to the client

### 6. TypeScript types
- Use interfaces from `@/types/index.ts`
- Strict typing on request/response — no `any`

## After creating the file:
- Run `npm run type-check` to confirm zero TypeScript errors
- Remind about adding the route to any relevant tests in `tests/e2e/`
