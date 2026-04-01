"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import ActiveSessionBanner from "@/components/ActiveSessionBanner";
import ResurfacingCard from "@/components/ResurfacingCard";
import StreakHeatmap from "@/components/StreakHeatmap";
import { WordReveal } from "@/components/ui/word-reveal";
import OnboardingReflectionRestore from "@/components/OnboardingReflectionRestore";
import QuickDistill from "@/components/QuickDistill";
import posthog from "posthog-js";
import { toast } from "sonner";
import {
  Flame,
  BookOpen,
  PenTool,
  TrendingUp,
  Sparkles,
  Check,
  ArrowRight,
  CalendarDays,
  X,
  ArchiveRestore,
  Lock,
} from "lucide-react";
import UpgradeModal from "@/components/UpgradeModal";
import { FREE_TIER_LIMIT } from "@/lib/constants";

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

// Goal Gradient — milestones feel closer as you approach them
const MILESTONES = [1, 3, 5, 10, 25, 50, 100, 250, 500, 1000];

function getNextMilestone(current: number) {
  for (const m of MILESTONES) {
    if (current < m) return m;
  }
  return current + 100;
}

// Loss Aversion — calculate hours until streak dies
function getStreakUrgency(
  lastReflectionDate: string | undefined,
  timezone: string,
): { hoursLeft: number; isUrgent: boolean } | null {
  if (!lastReflectionDate) return null;

  const now = new Date();
  const todayStr = toDateString(now, timezone);

  // Already reflected today — no urgency
  if (lastReflectionDate === todayStr) return null;

  // Calculate end of today in user's timezone
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  const hoursLeft = Math.max(
    0,
    Math.floor((endOfDay.getTime() - now.getTime()) / (1000 * 60 * 60)),
  );

  return { hoursLeft, isUrgent: hoursLeft <= 6 };
}

// Identity Labels — earned titles based on reflection count
function getIdentityLabel(reflectionCount: number): {
  label: string;
  description: string;
} {
  if (reflectionCount >= 100)
    return {
      label: "Deep Thinker",
      description: "100+ reflections. your perspective is an archive.",
    };
  if (reflectionCount >= 50)
    return {
      label: "Pattern Finder",
      description: "50+ reflections. connections are forming.",
    };
  if (reflectionCount >= 25)
    return {
      label: "Consistent Mind",
      description: "25+ reflections. the habit is yours now.",
    };
  if (reflectionCount >= 10)
    return {
      label: "Active Thinker",
      description: "10+ reflections. you think for yourself.",
    };
  if (reflectionCount >= 3)
    return {
      label: "Emerging Voice",
      description: "your own perspective is taking shape.",
    };
  return {
    label: "New Thinker",
    description: "every reflection compounds. start here.",
  };
}

function MonthlyDigestCard() {
  const profile = useQuery(api.profiles.get);
  const digest = useQuery(api.reflections.getMonthlyDigest);
  const updateProfile = useMutation(api.profiles.update);

  if (!digest || !profile) return null;

  // Check if already dismissed for current month
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  if (profile.lastDigestDismissedMonth === currentMonth) return null;

  const handleDismiss = async () => {
    try {
      await updateProfile({ lastDigestDismissedMonth: currentMonth });
    } catch {
      toast.error("Failed to dismiss.");
    }
  };

  return (
    <div className="p-6 md:p-8 rounded-[2rem] bg-sage/10 border-2 border-sage/30 space-y-3 relative">
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-sage/20 transition-colors text-muted-text hover:text-soft-black"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-2">
        <CalendarDays className="w-4 h-4 text-sage-dark" />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-text">
          Monthly Digest
        </span>
      </div>
      <p className="font-grotesk text-lg font-black lowercase leading-snug text-soft-black">
        in {digest.monthLabel.toLowerCase()}, you wrote{" "}
        {digest.totalReflections} reflection
        {digest.totalReflections !== 1 ? "s" : ""} across {digest.contentTypes}{" "}
        type{digest.contentTypes !== 1 ? "s" : ""}.
        {digest.totalWords > 0 &&
          ` ${digest.totalWords.toLocaleString()} words total.`}
        {digest.longestStreak > 0 &&
          ` your longest streak was ${digest.longestStreak} days.`}
      </p>
    </div>
  );
}

