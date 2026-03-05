"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { sanitizeContent } from "@/lib/sanitize";
import type { ContentType } from "@/types";

const CONTENT_TYPES: { value: ContentType; label: string; icon: string }[] = [
  { value: "book", label: "Book", icon: "\u{1F4D6}" },
  { value: "video", label: "Video", icon: "\u{1F3AC}" },
  { value: "article", label: "Article", icon: "\u{1F4F0}" },
  { value: "podcast", label: "Podcast", icon: "\u{1F3A7}" },
  { value: "other", label: "Other", icon: "\u{1F4CC}" },
];

export default function SessionStartForm() {
  const router = useRouter();
  const createSession = useMutation(api.sessions.create);
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState<ContentType>("book");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = title.trim();
    if (!trimmed) {
      setError("Enter a title for what you're consuming.");
      return;
    }
    if (trimmed.length > 200) {
      setError("Title must be 200 characters or fewer.");
      return;
    }

    setSubmitting(true);

    try {
      const session = await createSession({
        title: sanitizeContent(trimmed),
        contentType,
        consumeReason: reason.trim()
          ? sanitizeContent(reason.trim())
          : undefined,
      });

      if (session) {
        router.push(`/dashboard/session/${session._id}`);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-300 mb-1.5"
        >
          What are you consuming?
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='e.g. "Thinking, Fast and Slow"'
          maxLength={200}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all duration-200"
          autoFocus
        />
        <p className="text-xs text-gray-500 mt-1 text-right">
          {title.length}/200
        </p>
      </div>

      {/* Content Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Type
        </label>
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map((ct) => (
            <button
              key={ct.value}
              type="button"
              onClick={() => setContentType(ct.value)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm transition-all duration-200 ${
                contentType === ct.value
                  ? "bg-amber-500 text-black font-medium"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              <span>{ct.icon}</span>
              {ct.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reason (optional) */}
      <div>
        <label
          htmlFor="reason"
          className="block text-sm font-medium text-gray-300 mb-1.5"
        >
          Why are you consuming this?{" "}
          <span className="text-gray-500 font-normal">Optional</span>
        </label>
        <input
          id="reason"
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Curious about decision-making biases"
          maxLength={140}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all duration-200"
        />
        <p className="text-xs text-gray-500 mt-1 text-right">
          {reason.length}/140
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
        type="submit"
        disabled={submitting || !title.trim()}
        className="w-full bg-amber-500 text-black px-5 py-3 rounded-xl text-sm font-semibold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {submitting ? "Starting..." : "Start Session"}
      </button>
    </form>
  );
}
