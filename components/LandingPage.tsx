"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { MagnetizeButton } from "@/components/ui/magnetize-button";
import { CreativePricingDemo } from "@/components/ui/pricing-demo";
import { WordReveal } from "@/components/ui/word-reveal";
import { AppPreview } from "@/components/ui/app-preview";
import { ZenParticles } from "@/components/ui/zen-particles";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen font-sans selection:bg-peach selection:text-soft-black">
      <GrainOverlay />

      <main>
        <Header />
        <Hero />
        <SlantedMarquee />
        <div id="features" /> {/* Anchor for navigation */}
        <BentoGrid />
        <CreativePricingDemo />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}

function GrainOverlay() {
  return <div className="grain-overlay" />;
}

function Header() {
  return (
    <header className="px-6 pt-6 pb-0 flex items-center justify-between max-w-6xl mx-auto w-full relative z-[60]">
      <div className="flex items-center gap-3">
        {/* Swishy-inspired Dot Logo */}
        <div className="grid grid-cols-3 gap-1 w-6 h-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-soft-black" />
          ))}
        </div>
        <span className="font-grotesk font-black text-2xl tracking-tight lowercase">
          distill
        </span>
      </div>

      {/* Keeping a minimal link to sign in so users aren't stranded */}
      <Link
        href="/sign-in"
        className="text-sm font-bold uppercase tracking-widest hover:text-peach transition-colors"
      >
        log in
      </Link>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-10 md:pt-12 pb-20 px-6 overflow-hidden">
      <ZenParticles />

      {/* Massive Background Watermark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-20 opacity-[0.04] select-none pointer-events-none"
        aria-hidden="true"
      >
        <span className="text-[50vw] font-grotesk font-black text-soft-black leading-none block">
          D
        </span>
      </div>

      {/* Background Blobs */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-[10%] w-[500px] h-[500px] bg-sage/30 rounded-full blur-[120px] -z-10"
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 right-[10%] w-[600px] h-[600px] bg-lavender/30 rounded-full blur-[140px] -z-10"
      />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="space-y-4 mb-12">
          <h1 className="flex flex-col items-center">
            <WordReveal
              text="think more clearly"
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tighter"
            />
            <div className="flex items-center justify-center -mt-1 md:-mt-2">
              <span className="font-reenie text-4xl md:text-6xl text-peach inline-block rotate-[-4deg] px-4 md:px-8 -translate-y-1">
                about
              </span>
              <WordReveal
                text="what you consume."
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tighter"
                delay={0.5}
              />
            </div>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl mx-auto text-base md:text-lg text-muted-text font-medium leading-relaxed opacity-80"
          >
            the 2-minute thinking ritual. convert passive consumption into
            active thinking,{" "}
            <span className="font-black text-soft-black">so you can</span>{" "}
            finally own your own perspective.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4"
          >
            <MagnetizeButton asChild className="w-full sm:w-auto">
              <Link href="/start" className="text-lg px-10 py-4">
                start distilling
              </Link>
            </MagnetizeButton>
            <Link
              href="#features"
              className="px-10 py-4 rounded-full font-bold border-2 border-soft-black/5 hover:border-soft-black/20 hover:bg-white transition-all w-full sm:w-auto"
            >
              how it works
            </Link>
          </motion.div>
        </div>

        <AppPreview />

        <Sticker
          label="unplug"
          icon="🔌"
          className="top-[10%] left-2 rotate-[-12deg] hidden xl:block"
        />
        <Sticker
          label="breathe"
          icon="✨"
          className="top-[15%] right-2 rotate-[8deg] hidden xl:block"
        />
        <Sticker
          label="compounds"
          icon="📈"
          className="bottom-[40%] left-10 rotate-[15deg] hidden xl:block"
        />
        <Sticker
          label="archive"
          icon="🗄️"
          className="bottom-[20%] right-10 rotate-[-8deg] hidden xl:block"
        />
      </div>
    </section>
  );
}

