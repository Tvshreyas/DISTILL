# Distill 🧠

Distill helps you develop your own perspective on the content you consume. It intentionally slows down the consumption loop, forcing you to capture your actual thinking after every book, video, or article.

## 🚀 Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org)
- **Database**: [Convex](https://convex.dev) (Real-time, TypeScript-first)
- **Auth**: [Clerk](https://clerk.com)
- **Payments**: [Stripe](https://stripe.com)
- **Styling**: Tailwind CSS (Neo-Brutalist Theme)
- **Monitoring**: Sentry & PostHog

## 🛠️ Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env.local` and fill in your keys for Convex, Clerk, and Stripe.

3. **Convex Backend**:
   ```bash
   npx convex dev
   ```

4. **Next.js Frontend**:
   ```bash
   npm run dev
   ```

## 🧪 Testing

Distill maintains a strict 100% pass rate for its 300+ tests.

- **Unit/Integration Tests**: `npm test`
- **E2E (Playwright)**: `npx playwright test`

## 🔒 Security & Architecture

- **Rate Limiting**: Custom token-bucket middleware for all API routes.
- **Sanitization**: Strict input scrubbing to prevent injection.
- **PWA**: Fully offline-capable manifest and service worker.
- **Legal**: Hardened account deletion and mandatory medical disclaimers.

## 🚢 Deployment

- **Frontend**: Deploy to [Vercel](https://vercel.com).
- **Backend**: Deploy to [Convex Prod](https://dashboard.convex.cloud).
- **Crons**: Ensure Convex cron jobs are active for auto-abandoning stale sessions and monthly counts reset.

---
Built for the intentional thinker.
