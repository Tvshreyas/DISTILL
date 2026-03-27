"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { sanitizeContent } from "@/lib/sanitize";

const STORAGE_KEY = "distill_onboarding";

interface OnboardingData {
  title: string;
  contentType: string;
  consumeReason?: string;
  content: string;
  promptUsed?: string;
  thinkingShiftRating?: number | null;
  savedAt?: string;
}

function getStoredData(): OnboardingData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: OnboardingData = JSON.parse(raw);
    // Expire after 7 days
    if (data.savedAt && Date.now() - new Date(data.savedAt).getTime() > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export default function MigratePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const migratedRef = useRef(false);
  const migrateOnboarding = useMutation(api.onboarding.migrate);

  async function migrate() {
    const data = getStoredData();

    if (!data || !data.content.trim()) {
      // No onboarding data — user may already be migrated or came here directly
      router.replace("/dashboard");
      return;
    }

    try {
      await migrateOnboarding({
        title: sanitizeContent(data.title),
        contentType: data.contentType,
        consumeReason: data.consumeReason
          ? sanitizeContent(data.consumeReason)
          : undefined,
        reflectionContent: sanitizeContent(data.content),
        promptUsed: data.promptUsed
          ? sanitizeContent(data.promptUsed)
          : undefined,
        thinkingShiftRating: data.thinkingShiftRating ?? undefined,
      });

      // Clear localStorage only AFTER successful migration
      localStorage.removeItem(STORAGE_KEY);
      router.replace("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Check your connection and try again."
      );
    }
  }

  useEffect(() => {
    // Prevent double-migration in React strict mode
    if (migratedRef.current) return;
    migratedRef.current = true;
    migrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleRetry() {
    setError(null);
    setRetrying(true);
    await migrate();
    setRetrying(false);
  }

  if (error) {
    return (
      <main className="min-h-screen bg-warm-bg flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center space-y-4 brutal-card bg-white p-8">
          <h1 className="text-xl font-black text-soft-black">
            Could not save your reflection
          </h1>
          <p className="text-sm text-muted-text">{error}</p>
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="bg-soft-black text-white px-5 py-2.5 rounded-2xl text-sm font-black hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {retrying ? "Retrying..." : "Try again"}
          </button>
          <p className="text-xs text-muted-text">
            Your reflection is still saved locally and will not be lost.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-warm-bg flex items-center justify-center p-4">
      <div className="text-center space-y-3">
        <div className="w-6 h-6 border-2 border-soft-black/20 border-t-soft-black rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-text">Saving your reflection...</p>
      </div>
    </main>
  );
}
