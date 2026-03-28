"use client";

import { useState, useEffect } from "react";
import { MagnetizeButton } from "@/components/ui/magnetize-button";
import { useAutoSave } from "@/hooks/useAutoSave";
import { Check, CloudUpload, Shuffle } from "lucide-react";
import { REFLECTION_PROMPTS } from "@/lib/prompts";
import { checkContentSafety, type SafetyResult } from "@/lib/safety";
import { toast } from "sonner";
import posthog from "posthog-js";

export default function ReflectionCapture({
  onSubmitAction,
  isSubmitting,
  prompt: initialPrompt,
}: {
  onSubmitAction: (content: string, rating: number | null) => void;
  isSubmitting: boolean;
  title: string;
  prompt: string;
}) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [prompt, setPrompt] = useState(initialPrompt);
  const [safetyResult, setSafetyResult] = useState<SafetyResult>({
    safe: true,
    category: null,
  });

  // Restore draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(`draft_${prompt}`);
    if (savedDraft) {
      setContent(savedDraft);
    }
  }, [prompt]);

  // Hook into auto-save
  useAutoSave(
    content,
    (val) => {
      setSaveStatus("saving");
      localStorage.setItem(`draft_${prompt}`, val);
      setTimeout(() => setSaveStatus("saved"), 500);
    },
    2000,
  );

  const handleSubmit = () => {
    const result = checkContentSafety(content);
    if (!result.safe && result.category === "A") {
      toast.error("This content cannot be saved.");
      return;
    }
    if (!result.safe && result.category === "B") {
      toast.warning(
        "Your reflection contains strong language. It will still be saved.",
        { duration: 5000 },
      );
    }
    onSubmitAction(content, rating);
    localStorage.removeItem(`draft_${prompt}`);
    posthog.capture("reflection_created", {
      word_count: content.trim().split(/\s+/).length,
      has_rating: rating !== null,
    });
  };

  const handleShufflePrompt = () => {
    const currentIndex = REFLECTION_PROMPTS.indexOf(prompt);
    const nextIndex = (currentIndex + 1) % REFLECTION_PROMPTS.length;
    setPrompt(REFLECTION_PROMPTS[nextIndex]);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-muted-text font-black">
              Reflection Prompt
            </span>
            <button
              onClick={handleShufflePrompt}
              className="p-1 px-2 rounded-md bg-soft-black/5 hover:bg-peach/20 transition-all flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-muted-text hover:text-soft-black transition-colors"
            >
              <Shuffle className="w-3 h-3" />
              Shuffle
            </button>
          </div>
          <h3 className="font-grotesk text-2xl md:text-3xl font-black lowercase tracking-tighter leading-none pr-8">
            {prompt}
          </h3>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white brutal-border-sm border-2 border-soft-black rounded-xl shrink-0">
          {saveStatus === "saving" ? (
            <>
              <div className="w-2 h-2 rounded-full bg-peach animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Saving...
              </span>
            </>
          ) : (
            <>
              <Check
                className={`w-3 h-3 ${saveStatus === "saved" ? "text-sage-dark" : "text-muted-text"}`}
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-text">
                {saveStatus === "saved" ? "Saved" : "Draft"}
              </span>
            </>
          )}
        </div>
      </header>

      <div className="relative group">
        <textarea
          value={content}
          onChange={(e) => {
            const val = e.target.value;
            setContent(val);
            setSaveStatus("idle");
            // Live safety check
            const result = checkContentSafety(val);
            setSafetyResult(result);
          }}
          placeholder="pour your thoughts here..."
          className="w-full h-80 p-8 rounded-[2rem] bg-white brutal-border border-4 border-soft-black text-xl font-medium placeholder:text-soft-black/20 outline-none focus:bg-sage/5 transition-all resize-none shadow-[8px_8px_0px_0px_rgba(41,37,36,0.05)]"
          required
        />

        {/* Safety Warning Overlay */}
        {!safetyResult.safe && (
          <div
            className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg border-2 font-black text-[10px] uppercase tracking-wider transition-all ${
              safetyResult.category === "A"
                ? "bg-red-100 text-red-600 border-red-600"
                : "bg-peach/20 text-soft-black border-soft-black/20"
            }`}
          >
            {safetyResult.category === "A"
              ? "Blocked Content"
              : "Strong Language"}
          </div>
        )}

        {/* Visual Cue */}
        <div className="absolute bottom-6 right-8 text-[10px] font-black uppercase tracking-[0.2em] text-soft-black/10">
          Analog Focus Mode
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-black text-muted-text uppercase tracking-widest">
          How much did your thinking shift?
        </p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRating(n)}
              className={`flex-1 py-4 rounded-xl border-2 font-black text-lg transition-all active:scale-95 ${
                rating === n
                  ? "bg-peach text-soft-black border-soft-black brutal-shadow-xs -translate-x-0.5 -translate-y-0.5"
                  : "bg-white text-muted-text border-soft-black hover:bg-peach/10"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <MagnetizeButton
        onClick={handleSubmit}
        disabled={!content.trim() || isSubmitting}
        className="w-full py-6 text-2xl font-black rounded-2xl"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            preserving... <CloudUpload className="animate-bounce" />
          </span>
        ) : (
          "complete reflection"
        )}
      </MagnetizeButton>
    </div>
  );
}
