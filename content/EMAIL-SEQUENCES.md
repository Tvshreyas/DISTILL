# Email Sequences — Distill

*Created: 2026-03-15*

Three automated sequences to drive activation, retention, and conversion. All copy follows Distill's rules: no praise, no marketing language, no medical claims.

**Existing automated emails (already built):** Resurfacing reminders, streak nudges, weekly summaries.

---

## Sequence 1: Welcome / Onboarding (5 emails, 10 days)

**Trigger:** New user signs up
**Exit conditions:** User unsubscribes, or sequence completes
**Goal:** Get the user to write their first reflection

---

### Email 1: Welcome + First Step
**Send:** Immediately after signup
**Subject:** Your account is ready
**Preview:** Start your first session in under 2 minutes.

> You signed up for Distill. Here's what it does:
>
> 1. Start a session — pick what you're reading, watching, or listening to
> 2. Consume the content (Distill doesn't host anything)
> 3. Write a short reflection — what did you think?
> 4. Your reflections resurface at intervals
>
> That's the entire product. No folders. No tags. No AI.
>
> The best way to understand it is to try it once:
>
> **[Start your first session →]** → /dashboard/session/new
>
> — The Distill team

---

### Email 2: Getting Started
**Send:** Day 1 (24 hours after signup)
**Subject:** The simplest way to start
**Preview:** Think of the last thing you read. That's your first session.
**Condition:** Only send if user has NOT written a reflection yet.

> You don't need to read something new to use Distill.
>
> Think of the last book you read. The last article. The last podcast episode. Anything.
>
> Open Distill. Start a session. Write 2-3 sentences about what you thought. Not a summary — your perspective.
>
> That's it. There's no minimum length and no required format.
>
> **[Start a session →]** → /dashboard/session/new
>
> — The Distill team

---

### Email 3: Why Reflection Matters
**Send:** Day 3
**Subject:** You consume plenty. How much do you keep?
**Preview:** The gap between reading and thinking is where most ideas disappear.

> Most people read 20-50 books a year. Thousands of articles. Hundreds of hours of podcasts.
>
> Ask them what they thought about any of it — not what the author said, but what THEY thought — and the answer is usually nothing.
>
> That gap between consuming and thinking is where your own ideas disappear. You absorb the author's perspective and never form your own.
>
> Distill exists to close that gap. One reflection at a time.
>
> **[Write a reflection →]** → /dashboard/session/new
>
> — The Distill team

---

### Email 4: Feature Highlight — Resurfacing
**Send:** Day 5
**Subject:** Your reflections come back
**Preview:** Past reflections resurface so your thinking compounds.

> Here's something that happens after you've used Distill for a while:
>
> A reflection you wrote 3 weeks ago appears in your dashboard. You read what past-you thought. Sometimes you agree. Sometimes you don't. Either way, you're thinking about it again.
>
> This is spaced resurfacing. Your past thinking comes back at intervals, so it compounds instead of disappearing.
>
> The more reflections you write, the more you have to resurface.
>
> **[Start building your library →]** → /dashboard/session/new
>
> — The Distill team

---

### Email 5: Check-In
**Send:** Day 10
**Subject:** Still here if you want it
**Preview:** No pressure. Distill works when you're ready.
**Condition:** Only send if user has written 0 reflections.

> You signed up for Distill 10 days ago. You haven't written a reflection yet.
>
> That's fine. There's no streak to break, no algorithm to feed, no daily quota.
>
> Whenever you finish reading, watching, or listening to something and want to capture what you thought — Distill is there.
>
> **[Open Distill →]** → /dashboard
>
> — The Distill team

---

## Sequence 2: Re-Engagement (3 emails)

**Trigger:** User has written 1+ reflections but has been inactive for 14+ days
**Exit conditions:** User writes a new reflection, unsubscribes, or sequence completes
**Goal:** Bring inactive users back for one more reflection

---

### Email 1: Check-In
**Send:** Day 14 of inactivity
**Subject:** It's been a while
**Preview:** Your library is waiting.

> You haven't opened Distill in 2 weeks.
>
> Your library has [X] reflection(s) in it. They're still there.
>
> If you've read, watched, or listened to anything recently, consider writing a quick reflection. Even one sentence counts.
>
> **[Open your library →]** → /dashboard/library
>
> — The Distill team

---

### Email 2: Value Reminder
**Send:** Day 21 of inactivity
**Subject:** [X] reflections, waiting
**Preview:** Your past thinking doesn't have to disappear.

> You've written [X] reflections in Distill. That's [X] moments where you stopped consuming and started thinking.
>
> Those reflections are still in your library. They can still resurface. But only if you keep adding to them.
>
> Think of the last thing you read. What did you actually think about it?
>
> **[Write a reflection →]** → /dashboard/session/new
>
> — The Distill team

---

### Email 3: Last Touch
**Send:** Day 30 of inactivity
**Subject:** Your reflections are still here
**Preview:** No pressure. Just letting you know.

> This is the last email you'll get from Distill about coming back.
>
> Your [X] reflections are still in your library. If you want to pick up where you left off, the tool is there. If not, no hard feelings.
>
> You can always unsubscribe from these emails in Settings.
>
> **[Open Distill →]** → /dashboard
>
> — The Distill team

---

## Sequence 3: Free → Pro Upgrade (3 emails)

**Trigger:** User hits 2/3 deep sessions/month free current month (FREE_TIER_NUDGE)
**Exit conditions:** User upgrades to Pro, unsubscribes, or sequence completes
**Goal:** Convert engaged free users to Pro

---

### Email 1: Usage Milestone
**Send:** When user completes their 2nd deep session this month
**Subject:** You've used 2 of 3 deep sessions this month
**Preview:** 1 deep session remaining on the free tier.

> You've completed 2 deep sessions this month. The free tier includes 3 deep sessions per month.
>
> After 3 deep sessions, you'll need to wait until next month — or upgrade to Pro for unlimited deep sessions.
>
> Pro also includes spaced resurfacing and streak tracking.
>
> **[See Pro details →]** → /dashboard/settings
>
> No pressure. The free tier resets on the 1st of every month.
>
> — The Distill team

---

### Email 2: Limit Reached
**Send:** When user hits 10/10 OR on the 1st of the following month (whichever comes first)
**Subject:** Your free reflections reset — or go unlimited
**Preview:** 10 more reflections available, or remove the limit entirely.
**Condition:** Only send if user is still on free tier.

> Your monthly reflection count has reset. You have 10 more reflections available.
>
> Last month you used all 10. That's more active thinking than most people do in a year.
>
> If the limit feels like it's getting in the way, Pro removes it entirely:
>
> - Unlimited reflections
> - Spaced resurfacing (past reflections come back at intervals)
> - Streak tracking
> - $5/month or $36/year
>
> **[Upgrade to Pro →]** → /dashboard/settings
>
> The free tier stays free. Upgrade only if the limit doesn't work for you.
>
> — The Distill team

---

### Email 3: Annual Savings
**Send:** 14 days after upgrading to monthly Pro
**Subject:** Save 40% with annual billing
**Preview:** Switch to annual: $36/year instead of $60/year.
**Condition:** Only send to monthly Pro subscribers.

> You've been on Distill Pro for 2 weeks.
>
> Monthly Pro is $5/month ($60/year). Annual Pro is $36/year — that's 40% less.
>
> You can switch in Settings. Your current billing period will be prorated.
>
> **[Switch to annual →]** → /dashboard/settings
>
> — The Distill team

---

## Implementation Notes

### Stack
- **Email provider:** Resend (already integrated)
- **Templates:** React Email (`lib/email/templates/`)
- **Backend:** Convex actions with `"use node"` runtime
- **Scheduling:** Convex crons + mutation-triggered actions

### New Templates Needed
1. `WelcomeEmail.tsx` — generic template with variable body content (reuse for all 5 welcome emails)
2. `ReEngagementEmail.tsx` — includes reflection count variable
3. `UpgradeEmail.tsx` — includes usage stats and Pro CTA

### Trigger Logic
- **Welcome sequence:** Trigger email 1 on `profiles.create`. Schedule emails 2-5 via Convex scheduled functions. Cancel remaining emails if user writes a reflection (for conditional emails).
- **Re-engagement:** Hourly cron checks for users with `lastActiveAt` > 14 days ago and no re-engagement email sent. Use `notificationLogs` table to prevent duplicates.
- **Upgrade sequence:** Trigger from `reflections.create` mutation when `reflectionCountThisMonth` hits 8. Use profile field to track sequence state.

### Metrics to Track
| Metric | Target |
|---|---|
| Welcome email open rate | 50%+ |
| Welcome sequence → first reflection | 30%+ |
| Re-engagement click rate | 10%+ |
| Re-engagement → returned user | 15%+ |
| Upgrade email → Pro conversion | 5%+ |
| Unsubscribe rate per sequence | < 2% |

### Unsubscribe Handling
All emails use the existing HMAC unsubscribe system (`lib/email/unsubscribe.ts`). Users can also toggle email preferences in Settings.
