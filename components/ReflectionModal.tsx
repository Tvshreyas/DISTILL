"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export default function ReflectionModal({
  isOpen,
  onClose,
  title,
  content,
}: ReflectionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-soft-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="max-w-2xl w-full mx-auto mt-20 max-h-[80vh] overflow-y-auto bg-white border-4 border-soft-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(41,37,36,1)] p-8 md:p-12 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-soft-black/5 transition-colors text-muted-text hover:text-soft-black"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-grotesk text-2xl font-black lowercase tracking-tighter mb-4 pr-10">
              {title}
            </h2>

            <p className="font-serif text-xl md:text-2xl leading-relaxed italic whitespace-pre-wrap text-soft-black">
              &ldquo;{content}&rdquo;
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
