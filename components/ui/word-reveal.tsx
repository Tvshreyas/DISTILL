"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function WordReveal({ text, className, delay = 0 }: WordRevealProps) {
  const words = text.split(" ");

  return (
    <h1 className={cn("flex flex-wrap justify-center text-center", className)}>
      {words.map((word, i) => (
        <span 
          key={i} 
          className="relative inline-block mr-[0.25em] mb-[0.1em]"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * 0.1,
            }}
            className="inline-block font-grotesk"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
