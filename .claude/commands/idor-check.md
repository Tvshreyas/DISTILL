Run a focused IDOR (Insecure Direct Object Reference) audit across all Distill API routes.

This is the #1 security priority for Distill. Every data access must be scoped to the authenticated user.

## Audit process:

### 1. Find all API routes
Scan `app/api/` recursively for all `route.ts` files.

### 2. For each route, verify:

**Auth guard present:**
```typescript
const { data: { session } } = await supabase.auth.getSession()
if (!session) return 401
```

**Every Supabase query scoped to user:**
```typescript
.eq('user_id', session.user.id)  // MUST be present
```

**No mass assignment:**
- Body should be destructured: `const { field1, field2 } = await req.json()`
- Never: `const body = await req.json(); insert(body)`

**user_id always from server session:**
- `user_id: session.user.id` — from the server, never from request body

**404 = 403 (no info leak):**
- When a resource isn't found OR belongs to another user, return identical 404 response
- Never: "reflection not found" vs "not authorized" (leaks existence)

**Nested resource authorization:**
- `reflection_layers`: verify reflection belongs to user before allowing layer operations
- `resurfacing_queue`: verify the full chain (queue → reflection → user)

### 3. Report
Print a table:
| Route | Auth | User Scoped | No Mass Assign | Safe 404 | Status |
|-------|------|-------------|----------------|----------|--------|

Flag every violation as CRITICAL with the exact line number and fix.
