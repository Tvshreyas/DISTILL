import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Privacy Policy — Distill",
  description:
    "How Distill handles your data. Your reflections are private and encrypted. Read our full privacy policy.",
  alternates: { canonical: "https://distillwise.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-warm-bg">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-text mb-10">
          Last updated: April 2026
        </p>

        <div className="space-y-8 text-soft-black/80 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-soft-black mb-2">
              What Distill Is
            </h2>
            <p>
              Distill is a thinking development and reflection tool. It helps
              you capture your own perspective after consuming content. It is
              NOT a medical device and is NOT intended to diagnose, treat, cure,
              or prevent any medical or psychological condition.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-black mb-2">
              Data We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Email address</strong> — used for authentication and
                service-related emails (resurfacing reminders, streak
                notifications, weekly summaries). You can disable any email type
                from Settings.
              </li>
              <li>
                <strong>Reflection content</strong> — the text you write after
                consuming content. This is the core of what Distill stores.
              </li>
              <li>
                <strong>Session metadata</strong> — content titles, types
                (book/video/article/podcast), and optional reasons you provide.
              </li>
              <li>
                <strong>Usage data</strong> — streak counts, reflection counts,
                and timestamps. Used to power your dashboard.
              </li>
              <li>
                <strong>Payment data</strong> — if you upgrade to Pro, Stripe
                processes your payment. We store only your Stripe customer ID,
                not your card details.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-black mb-2">
              How We Use Your Data
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide and maintain the Distill service.</li>
              <li>
                To resurface your own reflections at intervals (3, 7, 30, 90
                days) so you can revisit your thinking.
              </li>
              <li>To track your streak and reflection counts.</li>
              <li>To process payments via Stripe.</li>
              <li>
                To send service-related emails — resurfacing reminders, streak
                notifications, and weekly summaries. You can disable each type
                individually from Settings.
              </li>
              <li>
                To understand how the product is used via anonymized analytics
                (see Cookies &amp; Analytics below).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-black mb-2">
              What We Never Do
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>
                  Your reflections are never used for AI training.
                </strong>{" "}
                Not by us. Not by any third party. Not ever.
              </li>
              <li>
                <strong>Your data is never shared with third parties</strong>{" "}
                for marketing, advertising, or any other purpose.
              </li>
              <li>
                <strong>
                  We take steps to minimize logging of your reflection content.
                </strong>{" "}
                Error tracking systems receive only error metadata, not
                reflection text.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-black mb-2">
              Data Retention
            </h2>
            <p>
              Your data is stored for as long as your account is active. If you
              delete your account, all data is soft-deleted immediately and
              permanently purged within 30 days. Deleted reflections are also
              purged 30 days after deletion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-black mb-2">
              Your Data Rights
            </h2>
            <p className="mb-2">
              Regardless of where you are located, you have the following
              rights:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Access</strong> — Export all your data at any time from
                Settings.
              </li>
              <li>
                <strong>Deletion</strong> — Delete your account from Settings.
                All data is purged within 30 days.
              </li>
              <li>
                <strong>Portability</strong> — Your data export is in
                human-readable JSON format.
              </li>
              <li>
                <strong>Rectification</strong> — Add layers to any reflection to
                update your thinking, or delete and re-create it.
              </li>
              <li>
                <strong>Withdraw consent</strong> — Disable any non-essential
                processing (analytics, email notifications) from Settings at any
                time.
              </li>
            </ul>
            <p className="mt-2">
              See the Regional Rights section below for jurisdiction-specific
              details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-black mb-2">
              Cookies &amp; Analytics
            </h2>
            <p className="mb-2">
              Distill uses the following cookies and local storage:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Authentication cookies</strong> — set by Clerk to
                maintain your login session. Strictly necessary.
              </li>
              <li>
                <strong>Cookie consent</strong> — remembers whether you
                dismissed the cookie banner. Stored in localStorage.
              </li>
              <li>
                <strong>UTM attribution cookies</strong> — if you arrive via a
                marketing link, we store the source, medium, and campaign name
                for 30 days to understand how you found Distill. These are
                first-party cookies and are not shared with any third party.
              </li>
              <li>
                <strong>Country detection</strong> — your country code (derived
                from your IP by our hosting provider) is stored in a cookie to
                display region-appropriate pricing. Your IP address is not
                stored.
              </li>
              <li>
                <strong>Analytics (PostHog)</strong> — we use PostHog to
                understand how the product is used (page views, feature
                adoption). PostHog runs in identified-only mode — anonymous
                visitors are not tracked. We do not use this data for
                advertising. PostHog does not track your browsing activity
                across other sites.
              </li>
              <li>
                <strong>Error tracking (Sentry)</strong> — we use Sentry to
                detect and fix bugs. Sentry receives error metadata (error type,
                URL, browser info) but not your reflection content.
              </li>
            </ul>
            <p className="mt-2">
              We do not use advertising cookies, retargeting pixels, or any
              tracking that follows you across other websites.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-black mb-2">
              Sub-Processors
            </h2>
            <p className="mb-2">
              We use the following third-party services to operate Distill:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Convex</strong> — database and backend (stores your
                reflections, sessions, and profile data).
              </li>
              <li>
                <strong>Clerk</strong> — authentication (manages your login and
                email verification).
              </li>
              <li>
                <strong>Stripe</strong> — payment processing (handles Pro
                subscription billing).
              </li>
              <li>
                <strong>Resend</strong> — transactional email delivery (sends
                resurfacing reminders, streak notifications, and weekly
                summaries).
              </li>
              <li>
                <strong>Vercel</strong> — hosting and content delivery.
              </li>
              <li>
                <strong>PostHog</strong> — product analytics.
              </li>
              <li>
                <strong>Sentry</strong> — error monitoring.
              </li>
            </ul>
            <p className="mt-2">
              Distill is operated from India. Our sub-processors store and
              process data primarily in the United States. By using Distill, you
              consent to the transfer of your data to these locations. All
              sub-processors maintain industry-standard security practices and
              data protection measures.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-black mb-2">
              Regional Rights
            </h2>
            <p className="mb-2 font-medium text-soft-black">India (DPDP Act)</p>
            <p className="mb-3">
              If you are in India, you have the right to access, correct, and
              erase your personal data. You may withdraw consent for
              non-essential data processing at any time. Distill does not
              process data of users known to be under 18 without verifiable
              parental consent. To exercise your rights, email us at the address
              below.
            </p>
            <p className="mb-2 font-medium text-soft-black">EU/EEA (GDPR)</p>
            <p className="mb-3">
              If you are in the EU/EEA, the legal basis for processing your data
              is (a) contract performance (providing the service you signed up
              for), (b) legitimate interest (analytics and error tracking to
              improve the product), and (c) consent (marketing emails, which you
              can disable from Settings). You may exercise your rights to
              access, portability, deletion, and rectification as described
              above.
            </p>
            <p className="mb-2 font-medium text-soft-black">
              California (CCPA)
            </p>
            <p>
              Distill does not sell your personal information. We do not share
              your data with third parties for their own marketing purposes. You
              have the right to know what data we collect, request deletion, and
              opt out of any future sale (though we have nothing to opt out of).
              To exercise these rights, email us at the address below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-black mb-2">
              Contact
            </h2>
            <p>
              For any privacy-related questions or to exercise your rights,
              email us at{" "}
              <a
                href="mailto:hello@distillwise.com"
                className="text-soft-black underline underline-offset-2"
              >
                hello@distillwise.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-soft-black/10">
          <Link
            href="/"
            className="text-sm text-muted-text hover:text-soft-black underline-offset-2 hover:underline"
          >
            Back to Distill
          </Link>
        </div>
      </div>
    </main>
  );
}
