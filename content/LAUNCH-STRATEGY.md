# Distill Launch Strategy

_Created: 2026-03-14_
_Launch date target: Tuesday, March 24, 2026_

---

## Why Tuesday March 17

- Product Hunt launches perform best Tuesday-Thursday (highest voter traffic).
- Tuesday gives 4 full weekdays of momentum before weekend drop-off.
- Product is ready. Blog is live. Programmatic SEO pages are indexed. No reason to wait.
- 3 days of focused prep is enough when the product is built.

---

## Phase 1: Pre-Launch Prep (March 14-23)

### Goal

Final polish, visual assets, community drafts, recruit 10-15 launch day supporters.

### Friday March 14: Product & Assets

**Domain & analytics:**

- [ ] Confirm domain is live and `NEXT_PUBLIC_APP_URL` is set correctly
- [ ] Add domain to Clerk (Authentication settings → Production)
- [ ] Verify PostHog is receiving events (signup, session_start, reflection_saved)
- [ ] Sign up for Google Search Console and submit sitemap: `https://[your-domain]/sitemap.xml`
- [ ] Verify Stripe is in live mode with correct price IDs

**Visual assets (critical for Product Hunt):**

- [ ] Take 5 high-resolution screenshots:
  1. Landing page hero (full viewport, shows positioning)
  2. Session start flow (content type selection)
  3. Reflection writing screen (mid-reflection, shows the core experience)
  4. Library view with search (shows accumulated value)
  5. Resurfacing / streak counter (shows compound effect)
- [ ] Record a 60-second screen recording demo. No voiceover — text overlays only:
  - "Start a session" → "Read something" → "Write what you think" → "It resurfaces later"
  - Smooth cursor movements, real typing. Show the full loop in one take.
- [ ] Export OG image as PNG, verify it renders correctly when shared on X/LinkedIn

**Quick product checks:**

- [ ] Sign up as a new user end-to-end: landing → signup → onboarding → first session → reflection → library
- [ ] Test on mobile (PWA). Core flow should work without friction
- [ ] Confirm free tier enforcement works (10 deep sessions/month limit)
- [ ] Confirm upgrade flow works (Stripe checkout → Pro access)
- [ ] Load the blog, glossary, and reflection guide pages — verify no 404s

### Saturday March 15: Community Prep & Drafts

**Product Hunt prep:**

- [ ] Create Product Hunt maker profile. Upload headshot. Bio: "Solo founder. Building tools for thinkers, not consumers."
- [ ] Draft the Product Hunt listing (full copy below)
- [ ] Upload all 5 screenshots + demo video to PH draft
- [ ] Find 2-3 Product Hunt hunters with 500+ followers. DM them:

> Hey [name] — I've been following your hunts. I'm launching Distill on Tuesday: a thinking tool where you write reflections after reading/watching content, and they resurface later. No AI, no summaries. Solo founder, bootstrapped. Would you consider hunting it? Happy to give you early access right now. [link]

- [ ] Schedule the Product Hunt launch for exactly 12:01 AM PT on Tuesday March 17

**Write all launch copy (drafts ready to paste):**

- [ ] Show HN post (full draft below)
- [ ] Reddit posts for r/productivity and r/books (full drafts below)
- [ ] 6-tweet launch thread (full drafts below)
- [ ] Waitlist/announcement email if you have any signups (draft below)
- [ ] Product Hunt maker comment (draft below)

**Recruit launch day supporters:**

- [ ] DM 10-15 friends, colleagues, anyone who reads regularly. Use this:

> Hey — I'm launching Distill on Tuesday. It's a tool where you write a short reflection after reading/watching/listening to something, and your reflections resurface later. Would you sign up on launch day and leave an honest comment on Product Hunt? Not asking for fake praise — just your genuine experience. I'll send you the link Tuesday morning.

- [ ] Ask 3-5 people to actually use the app before Tuesday so they can leave informed PH comments

### Sunday March 16: Final Checks (T-Minus 24 Hours)

**Morning:**

- [ ] Do one final full walkthrough: signup → session → reflection → library → settings
- [ ] Test on a different browser (incognito) to catch any auth/cookie issues
- [ ] Verify all blog posts, glossary pages, and reflection guides load correctly
- [ ] Check that JSON-LD structured data renders (view page source, search for "application/ld+json")

**Afternoon:**

