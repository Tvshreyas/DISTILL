"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export default function AbandonSessionButton({
  sessionId,
}: {
  sessionId: Id<"sessions">;
}) {
  const router = useRouter();
  const abandonSession = useMutation(api.sessions.abandon);
  const [confirming, setConfirming] = useState(false);
  const [abandoning, setAbandoning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAbandon() {
    setAbandoning(true);
    setError(null);
    try {
      await abandonSession({ sessionId });
      router.push("/dashboard");
    } catch {
      setError("Something went wrong.");
      setAbandoning(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleAbandon}
          disabled={abandoning}
          className="text-sm text-red-400 hover:text-red-300 font-medium disabled:opacity-50 transition-colors"
        >
          {abandoning ? "Abandoning..." : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="shrink-0">
      {error && (
        <p className="text-xs text-red-400 mb-1">{error}</p>
      )}
      <button
        onClick={() => setConfirming(true)}
        className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
      >
        Abandon
      </button>
    </div>
  );
}