function ResurfacingHero() {
  const pending = useQuery(api.resurfacing.getPending);
  const respond = useMutation(api.resurfacing.respond);
  const [isResponding, setIsResponding] = useState(false);
  const [isLayering, setIsLayering] = useState(false);
  const [layerContent, setLayerContent] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (!pending) return null;

  const handleStillTrue = async () => {
    setIsResponding(true);
    try {
      await respond({ queueId: pending.queueId, action: "surfaced" });
      toast.success("Acknowledged.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to respond.");
    } finally {
      setIsResponding(false);
    }
  };

  const handleLayered = async () => {
    if (!layerContent.trim()) return;
    setIsResponding(true);
    try {
      await respond({
        queueId: pending.queueId,
        action: "layered",
        layerContent: layerContent.trim(),
      });
      toast.success("Perspective layered.");
      setIsLayering(false);
      setLayerContent("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save layer.");
    } finally {
      setIsResponding(false);
    }
  };

  return (
    <div className="p-6 md:p-8 rounded-[2rem] bg-lavender/10 border-2 border-lavender/30 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-lavender" />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-text">
          {pending.daysAgo} days ago, you thought...
        </span>
      </div>

      <p className="text-lg md:text-xl font-medium text-soft-black leading-relaxed italic border-l-4 border-lavender/30 pl-4 line-clamp-3">
        &ldquo;{pending.reflection.content}&rdquo;
      </p>

      {pending.session?.title && (
        <p className="text-xs text-muted-text font-bold lowercase">
          from: {pending.session.title}
        </p>
      )}

      {isLayering ? (
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-text block">
            How has your thinking shifted?
          </label>
          <textarea
            value={layerContent}
            onChange={(e) => setLayerContent(e.target.value)}
            placeholder="Write how your perspective has changed..."
            className="w-full bg-white brutal-border-sm p-4 text-sm font-medium focus:outline-none min-h-[100px] rounded-xl resize-none"
            maxLength={3000}
          />
          <div className="flex gap-3">
            <button
              onClick={handleLayered}
              disabled={isResponding || !layerContent.trim()}
              className="px-5 py-2.5 bg-lavender text-soft-black rounded-xl font-bold text-sm brutal-border-sm shadow-[2px_2px_0px_#292524] hover:bg-lavender/90 disabled:opacity-50"
            >
              {isResponding ? "Saving..." : "Save Layer"}
            </button>
            <button
              onClick={() => {
                setIsLayering(false);
                setLayerContent("");
              }}
              className="px-5 py-2.5 text-muted-text font-bold text-sm hover:text-soft-black"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleStillTrue}
            disabled={isResponding}
            className="px-5 py-2.5 bg-soft-black text-white rounded-xl font-bold text-sm hover:bg-soft-black/90 transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Still true
          </button>
          {pending.plan === "free" && pending.hasExistingLayer ? (
            <button
              onClick={() => setShowUpgrade(true)}
              className="px-5 py-2.5 text-muted-text font-bold text-sm hover:text-soft-black transition-colors flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              unlock unlimited layers
              <span className="text-[10px] font-black uppercase tracking-wider bg-soft-black/10 px-2 py-0.5 rounded-full">
                pro
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsLayering(true)}
              className="px-5 py-2.5 bg-white border-2 border-soft-black rounded-xl font-bold text-sm hover:bg-lavender/10 transition-all flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" /> My thinking shifted
            </button>
          )}
        </div>
      )}
      <UpgradeModal
        isOpen={showUpgrade}
        onCloseAction={() => setShowUpgrade(false)}
      />
    </div>
  );
}

