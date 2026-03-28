Refactor code in the Distill codebase. What to refactor: $ARGUMENTS

## Refactoring rules:

### 1. Analyze first

- Read all related files thoroughly before making changes
- Understand the current patterns and why they exist
- Check for callers/consumers of the code being refactored

### 2. Constraints

- Do NOT change the public API of any function/component unless explicitly asked
- Do NOT add new dependencies
- Do NOT change rendering strategy (SSR/SSG/Client) unless explicitly asked
- Preserve all security patterns (auth guards, user scoping, sanitization)
- Preserve all four state handlers (loading/empty/error/success)

### 3. Refactoring checklist

- [ ] Extract repeated patterns into shared utilities in `lib/`
- [ ] Move shared types to `types/index.ts`
- [ ] Ensure consistent error handling across similar routes
- [ ] Remove dead code (unused imports, unreachable branches)
- [ ] Simplify complex conditionals
- [ ] Keep Tailwind classes — never extract to CSS

### 4. Verify

After refactoring:

- `npm run type-check` — zero errors
- `npm run lint` — zero errors
- `npm run build` — builds successfully
- Manually verify no security patterns were broken

### 5. Report

- What was refactored and why
- Files changed
- Before/after comparison of the key change
- Confirmation that no behavior changed