- [ ] Pre-open all tabs you'll need Tuesday morning:
  - Product Hunt maker dashboard
  - X/Twitter compose (with thread saved in drafts)
  - Hacker News submit page
  - Reddit r/productivity and r/books submit pages
  - Convex dashboard (for monitoring)
  - PostHog dashboard (for real-time signups)
  - Clerk dashboard (for user count)
- [ ] Set 3 alarms: 11:45pm Monday night (PH goes live), 6:00am Tuesday, 8:00am Tuesday
- [ ] Pre-write a "things are breaking" status tweet just in case:

> we're seeing higher traffic than expected. some signups may be slow. working on it. your data is safe. distillwise.com

- [ ] Get a good night's sleep. Launch day is a marathon.

### Pre-Launch Metrics Targets

| Metric                               | Target   |
| ------------------------------------ | -------- |
| Launch day supporters committed      | 10-15    |
| People who tried the app pre-launch  | 3-5      |
| All copy drafts written              | Yes      |
| PH listing fully drafted with assets | Yes      |
| Full signup flow tested              | 3+ times |

---

## Phase 2: Launch Day — Tuesday, March 24, 2026

### Hour-by-Hour Playbook

**Monday night, 11:45pm PT:**

- Verify PH listing is queued and goes live at 12:01am PT.
- Have maker comment copied to clipboard.

**12:01am PT (Product Hunt goes live):**

- Verify listing is live. Immediately post maker comment:

> Hey PH — I'm [name], solo founder of Distill.
>
> I built this because I read 40+ books last year and couldn't recall a single original thought about any of them. I was consuming, not thinking.
>
> Distill is deliberately simple: start a session, consume something, write what you thought, and your reflections resurface later.
>
> What it's NOT: a note-taking app, an AI summarizer, or a "second brain." It's a single-purpose thinking tool.
>
> Free: 10 deep sessions/month. Pro: unlimited + spaced resurfacing.
>
> I'd genuinely appreciate your feedback — especially on what's confusing or unnecessary.

- Text/DM all 10-15 committed supporters: "We're live! [PH link]. Genuine comments about your experience mean more than upvotes."

**6:00am - 7:00am (your morning):**

- Check PH ranking. Respond to every comment within 30 minutes. Be specific, not generic.
- Post Show HN. Title: "Show HN: Distill — A thinking tool for people who read"
- Monitor HN /newest to confirm it appears. Do NOT ask anyone to upvote HN — this triggers a penalty and kills the post.

**8:00am - 9:00am:**

- Post launch tweet thread on @distillapp (full thread below).
- Post r/productivity and r/books posts (put link in first comment, not post body — Reddit penalizes link posts).
- Send announcement email to any waitlist/early signups (draft below).

**10:00am - 12:00pm:**

- Respond to every PH comment. Be specific and genuine — no "thanks for the support!" replies.
- Respond to every HN comment. Be technical and honest. If someone says "a blank text file does this" — agree, then explain the resurfacing mechanism and compound thinking angle.
- Monitor signups in Convex/Clerk dashboard. Watch for errors in Convex function logs.

**2:00pm - 6:00pm:**

- Post a "building in public" update on X with real-time numbers:

> a few hours since launch.
> [X] signups.
> [X] reflections written.
> one person already wrote [X] reflections. that's more active thinking than most people do in a month.
> distillwise.com

- Reply to every X mention, RT, and quote tweet.
- Check Reddit posts. Respond to every comment thoughtfully.
- If PH ranking is top 10, post another tweet:

> distill is currently #[X] on product hunt.
> built by one person. no VC. no AI.
> just a tool that asks: what did you actually think?
> distillwise.com

**8:00pm - 10:00pm:**

- Final PH comment push. Thank specific commenters by name.
- Post "end of day 1" tweet:

> day 1 done.
> [X] people signed up for distill.
> [X] reflections written.
> every reflection is someone choosing to think instead of scroll.
> thank you. more tomorrow.

- Send personal thank-you DMs to everyone who supported the launch.

### Launch Day Metrics Targets

| Metric              | Minimum | Good  | Great |
| ------------------- | ------- | ----- | ----- |
| PH upvotes          | 50      | 150   | 300+  |
| PH ranking (daily)  | Top 15  | Top 5 | #1-3  |
| HN points           | 5       | 30    | 100+  |
| New signups         | 50      | 150   | 300+  |
| Reflections written | 20      | 75    | 200+  |

---

## Phase 3: Post-Launch Week 1 (March 25-30)

### Goal

