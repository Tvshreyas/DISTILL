# Marketing Ledger
> Running log of all growth work done on Distill. Updated each session.

---

## 2026-03-20 — Growth Engine Run #1

### pSEO: New Content
| Asset | Type | Target Keyword | Est. Volume | Status |
|-------|------|----------------|-------------|--------|
| `/blog/notion-vs-obsidian-for-book-notes` | Blog post | "Notion vs Obsidian for book notes" | 3,000-6,000/mo | Published to codebase |

**Why this keyword:** Highest-volume PKM comparison keyword not yet covered. Captures people at the decision point between two general-purpose tools and positions Distill as the purpose-built alternative. High purchase intent — searcher has already decided to use a tool and is choosing which one.

### Social Intelligence: Drafted Responses
| # | Platform | Conversation | Status |
|---|----------|-------------|--------|
| 1 | Medium | "I Spent 3 Months Building My Second Brain in Notion. Then I Deleted Everything." (Suzaan Sayed, Jan 2026) | Drafted — `content/SOCIAL-RESPONSES.md` |
| 2 | Zettelkasten Forum | "Every attempt at PKM has landed me in the same place: a huge mess" (Oct 2024, still active) | Drafted |
| 3 | Medium | "Your Second Brain Is Broken: Why Most PKM Tools Waste Your Time" (Ann P., May 2025) | Drafted |

All responses follow the 2-sentence philosophy: lead with empathy, give value, mention Distill naturally at the end.

### Infrastructure: UTM Attribution System
| Component | File | Status |
|-----------|------|--------|
| UTM cookie capture in middleware | `middleware.ts` | Built |
| Acquisition fields in Convex schema | `convex/schema.ts` | Built |
| UTM → profile on first signup | `convex/profiles.ts` + `components/ProfileSync.tsx` | Built |
| PostHog user identification | `components/ProfileSync.tsx` | Built |
| `user_signed_up` event | `components/ProfileSync.tsx` | Built |
| `reflection_created` event | `components/ReflectionCapture.tsx` | Built |
| `upgraded_to_pro` event | `app/dashboard/page.tsx` | Built |

### Infrastructure: Share & Discoverability
| Component | File | Status |
|-----------|------|--------|
| Share Distill button (native + clipboard) | `app/dashboard/settings/page.tsx` | Built |
| PWA share_target (appear in OS share sheet) | `public/manifest.json` | Built |
| `shared_distill` PostHog event | `app/dashboard/settings/page.tsx` | Built |

### Bug Fixes: Domain Migration
| File | Fix |
|------|-----|
| `robots.txt` | Sitemap URL: `distill.app` → `distillwise.com` |
| `sitemap.ts` | Fallback base URL: `distill.app` → `distillwise.com` |
| `app/layout.tsx` | metadataBase URL |
| `app/page.tsx` | All canonical/OG/JSON-LD URLs (8 occurrences) |
| `app/blog/page.tsx` | Canonical URL |
| `app/blog/[slug]/page.tsx` | Canonical + JSON-LD URLs |
| `app/glossary/page.tsx` | Canonical URL |
| `app/glossary/[slug]/page.tsx` | Canonical + JSON-LD URLs |
| `app/reflect/page.tsx` | Canonical URL |
| `app/reflect/[slug]/page.tsx` | Canonical URL |
| `app/start/layout.tsx` | Canonical URL |
| `app/terms/page.tsx` | Canonical URL |
| `app/privacy/page.tsx` | Canonical URL |
| `components/LandingPage.tsx` | Email link |
| `public/llms.txt` | Site URL |

**Impact:** Before this fix, Google would have indexed all pages under the wrong domain. Canonical URLs tell Google "this is the real URL" — having them point to `distill.app` (which you don't own) would have caused indexing issues and potentially split your SEO equity.

---

## 2026-03-21 — Counter-Culture Repositioning

### Strategic Shift
Repositioned Distill from "building in public / productivity tool" to **"Mindful Resistance / Anti-AI Thinking Tool."**

| Concept | Description | Status |
|---------|-------------|--------|
| "Mindful Resistance" positioning | Distill as the anti-productivity app — consume less, think more | New master strategy |
| "AI summarizes. Humans Distill." | Core catchphrase — positions manual reflection as luxury good | Ready for all channels |
| Resurfacing = viral engine | Beautiful resurfacing cards designed to be screenshot-worthy | Strategy documented |
| Proof of Thinking | Before/after content (long video → 1-sentence distill) | Need to create 3 examples |
| Counter-positioning table | Every trend vs Distill's contrarian stance | Documented |

### New Content Created
| Asset | File | Status |
|-------|------|--------|
| Counter-Culture Master Strategy | `content/COUNTER-CULTURE-STRATEGY.md` | Written |
| Updated X/Twitter posts (anti-AI voice) | In strategy doc | Ready to post |
| Updated LinkedIn posts (counter-culture) | In strategy doc | Ready to post |
| Updated Product Hunt copy | In strategy doc | Ready |
| Updated Show HN copy | In strategy doc | Ready |
| Updated Reddit posts (+ r/nosurf) | In strategy doc | Ready |
| New newsletter pitch angle | In strategy doc | Ready |

### New Channel: r/nosurf + r/digitalminimalism
Natural fit for "mindful resistance" positioning. Post drafted for launch day.

---

## Content Inventory (as of 2026-03-20)

### Blog Posts: 22 total
- 2 comparison posts (distill-vs-readwise, notion-vs-obsidian-for-book-notes)
- 1 listicle (best-book-reflection-apps-2026)
- 19 informational/educational posts

### Programmatic SEO: 15 pages
- 10 glossary terms
- 5 reflection guides

### Total Indexable Pages: ~40

---

## Next Keyword Targets (backlog)
| Keyword | Est. Volume | Priority | Notes |
|---------|-------------|----------|-------|
| "second brain for readers" | 1,500-3,000/mo | HIGH | Reframes BASB category on Distill's terms |
| "best apps to remember what you read" | 2,000-4,000/mo | HIGH | Transactional intent, bridges existing content |
| "Distill vs Obsidian" | TBD | MEDIUM | Brand comparison — build after launch traction |
| "Distill vs Notion" | TBD | MEDIUM | Brand comparison — build after launch traction |

---

## Self-Correction: Next Automated Growth Experiment

**Experiment: Auto-generate "Distill vs X" comparison pages for every PKM tool mentioned on Reddit**

How it works:
1. Weekly scrape of r/PKMS, r/ObsidianMD, r/Notion, r/productivity for tool names mentioned alongside frustration keywords
2. For each tool with 3+ frustrated mentions: auto-generate a comparison blog post using the same template as `distill-vs-readwise`
3. Each post targets "[Tool] alternative for readers" and "[Tool] vs Distill"

Why this compounds:
- Every comparison page catches people actively looking to switch tools
- The posts are formulaic (same structure, different competitor details) so they can be batch-produced
- Each new post adds a new entry point to the site from Google
- As the tool landscape changes (new tools launch, old ones pivot), new comparison opportunities emerge automatically

First candidates: Distill vs Capacities, Distill vs Mem, Distill vs Reflect, Distill vs Heptabase