function Sticker({
  label,
  icon,
  className,
}: {
  label: string;
  icon: string;
  className?: string;
}) {
  return (
    <motion.div
      animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute z-10 px-4 py-2 bg-white brutal-border brutal-shadow-sm rounded-full flex items-center gap-2 select-none ${className}`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-grotesk font-bold text-xs lowercase">{label}</span>
    </motion.div>
  );
}

function SlantedMarquee() {
  return (
    <div
      className="relative py-12 -rotate-1 scale-105 overflow-hidden z-20"
      aria-hidden="true"
    >
      <div className="bg-soft-black py-4 border-y-[4px] border-white flex">
        <div className="flex animate-marquee whitespace-nowrap">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              <span className="text-4xl md:text-6xl font-grotesk font-black text-white uppercase tracking-tighter">
                distill your presence
              </span>
              <span className="w-12 h-1 md:w-20 md:h-1.5 bg-sage rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BentoGrid() {
  return (
    <section
      id="features"
      className="py-32 px-6 bg-white/30 relative"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto space-y-24">
        <header className="max-w-2xl">
          <h2
            id="features-heading"
            className="font-grotesk text-5xl font-bold leading-none lowercase"
          >
            built for <br />
            <span className="text-peach">intentional</span> focus.
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <BentoCard
            className="md:col-span-7 bg-sage"
            title="session starts"
            description="open a cognitive loop before you consume. Distill creates a space for your brain to stay active."
            label="01"
          />
          <BentoCard
            className="md:col-span-5 bg-lavender"
            title="reflection capture"
            description="write your own perspective immediately after finishing. no AI summaries, just your raw thoughts."
            label="02"
          />
          <BentoCard
            className="md:col-span-5 bg-white"
            title="personal library"
            description="a searchable, private archive of your own mind that compounds and grows with every session."
            label="03"
          />
          <BentoCard
            className="md:col-span-7 bg-peach"
            title="spaced resurfacing"
            description="your past reflections resurface at timed intervals, forcing you to engage with your former self."
            label="04"
          />
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  className,
  title,
  description,
  label,
}: {
  className: string;
  title: string;
  description: string;
  label: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`p-8 rounded-[3rem] brutal-border brutal-shadow min-h-[320px] flex flex-col justify-between group hover:-translate-y-1 transition-transform ${className}`}
    >
      <div className="flex justify-between items-start">
        <span
          className="font-grotesk font-bold text-4xl leading-none opacity-20"
          aria-hidden="true"
        >
          {label}
        </span>
        <div
          className="w-12 h-12 rounded-full border border-soft-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        >
          &rarr;
        </div>
      </div>
      <div>
        <h3 className="font-grotesk text-3xl font-bold mb-3 lowercase">
          {title}
        </h3>
        <p className="text-muted-text font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

function FAQ() {
  return (
    <section className="py-32 px-6" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto space-y-12">
        <h2
          id="faq-heading"
          className="font-grotesk text-4xl font-bold text-center lowercase"
        >
          questions you might have
        </h2>
        <div className="space-y-4">
          <FAQItem
            question="is this just another journaling app?"
            answer="not quite. distill is a thinking development tool. it helps you build a reflection habit and develop your own perspective on what you consume."
          />
          <FAQItem
            question="how does it help with focus?"
            answer="by providing a high-contrast interface that encourages active thinking, helping you engage with content instead of just scrolling past it."
          />
          <FAQItem
            question="can i export my thoughts?"
            answer="yes, your perspectives are yours. you can export them as clean markdown or json at any time."
          />
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <details
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
      className="group brutal-card bg-white p-0 overflow-hidden cursor-pointer"
    >
      <summary className="p-8 flex items-center justify-between font-bold text-lg list-none font-grotesk lowercase">
        <span>{question}</span>
        <span
          className={`w-8 h-8 rounded-full bg-sage/50 flex items-center justify-center transition-transform ${isOpen ? "rotate-45" : ""}`}
        >
          +
        </span>
      </summary>
      <div className="px-8 pb-8 text-muted-text font-medium leading-relaxed">
        {answer}
      </div>
    </details>
  );
}

function FinalCTA() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 bg-peach/20 -z-10" />
      <div className="max-w-5xl mx-auto text-center space-y-12">
        <h2 className="font-grotesk text-7xl md:text-9xl font-bold lowercase leading-tight">
          you are not <br />
          an algorithm.
        </h2>
        <div className="pt-8">
          <Link
            href="/sign-up"
            className="brutal-btn bg-soft-black text-white text-xl px-12 py-5"
          >
            start reflecting &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="pt-32 pb-12 px-6 bg-white border-t-8 border-soft-black overflow-hidden relative">
      <div
        className="absolute -bottom-10 left-0 w-full opacity-[0.03] select-none pointer-events-none"
        aria-hidden="true"
      >
        <span className="text-[20vw] font-grotesk font-black uppercase text-soft-black whitespace-nowrap block">
          distill distill distill distill
        </span>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
        <div className="col-span-2 md:col-span-1 space-y-6">
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-3 gap-1 w-5 h-5">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-soft-black" />
              ))}
            </div>
            <span className="font-grotesk text-2xl font-bold lowercase">
              distill
            </span>
          </div>
          <p className="text-sm text-muted-text max-w-xs leading-relaxed">
            the 2-minute thinking ritual. think more clearly about what you
            consume.
          </p>
        </div>
        <div>
          <ul className="space-y-3 text-sm text-muted-text font-medium">
            <li>
              <Link href="#features">features</Link>
            </li>
            <li>
              <Link href="/blog">blog</Link>
            </li>
            <li>
              <Link href="/dashboard">web app</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-grotesk font-bold mb-6 lowercase">company</h4>
          <ul className="space-y-3 text-sm text-muted-text font-medium">
            <li>
              <Link href="/terms">terms</Link>
            </li>
            <li>
              <Link href="/privacy">privacy</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-grotesk font-bold mb-6 lowercase">connect</h4>
          <ul className="space-y-3 text-sm text-muted-text font-medium">
            <li>
              <Link
                href="https://x.com/distillapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                twitter
              </Link>
            </li>
            <li>
              <Link
                href="https://instagram.com/distillapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                instagram
              </Link>
            </li>
            <li>
              <Link href="mailto:hello@distillwise.com">email</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-20 p-8 rounded-[2rem] border-2 border-soft-black/20 bg-sage/5">
        <p className="text-xs text-muted-text font-medium leading-relaxed italic text-center max-w-4xl mx-auto">
          distill is a thinking development and reflection tool. it is NOT a
          medical device and is NOT intended to diagnose, treat, cure, or
          prevent anxiety, digital addiction, attention disorders, or any other
          medical or psychological condition. users experiencing mental health
          difficulties should consult a qualified healthcare professional.
        </p>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-soft-black/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-muted-text font-bold uppercase tracking-widest relative z-10">
        <span>&copy; 2026 distill. all rights reserved.</span>
        <div className="flex gap-8">
          <span>built in public</span>
          <span>privacy first</span>
        </div>
      </div>
    </footer>
  );
}
