---
name: Create Component
description: Create a new React component following Distill's conventions and state handling rules
---

# Create Component

When creating a new UI component in `components/`, follow these rules.

## Steps

1. **Decide Server vs Client:**
   - Default to **Server Component** (no `'use client'` directive)
   - Only use Client Component if it needs: event handlers, useState/useEffect, browser APIs, or interactivity
   - If mixed: Server Component wrapper with Client interactive parts

2. **File location:**
   - Reusable UI primitives → `components/ui/`
   - Feature components → `components/`
   - Page-specific (not reusable) → co-locate in the route folder

3. **Handle all 4 states** (mandatory — from CLAUDE.md):
```typescript
// Loading → Skeleton UI matching final shape
// Empty → Icon + explanation + CTA
// Error → Friendly message + retry, no technical jargon
// Success → Neutral confirmation, no excessive celebration
```

4. **Styling rules:**
   - Tailwind v4 utility classes only (no custom CSS)
   - No `tailwind.config.js` — uses CSS-native `@import "tailwindcss"`
   - Responsive: mobile-first (`sm:`, `md:`, `lg:` breakpoints)

5. **Copy rules** (legally required):
   - No praise language ("Great job!", "Amazing!")
   - No medical/therapeutic claims
   - Neutral confirmations only ("Saved." not "Awesome!")
   - See CLAUDE.md Copy & Language Rules section

6. **TypeScript:**
   - Props interface defined and exported
   - No `any` types
   - Import shared types from `types/index.ts`

## Template
```typescript
// components/MyComponent.tsx
import { type FC } from 'react'

interface MyComponentProps {
  title: string
  onAction?: () => void
}

export const MyComponent: FC<MyComponentProps> = ({ title, onAction }) => {
  return (
    <div className="rounded-lg border border-neutral-200 p-4">
      <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
    </div>
  )
}
```

## Checklist
- [ ] Server or Client component decision documented
- [ ] All 4 states handled (loading, empty, error, success)
- [ ] Tailwind v4 utility classes only
- [ ] Follows copy/language rules
- [ ] Props typed with interface
- [ ] Accessible (aria labels, keyboard navigation)
