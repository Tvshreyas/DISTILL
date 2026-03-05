"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FREE_TIER_LIMIT, FREE_TIER_NUDGE } from "@/lib/constants";
import Link from "next/link";
import ActiveSessionBanner from "@/components/ActiveSessionBanner";
import ResurfacingCard from "@/components/ResurfacingCard";

function toDateString(date: Date, timezone: string): string {
  return date.toLocaleDateString("en-CA", { timeZone: timezone });
}

function getWeekDays(timezone: string) {
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = toDateString(d, timezone);
    const label = d.toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: timezone,
    }).slice(0, 1);
    days.push({ label, dateStr });
  }
  return days;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-3">
        <div className="h-7 w-48 skeleton" />
        <div className="flex gap-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 skeleton rounded-lg" />
              <div className="w-3 h-3 skeleton rounded" />
            </div>
          ))}
        </div>
        <div className="h-4 w-32 skeleton" />
      </div>
      <div className="h-20 skeleton rounded-xl" />
      <div className="h-12 w-40 skeleton rounded-xl" />
    </div>
  );
}

export default function DashboardPage() {
  const profile = useQuery(api.profiles.get);
  const activeSession = useQuery(api.sessions.getActive);
  const recentReflections = useQuery(api.reflections.recent);

  // Loading state
  if (profile === undefined) {
    return <DashboardSkeleton />;
  }

  // Error state — profile not found
  if (profile === null) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm mb-4">Could not load your profile.</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  const currentStreak = profile.currentStreak ?? 0;
  const longestStreak = profile.longestStreak ?? 0;
  const monthlyCount = profile.reflectionCountThisMonth ?? 0;
  const lifetimeCount = profile.reflectionCountLifetime ?? 0;
  const plan = profile.plan ?? "free";
  const userTimezone = profile.timezone ?? "UTC";

  const reflectionDates = new Set(
    (recentReflections ?? []).map((r) =>
      toDateString(new Date(r._creationTime), userTimezone)
    )
  );
  const weekDays = getWeekDays(userTimezone);

  // Empty state — no reflections ever
  const isEmpty = lifetimeCount === 0 && !activeSession;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <h1 className="text-2xl font-semibold text-white">Welcome back</h1>

      {/* Streak section */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-white">{currentStreak}</span>
          <span className="text-sm text-gray-400">day streak</span>
          {longestStreak > 0 && longestStreak > currentStreak && (
            <span className="text-xs text-gray-500 ml-auto">
              Best: {longestStreak} days
            </span>
          )}
        </div>

        {/* 7-day grid */}
        <div className="flex gap-2">
          {weekDays.map(({ label, dateStr }) => {
            const hasReflection = reflectionDates.has(dateStr);
            return (
              <div key={dateStr} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-9 h-9 rounded-lg transition-all duration-200 ${
                    hasReflection
                      ? "bg-amber-500 shadow-lg shadow-amber-500/20"
                      : "bg-white/5 border border-white/10"
                  }`}
                />
                <span className="text-[10px] text-gray-500">{label}</span>
              </div>
            );
          })}
        </div>

        {/* Stats row */}
        <div className="flex gap-6 text-sm text-gray-400">
          <span>
            This month:{" "}
            <span className="font-medium text-white">
              {monthlyCount}
              {plan === "free" ? `/${FREE_TIER_LIMIT}` : ""}
            </span>
          </span>
          <span>
            Total:{" "}
            <span className="font-medium text-white">{lifetimeCount}</span>
          </span>
        </div>
      </section>

      {/* Free tier nudge */}
      {plan === "free" && monthlyCount >= FREE_TIER_NUDGE && monthlyCount < FREE_TIER_LIMIT && (
        <section className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-amber-400">
            {FREE_TIER_LIMIT - monthlyCount} reflection{FREE_TIER_LIMIT - monthlyCount !== 1 ? "s" : ""} remaining this month.
          </p>
          <Link href="/dashboard/settings" className="text-xs text-amber-500 hover:text-amber-400 font-medium transition-colors">
            Upgrade to Pro &rarr;
          </Link>
        </section>
      )}
      {plan === "free" && monthlyCount >= FREE_TIER_LIMIT && (
        <section className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 space-y-2">
          <p className="text-sm text-red-400 font-medium">Monthly limit reached.</p>
          <p className="text-xs text-gray-400">You&apos;ve used all 10 reflections this month. Upgrade to Pro to keep reflecting.</p>
          <Link href="/dashboard/settings" className="inline-block mt-1 bg-amber-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-400 transition-all duration-200">
            Upgrade to Pro
          </Link>
        </section>
      )}

      {/* Active session banner */}
      {activeSession && (
        <section>
          <ActiveSessionBanner session={activeSession} />
        </section>
      )}

      {/* Resurfacing card */}
      <ResurfacingCard />

      {/* Start session CTA */}
      {!activeSession && (
        <section>
          <Link
            href="/dashboard/session/new"
            className="inline-flex items-center gap-2 bg-amber-500 text-black px-6 py-3 rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Start a Session
          </Link>
        </section>
      )}

      {/* Empty state */}
      {isEmpty && (
        <section className="text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            Your library is empty. Start your first session to begin building
            your collection of thoughts.
          </p>
        </section>
      )}

      {/* Quick link to library */}
      {lifetimeCount > 0 && (
        <section>
          <Link
            href="/dashboard/library"
            className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
          >
            View your library &rarr;
          </Link>
        </section>
      )}
    </div>
  );
}
