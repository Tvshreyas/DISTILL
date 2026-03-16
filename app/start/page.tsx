"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Shuffle } from "lucide-react";
import Link from "next/link";
import type { ContentType } from "@/types";
import { REFLECTION_PROMPTS } from "@/lib/prompts";

const CONTENT_TYPES: { id: ContentType; label: string }[] = [
  { id: "book", label: "book" },
  { id: "video", label: "video" },
  { id: "article", label: "article" },
  { id: "podcast", label: "podcast" },
  { id: "other", label: "other" },
];

const STEP_TITLES = [
  "what are you consuming?",
  "why are you consuming this?",
  "write your reflection.",
  "how much did your thinking shift?",
];

interface OnboardingData {
  title: string;
  contentType: ContentType;
  consumeReason: string;
  content: string;
  promptUsed: string;
  thinkingShiftRating: number | null;
}

export default function StartPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [promptIndex, setPromptIndex] = useState(
    Math.floor(Math.random() * REFLECTION_PROMPTS.length)
  );
  const [data, setData] = useState<OnboardingData>({
    title: "",
    contentType: "article",
    consumeReason: "",
    content: "",
    promptUsed: REFLECTION_PROMPTS[0],
    thinkingShiftRating: null,
  });

  const prompt = REFLECTION_PROMPTS[promptIndex];

  function handleShufflePrompt() {
    const next = (promptIndex + 1) % REFLECTION_PROMPTS.length;
    setPromptIndex(next);
    setData((d) => ({ ...d, promptUsed: REFLECTION_PROMPTS[next] }));
  }

  function canAdvance(): boolean {
    switch (step) {
      case 0:
        return data.title.trim().length > 0;
      case 1:
        return true; // consumeReason is optional
      case 2:
        return data.content.trim().length > 0 && data.content.length <= 3000;
      case 3:
        return data.thinkingShiftRating !== null;
      default:
        return false;
    }
  }

  function handleNext() {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save to localStorage and redirect to sign-up
      const onboardingPayload = {
        title: data.title,
        contentType: data.contentType,
        consumeReason: data.consumeReason || undefined,
        content: data.content,
        promptUsed: data.promptUsed,
        thinkingShiftRating: data.thinkingShiftRating,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("distill_onboarding", JSON.stringify(onboardingPayload));
      router.push("/sign-up");
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <div className="min-h-screen bg-white font-sans relative">
      <main className="max-w-2xl mx-auto px-6 py-20 relative">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-text hover:text-soft-black transition-colors mb-12"
        >
          <ArrowLeft className="w-3 h-3" /> back
        </Link>

        {/* Progress bar */}
        <div className="flex gap-2 mb-12">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? "bg-soft-black" : "bg-soft-black/10"
              }`}
            />
          ))}
        </div>

        {/* Step title */}
        <h1 className="font-grotesk text-4xl md:text-5xl font-black lowercase tracking-tighter mb-10">
          {STEP_TITLES[step]}
        </h1>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <div className="space-y-8">
                <input
                  value={data.title}
                  onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))}
                  placeholder="title of what you're consuming..."
                  maxLength={200}
                  className="w-full h-16 px-6 rounded-2xl bg-white brutal-border border-4 border-soft-black text-xl font-bold placeholder:text-soft-black/20 outline-none focus:bg-sage/5 transition-all"
                  autoFocus
                />
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-text block">
                    content type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CONTENT_TYPES.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setData((d) => ({ ...d, contentType: type.id }))}
                        className={`px-6 py-3 rounded-full border-4 border-soft-black font-black text-sm transition-all active:scale-95 ${
                          data.contentType === type.id
                            ? "bg-peach text-soft-black brutal-shadow-xs -translate-x-0.5 -translate-y-0.5"
                            : "bg-white text-muted-text hover:bg-peach/10"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <textarea
                  value={data.consumeReason}
                  onChange={(e) => setData((d) => ({ ...d, consumeReason: e.target.value }))}
                  placeholder="what do you hope to get from this? (optional)"
                  maxLength={140}
                  className="w-full h-40 p-6 rounded-2xl bg-white brutal-border border-4 border-soft-black text-lg font-medium placeholder:text-soft-black/20 outline-none focus:bg-sage/5 transition-all resize-none"
                  autoFocus
                />
                <p className="text-xs font-bold text-muted-text text-right">
                  {data.consumeReason.length}/140
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-widest text-muted-text font-black">
                    prompt
                  </span>
                  <button
                    onClick={handleShufflePrompt}
                    className="p-1 px-2 rounded-md bg-soft-black/5 hover:bg-peach/20 transition-all flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-muted-text hover:text-soft-black"
                  >
                    <Shuffle className="w-3 h-3" />
                    shuffle
                  </button>
                </div>
                <p className="font-grotesk text-2xl font-black lowercase tracking-tighter leading-none">
                  {prompt}
                </p>
                <div className="relative">
                  <textarea
                    value={data.content}
                    onChange={(e) => setData((d) => ({ ...d, content: e.target.value }))}
                    placeholder="pour your thoughts here..."
                    maxLength={3000}
                    className="w-full h-64 p-6 rounded-2xl bg-white brutal-border border-4 border-soft-black text-lg font-medium placeholder:text-soft-black/20 outline-none focus:bg-sage/5 transition-all resize-none"
                    autoFocus
                  />
                  <p className="text-xs font-bold text-muted-text text-right mt-2">
                    {data.content.length}/3000
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <p className="text-sm font-black text-muted-text uppercase tracking-widest">
                  how much did your thinking shift?
                </p>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setData((d) => ({ ...d, thinkingShiftRating: n }))}
                      className={`flex-1 py-6 rounded-2xl border-4 border-soft-black font-black text-2xl transition-all active:scale-95 ${
                        data.thinkingShiftRating === n
                          ? "bg-peach text-soft-black brutal-shadow-xs -translate-x-0.5 -translate-y-0.5"
                          : "bg-white text-muted-text hover:bg-peach/10"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs font-bold text-muted-text uppercase tracking-widest">
                  <span>no shift</span>
                  <span>total shift</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-16">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-muted-text hover:text-soft-black transition-all disabled:opacity-0"
          >
            <ArrowLeft className="w-4 h-4" /> back
          </button>

          <button
            onClick={handleNext}
            disabled={!canAdvance()}
            className="flex items-center gap-2 px-8 py-4 bg-soft-black text-white rounded-2xl font-black text-sm disabled:opacity-30 transition-all hover:scale-105 active:scale-95"
          >
            {step === 3 ? "save & sign up" : "next"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
