"use client";

import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";

const TYPE_LABELS: Record<string, string> = {
  book: "Book",
  video: "Video",
  article: "Article",
  podcast: "Podcast",
  other: "Content",
};

interface Props {
  session: {
    _id: Id<"sessions">;
    title: string;
    contentType: string;
  };
}

export default function ActiveSessionBanner({ session }: Props) {
  const abandonSession = useMutation(api.sessions.abandon);
  const [abandoning, setAbandoning] = useState(false);

  async function handleAbandon() {
    setAbandoning(true);
    try {
      await abandonSession({ sessionId: session._id });
    } catch {
      setAbandoning(false);
    }
  }

  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-amber-500 font-medium uppercase tracking-wider">
            Active session · {TYPE_LABELS[session.contentType] ?? "Content"}
          </p>
          <p className="text-sm font-medium text-white mt-1">
            {session.title} is waiting for your reflection
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          href={`/dashboard/session/${session._id}`}
          className="bg-amber-500 text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all duration-200"
        >
          Write reflection
        </Link>
        <button
          onClick={handleAbandon}
          disabled={abandoning}
          className="text-sm text-gray-500 px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-200 disabled:opacity-50"
        >
          {abandoning ? "..." : "Abandon"}
        </button>
      </div>
    </div>
  );
}
