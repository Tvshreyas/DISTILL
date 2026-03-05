import Link from "next/link";

export const dynamic = "force-static";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: February 2026</p>

        <div className="space-y-8 text-gray-700 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-black mb-2">
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
            <h2 className="text-lg font-semibold text-black mb-2">
              Data We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Email address</strong> — used for authentication only.
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
            <h2 className="text-lg font-semibold text-black mb-2">
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
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">
              What We Never Do
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Your reflections are never used for AI training.</strong>{" "}
                Not by us. Not by any third party. Not ever.
              </li>
              <li>
                <strong>
                  Your data is never shared with third parties
                </strong>{" "}
                for marketing, advertising, or any other purpose.
              </li>
              <li>
                <strong>
                  Your reflection content is never logged
                </strong>{" "}
                in server logs or error tracking systems.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">
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
            <h2 className="text-lg font-semibold text-black mb-2">
              Your Rights (GDPR)
            </h2>
            <p className="mb-2">
              If you are in the EU/EEA, you have the following rights:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Right to access</strong> — Export all your data at any
                time from Settings.
              </li>
              <li>
                <strong>Right to deletion</strong> — Delete your account from
                Settings. All data is purged within 30 days.
              </li>
              <li>
                <strong>Right to portability</strong> — Your data export is in
                human-readable JSON format.
              </li>
              <li>
                <strong>Right to rectification</strong> — Edit any reflection at
                any time from your library.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">
              Cookies
            </h2>
            <p>
              Distill uses functional cookies only for authentication. We do not
              use tracking cookies, advertising cookies, or analytics cookies
              that track your browsing behaviour across sites.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">
              Contact
            </h2>
            <p>
              For any privacy-related questions or to exercise your rights,
              email us at{" "}
              <a
                href="mailto:privacy@distill.app"
                className="text-black underline underline-offset-2"
              >
                privacy@distill.app
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-black underline-offset-2 hover:underline"
          >
            Back to Distill
          </Link>
        </div>
      </div>
    </main>
  );
}
