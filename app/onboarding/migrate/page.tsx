"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { sanitizeContent } from "@/lib/sanitize";

const STORAGE_KEY = "distill_onboarding";

interface OnboardingData {
  deviceToken: string;
  title: string;
  contentType: string;
  consumeReason: string;
  reflectionContent: string;
  promptUsed: string;
  thinkingShiftRating: number | null;
  createdAt: number;
}

function getStoredData(): OnboardingData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: OnboardingData = JSON.parse(raw);
    // Expire after 7 days
    if (Date.now() - data.createdAt > 7 * 24 * 60 * 60 * 1000) {
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

    if (!data || !data.reflectionContent.trim()) {
      // No onboarding data — user may already be migrated or came here directly
      router.replace("/dashboard");
      return;
    }

    try {
      await migrateOnboarding({
        deviceToken: data.deviceToken,
        title: sanitizeContent(data.title),
        contentType: data.contentType,
        consumeReason: data.consumeReason
          ? sanitizeContent(data.consumeReason)
          : undefined,
        reflectionContent: sanitizeContent(data.reflectionContent),
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
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Could not save your reflection
          </h1>
          <p className="text-sm text-gray-600">{error}</p>
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="bg-black text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {retrying ? "Retrying..." : "Try again"}
          </button>
          <p className="text-xs text-gray-400">
            Your reflection is still saved locally and will not be lost.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-3">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500">Saving your reflection...</p>
      </div>
    </main>
  );
}
