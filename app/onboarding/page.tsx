"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LazyMotion, m, AnimatePresence, domAnimation } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ShaderAnimation } from "@/components/ui/shader-lines";
import { MagnetizeButton } from "@/components/ui/magnetize-button";
import { ArrowRight, Sparkles, Clock, Layout, Zap } from "lucide-react";

const STEPS = [
  {
    id: "welcome",
    title: "welcome to distill.",
    description: "a digital living room for your thoughts. intentionally slow, tactile, and private.",
    icon: Sparkles,
    accent: "bg-sage",
  },
  {
    id: "how-it-works",
    title: "how it works",
    description: "reflect on what you consume—books, videos, articles. we use spaced repetition to resurface your insights at the perfect moment.",
    icon: Layout,
    accent: "bg-peach",
  },
  {
    id: "setup",
    title: "make it yours",
    description: "we'll sync with your local time to send subtle reminders when you're most receptive.",
    icon: Clock,
    accent: "bg-lavender",
  },
  {
    id: "launch",
    title: "the clarity era",
    description: "you're ready. start your first reflection to anchor your journey.",
    icon: Zap,
    accent: "bg-sage",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const updateProfile = useMutation(api.profiles.update);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timezone, setTimezone] = useState("UTC");

  useEffect(() => {
    // Detect user's timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(tz);
    } catch (e) {
      console.error("Failed to detect timezone", e);
    }
  }, []);

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      // Finalize onboarding
      try {
        await updateProfile({ 
          onboardingCompleted: true,
          timezone: timezone 
        });
        router.push("/dashboard");
      } catch (err: unknown) {
        console.error("Failed to complete onboarding", err);
        if (err instanceof Error && err.message?.includes("Unauthorized")) {
          // If unauthorized, redirect to sign-in with a redirect back to dashboard
          router.push("/sign-in");
        } else {
          setIsSubmitting(false);
        }
      }
    }
  };

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <main className="min-h-screen bg-[#FDFCF8] text-soft-black font-sans relative overflow-hidden flex items-center justify-center p-6 selection:bg-peach selection:text-soft-black">
      {/* Background Shader */}
      <div className="absolute inset-0 opacity-40">
        <ShaderAnimation />
      </div>

      {/* Analog Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.12] mix-blend-multiply bg-[url('https://grain-y.vercel.app/noise.svg')] bg-repeat z-50" />

      <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait">
        <m.div
          key={step.id}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl w-full bg-white/80 backdrop-blur-xl brutal-border border-4 border-soft-black p-10 md:p-16 relative z-10 rounded-[2rem] shadow-[12px_12px_0px_0px_rgba(41,37,36,1)]"
        >
          {/* Progress Indicator */}
          <div className="absolute top-10 left-10 md:left-16 flex gap-2">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i <= currentStep ? "w-8 bg-soft-black" : "w-2 bg-soft-black/20"
                }`}
              />
            ))}
          </div>

          <div className="mt-8 space-y-8">
            <div className={`w-20 h-20 rounded-3xl ${step.accent} flex items-center justify-center brutal-border-sm border-2`}>
              <Icon className="w-10 h-10 text-soft-black" />
            </div>

            <div className="space-y-4">
              <h1 className="font-grotesk text-4xl md:text-5xl font-black lowercase tracking-tighter leading-none">
                {step.title}
              </h1>
              <p className="text-xl md:text-2xl text-muted-text font-medium leading-tight">
                {step.description}
              </p>
              {step.id === "welcome" && (
                <p className="text-[10px] md:text-xs text-muted-text/60 italic font-medium leading-relaxed pt-2 border-t border-soft-black/5">
                  Disclaimer: Distill is a thinking development tool. It is NOT a medical device and is NOT intended to diagnose, treat, cure, or prevent any medical or psychological condition.
                </p>
              )}
            </div>

            {step.id === "setup" && (
              <div className="p-6 bg-lavender/30 rounded-2xl brutal-border-sm border-2 space-y-2">
                <span className="text-xs uppercase font-bold tracking-widest text-soft-black/60">Detected Location</span>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-peach animate-pulse" />
                  <span className="font-mono text-sm font-bold">{timezone}</span>
                </div>
              </div>
            )}

            <div className="pt-8">
              <MagnetizeButton
                onClick={handleNext}
                disabled={isSubmitting}
                className="w-full md:w-auto px-10 py-5 text-xl font-black rounded-2xl"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">launching...</span>
                ) : currentStep === STEPS.length - 1 ? (
                  <span className="flex items-center gap-2">enter distill <Sparkles className="w-6 h-6" /></span>
                ) : (
                  <span className="flex items-center gap-2">continue <ArrowRight className="w-6 h-6" /></span>
                )}
              </MagnetizeButton>
            </div>
          </div>
        </m.div>
      </AnimatePresence>
      </LazyMotion>

      {/* Branding */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 font-grotesk text-sm font-bold opacity-20 tracking-[0.3em] uppercase">
        distillwise.com
      </div>
    </main>
  );
}
