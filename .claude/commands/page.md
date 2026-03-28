Create a new Distill page following the App Router conventions. Page details: $ARGUMENTS

## Steps:

### 1. Determine route path

Based on the description, create the correct file at `app/[route]/page.tsx`.

### 2. Determine rendering strategy

Refer to CLAUDE.md rendering strategy table:

- **SSG** (Static): Marketing/public pages with no user data
- **SSR** (Server): Pages needing fresh user data (dashboard, library, settings)
- **Client**: Multi-step interactive flows (onboarding)

### 3. Required page structure

For **Server pages** (SSR):

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PageName() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/sign-in')

  // Fetch data server-side
  const { data } = await supabase
    .from('table')
    .select('*')
    .eq('user_id', session.user.id)

  return (/* JSX */)
}
```

For **Client pages**:

```typescript
"use client";
// Only use when interactivity is required
```

For **Static pages** (SSG):

```typescript
// No auth, no dynamic data
export default function PageName() {
  return (/* JSX */)
}
```

### 4. Required elements

- All four states: loading (skeleton), empty, error, success
- Metadata export for SEO: `export const metadata = { title: '...', description: '...' }`
- Tailwind CSS only
- Mobile-responsive (PWA target)
- No praise language or medical claims

### 5. After creating

- Run `npm run type-check`
- Verify the route is accessible in dev
