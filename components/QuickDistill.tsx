"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function QuickDistill() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickCreate = useMutation(api.reflections.quickCreate);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await quickCreate({ content: content.trim() });
      setShowSuccess(true);
      setContent("");
      toast.success("Thought distilled.");
      
      // Auto-reset success message after 3 seconds to allow next capture
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Capture failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full max-w-4xl mx-auto z-30 mb-8">
      <motion.div 
        layout
        className="brutal-card bg-white p-2 md:p-3 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {!showSuccess ? (
            <motion.form 
              key="input-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="flex items-center gap-4 px-4 py-2"
            >
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What did you learn today?"
                  className="w-full bg-transparent border-none focus:outline-none font-medium text-lg md:text-xl placeholder:text-muted-text/50"
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className={`p-3 rounded-2xl transition-all flex items-center justify-center ${
                  content.trim() 
                    ? "bg-peach text-soft-black brutal-border-sm shadow-[2px_2px_0px_#292524] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#292524]" 
                    : "bg-soft-black/5 text-muted-text"
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Send className="w-6 h-6" />
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success-message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-3 py-4 text-sage-dark"
            >
              <div className="w-8 h-8 rounded-full bg-sage/30 flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <span className="font-grotesk font-black text-xl lowercase">distilled. one step closer.</span>
              <Sparkles className="w-5 h-5 text-peach animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick context info */}
      {!showSuccess && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 flex justify-center gap-6"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-text flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-peach" />
            Quick Capture Mode
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-text flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sage" />
            Bypasses Session Ceremony
          </p>
        </motion.div>
      )}
    </section>
  );
}
