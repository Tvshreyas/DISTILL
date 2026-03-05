---
name: Test-Driven Development
description: Write tests first, then implement, following Distill's testing strategy
---

# Test-Driven Development Workflow

When implementing new features or fixing bugs, follow this TDD cycle.

## The Cycle

### 1. RED — Write the failing test first
```bash
# Unit test → tests/unit/<feature>.test.ts
# E2E test → tests/e2e/<feature>.spec.ts
```

Decide test type:
- **Unit test (Vitest)** for: pure logic, calculations, validation, sanitization
- **E2E test (Playwright)** for: user flows, page interactions, API integration

### 2. GREEN — Write minimal code to pass
- Implement only what's needed to make the test green
- No premature optimization
- Run: `npm test` or `npx vitest run <file>`

### 3. REFACTOR — Clean up while green
- Extract shared logic
- Improve naming
- Remove duplication
- Tests must still pass after refactor

## Priority Test Areas (from CLAUDE.md)
1. **Streak calculation** — timezone handling, freeze logic, monthly reset
2. **Free tier enforcement** — exact limit (10), concurrent requests, downgrade
3. **Resurfacing scheduler** — 4 queue entries, correct intervals, cascade delete
4. **Input sanitization** — XSS prevention, unicode preservation, length limits
5. **IDOR prevention** — user A cannot access user B's data

## Unit Test Template
```typescript
import { describe, it, expect } from 'vitest'

describe('featureName', () => {
  it('should handle the happy path', () => {
    // Arrange
    // Act
    // Assert
    expect(result).toBe(expected)
  })

  it('should handle edge case', () => {
    // ...
  })

  it('should reject invalid input', () => {
    // ...
  })
})
```

## Rules
- 80% coverage target on critical paths
- Never mock Supabase RLS — test against real policies when possible
- Test timezone edge cases (UTC-12 to UTC+14)
- Test at exact boundaries (10th reflection, not 9th or 11th)
- Security tests: always verify IDOR returns 404 (not 403)
