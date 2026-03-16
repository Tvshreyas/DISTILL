"use client";

import { motion } from "framer-motion";

interface StreakHeatmapProps {
  dates: Set<string>;
  monthDays: { dateStr: string; isToday: boolean }[];
}

export default function StreakHeatmap({ dates, monthDays }: StreakHeatmapProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-grotesk text-xs font-bold uppercase tracking-[0.2em] text-muted-text">
          30-Day Activity
        </h3>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-text">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-peach shadow-[0_0_8px_rgba(255,183,178,0.5)]" />
            <span>Reflected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full border border-soft-black/20" />
            <span>Passive</span>
          </div>
        </div>
      </div>

      <div className="brutal-card bg-white/50 backdrop-blur-sm p-6 relative overflow-hidden">
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] select-none pointer-events-none">
          <span className="font-grotesk text-8xl font-black">30</span>
        </div>

        <div className="grid grid-cols-10 gap-3 md:gap-4 relative z-10">
          {monthDays.map(({ dateStr, isToday }, index) => {
            const hasReflected = dates.has(dateStr);
            
            return (
              <motion.div
                key={dateStr}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                className="relative group"
              >
                <div
                  className={`
                    aspect-square rounded-full flex items-center justify-center transition-all duration-300
                    ${hasReflected 
                      ? "bg-peach brutal-border-sm shadow-[2px_2px_0px_#292524] scale-105" 
                      : "bg-sage/20 border border-soft-black/10 hover:border-soft-black/30"
                    }
                    ${isToday ? "ring-2 ring-peach ring-offset-2 ring-offset-warm-bg" : ""}
                  `}
                >
                  {isToday && !hasReflected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-soft-black/20 animate-pulse" />
                  )}
                </div>
                
                {/* Tooltip-like date label on hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-soft-black text-white text-[9px] rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 brutal-shadow-sm border border-white/10 uppercase tracking-tighter">
                  {isToday ? "Today" : dateStr}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <p className="text-[10px] text-muted-text font-medium italic text-right italic">
        * Consistency is the compounding of focus.
      </p>
    </div>
  );
}
