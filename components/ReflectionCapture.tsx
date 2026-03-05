"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAutoSave } from "@/hooks/useAutoSave";
import { sanitizeContent } from "@/lib/sanitize";
import { FREE_TIER_LIMIT, FREE_TIER_NUDGE } from "@/lib/constants";
import { toast } from "sonner";
import UpgradeModal from "./UpgradeModal";
import type { Id } from "@/convex/_generated/dataModel";

const PROMPTS = [
  "What\u2019s one thing you disagree with or would challenge?",
  "What does this make you want to do, make, or change?",
  "What question does this leave you with?",
];

function getPrompt(sessionId: string): string {
  let hash = 0;
  for (let i = 0; i < sessionId.length; i++) {
    hash = (hash * 31 + sessionId.charCodeAt(i)) | 0;
  }
  return PROMPTS[Math.abs(hash) % PROMPTS.length];
}

const DRAFT_KEY_PREFIX = "distill_draft_";

function getDraftKey(sessionId: string) {
  return `${DRAFT_KEY_PREFIX}${sessionId}`;
}

function loadDraft(sessionId: string): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(getDraftKey(sessionId)) ?? "";
  } catch {
    return "";
  }
}

function saveDraft(sessionId: string, content: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getDraftKey(sessionId), content);
  } catch { }
}

function clearDraft(sessionId: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(getDraftKey(sessionId));
  } catch { }
}

interface Props {
  sessionId: Id<"sessions">;
  sessionTitle: string;
  reflectionCountThisMonth: number;
  plan: "free" | "pro";
  totalWordCount: number;
}

export default function ReflectionCapture({
  sessionId,
  sessionTitle,
  reflectionCountThisMonth,
  plan,
  totalWordCount,
}: Props) {
  const router = useRouter();
  const createReflection = useMutation(api.reflections.create);
  const [content, setContent] = useState(() => loadDraft(sessionId));
  const [rating, setRating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [wordCount, setWordCount] = useState(() => {
    const initial = content;
    return initial.trim() ? initial.trim().split(/\s+/).length : 0;
  });
  const prompt = getPrompt(sessionId);

  const atLimit =
    plan === "free" && reflectionCountThisMonth >= FREE_TIER_LIMIT;
  const nearLimit =
    plan === "free" && reflectionCountThisMonth >= FREE_TIER_NUDGE;

  const handleAutoSave = useCallback(
    (value: string) => {
      saveDraft(sessionId, value);
    },
    [sessionId]
  );

  useAutoSave(content, handleAutoSave, 3000);

  function handleContentChange(value: string) {
    if (value.length <= 3000) {
      setContent(value);
      const words = value.trim() ? value.trim().split(/\s+/).length : 0;
      setWordCount(words);
    }
  }

  async function handleSubmit() {
    setError(null);

    if (atLimit) {
      setShowUpgrade(true);
      return;
    }

    const trimmed = content.trim();
    if (!trimmed) {
      setError("Write something before submitting.");
      return;
    }
    if (trimmed.length > 3000) {
      setError("Reflection must be 3,000 characters or fewer.");
      return;
    }

    setSubmitting(true);

    try {
      const reflection = await createReflection({
        sessionId,
        content: sanitizeContent(trimmed),
        promptUsed: prompt,
        thinkingShiftRating: rating ?? undefined,
      });

      clearDraft(sessionId);
      setSubmitted(true);
      toast.success("Reflection captured!");
      if (reflection) {
        setWordCount(reflection.wordCount);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Check your connection and try again."
      );
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="space-y-4 max-w-lg">
        <p className="text-sm text-white">
          Saved. {wordCount} words captured.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard/library")}
            className="bg-amber-500 text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all duration-200"
          >
            View in Library
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="border border-white/10 text-gray-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/5 transition-all duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-lg">
      {/* Session title */}
      <p className="text-sm text-gray-400">
        Reflecting on: <span className="text-white font-medium">{sessionTitle}</span>
      </p>

      {/* Prompt */}
      <p className="text-sm text-gray-500 italic">{prompt}</p>

      {/* Free tier warning */}
      {atLimit && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <p className="text-sm text-red-400">
            You&apos;ve used all {FREE_TIER_LIMIT} reflections this month.
          </p>
        </div>
      )}
      {nearLimit && !atLimit && (
        <p className="text-xs text-amber-500">
          {FREE_TIER_LIMIT - reflectionCountThisMonth} reflection{FREE_TIER_LIMIT - reflectionCountThisMonth !== 1 ? "s" : ""} remaining this month.
        </p>
      )}

      {/* Textarea */}
      <div>
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          disabled={atLimit}
          placeholder="Write your reflection..."
          rows={8}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent resize-y disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{wordCount} words</span>
          <span>{content.length} / 3000 characters</span>
        </div>
      </div>

      {/* Thinking Shift Rating */}
      <div>
        <p className="text-sm font-medium text-gray-300 mb-2">
          How much did this shift your thinking?{" "}
          <span className="text-gray-500 font-normal">Optional</span>
        </p>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(rating === n ? null : n)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${rating !== null && n <= rating
                  ? "bg-amber-500 text-black"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                }`}
            >
              {rating !== null && n <= rating ? "\u2605" : "\u2606"}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          1 = reinforced what I knew &middot; 5 = completely changed my view
        </p>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting || (!atLimit && !content.trim())}
        className="w-full bg-amber-500 text-black px-5 py-3 rounded-xl text-sm font-semibold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {submitting ? "Saving..." : "Save reflection"}
      </button>

      {/* Upgrade modal */}
      {showUpgrade && (
        <UpgradeModal
          reflectionCount={reflectionCountThisMonth}
          totalWordCount={totalWordCount}
          onDismiss={() => setShowUpgrade(false)}
        />
      )}
    </div>
  );
}
