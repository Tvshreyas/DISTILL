# AI SEO Strategy — Distill

## Goal
Get Distill cited in AI search answers (ChatGPT, Perplexity, Google AI Overviews) for queries about reading retention, reflection practices, and thinking tools.

---

## Phase 1: Quick Wins (Before Launch)

### 1. Expand FAQPage JSON-LD from 3 to 11 questions
**File:** `app/page.tsx`

Add these questions to the existing FAQPage schema:
- "What is Distill?"
- "Is Distill a note-taking app?"
- "How does Distill work?"
- "Is Distill free?"
- "What is a reflection practice?"
- "How does Distill use spaced repetition?"
- "What types of content can I reflect on?"
- "How is Distill different from Notion or Readwise?"
- "Can Distill help me remember what I read?"
- "Does Distill use AI?"
- "What is compound thinking?"

### 2. Create `public/llms.txt`
Machine-readable site description following the llms.txt convention. Contains Distill's canonical description, core concepts, and links to key content pages. Direct signal to AI crawlers.

### 3. Update `public/robots.txt`
Explicitly allow AI bots: GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended, Amazonbot, anthropic-ai, cohere-ai.

### 4. Add `max-snippet:-1` meta tag
**File:** `app/layout.tsx` — allows unlimited snippet extraction for AI Overviews.

### 5. Add WebSite schema + knowsAbout to landing page JSON-LD
**File:** `app/page.tsx` — add `WebSite` schema and `knowsAbout` array to Organization.

---

## Phase 2: Content Formatting for AI Extraction

### 6. Answer-first formatting
Every H2 section should begin with a 1-2 sentence direct answer before elaborating. AI engines extract the first 1-2 sentences after a heading as the snippet. Applies to:
- All 10 glossary terms in `lib/pseo-data.ts`
- All 6 blog posts in `content/blog/*.md`

### 7. Add summary/definition boxes
- Definition box at top of glossary pages
- TL;DR box at top of blog posts

### 8. Add FAQ sections to blog posts
3-5 Q&A pairs per post. Add FAQPage JSON-LD to glossary pages too.

---

## Phase 3: Structured Data Enhancement

### 9. Enhance BlogPosting JSON-LD
**File:** `app/blog/[slug]/page.tsx`

Add: `wordCount`, `keywords`, `articleSection`, `about` entity, `speakable`, `isPartOf`.

### 10. Enhance DefinedTerm JSON-LD
**File:** `app/glossary/[slug]/page.tsx`

Add: `url`, `speakable`, `sameAs` (Wikipedia URLs for each concept).

### 11. Add BreadcrumbList JSON-LD
To all three content templates: blog, glossary, guides.

---

## Phase 4: New Content for Entity Establishment

### 12. Create About page (`app/about/page.tsx`)
Critical for entity establishment. Explains what Distill is, who built it, and why.

### 13. Create comparison pages (`app/compare/[slug]/page.tsx`)
- distill-vs-notion
- distill-vs-readwise
- distill-vs-journaling
- distill-vs-obsidian

These capture high-intent "alternative to X" queries that AI engines love to cite.

### 14. Create `/learn` hub page
Pillar page linking all educational content (glossary, guides, blog).

### 15. Name the framework
"The Distill Loop" — Consume, Reflect, Resurface, Layer. A citable methodology AI can reference.

### 16. Quotable one-liners for AI extraction
Embed in content:
- "Passive reading is a forgetting machine."
- "Highlights are where ideas go to die."
- "Your brain remembers what it processes, not what it sees."

---

## Phase 5: External Signals (Post-Launch, Ongoing)

- Launch on Product Hunt → add to `sameAs` in Organization JSON-LD
- Create social profiles (X, LinkedIn) → add to `sameAs`
- Submit to directories (AlternativeTo, G2, SaaSHub)
- Answer questions on Quora/Reddit linking to distillwise.com content
- Guest post on productivity blogs
- All external profile URLs go into the `sameAs` array

---

## Target Queries to Monitor

| Query | Content that should rank |
|---|---|
| "what is a reflection practice" | /glossary/reflective-thinking |
| "how to remember what you read" | /blog/how-to-remember-what-you-read |
| "best reflection app" | / (landing page) |
| "thinking tool for readers" | / (landing page) |
| "spaced repetition for reading" | /glossary/spaced-repetition |
| "how to reflect on books" | /reflect/books |
| "compound thinking" | /glossary/compound-thinking |
| "alternative to readwise" | /compare/distill-vs-readwise (future) |
| "forgetting curve solution" | /glossary/forgetting-curve |
| "distill app" | / (landing page) |

---

## Priority Order

1. **P0 (before launch):** llms.txt, robots.txt AI bot allows, max-snippet meta tag
2. **P0 (before launch):** Expand FAQ JSON-LD to 11 questions
3. **P1 (week 1):** Answer-first content reformatting
4. **P1 (week 1):** BreadcrumbList JSON-LD on all templates
5. **P2 (week 2-3):** Comparison pages, About page
6. **P2 (week 2-3):** Enhanced BlogPosting + DefinedTerm schemas
7. **P3 (ongoing):** External signals, directory submissions
