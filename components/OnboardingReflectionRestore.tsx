"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const STORAGE_KEY = "distill_onboarding";

/**
 * Invisible component that restores a reflection saved during the /start
 * onboarding flow. Reads from localStorage, creates a session + reflection
 * via existing Convex mutations, then clears the stored data.
 *
 * Mount this inside the dashboard page. It renders nothing.
 */
export default function OnboardingReflectionRestore() {
  const createSession = useMutation(api.sessions.create);
  const createReflection = useMutation(api.reflections.create);
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    let data: {
      title?: string;
      contentType?: string;
      consumeReason?: string;
      content?: string;
      promptUsed?: string;
      thinkingShiftRating?: number | null;
    };

    try {
      data = JSON.parse(raw);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    // Validate minimum required fields
    if (!data.title || !data.content || !data.contentType) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const validTypes = ["book", "video", "article", "podcast", "other"] as const;
    type ContentType = (typeof validTypes)[number];
    const contentType: ContentType = validTypes.includes(data.contentType as ContentType)
      ? (data.contentType as ContentType)
      : "article";

    (async () => {
      try {
        // 1. Create a retroactive session (returns full session object)
        const session = await createSession({
          title: data.title!.slice(0, 200),
          contentType,
          consumeReason: data.consumeReason?.slice(0, 140) || undefined,
          isRetroactive: true,
        });

        if (!session || !session._id) {
          return;
        }

        // 2. Create the reflection on that session
        await createReflection({
          sessionId: session._id,
          content: data.content!.slice(0, 400),
          promptUsed: data.promptUsed || undefined,
          thinkingShiftRating:
            data.thinkingShiftRating != null &&
            Number.isInteger(data.thinkingShiftRating) &&
            data.thinkingShiftRating >= 1 &&
            data.thinkingShiftRating <= 5
              ? data.thinkingShiftRating
              : undefined,
        });

        // 3. Clear localStorage on success
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        // If it fails (e.g. free tier reached, active session exists),
        // silently ignore — the user can still create it manually.
        // Keep localStorage so it can be retried on next visit.
        console.error("Failed to restore onboarding reflection", err);
      }
    })();
  }, [createSession, createReflection]);

  return null;
}