Convert launch traffic into retained users. Fix bugs. Keep momentum.

**Wednesday March 18 (Day 2):**

- Continue responding to all PH/HN/Reddit comments (threads stay active 48 hours).
- Post follow-up on X with a specific user story (ask permission first):

> someone used distill after watching a 3-hour documentary and wrote their first reflection.
>
> that's the point. not AI summaries. YOUR perspective, captured before it fades.

- If PH result was top 5: add "Product Hunt #X" badge to landing page.
- Fix any bugs reported during launch. Priority order: signup flow → reflection saving → everything else.

**Thursday-Friday March 19-20 (Day 3-4):**

- Email all launch-day signups who haven't written a reflection yet:

> Subject: You signed up. You haven't reflected yet.
>
> You joined Distill [X] days ago. You haven't started a session yet.
>
> Here's the simplest way to start: Think of the last thing you read, watched, or listened to. Open Distill. Start a session. Write 2 sentences about what you thought.
>
> That's it. No minimum length. No requirements.
>
> [link to start a session]
>
> — [name]

- Post on IndieHackers: "I launched Distill 3 days ago — here are the real numbers." Include: signups, reflections written, PH ranking, what went well, what didn't. The IH community loves transparent posts.
- Submit to directories:
  - AlternativeTo (alternative to: Readwise, Notion, Day One)
  - SaaSHub
  - BetaList
  - ToolFinder
  - There's An AI For That (position as the anti-AI tool — this is a differentiator)

**Weekend March 22-23 (Day 6-7):**

- Analyze first week data in PostHog:
  - Where do users drop off? (signup → session start → reflection saved)
  - What content types are most common? (books, articles, podcasts, videos)
  - Average reflection length and time spent
- Post 2-3 more tweets. Focus on thinking-provocation, not product features:

> you read 3 articles today. what did you actually think about any of them?
>
> not what the author said. what YOU thought.
>
> that gap — between consuming and thinking — is the entire problem.

### Week 1 Metrics Targets

| Metric                         | Target         |
| ------------------------------ | -------------- |
| Total registered users         | 100-300        |
| Users who wrote 1+ reflection  | 40% of signups |
| Users who wrote 3+ reflections | 15% of signups |
| Bugs reported and fixed        | All critical   |
| Directory submissions          | 5              |

---

## Phase 4: Post-Launch Weeks 2-4 (March 31 - April 20)

### Goal

Convert free users to Pro. Build sustainable content + community cadence. Get first revenue.

### Week 2 (March 31 - April 6): Convert and retain

- Email users who wrote 3+ reflections:

> Subject: You've reflected [X] times
>
> Most people who try Distill write one reflection and stop. You've written [X].
>
> That means you have a growing library of your own thinking. It compounds over time — especially when past reflections resurface and you see how your perspective has evolved.
>
> Free tier: 10 deep sessions/month. If you want unlimited: [upgrade link]
>
> No pressure. The free tier is real — it stays free.

- Publish 1-2 blog posts from Wave 2 editorial calendar (information-diet, active-reading-techniques). Each new post = fresh organic search surface area.
- Post 3x/week on X. Content ratio: 60% original thinking about reading/retention, 30% engagement, 10% product.
- Collect testimonials from active users:

> Subject: Quick ask — one sentence about Distill
>
> Hey [name],
>
> You've written [X] reflections in Distill so far. That's more than most people process in a year.
>
> Would you write one honest sentence about whether Distill changed how you think about what you read? No pressure for praise — even "it's fine but I wish it did X" is useful.
>
> I'll use it on the landing page (with your permission). First name only.
>
> Thanks,
> [your name]

### Week 3 (April 7-13): Second wave

- Guest pitch 2-3 newsletters in the reading/productivity space:
  - Dense Discovery (Kai Brach) — thoughtful tech audience
  - The Honest Broker (Ted Gioia) — readers + anti-algorithm crowd
  - Nerdish by Nature — book/learning focused
- Pitch template:

> Subject: Distill — the anti-AI reading tool
>
> Hey [name],
>
> I read your newsletter regularly. [Specific reference to a recent issue.]
>
> I built Distill, a tool where you write a short reflection after reading/watching/listening to something. No AI summaries, no second brain complexity. Just: what did you think?
>
> Your reflections resurface at intervals so your thinking compounds.
>
> Would it be a fit for [newsletter name]? Happy to write a guest piece on [specific topic relevant to their audience] if that works better than a feature.
>
> [your name]
> distillwise.com