// Variable Reward — random past reflection surfaces daily
function ArchiveSpotlight() {
  const archiveItem = useQuery(api.reflections.randomFromArchive);

  if (!archiveItem) return null;

  return (
    <Link
      href={`/dashboard/library/${archiveItem._id}`}
      className="block p-6 md:p-8 rounded-[2rem] bg-peach/5 border-2 border-peach/20 space-y-3 hover:bg-peach/10 transition-colors group"
    >
      <div className="flex items-center gap-2">
        <ArchiveRestore className="w-4 h-4 text-peach" />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-text">
          From Your Archive
          {archiveItem.daysAgo > 0 && ` · ${archiveItem.daysAgo}d ago`}
        </span>
      </div>

      <p className="text-lg font-medium text-soft-black leading-relaxed italic border-l-4 border-peach/30 pl-4 line-clamp-3">
        &ldquo;{archiveItem.content}&rdquo;
      </p>

      {archiveItem.sessionTitle && (
        <p className="text-xs text-muted-text font-bold lowercase">
          from: {archiveItem.sessionTitle}
        </p>
      )}

      <span className="text-[10px] font-black uppercase tracking-widest text-peach group-hover:text-soft-black transition-colors flex items-center gap-1">
        revisit this thought <ArrowRight className="w-3 h-3" />
      </span>
    </Link>
  );
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
      toast.success("Welcome to Pro.");
      // Clean URL without reload
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const dashboardData = useMemo(() => {
    if (!profile) return null;

    const currentStreak = profile.currentStreak ?? 0;
    const userTimezone = profile.timezone ?? "UTC";
    const lifetimeReflections = profile.reflectionCountLifetime ?? 0;
    const totalWords = profile.totalWordsWritten ?? 0;
    const nextMilestone = getNextMilestone(lifetimeReflections);
    const milestoneProgress = lifetimeReflections / nextMilestone;
    const streakUrgency =
      currentStreak > 0
        ? getStreakUrgency(profile.lastReflectionDate, userTimezone)
        : null;
    const identity = getIdentityLabel(lifetimeReflections);

    const reflectionDates = new Set(
      (recentReflections ?? []).map((r) =>
        toDateString(new Date(r._creationTime), userTimezone),
      ),
    );
    const monthDays = getMonthDays(userTimezone);

    return {
      currentStreak,
      userTimezone,
      lifetimeReflections,
      totalWords,
      nextMilestone,
      milestoneProgress,
      streakUrgency,
      identity,
      reflectionDates,
      monthDays,
    };
  }, [profile, recentReflections]);

  if (profile === undefined)
    return (
      <div className="space-y-12 animate-pulse">
        <div className="space-y-2">
          <div className="h-12 w-56 bg-soft-black/10 rounded-2xl" />
          <div className="h-4 w-72 bg-soft-black/5 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 h-60 bg-peach/10 rounded-[2rem] border-4 border-soft-black/10" />
          <div className="lg:col-span-8 h-60 bg-soft-black/5 rounded-[2rem] border-2 border-soft-black/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-36 bg-white/50 rounded-2xl border-2 border-soft-black/10" />
          <div className="h-36 bg-white/50 rounded-2xl border-2 border-soft-black/10" />
          <div className="h-36 bg-white/50 rounded-2xl border-2 border-soft-black/10" />
        </div>
      </div>
    );
  if (!profile)
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="p-8 rounded-[2rem] border-4 border-soft-black bg-peach/10 max-w-sm space-y-4">
          <h2 className="font-grotesk text-xl font-black text-soft-black">
            setting up your archive.
          </h2>
          <p className="text-sm text-muted-text">
            we&apos;re initializing your thinking space.
          </p>
          <div className="flex justify-center pt-2">
            <div className="w-8 h-8 border-4 border-soft-black border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  if (!dashboardData) return null;

  const {
    currentStreak,
    lifetimeReflections,
    totalWords,
    nextMilestone,
    milestoneProgress,
    streakUrgency,
    identity,
    reflectionDates,
    monthDays,
  } = dashboardData;

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

      {profile.plan === "free" && (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sage/20 border border-sage/50 rounded-full">
          <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-soft-black/80">
            {Math.max(0, FREE_TIER_LIMIT - (profile.deepSessionsCount ?? 0))}{" "}
            deep sessions left this month
          </span>
          <Link
            href="/dashboard/session/new"
            className="text-[10px] font-black uppercase tracking-wider text-sage-dark hover:text-soft-black transition-colors"
          >
            start &rarr;
          </Link>
        </div>
      )}

      <QuickDistill />

      <ResurfacingHero />

      <ArchiveSpotlight />

      <MonthlyDigestCard />

      {/* === LOSS AVERSION: Streak urgency banner === */}
      {streakUrgency && (
        <div
          className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 border-soft-black ${
            streakUrgency.isUrgent ? "bg-peach/30 animate-pulse" : "bg-peach/10"
          }`}
        >
          <Flame
            className={`w-5 h-5 ${streakUrgency.isUrgent ? "text-red-500" : "text-peach"}`}
          />
          <span className="font-grotesk text-sm font-bold">
            {streakUrgency.isUrgent
              ? `${streakUrgency.hoursLeft}h left to keep your ${currentStreak}-day streak alive.`
              : `Reflect today to extend your ${currentStreak}-day streak.`}
          </span>
          <Link
            href="/dashboard/session/new"
            className="ml-auto text-xs font-black uppercase tracking-wider bg-soft-black text-white px-4 py-2 rounded-full hover:bg-peach hover:text-soft-black transition-colors"
          >
            Reflect now
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Streak Counter + Identity Label */}
        <section className="lg:col-span-4 p-8 rounded-[2rem] border-4 border-soft-black bg-peach/10 relative overflow-hidden group hover:bg-peach/20 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.312 10.5c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" />
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h2 className="font-grotesk text-xs font-bold uppercase tracking-[0.2em] text-muted-text mb-4">
            Current Streak
          </h2>
          <div className="flex items-baseline gap-2">
            <span className="font-grotesk text-7xl font-black text-soft-black">
              {currentStreak}
            </span>
            <span className="font-grotesk text-xl font-bold text-soft-black/40 lowercase">
              days
            </span>
          </div>

          {/* IDENTITY LABELING — earned title */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-soft-black text-white text-[10px] font-bold rounded-full uppercase tracking-tighter">
                {identity.label}
              </div>
              {currentStreak > 0 && (
                <Flame className="w-4 h-4 text-peach animate-pulse" />
              )}
            </div>
            <p className="text-[10px] text-muted-text font-medium lowercase tracking-wide">
              {identity.description}
            </p>
          </div>
        </section>

        {/* 30-Day Activity Heatmap */}
        <section className="lg:col-span-8">
          <StreakHeatmap dates={reflectionDates} monthDays={monthDays} />
        </section>
      </div>

      {/* === ENDOWMENT EFFECT + GOAL GRADIENT: Your thinking portfolio === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total reflections */}
        <div className="p-6 rounded-2xl border-2 border-soft-black/10 bg-white/50 backdrop-blur-sm space-y-2">
          <div className="flex items-center gap-2 text-muted-text">
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Reflections
            </span>
          </div>
          <span className="font-grotesk text-4xl font-black text-soft-black">
            {lifetimeReflections}
          </span>
          <p className="text-[10px] text-muted-text font-medium">
            {lifetimeReflections === 0
              ? "your archive starts with one."
              : lifetimeReflections === 1
                ? "the first of many."
                : `${lifetimeReflections} perspectives, uniquely yours.`}
          </p>
        </div>

        {/* Total words — the investment you've built */}
        <div className="p-6 rounded-2xl border-2 border-soft-black/10 bg-white/50 backdrop-blur-sm space-y-2">
          <div className="flex items-center gap-2 text-muted-text">
            <PenTool className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Words Written
            </span>
          </div>
          <span className="font-grotesk text-4xl font-black text-soft-black">
            {totalWords.toLocaleString()}
          </span>
          <p className="text-[10px] text-muted-text font-medium">
            {totalWords === 0
              ? "your thinking, in your words."
              : totalWords < 500
                ? "a growing body of thought."
                : totalWords < 2000
                  ? "this is becoming something real."
                  : "a library of your own thinking."}
          </p>
        </div>

        {/* GOAL GRADIENT — progress toward next milestone */}
        <div className="p-6 rounded-2xl border-2 border-soft-black/10 bg-white/50 backdrop-blur-sm space-y-2">
          <div className="flex items-center gap-2 text-muted-text">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Next Milestone
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-grotesk text-4xl font-black text-soft-black">
              {nextMilestone}
            </span>
            <span className="font-grotesk text-sm font-bold text-soft-black/40">
              reflections
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-soft-black/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-peach rounded-full transition-all duration-700"
              style={{ width: `${Math.min(milestoneProgress * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-text font-medium">
            {nextMilestone - lifetimeReflections === 1
              ? "one reflection away."
              : `${nextMilestone - lifetimeReflections} to go. keep compounding.`}
          </p>
        </div>
      </div>

      {activeSession && <ActiveSessionBanner session={activeSession} />}

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
