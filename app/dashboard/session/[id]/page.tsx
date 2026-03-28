"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";
import ReflectionCapture from "@/components/ReflectionCapture";
import SessionSuccessOverlay from "@/components/SessionSuccessOverlay";
import Link from "next/link";

const MILESTONE_MESSAGES: Record<number, string> = {
  1: "Your first reflection. The journey begins.",
  3: "3 reflections. You're finding your rhythm.",
  10: "10 reflections. You're building a real habit.",
  50: "50 reflections. Your library is growing.",
  100: "100 reflections. A century of your own thinking.",
};

export default function ActiveSessionPage() {
  const { id } = useParams();
  const router = useRouter();
  const session = useQuery(api.sessions.getById, {
    sessionId: id as Id<"sessions">,
  });
  const completeSession = useMutation(api.reflections.create);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastWordCount, setLastWordCount] = useState(0);

  if (session === undefined)
    return (
      <div className="p-8 text-muted-text animate-pulse text-center">
        Loading session...
      </div>
    );
  if (!session)
    return (
      <div className="p-8 text-muted-text text-center">Session not found.</div>
    );

  async function handleComplete(content: string, rating: number | null) {
    setIsSubmitting(true);
    try {
      const result = await completeSession({
        sessionId: id as Id<"sessions">,
        content,
        thinkingShiftRating: rating || undefined,
      });

      if (result?.milestoneReached) {
        const msg =
          MILESTONE_MESSAGES[result.milestoneReached] ??
          `Milestone reached: ${result.milestoneReached} reflections.`;
        toast.success(msg, { duration: 6000 });
      }

      setLastWordCount(result.wordCount ?? 0);
      setShowSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
      setIsSubmitting(false);
    }
  }

  function handleSuccessComplete() {
    router.push("/dashboard");
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-20 relative">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-text hover:text-soft-black transition-colors"
      >
        &larr; Dashboard
      </Link>

      <header className="space-y-2 border-b-4 border-soft-black pb-8 mt-6 mb-10">
        <div className="text-xs font-black uppercase tracking-widest text-muted-text">
          {session.contentType}
        </div>
        <h1 className="font-grotesk text-4xl font-black lowercase tracking-tighter">
          {session.title}
        </h1>
        {session.consumeReason && (
          <p className="text-sm text-muted-text font-medium italic">
            &ldquo;{session.consumeReason}&rdquo;
          </p>
        )}
      </header>

      <ReflectionCapture
        title={session.title}
        prompt="What's your core takeaway from this?"
        onSubmitAction={handleComplete}
        isSubmitting={isSubmitting}
      />

      <SessionSuccessOverlay
        isVisible={showSuccess}
        wordCount={lastWordCount}
        title={session.title}
        onComplete={handleSuccessComplete}
      />
    </main>
  );
}
