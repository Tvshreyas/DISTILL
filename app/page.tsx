"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/* ─── Animation config ─── */
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

/* ─── Data ─── */
const PROBLEMS = [
  {
    quote:
      "I have 47 books saved. I couldn\u2019t tell you what I actually think about any of them.",
  },
  {
    quote:
      "I watch productivity videos for hours. Then I open a blank doc and have nothing to say.",
  },
  {
    quote:
      "When someone asks my opinion I realise I\u2019m just repeating what the creator said.",
  },
];

const STEPS = [
  { n: "1", text: "Start a session before you consume." },
  {
    n: "2",
    text: "When you finish \u2014 write what you actually think. Not a summary. Your perspective.",
  },
  {
    n: "3",
    text: "Your thoughts compound. In 90 days, your past self\u2019s thinking finds you again.",
  },
];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited reflections",
  "Add layers to past thoughts",
  "Weekly digest",
  "Export everything",
  "Streak freeze",
];

/* ─── Page ─── */
export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* ── Atmospheric background ── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[120%] h-[65%] rounded-full bg-amber-500/[0.04] blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[55%] h-[45%] rounded-full bg-amber-500/[0.025] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.035] grain-bg" />
      </div>

      <div className="relative z-10">
        {/* ── Nav ── */}
        <nav className="px-8 sm:px-6 py-7 flex items-center justify-between max-w-5xl mx-auto w-full">
          <span className="font-serif text-2xl font-semibold tracking-tight">Distill</span>
          <Link
            href="/sign-in"
            className="text-sm text-gray-500 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-colors duration-300"
          >
            Sign in
          </Link>
        </nav>

        {/* ── Hero ── */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={heroContainer}
          className="px-8 sm:px-6 pt-36 sm:pt-44 pb-32 sm:pb-40 max-w-4xl mx-auto text-center"
        >
          <motion.h1 variants={heroItem}>
            <span className="block font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1]">
              You&apos;ve consumed a lot.
            </span>
            <span className="block font-serif italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1] mt-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              How much of it became yours?
            </span>
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="mt-10 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Distill helps you write what you actually think &mdash; right after
            you finish a book, video, or article.
          </motion.p>

          <motion.div variants={heroItem} className="mt-16">
            <motion.a
              href="/onboarding"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block bg-amber-500 text-black px-10 py-4 rounded-2xl font-semibold text-base hover:bg-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30"
            >
              Start for free
            </motion.a>
          </motion.div>

          <motion.p variants={heroItem} className="mt-6 text-sm text-gray-600">
            Free to start &middot; &#x20B9;249/month in India &middot;
            $8/month everywhere else
          </motion.p>
        </motion.section>

        {/* ── Problem — "Sound familiar?" ── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="px-8 sm:px-6 py-32 sm:py-40 max-w-5xl mx-auto"
        >
          <motion.h2
            variants={staggerItem}
            className="font-serif text-3xl sm:text-4xl text-center mb-20 tracking-tight"
          >
            Sound familiar?
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {PROBLEMS.map((item, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="border border-white/[0.08] rounded-2xl p-8 min-h-[160px] bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-500"
              >
                <span className="block text-4xl text-amber-500/40 font-serif leading-none select-none">
                  &ldquo;
                </span>
                <p className="text-gray-300 text-[15px] leading-relaxed italic mt-2">
                  {item.quote}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Insight ── */}
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease }}
          className="px-8 sm:px-6 py-32 sm:py-40 max-w-2xl mx-auto text-center"
        >
          <div className="w-12 h-px bg-amber-500/40 mx-auto mb-10" />
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight mb-10 leading-[1.2]">
            The problem isn&apos;t how much you consume.
          </h2>
          <p className="text-gray-400 text-lg leading-[1.85]">
            The problem is the 5 minutes after. When the video ends, the book
            closes &mdash; your brain is full of someone else&apos;s ideas and
            you move immediately to the next thing. That window is the most
            valuable moment in the whole experience. Almost everyone wastes it.
          </p>
        </motion.section>

        {/* ── Product preview ── */}
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease }}
          className="px-8 sm:px-6 py-28 sm:py-36 max-w-3xl mx-auto text-center"
        >
          <div className="aspect-video max-w-2xl mx-auto bg-white/[0.02] border border-white/[0.08] rounded-3xl flex items-center justify-center backdrop-blur-xl">
            <div className="text-center space-y-4">
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="w-16 h-16 mx-auto rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-white/[0.08]"
              >
                <svg
                  className="w-6 h-6 text-gray-500 ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </motion.div>
              <p className="text-sm text-gray-600">
                Screen recording coming soon
              </p>
            </div>
          </div>
          <p className="mt-10 text-gray-400 text-lg font-serif italic">
            3 minutes. Your perspective. Saved permanently.
          </p>
        </motion.section>

        {/* ── How it works ── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="px-8 sm:px-6 py-32 sm:py-40 max-w-3xl mx-auto"
        >
          <motion.h2
            variants={staggerItem}
            className="font-serif text-3xl sm:text-4xl text-center mb-24 tracking-tight"
          >
            How it works
          </motion.h2>

          <motion.div
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.18 } },
            }}
            className="space-y-16"
          >
            {STEPS.map((step) => (
              <motion.div
                key={step.n}
                variants={staggerItem}
                className="flex gap-8 items-start"
              >
                <span className="shrink-0 w-11 h-11 rounded-full bg-amber-500 text-black flex items-center justify-center font-semibold text-sm">
                  {step.n}
                </span>
                <p className="text-gray-300 text-lg leading-relaxed pt-2">
                  {step.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Compounding argument ── */}
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease }}
          className="px-8 sm:px-6 py-32 sm:py-40 max-w-2xl mx-auto text-center"
        >
          <div className="w-12 h-px bg-amber-500/40 mx-auto mb-10" />
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight mb-10 leading-[1.2]">
            Your thinking compounds over time.
          </h2>
          <p className="text-gray-400 text-lg leading-[1.85]">
            After 50 reflections you start to see what you actually care about.
            What you keep disagreeing with. What appears across completely
            different things you consume. That pattern is yours. No AI generated
            it. Nobody else has it.
          </p>
        </motion.section>

        {/* ── Pricing ── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="px-8 sm:px-6 py-32 sm:py-40 max-w-4xl mx-auto"
        >
          <motion.h2
            variants={staggerItem}
            className="font-serif text-3xl sm:text-4xl text-center mb-20 tracking-tight"
          >
            Simple pricing.
          </motion.h2>

          <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto items-start">
            {/* Free */}
            <motion.div
              variants={staggerItem}
              className="border border-white/[0.08] rounded-2xl p-8 sm:p-10 bg-white/[0.02] backdrop-blur-xl"
            >
              <h3 className="font-semibold text-lg mb-1 text-white">Free</h3>
              <p className="text-2xl font-bold text-white mb-1">
                &#x20B9;0{" "}
                <span className="text-sm font-normal text-gray-600">/ $0</span>
              </p>
              <p className="text-sm text-gray-600 mb-6">No card required</p>
              <ul className="space-y-4 text-sm text-gray-400 mb-8">
                {["10 reflections per month", "Personal library", "Spaced resurfacing (view only)"].map(
                  (f) => (
                    <li key={f} className="flex gap-3 items-center">
                      <span className="w-1 h-1 rounded-full bg-gray-600 shrink-0" />
                      {f}
                    </li>
                  )
                )}
              </ul>
              <motion.a
                href="/onboarding"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="block text-center border border-white/[0.1] text-white py-3.5 rounded-xl text-sm font-medium hover:bg-white/[0.05] transition-all duration-300"
              >
                Start for free &rarr;
              </motion.a>
            </motion.div>

            {/* Pro */}
            <motion.div
              variants={staggerItem}
              className="relative border border-amber-500/25 rounded-2xl p-8 sm:p-10 bg-amber-500/[0.03] backdrop-blur-xl glow-pulse"
            >
              <span className="absolute -top-3 left-7 bg-amber-500 text-black text-[11px] font-bold px-3 py-1 rounded-full tracking-wide uppercase">
                Best value
              </span>
              <h3 className="font-semibold text-lg mb-1 text-white">Pro</h3>
              <p className="text-sm text-gray-400 mb-6">
                &#x20B9;249/mo in India &middot; $8/mo globally
                <br />
                &#x20B9;1,999/yr &middot; $72/yr &mdash; save 25%
              </p>
              <ul className="space-y-4 text-sm text-gray-300 mb-8">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex gap-3 items-center">
                    <svg
                      className="w-4 h-4 text-amber-500 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <motion.a
                href="/onboarding"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block text-center bg-amber-500 text-black py-3.5 rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all duration-300"
              >
                Get Pro &rarr;
              </motion.a>
            </motion.div>
          </div>

          <motion.p
            variants={staggerItem}
            className="text-center text-sm text-gray-600 mt-8"
          >
            Your reflections are yours permanently. Export anytime. Cancel
            anytime.
          </motion.p>
        </motion.section>

        {/* ── Final CTA ── */}
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease }}
          className="px-8 sm:px-6 py-36 sm:py-44 max-w-3xl mx-auto text-center"
        >
          <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl tracking-tight mb-14 leading-[1.15]">
            Your next thought is worth keeping.
          </h2>
          <motion.a
            href="/onboarding"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block bg-amber-500 text-black px-10 py-4 rounded-2xl font-semibold text-base hover:bg-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30"
          >
            Start for free
          </motion.a>
          <p className="mt-5 text-sm text-gray-600">
            &#x20B9;249/month in India &middot; $8/month globally &middot; Free
            to start
          </p>
        </motion.section>

        {/* ── Footer ── */}
        <footer className="border-t border-white/[0.06] px-8 sm:px-6 py-14 sm:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
              <span className="font-serif text-lg tracking-tight">
                Distill
              </span>
              <div className="flex gap-8 text-sm text-gray-600">
                <a
                  href="/privacy"
                  className="hover:text-gray-300 transition-colors duration-300"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="hover:text-gray-300 transition-colors duration-300"
                >
                  Terms of Service
                </a>
              </div>
              <span className="text-sm text-gray-600">Made by Shreyas</span>
            </div>
            <p className="text-[11px] text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
              Distill is a thinking tool, not a therapeutic or medical
              intervention. It does not diagnose, treat, or prevent any medical,
              psychological, or psychiatric condition. If you are experiencing
              mental health difficulties, please consult a qualified
              professional.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