- Publish 1-2 more blog posts. Prioritize based on which search queries are showing impressions in Google Search Console.
- Update landing page with 3 testimonial quotes from real users.

### Week 4 (April 14-20): Optimize and plan

- First monthly cohort analysis:
  - Day 1 → Day 7 retention rate
  - Day 1 → Day 14 retention rate
  - Free → Pro conversion rate
  - Average reflections per active user per week
- Based on data, decide:
  - If retention is low (< 20% D7): onboarding needs work. Add guided first session or onboarding email sequence.
  - If conversion is low (< 2%): free tier may be too generous. Test reducing to 5 reflections/month.
  - If acquisition is low: double down on SEO content (Wave 2 posts) and newsletter pitches.
- Plan April content calendar based on Search Console data.

### Weeks 2-4 Metrics Targets

| Metric                     | Minimum | Good | Great  |
| -------------------------- | ------- | ---- | ------ |
| Total registered users     | 150     | 400  | 1,000+ |
| Users with 3+ reflections  | 40      | 100  | 250+   |
| Day 7 retention            | 15%     | 25%  | 35%+   |
| Pro conversions            | 3       | 10   | 25+    |
| MRR                        | $15     | $50  | $125+  |
| Organic search clicks/week | 50      | 150  | 300+   |
| Testimonials collected     | 3       | 5    | 10+    |

---

## Product Hunt Listing Copy

**Tagline (60 char max):**

> Stop absorbing. Start thinking.

**Description:**

