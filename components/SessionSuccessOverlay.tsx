"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Library, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface SessionSuccessOverlayProps {
  isVisible: boolean;
  wordCount: number;
  title: string;
  onComplete: () => void;
}

export default function SessionSuccessOverlay({
  isVisible,
  wordCount,
  title,
  onComplete,
}: SessionSuccessOverlayProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setInterval(() => {
        setProgress((old) => {
          if (old >= 100) {
            clearInterval(timer);
            return 100;
          }
          return old + 2;
        });
      }, 30);
      
      // Auto-dismiss after 3.5 seconds
      const dismiss = setTimeout(onComplete, 3500);
      
      return () => {
        clearInterval(timer);
        clearTimeout(dismiss);
      };
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-warm-bg flex items-center justify-center p-6"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-lg brutal-card bg-white p-12 text-center space-y-8 relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
              <Library className="w-32 h-32" />
            </div>

            <div className="space-y-4">
              <motion.div 
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-20 h-20 bg-peach border-4 border-soft-black rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-brutal"
              >
                <Zap className="w-10 h-10 text-soft-black" />
              </motion.div>
              
              <h2 className="font-grotesk text-4xl font-black lowercase tracking-tighter text-soft-black">
                perspective preserved.
              </h2>
              <p className="font-serif italic text-xl text-muted-text">
                &ldquo;{title}&rdquo;
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-text mb-1">
                <span>Archiving {wordCount} words</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-4 w-full bg-soft-black/5 rounded-full overflow-hidden border-2 border-soft-black/20">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-peach border-r-2 border-soft-black"
                />
              </div>
            </div>

            <div className="pt-4">
              <p className="text-xs font-grotesk font-bold uppercase tracking-[0.2em] text-sage-dark flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-peach animate-pulse" />
                your thinking, compounded daily
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
