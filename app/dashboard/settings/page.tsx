"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { FREE_TIER_LIMIT } from "@/lib/constants";

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Dubai",
  "Australia/Sydney",
  "Pacific/Auckland",
];

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const profile = useQuery(api.profiles.get);
  const exportData = useQuery(api.export.getAllData);
  const updateProfile = useMutation(api.profiles.update);
  const deleteAccount = useMutation(api.account.deleteAccount);

  const [deletePhrase, setDeletePhrase] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [billingLoading, setBillingLoading] = useState(false);

  // Loading state
  if (profile === undefined) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 skeleton rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (!profile) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-center">
          <p className="text-gray-400 text-sm mb-3">Could not load profile.</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  async function handleTimezoneChange(tz: string) {
    try {
      await updateProfile({ timezone: tz });
      toast.success("Timezone updated.");
    } catch {
      setError("Failed to update timezone.");
    }
  }

  async function handleExport() {
    if (!exportData) return;
    setIsExporting(true);
    try {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `distill-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Data exported.");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleDeleteAccount() {
    if (deletePhrase !== "DELETE MY ACCOUNT") return;
    setIsDeleting(true);
    setError("");
    try {
      await deleteAccount();
      await signOut({ redirectUrl: "/" });
    } catch {
      setError("Something went wrong. Please try again.");
      setIsDeleting(false);
    }
  }

  async function handleManageBilling() {
    setBillingLoading(true);
    try {
      const res = await fetch("/api/stripe/create-portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Could not open billing portal.");
    } finally {
      setBillingLoading(false);
    }
  }

  async function handleUpgrade() {
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "monthly" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Could not start checkout.");
    }
  }

  const monthlyCount = profile.reflectionCountThisMonth ?? 0;
  const progressPct = Math.min((monthlyCount / FREE_TIER_LIMIT) * 100, 100);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Settings</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Profile Section */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <h2 className="font-medium text-white">Profile</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">Email</label>
            <p className="text-sm text-gray-300 mt-0.5">
              {user?.primaryEmailAddress?.emailAddress ?? "\u2014"}
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">Account created</label>
            <p className="text-sm text-gray-300 mt-0.5">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "\u2014"}
            </p>
          </div>
        </div>
      </section>

      {/* Plan Section */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <h2 className="font-medium text-white">Plan</h2>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              profile.plan === "pro"
                ? "bg-amber-500/20 text-amber-500"
                : "bg-white/10 text-gray-400"
            }`}
          >
            {profile.plan === "pro" ? "Pro" : "Free"}
          </span>
        </div>

        {profile.plan === "free" && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  {monthlyCount} / {FREE_TIER_LIMIT} reflections this month
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            <button
              onClick={handleUpgrade}
              className="bg-amber-500 text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all duration-200"
            >
              Upgrade to Pro
            </button>
            <p className="text-xs text-gray-500">
              &#x20B9;249/month in India — $8/month everywhere else
            </p>
          </>
        )}

        {profile.plan === "pro" && (
          <>
            <p className="text-sm text-gray-400">Unlimited reflections</p>
            {profile.subscriptionPeriodEnd && (
              <p className="text-xs text-gray-500">
                Renews{" "}
                {new Date(profile.subscriptionPeriodEnd).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}
              </p>
            )}
            <button
              onClick={handleManageBilling}
              disabled={billingLoading}
              className="border border-white/10 text-gray-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/5 disabled:opacity-50 transition-all duration-200"
            >
              {billingLoading ? "Loading..." : "Manage billing"}
            </button>
          </>
        )}
      </section>

      {/* Streak Section */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <h2 className="font-medium text-white">Streak</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-white">{profile.currentStreak}</p>
            <p className="text-xs text-gray-500">Current streak</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{profile.longestStreak}</p>
            <p className="text-xs text-gray-500">Longest streak</p>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-400">
              Streak freeze: {profile.streakFreezeUsedThisMonth ?? 0} of 1 used this month
            </p>
            {profile.plan === "free" && (
              <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-full font-medium">
                Pro
              </span>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="timezone"
            className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5"
          >
            Timezone
          </label>
          <select
            id="timezone"
            value={profile.timezone}
            onChange={(e) => handleTimezoneChange(e.target.value)}
            className="block w-full max-w-xs bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-200"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz} className="bg-[#111] text-white">
                {tz.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Data Section */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <h2 className="font-medium text-white">Data</h2>
        <div className="space-y-3">
          <div>
            <button
              onClick={handleExport}
              disabled={isExporting || !exportData}
              className="bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isExporting ? "Exporting..." : "Export all my data"}
            </button>
            <p className="text-xs text-gray-500 mt-1.5">
              Downloads a JSON file with all your reflections, sessions, and profile data.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Delete account
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-300">
                  This will permanently delete your account and all reflections
                  in 30 days. Type{" "}
                  <span className="font-mono font-semibold text-white">
                    DELETE MY ACCOUNT
                  </span>{" "}
                  to confirm.
                </p>
                <input
                  type="text"
                  value={deletePhrase}
                  onChange={(e) => setDeletePhrase(e.target.value)}
                  placeholder="Type DELETE MY ACCOUNT"
                  className="block w-full max-w-sm bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-200"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deletePhrase !== "DELETE MY ACCOUNT" || isDeleting}
                    className="text-sm bg-red-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isDeleting ? "Deleting..." : "Delete my account"}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletePhrase("");
                    }}
                    className="text-sm text-gray-400 px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
