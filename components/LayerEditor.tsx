"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnetizeButton } from "@/components/ui/magnetize-button";

interface LayerEditorProps {
  onSave: (content: string, thinkingShiftRating?: number) => Promise<void>;
  onCancel: () => void;
}

export default function LayerEditor({ onSave, onCancel }: LayerEditorProps) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!content.trim()) return;
    setIsSaving(true);
    setError("");
    try {
      await onSave(content.trim(), rating);
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Could not save. Your addition is preserved — try again.";
      setError(message);
      setIsSaving(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="brutal-card bg-white space-y-5"
      >
        {/* Textarea */}
        <div className="space-y-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="how has your thinking changed?"
            maxLength={3000}
            rows={5}
            className="w-full bg-warm-bg brutal-border rounded-2xl p-4 font-serif text-lg text-soft-black placeholder:text-soft-black/30 resize-none focus:outline-none focus:ring-2 focus:ring-peach/50 transition-all duration-200"
          />
          <p className="text-right text-[10px] font-grotesk font-black uppercase tracking-widest text-soft-black/30">
            {content.length}/3000
          </p>
        </div>

        {/* Thinking Shift Rating */}
        <div className="space-y-2">
          <p className="font-grotesk text-[10px] font-black uppercase tracking-[0.2em] text-soft-black/40">
            thinking shift
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(rating === n ? undefined : n)}
                className={`w-10 h-10 rounded-full brutal-border font-grotesk font-black text-sm transition-all duration-200 ${
                  rating === n
                    ? "bg-peach text-soft-black"
                    : "bg-white text-soft-black/40 hover:bg-warm-bg"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600 font-grotesk">{error}</p>}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-1">
          <MagnetizeButton
            onClick={handleSave}
            disabled={!content.trim() || isSaving}
            className="min-w-[180px]"
          >
            {isSaving ? "preserving..." : "add perspective"}
          </MagnetizeButton>
          <button
            onClick={onCancel}
            className="font-grotesk text-sm font-bold text-soft-black/40 hover:text-soft-black transition-colors lowercase px-4 py-2"
          >
            cancel
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