> Distill is a thinking tool for people who consume content but forget what they thought about it.
>
> The loop is simple:
>
> 1. Start a session — pick what you're reading, watching, or listening to
> 2. Consume the content (Distill doesn't host anything)
> 3. Write a short reflection — what did YOU think?
> 4. Your reflections resurface at intervals so your thinking compounds
>
> It's not a note-taking app. No folders, no tags, no organizational overhead.
> It's not an AI summarizer. You write, not a model.
> It's not a journal. Reflections are content-triggered, not emotion-triggered.
>
> Free: 10 deep sessions/month. Pro: unlimited + spaced resurfacing + streaks.
>
> Built by a solo founder who read 40+ books last year and couldn't recall a single original thought about any of them.

**Topics:** Productivity, Reading, Education, Writing

---

## Show HN Post

> Show HN: Distill — A thinking tool for people who read
>
> I read 40+ books last year and realized I couldn't tell you a single original thought I had about any of them. I was absorbing, not thinking.
>
> So I built Distill. The idea is simple:
>
> 1. Start a session (book, article, video, podcast)
> 2. Consume the content (externally — Distill doesn't host anything)
> 3. Write a short reflection: what did you actually think?
> 4. Your reflections resurface at intervals so they stick
>
> It's not a note-taking app (no org, no folders, no tags). It's not an AI summarizer (you write, not a model). It's a single-purpose tool: make yourself think after consuming something.
>
> Free tier: 10 deep sessions/month. Pro: unlimited + spaced resurfacing + streak tracking.
>
> Tech: Next.js 15, Convex, Clerk, Stripe. PWA so it works on mobile. Solo founder, bootstrapped.
>
> I'd especially appreciate feedback on:
>
> - Is the core loop clear enough?
> - Would you actually use this, or does a blank doc achieve the same thing?
> - Pricing feel right?
>
> [URL]

---

## Reddit Posts

### r/productivity

> **I built a tool that does one thing: makes you think after reading something**
>
> I kept reading books, saving highlights, even writing summaries. But when someone asked me "what did YOU think about it?" I had nothing.
>
> Distill is dead simple: you log what you're reading/watching, write a short reflection when you're done, and your past reflections resurface over time.
>
> No AI. No summaries. No folders or tags. Just: what did you think?
>
> Free tier gives you 10 deep sessions/month. Pro is unlimited.
>
> Would love honest feedback from this community. Link in comments.

### r/books

> **After reading 40+ books last year, I couldn't articulate a single original thought about any of them**
>
> So I built a small tool for myself. After finishing a book (or article, or podcast), I write one short reflection: what did I actually think? Not a summary. Not highlights. My perspective.
>
> Then those reflections come back to me weeks later. It's surprising how often past-me had interesting ideas that present-me forgot.
>
> I turned it into a free web app called Distill. 10 deep sessions/month free, unlimited with Pro.
>
> Anyone else struggle with this? Curious if it's just me or if "consuming without thinking" is a common pattern.

---

## Launch Tweet Thread

**Tweet 1:**

> distill is live.
>
> a thinking tool for people who read, watch, and listen to things — and want to actually remember what they thought about them.
>
> free to use. link below.
> distillwise.com

**Tweet 2:**

> the problem: you consume 50+ books, 1000+ articles, countless podcasts per year.
>
> how many original thoughts did you keep from all of that?
>
> probably zero. because you never wrote them down.

**Tweet 3:**

> distill works like this:
>
> 1. start a session (book, article, video, podcast)
> 2. consume the content wherever you want
> 3. write a short reflection — what did YOU think?
> 4. your reflections resurface at intervals
>
> that's it. no AI. no summaries. no folders.

**Tweet 4:**

> this is not a note-taking app.
> no tags. no folders. no org system to maintain.
>
> it's also not an AI tool.
> you write. not a model.
>
> one job: force yourself to think after consuming something.

**Tweet 5:**

> free: 10 deep sessions/month.
> pro: unlimited reflections + spaced resurfacing + streaks.
>
> built with next.js, convex, clerk.
> solo founder. bootstrapped. no VC.

**Tweet 6:**

> if you've ever finished a book and immediately forgotten what you thought about it — distill exists for you.
>
> try it: distillwise.com
> feedback welcome. i read everything.

---

## Pre-Launch X Posts (Post March 14-16)

Post these one per day leading up to launch:

**Saturday:**

> i built a tool because i realized i'd read 40+ books last year and couldn't tell you a single original thought i had about any of them.
>
> not a summary tool. not AI. just a prompt: what did you actually think?
>
> launching tuesday. distillwise.com

**Sunday:**

> the problem isn't that you forget what you read.
> the problem is you never processed it in the first place.
>
> highlighting ≠ thinking.
> saving ≠ understanding.
> bookmarking ≠ learning.

**Monday (day before launch):**

> unpopular opinion: AI summaries make the reading retention problem worse.
> you skip the processing step entirely.
> your brain needs friction. distill adds the right kind.
>
> launching tomorrow.

---

## Announcement Email

> Subject: Distill is live — your account is ready
>
> Distill is officially live.
>
> What it does: After reading, watching, or listening to something, you write a short reflection. Your reflections resurface at intervals so your thinking compounds over time.
>
> Start here: [link]
>
> Free tier: 10 deep sessions/month. Pro: unlimited.
>
> If something breaks, reply to this email. I read everything.
>
> — [name]

---

## Activation Email (Send Day 3-4 to non-active signups)

> Subject: You signed up. You haven't reflected yet.
>
> You joined Distill [X] days ago. You haven't started a session yet.
>
> Here's the simplest way to start: Think of the last thing you read, watched, or listened to. Open Distill. Start a session. Write 2 sentences about what you thought.
>
> That's it. No minimum length. No requirements.
>
> [link to start a session]
>
> — [name]

---

## Testimonial Request Email (Send to users with 5+ reflections)

> Subject: Quick ask — one sentence about Distill
>
> Hey [name],
>
> You've written [X] reflections in Distill so far. That's more than most people process in a year.
>
> Would you write one honest sentence about whether Distill changed how you think about what you read? No pressure for praise — even "it's fine but I wish it did X" is useful.
>
> I'll use it on the landing page (with your permission). First name only.
>
> Thanks,
> [your name]

---

## Conversion Email (Send to users with 3+ reflections, week 2)

> Subject: You've reflected [X] times
>
> Most people who try Distill write one reflection and stop. You've written [X].
>
> That means you have a growing library of your own thinking. It compounds over time — especially when past reflections resurface and you see how your perspective has evolved.
>
> Free tier: 10 deep sessions/month. If you want unlimited: [upgrade link]
>
> No pressure. The free tier is real — it stays free.

---

## Newsletter Pitch Template (Week 3)

> Subject: Distill — the anti-AI reading tool
>
> Hey [name],
>
> I read your newsletter regularly. [Specific reference to a recent issue.]
>
> I built Distill, a tool where you write a short reflection after reading/watching/listening to something. No AI summaries, no second brain complexity. Just: what did you think?
>
> Your reflections resurface at intervals so your thinking compounds.
>
> Would it be a fit for [newsletter name]? Happy to write a guest piece on [specific topic relevant to their audience] if that works better than a feature.
>
> [your name]
> distillwise.com

---

## Risk Mitigation

### Risk 1: Product Hunt flop (< 30 upvotes)

**Mitigation (before):**

- Recruit a hunter with 500+ followers (dramatically increases visibility).
- Have 10+ genuine users ready to comment (PH algorithm weights comments heavily).
- Post maker comment immediately when listing goes live.
- Share the PH link directly (not distillwise.com) on X, email, everywhere — PH algorithm counts referral traffic.

**Recovery (after):**

- Do NOT delete the listing or try to relaunch. You only get one shot per product.
- Shift focus to Show HN (completely independent audience).
- Write an honest "I launched on Product Hunt and here's what happened" post on IndieHackers or X. Vulnerability posts often get more traction than the launch itself.
- Redirect energy to SEO content (long-term, compounding) and newsletter pitches (higher conversion per impression).

### Risk 2: Hacker News no traction (< 5 points)

**Mitigation (before):**

- Title must differentiate: "Show HN: Distill — A thinking tool for people who read" — "thinking tool" is unusual enough to generate curiosity.
- Post between 8am-10am ET on a weekday (peak HN traffic).
- Post body must be technical and honest. Include tech stack. Ask genuine questions.
- Do NOT ask anyone to upvote. HN detects vote rings and will kill the post.

**Recovery (after):**

- HN is unpredictable. Many successful products were ignored on their first Show HN.
- Wait 3-6 months, ship significant new features, and post again with a different angle.
- Comment thoughtfully on HN threads about reading, retention, information overload. Over time, people check your profile and find Distill.

### Risk 3: Zero Pro conversions in first month

**Mitigation (before):**

- Ensure upgrade prompt is clear and non-annoying at session 2/3 (FREE_TIER_NUDGE = 2).
- Make spaced resurfacing a Pro-only feature that free users can SEE but not USE. Show a locked "Your reflection from 3 weeks ago" card with "Upgrade to unlock resurfacing."
- Price Pro at $8/month or $72/year (30% annual discount). Low enough to be impulse.

**Recovery (after):**

- If 0 conversions after 30 days with 100+ users: problem is either (a) users don't reach the limit or (b) they don't care enough to pay.
- Survey users at 8+ reflections: "What would make this worth paying for?"
- Consider reducing free tier to 5 reflections/month (only if data shows users value the product but 10 is enough).
- Consider adding a 14-day Pro trial for new users, then drop to free tier.

### Risk 4: Launch day technical failure

**Mitigation (before):**

- Convex handles scaling automatically (serverless). No database scaling needed.
- Clerk free tier supports 10,000 MAU. Verify you're not near the limit.
- Vercel handles traffic spikes. Verify you're on the right plan.
- Test the full signup → session → reflection flow 5+ times on the morning of launch.

**Recovery (during):**

- If signups fail: temporarily remove email verification (Clerk setting) to reduce friction.
- If reflections fail to save: check Convex dashboard for function errors. Redeploy (Convex deploys are instant).
- If site goes down: post update on X every 30 minutes until resolved.
- Have the pre-written "things are breaking" tweet ready to post immediately.

---

## Sustainable Cadence (After Week 4)

Once the launch energy fades, settle into a rhythm:

**Daily (15 min):**

- Check PostHog for errors or drop-offs
- Reply to any DMs, emails, or social mentions

**Weekly (2-3 hours):**

- Publish 1 blog post from the editorial calendar
- Post 3x on X (thinking-provocation content, not product features)
- Review Search Console for new keyword opportunities

**Monthly (2-3 hours):**

- Cohort analysis: retention, conversion, engagement trends
- Update landing page with fresh testimonials
- Evaluate what's working and cut what isn't

---

## Key Principles

1. **Genuine engagement over growth hacking.** Comment on threads because you have something to say about reading and retention. The product sells itself to people who have the problem.

2. **Transparency over polish.** "Solo founder, bootstrapped, built this for myself" resonates more than a polished brand story. Share real numbers. Admit what's broken.

3. **Content compounds, launches don't.** Product Hunt gives you one day. Blog posts and programmatic SEO pages give you years of organic traffic. Allocate 30% to launch events, 70% to content.

4. **One metric matters in month 1: reflections written.** Not signups. Not page views. Reflections written. If someone writes a reflection, they experienced the product. If they don't, nothing else matters.

5. **Copy rules apply everywhere.** No praise ("Amazing tool!"), no medical claims ("reduces anxiety"), no hustle culture ("10x your learning"). Identity framing only: "a thinking tool for people who read."
