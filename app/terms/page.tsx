import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Terms of Service — Distill",
  description:
    "Terms of service for Distill, a thinking development and reflection tool.",
  alternates: { canonical: "https://distillwise.com/terms" },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: February 2026</p>

        <div className="space-y-8 text-gray-700 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-black mb-2">
              1. What Distill Is
            </h2>
            <p>
              Distill is a thinking development and reflection tool. It helps
              you capture and revisit your own perspective on content you
              consume.
            </p>
            <p className="mt-2 p-3 bg-gray-50 rounded text-sm border border-gray-200">
              <strong>Medical disclaimer:</strong> Distill is NOT a medical
              device and is NOT intended to diagnose, treat, cure, or prevent
              anxiety, digital addiction, attention disorders, or any other
              medical or psychological condition. Users experiencing mental
              health difficulties should consult a qualified healthcare
              professional.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">
              2. Your Account
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>You must provide a valid email address to create an account.</li>
              <li>You are responsible for maintaining access to your email for authentication.</li>
              <li>One account per person. Do not share your account.</li>
              <li>You must be at least 13 years old to use Distill.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">
              3. Free and Pro Tiers
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Free plan:</strong> Up to 3 deep sessions per month.
                Personal library. Spaced resurfacing (view only).
              </li>
              <li>
                <strong>Pro plan:</strong> Unlimited reflections. Add layers to
                past thoughts. Weekly digest. Export everything.
              </li>
              <li>
                Free tier limits reset on the 1st of each month.
              </li>
              <li>
                We reserve the right to modify tier limits with 30 days notice.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">
              4. Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Use Distill to store or transmit illegal content.</li>
              <li>Attempt to access other users&apos; data.</li>
              <li>Abuse the API or circumvent usage limits.</li>
              <li>Use automated tools to create accounts or reflections.</li>
              <li>Reverse engineer, decompile, or disassemble the service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">
              5. Your Content
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                You own everything you write in Distill. We do not claim any
                rights to your reflections or layers.
              </li>
              <li>
                We store your content solely to provide the service to you.
              </li>
              <li>
                Your content is never used for AI training, never shared with
                third parties, and never sold.
              </li>
              <li>
                You can export or delete your data at any time.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">
              6. Payments and Cancellation
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Pro subscriptions are billed monthly or annually via Stripe.
              </li>
              <li>
                You can cancel at any time. Your Pro access continues until the
                end of the current billing period.
              </li>
              <li>
                After cancellation, your account reverts to the Free plan. Your
                data is preserved — nothing is deleted.
              </li>
              <li>
                Refunds are handled on a case-by-case basis. Contact us within
                7 days of a charge.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">
              7. Limitation of Liability
            </h2>
            <p>
              Distill is provided &quot;as is&quot; without warranties of any kind,
              express or implied. We do not guarantee that the service will be
              uninterrupted, secure, or error-free.
            </p>
            <p className="mt-2">
              To the maximum extent permitted by law, Distill and its creators
              shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits or
              data, arising from your use of the service.
            </p>
            <p className="mt-2">
              Our total liability for any claim arising from these terms or
              your use of Distill is limited to the amount you paid us in the
              12 months preceding the claim, or $50, whichever is greater.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">
              8. Changes to Terms
            </h2>
            <p>
              We may update these terms from time to time. We will notify you
              of material changes via the email associated with your account.
              Continued use of Distill after changes take effect constitutes
              acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">
              9. Contact
            </h2>
            <p>
              Questions about these terms? Email us at{" "}
              <a
                href="mailto:legal@distill.app"
                className="text-black underline underline-offset-2"
              >
                legal@distill.app
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
