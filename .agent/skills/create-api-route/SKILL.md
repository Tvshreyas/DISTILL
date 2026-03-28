---
name: Create API Route
description: Create a new Next.js API route following Distill's security patterns and conventions
---

# Create API Route

When creating a new API route in `app/api/`, follow this exact pattern every time.

## Steps

1. **Create the route file** at `app/api/<resource>/route.ts`

2. **Always start with auth check:**

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Sign in required.' } },
      { status: 401 }
    )
  }
```

3. **Destructure only allowed fields** — never spread the request body:

```typescript
const { field1, field2 } = await req.json();
```

4. **Sanitize all text inputs:**

```typescript
import { sanitizeContent } from "@/lib/sanitize";
const cleanField = sanitizeContent(field1);
```

5. **Always scope queries to `session.user.id`:**

```typescript
const { data, error } = await supabase
  .from("table")
  .select("*")
  .eq("user_id", session.user.id);
```

6. **Use standard error response format:**

```typescript
return NextResponse.json(
  { error: { code: "NOT_FOUND", message: "Resource not found." } },
  { status: 404 },
);
```

7. **Never expose internal errors** — log with console.error, return generic message.

8. **Add rate limiting** if endpoint mutates data (see CLAUDE.md rate limit table).

## Checklist

- [ ] Auth guard at top
- [ ] Explicit field destructuring (no mass assignment)
- [ ] Input sanitization on all text fields
- [ ] `user_id` scope on every DB query
- [ ] Generic error messages (no DB details leaked)
- [ ] Rate limiting for mutation endpoints
- [ ] TypeScript strict — no `any` types
