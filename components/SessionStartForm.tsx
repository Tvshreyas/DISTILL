"use client";

import { useState } from "react";
import type { ContentType } from "@/types";

interface SessionFormData {
  title: string;
  contentType: ContentType;
  consumeReason?: string;
  isRetroactive: boolean;
}

export default function SessionStartForm({
  onSubmitAction,
  isSubmitting,
}: {
  onSubmitAction: (data: SessionFormData) => void;
  isSubmitting: boolean;
}) {
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState<ContentType>("article");
  const [consumeReason, setConsumeReason] = useState("");
  const [isRetroactive, setIsRetroactive] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitAction({
          title,
          contentType,
          consumeReason: consumeReason.trim() || undefined,
          isRetroactive,
        });
      }}
      className="space-y-8"
    >
      {/* Title */}
      <label className="space-y-3 block">
        <span className="text-xs font-black uppercase tracking-widest text-muted-text block">
          what are you consuming?
        </span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="title of the content..."
          maxLength={200}
          className="w-full h-14 px-6 rounded-2xl bg-white brutal-border border-4 border-soft-black text-lg font-bold placeholder:text-soft-black/20 outline-none focus:bg-sage/5 transition-all"
          required
        />
      </label>

      {/* Content Type */}
      <fieldset className="space-y-3">
        <legend className="text-xs font-black uppercase tracking-widest text-muted-text block">
          content type
        </legend>
        <div className="flex flex-wrap gap-2">
          {(
            ["book", "video", "article", "podcast", "realization", "workout", "walk", "other"] as const
          ).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setContentType(type)}
              className={`px-5 py-2.5 rounded-full border-4 border-soft-black font-black text-sm transition-all active:scale-95 ${
                contentType === type
                  ? "bg-peach text-soft-black brutal-shadow-xs -translate-x-0.5 -translate-y-0.5"
                  : "bg-white text-muted-text hover:bg-peach/10"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Consume Reason */}
      <label className="space-y-3 block">
        <span className="text-xs font-black uppercase tracking-widest text-muted-text block">
          why are you consuming this? <span className="text-soft-black/30">(optional)</span>
        </span>
        <textarea
          value={consumeReason}
          onChange={(e) => setConsumeReason(e.target.value)}
          placeholder="what do you hope to get from this?"
          maxLength={140}
          className="w-full h-24 p-4 rounded-2xl bg-white brutal-border border-4 border-soft-black text-base font-medium placeholder:text-soft-black/20 outline-none focus:bg-sage/5 transition-all resize-none"
        />
        <p className="text-xs font-bold text-muted-text text-right">
          {consumeReason.length}/140
        </p>
      </label>

      {/* Retroactive Toggle */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-sage/5 border-4 border-soft-black">
        <div className="space-y-1">
          <p className="text-sm font-black lowercase">retroactive reflection</p>
          <p className="text-xs text-muted-text font-medium">
            already finished consuming this content?
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isRetroactive}
          onClick={() => setIsRetroactive(!isRetroactive)}
          className={`relative w-12 h-7 rounded-full border-2 border-soft-black transition-colors ${
            isRetroactive ? "bg-peach" : "bg-white"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-soft-black transition-transform ${
              isRetroactive ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="w-full py-4 bg-soft-black text-white rounded-2xl font-black text-lg disabled:opacity-30 transition-all hover:scale-[1.02] active:scale-95"
      >
        {isSubmitting ? "starting..." : "start session"}
      </button>
    </form>
  );
}
