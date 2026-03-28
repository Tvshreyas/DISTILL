"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Shuffle, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { REFLECTION_PROMPTS } from "@/lib/prompts";

export default function StartPage() {
  const router = useRouter();
  const [promptIndex, setPromptIndex] = useState(
    Math.floor(Math.random() * REFLECTION_PROMPTS.length),
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const prompt = REFLECTION_PROMPTS[promptIndex];

  function handleShufflePrompt() {
    setPromptIndex((prev) => (prev + 1) % REFLECTION_PROMPTS.length);
  }

  function handleSaveAndSignUp() {
    if (!content.trim()) return;

    // Save to localStorage for migration post-signup
    const onboardingPayload = {
      title: title.trim() || "First Reflection",
      contentType: "other",
      content: content.trim(),
      promptUsed: prompt,
      thinkingShiftRating: 3, // Default for quick start
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "distill_onboarding",
      JSON.stringify(onboardingPayload),
    );
    router.push("/sign-up");
  }

  return (
    <div className="min-h-screen bg-warm-bg font-sans relative overflow-x-hidden">
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-24 relative">
        {/* Simple navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-text hover:text-soft-black transition-colors mb-16"
        >
          <ArrowLeft className="w-3 h-3" /> back home
        </Link>

        <header className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-peach/10 border border-peach/20 text-[10px] font-bold uppercase tracking-widest text-peach">
            <Zap className="w-3 h-3 fill-current" /> Fast Start
          </div>
          <h1 className="font-grotesk text-5xl md:text-7xl font-black lowercase tracking-tighter leading-[0.85] text-soft-black">
            distill your
            <br />
            first thought.
          </h1>
          <p className="font-serif italic text-xl text-muted-text max-w-lg">
            &ldquo;Knowledge is not what you consume. It is what you
            remember.&rdquo;
          </p>
        </header>

        <div className="space-y-8">
          {/* Section 1: Context */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-text block">
              what are you thinking about? (e.g. A book, a meeting, a life
              event)
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The context of this reflection..."
              maxLength={120}
              className="w-full bg-transparent border-b-4 border-soft-black/10 focus:border-soft-black outline-none py-4 text-2xl font-black tracking-tight transition-all placeholder:text-soft-black/5"
            />
          </div>

          {/* Section 2: Content */}
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase font-black tracking-widest text-muted-text">
                  prompt
                </span>
                <button
                  onClick={handleShufflePrompt}
                  className="p-1 px-2 rounded-md bg-soft-black/5 hover:bg-peach/20 transition-all flex items-center gap-1.5 text-[9px] uppercase font-black tracking-widest text-muted-text hover:text-soft-black"
                >
                  <Shuffle className="w-3 h-3" /> shuffle
                </button>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-text">
                {content.length} / 800
              </p>
            </div>

            <p className="font-grotesk text-2xl font-black lowercase tracking-tighter text-soft-black leading-tight">
              {prompt}
            </p>

            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="pour your thoughts here..."
                maxLength={800}
                className="w-full h-80 p-8 rounded-3xl bg-white brutal-border border-4 border-soft-black text-xl font-medium placeholder:text-soft-black/5 outline-none focus:bg-white/80 transition-all resize-none shadow-brutal hover:shadow-brutal-lg"
                autoFocus
              />
            </div>
          </div>

          {/* Action */}
          <div className="pt-10 flex flex-col md:flex-row items-center gap-8">
            <button
              onClick={handleSaveAndSignUp}
              disabled={!content.trim()}
              className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-soft-black text-white rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-20 disabled:scale-100 group shadow-brutal-lg"
            >
              Preserve in Library
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs font-bold text-muted-text flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-peach" />
              Builds your Archive of Thought instantly.
            </p>
          </div>
        </div>

        {/* Footer text */}
        <footer className="mt-24 border-t border-soft-black/5 pt-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-text text-center italic">
            * Once saved, this thought will be resurfaced in 3 days.
          </p>
        </footer>
      </main>
    </div>
  );
}
