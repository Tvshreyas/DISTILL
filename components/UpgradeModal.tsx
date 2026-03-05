"use client";

import { useState, useEffect } from "react";

interface UpgradeModalProps {
  reflectionCount: number;
  totalWordCount: number;
  onDismiss: () => void;
}

const DISMISS_KEY = "distill_upgrade_dismissed_at";

export default function UpgradeModal({
  reflectionCount,
  totalWordCount,
  onDismiss,
}: UpgradeModalProps) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState<"monthly" | "annual" | null>(null);

  useEffect(() => {
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const dismissedDate = new Date(dismissedAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (dismissedDate > thirtyDaysAgo) {
        return;
      }
    }
    setVisible(true);
  }, []);

  function handleRemindLater() {
    localStorage.setItem(DISMISS_KEY, new Date().toISOString());
    setVisible(false);
    onDismiss();
  }

  async function handleUpgrade(plan: "monthly" | "annual") {
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(null);
      }
    } catch {
      setLoading(null);
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleRemindLater}
        role="presentation"
      />
      <div
        className="relative bg-[#111] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-heading"
      >
        <div className="space-y-2">
          <h2
            id="upgrade-heading"
            className="text-xl font-semibold text-white"
          >
            You&apos;ve written {reflectionCount} reflections this month.
          </h2>
          <p className="text-lg text-gray-400">
            {totalWordCount.toLocaleString()} words of your own thinking.
          </p>
        </div>

        <p className="text-gray-400 text-sm">
          The free plan covers 10 per month. To keep going, upgrade.
        </p>

        <ul className="space-y-2.5 text-sm text-gray-300">
          <li className="flex items-start gap-2.5">
            <span className="text-amber-500 mt-0.5 shrink-0">&#10003;</span>
            <span>
              Unlimited reflections — think as much as you want
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-amber-500 mt-0.5 shrink-0">&#10003;</span>
            <span>
              Add new perspectives to past thoughts as your view changes
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-amber-500 mt-0.5 shrink-0">&#10003;</span>
            <span>Weekly digest — one past thought, every Sunday</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-amber-500 mt-0.5 shrink-0">&#10003;</span>
            <span>Export everything — your thinking belongs to you</span>
          </li>
        </ul>

        <div className="text-sm text-gray-500">
          <p>&#x20B9;249/month in India — $8/month everywhere else</p>
          <p>Or &#x20B9;1,999/year — $72/year (save 25%)</p>
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={() => handleUpgrade("monthly")}
            disabled={loading !== null}
            className="w-full bg-amber-500 text-black py-2.5 px-4 rounded-xl font-medium hover:bg-amber-400 text-sm transition-all duration-200 disabled:opacity-50"
          >
            {loading === "monthly"
              ? "Redirecting..."
              : "Keep thinking — upgrade to Pro"}
          </button>
          <button
            onClick={() => handleUpgrade("annual")}
            disabled={loading !== null}
            className="w-full bg-white/5 border border-white/10 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-white/10 text-sm transition-all duration-200 disabled:opacity-50"
          >
            {loading === "annual"
              ? "Redirecting..."
              : "Get annual — save 25%"}
          </button>
          <button
            onClick={handleRemindLater}
            className="w-full text-gray-500 py-2 px-4 text-sm hover:text-gray-300 transition-colors"
          >
            Remind me next month
          </button>
        </div>
      </div>
    </div>
  );
}
