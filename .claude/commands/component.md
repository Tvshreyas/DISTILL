Create a new Distill component following project conventions. Component details: $ARGUMENTS

## Rules:

### 1. Determine component type
- **Server Component** (default): No "use client" directive. Fetches data via Supabase server client.
- **Client Component**: Only if interactivity is required (forms, click handlers, state). Add "use client" at top.

### 2. File location
- Reusable UI primitives → `components/ui/`
- Feature components → `components/`
- Page-specific components → colocate in the route directory

### 3. Required patterns
- TypeScript strict: define Props interface, no `any` types
- Tailwind CSS v4 only: no custom CSS, no CSS modules
- All four states: Loading (skeleton), Empty (icon + CTA), Error (friendly message + retry), Success
- No emojis in UI copy unless specified
- No praise language ("Great job!") — use neutral confirmations ("Saved.")

### 4. Security
- Sanitize any user-provided content with `sanitizeContent()` from `@/lib/sanitize`
- Never use `dangerouslySetInnerHTML`
- Never render reflection content as HTML

### 5. Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus management for modals/dialogs

### 6. After creating
- Run `npm run type-check` to verify
- If the component needs data, check if the parent page should fetch it (Server Component pattern)
