"use client";

import { motion } from "framer-motion";

export function AppPreview() {
  return (
    <div className="relative w-full max-w-4xl mx-auto mt-16 group">
      {/* Decorative Blur Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-peach/20 via-sage/20 to-lavender/20 blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-1000" />

      {/* Main Container - Neo-Brutalist Frame */}
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        whileInView={{ y: 0, opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative z-10 bg-white brutal-border brutal-shadow rounded-[2rem] overflow-hidden aspect-[16/10] flex flex-col"
      >
        {/* Mock Title Bar */}
        <div className="h-10 border-b-2 border-soft-black flex items-center px-4 gap-2 bg-warm-bg/50">
          <div className="w-3 h-3 rounded-full bg-soft-black/10" />
          <div className="w-3 h-3 rounded-full bg-soft-black/10" />
          <div className="w-3 h-3 rounded-full bg-soft-black/10" />
          <div className="flex-1 flex justify-center">
            <div className="h-4 w-32 bg-soft-black/5 rounded-full" />
          </div>
        </div>

        {/* Mock Content Area */}
        <div className="flex-1 flex">
          {/* Sidebar */}
          <div className="w-20 md:w-64 border-r-2 border-soft-black/5 p-6 space-y-8 hidden md:block">
            <div className="h-8 w-full bg-peach/10 rounded-xl" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-4 w-full bg-soft-black/5 rounded-full"
                />
              ))}
            </div>
          </div>

          {/* Main Feed */}
          <div className="flex-1 p-6 md:p-10 space-y-10">
            {/* Header Area */}
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-soft-black/10 rounded-full" />
                <div className="h-8 w-64 bg-soft-black rounded-xl" />
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-sage" />
                ))}
              </div>
            </div>

            {/* Reflection Card Mockup */}
            <div className="relative">
              <div className="brutal-card bg-warm-bg border-2 border-dashed border-soft-black/20 p-8 space-y-6">
                <div className="h-5 w-48 bg-soft-black rounded-full" />
                <div className="space-y-3">
                  <div className="h-3 w-full bg-soft-black/5 rounded-full" />
                  <div className="h-3 w-5/6 bg-soft-black/5 rounded-full" />
                  <div className="h-3 w-4/6 bg-soft-black/5 rounded-full" />
                </div>
                <div className="flex gap-4">
                  <div className="px-4 py-2 rounded-full border border-soft-black/10 text-[10px] font-bold uppercase tracking-wider text-muted-text">
                    perspective
                  </div>
                  <div className="px-4 py-2 rounded-full border border-soft-black/10 text-[10px] font-bold uppercase tracking-wider text-muted-text">
                    layer 01
                  </div>
                </div>
              </div>

              {/* Floating Element 1 - Sticker-like */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-6 -right-6 bg-peach brutal-border-sm brutal-shadow-sm rounded-2xl px-4 py-2 rotate-6"
              >
                <span className="font-grotesk font-bold text-xs">
                  active recall
                </span>
              </motion.div>
            </div>

            {/* Heatmap Mockup */}
            <div className="pt-4">
              <div className="flex justify-between items-center mb-4 px-2">
                <div className="h-3 w-24 bg-soft-black/10 rounded-full" />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-sm bg-peach/40" />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-10 gap-2">
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.01 }}
                    className={`aspect-square rounded-full border border-soft-black/5 ${
                      i % 7 === 0 || i % 7 === 2
                        ? "bg-peach shadow-[2px_2px_0px_#292524]"
                        : i % 5 === 0
                          ? "bg-sage/40"
                          : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Background Floating Elements - To fill edges */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -left-20 w-40 h-40 border-2 border-dashed border-soft-black/10 rounded-full -z-10"
      />
      <motion.div
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-20 -right-20 w-64 h-64 border-4 border-soft-black/5 rounded-[4rem] -z-10"
      />
    </div>
  );
}
