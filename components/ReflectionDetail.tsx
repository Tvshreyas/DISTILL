"use client";

import type { Doc } from "@/convex/_generated/dataModel";

export default function ReflectionDetail({
  reflection,
}: {
  reflection: Doc<"reflections">;
}) {
  if (!reflection) return null;

  return (
    <div className="space-y-8 relative z-10">
      <div className="max-w-none">
        <p className="whitespace-pre-wrap text-2xl md:text-3xl font-serif text-soft-black leading-[1.45] tracking-tight">
          &ldquo;{reflection.content}&rdquo;
        </p>
      </div>

      {reflection.thinkingShiftRating != null && (
        <div className="inline-flex items-center gap-4 px-5 py-3 bg-peach/10 rounded-2xl border-2 border-peach/20">
          <span className="font-grotesk text-[10px] font-black uppercase tracking-widest text-peach">
            Thinking Shift Impact
          </span>
          <span className="font-grotesk text-xl font-black text-soft-black">
            {reflection.thinkingShiftRating}/5
          </span>
        </div>
      )}
    </div>
  );
}
