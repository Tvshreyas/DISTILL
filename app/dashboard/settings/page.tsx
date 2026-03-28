"use client";

import { useClerk } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import {
  Bell,
  CreditCard,
  Download,
  LogOut,
  Globe,
  Settings2,
  ShieldAlert,
  Snowflake,
  Share2,
} from "lucide-react";
import posthog from "posthog-js";
import { MagnetizeButton } from "@/components/ui/magnetize-button";

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const DELETE_CONFIRMATION_PHRASE = "DELETE MY ACCOUNT";

export default function SettingsPage() {
  const { signOut } = useClerk();
  const profile = useQuery(api.profiles.get);
  const updateProfile = useMutation(api.profiles.update);
  const deleteAccount = useMutation(api.profiles.removeAccount);
  const applyFreeze = useMutation(api.profiles.applyStreakFreeze);

  const [isExporting, setIsExporting] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isFreezing, setIsFreezing] = useState(false);
  const [updatingPref, setUpdatingPref] = useState<string | null>(null);

  if (profile === undefined)
    return (
      <div className="p-8 text-muted-text animate-pulse">
        Loading settings...
      </div>
    );
  if (!profile)
    return (
      <div className="p-8 text-muted-text text-center">Profile not found.</div>
    );

  async function handleTimezoneChange(tz: string) {
    try {
      await updateProfile({ timezone: tz });
      toast.success("Timezone updated.");
    } catch {
      toast.error("Failed to update timezone.");
    }
  }

  async function handleManageSubscription() {
    setIsPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/create-portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        const parsed = new URL(data.url);
        if (
          !["checkout.stripe.com", "billing.stripe.com"].includes(
            parsed.hostname,
          )
        ) {
          toast.error("Unexpected redirect destination.");
          return;
        }
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Could not open billing portal.");
      }
    } catch {
      toast.error("Subscription management unavailable.");
    } finally {
      setIsPortalLoading(false);
    }
  }

  async function handleExportData() {
    setIsExporting(true);
    try {
      const res = await fetch("/api/export");
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `distill-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Data export ready.");
    } catch {
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleDeleteAccount() {
    try {
      await deleteAccount();
      toast.success("Account deleted. Goodbye.");
      signOut({ redirectUrl: "/" });
    } catch {
      toast.error("Failed to delete account. Contact support.");
    }
  }

  async function handleApplyFreeze() {
    setIsFreezing(true);
    try {
      await applyFreeze();
      toast.success("Streak freeze applied.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to apply freeze.",
      );
    } finally {
      setIsFreezing(false);
    }
  }

  const canDelete = deleteInput === DELETE_CONFIRMATION_PHRASE;

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-20">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <Settings2 className="w-8 h-8 text-soft-black" />
          <h1 className="font-grotesk text-4xl font-black lowercase tracking-tighter">
            Settings
          </h1>
        </div>
        <p className="text-muted-text font-medium text-lg">
          Manage your account and preferences.
        </p>
      </header>

      {/* Subscription Section */}
      <section className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-soft-black/40 flex items-center gap-2">
          <CreditCard className="w-3 h-3" /> Billing & Plan
        </h2>
        <div className="p-8 rounded-[2rem] bg-white brutal-border border-4 border-soft-black space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-black uppercase text-muted-text tracking-widest">
                Current Plan
              </p>
              <h3 className="text-2xl font-black lowercase">{profile.plan}</h3>
            </div>
            <div
              className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${profile.plan === "pro" ? "bg-sage text-sage-dark" : "bg-peach/20 text-peach-dark"}`}
            >
              {profile.plan === "pro" ? "Active" : "Standard"}
            </div>
          </div>

          <MagnetizeButton
            onClick={handleManageSubscription}
            disabled={isPortalLoading}
            className="w-full py-4 bg-soft-black text-white rounded-2xl font-black hover:bg-soft-black/90 transition-all"
          >
            {isPortalLoading
              ? "opening portal..."
              : profile.plan === "pro"
                ? "Manage Subscription"
                : "Upgrade to Pro"}
          </MagnetizeButton>
        </div>
      </section>

      {/* Streak Freeze Section */}
      <section className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-soft-black/40 flex items-center gap-2">
          <Snowflake className="w-3 h-3" /> Streak Freeze
        </h2>
        <div className="p-8 rounded-[2rem] bg-white brutal-border border-4 border-soft-black space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="font-black text-xl lowercase">streak freeze</h3>
              <p className="text-sm font-medium text-muted-text">
                Protect your streak when you miss a day. 1 available per month.
              </p>
            </div>
            <div
              className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                profile.streakFreezeUsedThisMonth >= 1
                  ? "bg-soft-black/10 text-muted-text"
                  : "bg-sage text-sage-dark"
              }`}
            >
              {profile.streakFreezeUsedThisMonth >= 1 ? "Used" : "Available"}
            </div>
          </div>

          <button
            onClick={handleApplyFreeze}
            disabled={isFreezing || profile.streakFreezeUsedThisMonth >= 1}
            className="flex items-center gap-2 px-6 py-3 bg-white border-4 border-soft-black rounded-xl font-black text-sm hover:bg-sage/10 transition-all disabled:opacity-30 disabled:hover:bg-white"
          >
            <Snowflake className="w-4 h-4" />
            {isFreezing
              ? "Applying..."
              : profile.streakFreezeUsedThisMonth >= 1
                ? "Already used this month"
                : "Apply Freeze"}
          </button>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-soft-black/40 flex items-center gap-2">
          <Globe className="w-3 h-3" /> Preferences
        </h2>
        <div className="p-8 rounded-[2rem] bg-white brutal-border border-4 border-soft-black">
          <label className="text-xs font-black uppercase text-muted-text tracking-widest block mb-4">
            Timezone
            <div className="relative">
              <select
                value={profile.timezone}
                onChange={(e) => handleTimezoneChange(e.target.value)}
                className="w-full p-4 rounded-xl bg-sage/5 border-2 border-soft-black font-bold text-soft-black appearance-none outline-none focus:bg-sage/10 transition-all"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Globe className="w-4 h-4 text-soft-black/40" />
              </div>
            </div>
          </label>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-soft-black/40 flex items-center gap-2">
          <Bell className="w-3 h-3" /> Email Notifications
        </h2>
        <div className="p-8 rounded-[2rem] bg-white brutal-border border-4 border-soft-black space-y-6">
          <p className="text-sm font-medium text-muted-text">
            All notifications are opt-in. Emails are sent at your preferred hour
            in your timezone ({profile.timezone.replace(/_/g, " ")}).
          </p>

          {/* Toggle: Resurfacing emails */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-black text-sm lowercase">
                resurfacing emails
              </h3>
              <p className="text-xs text-muted-text">
                Past reflections resurface via email when due.
              </p>
            </div>
            <button
              disabled={updatingPref === "resurfacing"}
              onClick={async () => {
                setUpdatingPref("resurfacing");
                const next = !profile.resurfacingEmailsEnabled;
                try {
                  await updateProfile({ resurfacingEmailsEnabled: next });
                  toast.success(
                    next
                      ? "Resurfacing emails enabled."
                      : "Resurfacing emails disabled.",
                  );
                } catch {
                  toast.error("Failed to update preference.");
                } finally {
                  setUpdatingPref(null);
                }
              }}
              className={`relative w-12 h-7 rounded-full border-2 border-soft-black transition-colors disabled:opacity-50 ${profile.resurfacingEmailsEnabled ? "bg-sage" : "bg-soft-black/10"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white border-2 border-soft-black transition-transform ${profile.resurfacingEmailsEnabled ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>

          {/* Toggle: Streak reminders */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-black text-sm lowercase">streak reminders</h3>
              <p className="text-xs text-muted-text">
                A reminder when your streak is active but no reflection recorded
                today.
              </p>
            </div>
            <button
              disabled={updatingPref === "streak"}
              onClick={async () => {
                setUpdatingPref("streak");
                const next = !profile.streakRemindersEnabled;
                try {
                  await updateProfile({ streakRemindersEnabled: next });
                  toast.success(
                    next
                      ? "Streak reminders enabled."
                      : "Streak reminders disabled.",
                  );
                } catch {
                  toast.error("Failed to update preference.");
                } finally {
                  setUpdatingPref(null);
                }
              }}
              className={`relative w-12 h-7 rounded-full border-2 border-soft-black transition-colors disabled:opacity-50 ${profile.streakRemindersEnabled ? "bg-sage" : "bg-soft-black/10"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white border-2 border-soft-black transition-transform ${profile.streakRemindersEnabled ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>

          {/* Toggle: Weekly summary */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-black text-sm lowercase">weekly summary</h3>
              <p className="text-xs text-muted-text">
                A summary of your reflections, sent Sundays.
              </p>
            </div>
            <button
              disabled={updatingPref === "weekly"}
              onClick={async () => {
                setUpdatingPref("weekly");
                const next = !profile.weeklySummaryEnabled;
                try {
                  await updateProfile({ weeklySummaryEnabled: next });
                  toast.success(
                    next
                      ? "Weekly summary enabled."
                      : "Weekly summary disabled.",
                  );
                } catch {
                  toast.error("Failed to update preference.");
                } finally {
                  setUpdatingPref(null);
                }
              }}
              className={`relative w-12 h-7 rounded-full border-2 border-soft-black transition-colors disabled:opacity-50 ${profile.weeklySummaryEnabled ? "bg-sage" : "bg-soft-black/10"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white border-2 border-soft-black transition-transform ${profile.weeklySummaryEnabled ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>

          {/* Preferred notification hour */}
          <div className="pt-2 border-t border-soft-black/10">
            <label className="text-xs font-black uppercase text-muted-text tracking-widest block mb-3">
              Preferred Send Time
              <div className="relative">
                <select
                  value={profile.preferredNotificationHour ?? 9}
                  onChange={async (e) => {
                    try {
                      await updateProfile({
                        preferredNotificationHour: parseInt(e.target.value, 10),
                      });
                      toast.success("Notification time updated.");
                    } catch {
                      toast.error("Failed to update time.");
                    }
                  }}
                  className="w-full p-4 rounded-xl bg-sage/5 border-2 border-soft-black font-bold text-soft-black appearance-none outline-none focus:bg-sage/10 transition-all"
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const period = i >= 12 ? "PM" : "AM";
                    const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
                    return (
                      <option key={`hour-${i}`} value={i}>
                        {hour}:00 {period}
                      </option>
                    );
                  })}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Bell className="w-4 h-4 text-soft-black/40" />
                </div>
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-soft-black/40 flex items-center gap-2">
          <Share2 className="w-3 h-3" /> Share Distill
        </h2>
        <div className="p-8 rounded-[2rem] bg-white brutal-border border-4 border-soft-black space-y-4">
          <p className="text-sm font-medium text-muted-text">
            Know someone who consumes a lot of content? Share distill with them.
          </p>
          <button
            onClick={async () => {
              const shareUrl =
                "https://distillwise.com?utm_source=referral&utm_medium=share&utm_campaign=user_share";
              const shareData = {
                title: "Distill — stop absorbing, start thinking",
                text: "A tool that helps you capture your own perspective after consuming books, videos, articles, and podcasts.",
                url: shareUrl,
              };
              const canShare = typeof navigator.share === "function";
              try {
                if (canShare) {
                  await navigator.share(shareData);
                } else {
                  await navigator.clipboard.writeText(shareUrl);
                  toast.success("Link copied.");
                }
                posthog.capture("shared_distill", {
                  method: canShare ? "native" : "clipboard",
                });
              } catch {
                // User cancelled native share — not an error
              }
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-soft-black rounded-xl font-black text-sm hover:bg-peach/10 transition-all brutal-border-sm"
          >
            <Share2 className="w-4 h-4" /> Share Distill
          </button>
        </div>
      </section>

      {/* Data Section */}
      <section className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-soft-black/40 flex items-center gap-2">
          <Download className="w-3 h-3" /> Data Portability
        </h2>
        <div className="p-8 rounded-[2rem] bg-white brutal-border border-4 border-soft-black space-y-4">
          <p className="text-sm font-medium text-muted-text">
            Export all your reflections and perspectives in a clean,
            human-readable JSON format.
          </p>
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-soft-black rounded-xl font-black text-sm hover:bg-sage/10 transition-all brutal-border-sm"
          >
            <Download className="w-4 h-4" />{" "}
            {isExporting ? "Exporting..." : "Export My Data"}
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-red-400 flex items-center gap-2">
          <ShieldAlert className="w-3 h-3" /> Danger Zone
        </h2>
        <div className="p-8 rounded-[2rem] bg-red-50/50 border-4 border-red-200 border-dashed space-y-6">
          <div className="space-y-2">
            <h3 className="font-black text-red-600 lowercase text-xl">
              Delete Account
            </h3>
            <p className="text-sm font-medium text-red-400">
              Permanently remove your profile and all reflections. This action
              is irreversible.
            </p>
          </div>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-3 bg-red-500 text-white rounded-xl font-black text-sm hover:bg-red-600 transition-all"
            >
              Delete My Account
            </button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-red-500 block">
                  Type &ldquo;{DELETE_CONFIRMATION_PHRASE}&rdquo; to confirm
                </label>
                <input
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder={DELETE_CONFIRMATION_PHRASE}
                  className="w-full p-4 rounded-xl border-2 border-red-300 bg-white font-bold text-red-600 placeholder:text-red-200 outline-none focus:border-red-500 transition-all"
                  autoFocus
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteAccount}
                  disabled={!canDelete}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-black text-sm disabled:opacity-30 transition-all"
                >
                  Confirm Irreversible Deletion
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteInput("");
                  }}
                  className="px-6 py-3 bg-white border-2 border-soft-black rounded-xl font-black text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="pt-10 flex justify-center">
        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          className="flex items-center gap-2 font-black text-muted-text hover:text-soft-black transition-colors uppercase text-xs tracking-widest"
        >
          <LogOut className="w-4 h-4" /> Sign out of Distill
        </button>
      </footer>
    </div>
  );
}
