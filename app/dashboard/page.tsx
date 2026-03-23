"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import ActiveSessionBanner from "@/components/ActiveSessionBanner";
import ResurfacingCard from "@/components/ResurfacingCard";
import StreakHeatmap from "@/components/StreakHeatmap";
import { WordReveal } from "@/components/ui/word-reveal";
import OnboardingReflectionRestore from "@/components/OnboardingReflectionRestore";
import QuickDistill from "@/components/QuickDistill";
import posthog from "posthog-js";

function toDateString(date: Date, timezone: string): string {
  return date.toLocaleDateString("en-CA", { timeZone: timezone });
}

function getMonthDays(timezone: string) {
  const today = new Date();
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = toDateString(d, timezone);
    const isToday = i === 0;
    days.push({ dateStr, isToday });
  }
  return days;
}

export default function DashboardPage() {
  const profile = useQuery(api.profiles.get);
  const activeSession = useQuery(api.sessions.getActive);
  const recentReflections = useQuery(api.reflections.recent);

  // Track upgrade success from Stripe redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgrade") === "success") {
      posthog.capture("upgraded_to_pro");
      // Clean URL without reload
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  if (profile === undefined) return <div>Loading dashboard...</div>;
  if (!profile) return <div>Profile not found.</div>;

  const currentStreak = profile.currentStreak ?? 0;
  const userTimezone = profile.timezone ?? "UTC";

  const reflectionDates = new Set(
    (recentReflections ?? []).map((r) =>
      toDateString(new Date(r._creationTime), userTimezone)
    )
  );
  const monthDays = getMonthDays(userTimezone);

  return (
    <div className="space-y-12">
      <OnboardingReflectionRestore />
      <header className="space-y-1">
        <WordReveal 
          text="dashboard"
          className="text-4xl md:text-5xl font-bold tracking-tighter justify-start text-left font-serif"
        />
        <p className="text-muted-text font-medium text-sm lowercase tracking-wider pl-1">
          your thinking, compounded daily.
        </p>
      </header>

      <QuickDistill />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Streak Counter */}
        <section className="lg:col-span-4 p-8 rounded-[2rem] border-4 border-soft-black bg-peach/10 relative overflow-hidden group hover:bg-peach/20 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.312 10.5c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" />
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h2 className="font-grotesk text-xs font-bold uppercase tracking-[0.2em] text-muted-text mb-4">Current Streak</h2>
          <div className="flex items-baseline gap-2">
            <span className="font-grotesk text-7xl font-black text-soft-black">{currentStreak}</span>
            <span className="font-grotesk text-xl font-bold text-soft-black/40 lowercase">days</span>
          </div>
          
          <div className="mt-6 flex items-center gap-2">
            <div className="px-3 py-1 bg-soft-black text-white text-[10px] font-bold rounded-full uppercase tracking-tighter">
              Active
            </div>
            {currentStreak > 0 && (
              <span className="text-[10px] font-bold text-peach uppercase tracking-tighter animate-pulse">
                Fire Keepers
              </span>
            )}
          </div>
        </section>

        {/* 30-Day Activity Heatmap */}
        <section className="lg:col-span-8">
          <StreakHeatmap dates={reflectionDates} monthDays={monthDays} />
        </section>
      </div>

      {activeSession && (
        <ActiveSessionBanner session={activeSession} />
      )}

      <ResurfacingCard />

      {!activeSession && (
        <div className="pt-8">
          <Link 
            href="/dashboard/session/new"
            className="brutal-btn bg-soft-black text-white text-lg px-10 py-4 hover:bg-peach hover:text-soft-black w-full md:w-auto"
          >
            Start Deep Session &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
