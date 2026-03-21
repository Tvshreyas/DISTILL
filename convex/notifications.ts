"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { v } from "convex/values";
import { ResurfacingEmail } from "../lib/email/templates/ResurfacingEmail";
import { StreakReminderEmail } from "../lib/email/templates/StreakReminderEmail";
import { WeeklySummaryEmail } from "../lib/email/templates/WeeklySummaryEmail";
import { WelcomeEmail, getWelcomeSubject } from "../lib/email/templates/WelcomeEmail";
import { ReEngagementEmail, getReEngagementSubject } from "../lib/email/templates/ReEngagementEmail";
import { UpgradeEmail, getUpgradeSubject } from "../lib/email/templates/UpgradeEmail";

const NOTIFICATION_COOLDOWN_HOURS = 24;
const NOTIFICATION_BATCH_SIZE = 50;
const DEFAULT_NOTIFICATION_HOUR = 9;

function getUserLocalHour(timezone: string): number {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      hour12: false,
    });
    return parseInt(formatter.format(now), 10);
  } catch {
    return new Date().getUTCHours();
  }
}

function getUserLocalDayOfWeek(timezone: string): number {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
    });
    return formatter.format(now) === "Sun" ? 0 : -1;
  } catch {
    return new Date().getUTCDay() === 0 ? 0 : -1;
  }
}

function getTodayInTimezone(timezone: string): string {
  try {
    return new Date().toLocaleDateString("en-CA", { timeZone: timezone });
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

async function generateUnsubscribeUrl(
  appUrl: string,
  userId: string,
  type: "resurfacing" | "streak" | "weekly" | "welcome" | "reengagement" | "upgrade",
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const payload = `${userId}:${type}`;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const hmacHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const token = btoa(`${payload}:${hmacHex}`)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${appUrl}/api/notifications/unsubscribe?token=${token}`;
}

// ────────────────────────────────────────────────────────
// Resurfacing Emails
// ────────────────────────────────────────────────────────

export const processResurfacingEmails = internalAction({
  args: {},
  handler: async (ctx) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const unsubSecret = process.env.NOTIFICATION_UNSUBSCRIBE_SECRET;

    if (!resendApiKey || !fromEmail || !appUrl || !unsubSecret) {
      console.log("[notifications] Missing env vars, skipping resurfacing emails");
      return;
    }

    const resend = new Resend(resendApiKey);
    const allProfiles = await ctx.runQuery(internal.profiles.getNotificationEligibleProfiles);

    let sent = 0;
    for (const profile of allProfiles) {
      if (sent >= NOTIFICATION_BATCH_SIZE) break;
      if (!profile.resurfacingEmailsEnabled || !profile.email) continue;

      // Check timezone match
      const userHour = getUserLocalHour(profile.timezone);
      const preferredHour = profile.preferredNotificationHour ?? DEFAULT_NOTIFICATION_HOUR;
      if (userHour !== preferredHour) continue;

      // Check cooldown
      const recentLogs = await ctx.runQuery(internal.notificationLogs.getRecentByUserAndType, {
        userId: profile.userId,
        type: "resurfacing",
        withinHours: NOTIFICATION_COOLDOWN_HOURS,
      });
      if (recentLogs.length > 0) continue;

      // Get pending resurfacing item
      const pending = await ctx.runQuery(internal.resurfacing.getPendingForUser, {
        userId: profile.userId,
      });
      if (!pending) continue;

      try {
        const unsubscribeUrl = await generateUnsubscribeUrl(appUrl, profile.userId, "resurfacing", unsubSecret);
        const dashboardUrl = `${appUrl}/dashboard`;

        const html = await render(
          ResurfacingEmail({
            daysAgo: pending.daysAgo,
            reflectionContent: pending.reflectionContent,
            contentTitle: pending.contentTitle,
            contentType: pending.contentType,
            dashboardUrl,
            unsubscribeUrl,
          })
        );

        const result = await resend.emails.send({
          from: fromEmail,
          to: profile.email,
          subject: `${pending.daysAgo} days ago, you thought...`,
          html,
        });

        await ctx.runMutation(internal.notificationLogs.log, {
          userId: profile.userId,
          type: "resurfacing",
          sentAt: new Date().toISOString(),
          emailId: result.data?.id,
        });

        sent++;
      } catch (err) {
        console.error(`[notifications] Failed to send resurfacing email to ${profile.userId}:`, err);
      }
    }

    if (sent > 0) {
      console.log(`[notifications] Sent ${sent} resurfacing emails`);
    }
  },
});

// ────────────────────────────────────────────────────────
// Streak Reminders
// ────────────────────────────────────────────────────────

export const processStreakReminders = internalAction({
  args: {},
  handler: async (ctx) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const unsubSecret = process.env.NOTIFICATION_UNSUBSCRIBE_SECRET;

    if (!resendApiKey || !fromEmail || !appUrl || !unsubSecret) {
      console.log("[notifications] Missing env vars, skipping streak reminders");
      return;
    }

    const resend = new Resend(resendApiKey);
    const allProfiles = await ctx.runQuery(internal.profiles.getNotificationEligibleProfiles);

    let sent = 0;
    for (const profile of allProfiles) {
      if (sent >= NOTIFICATION_BATCH_SIZE) break;
      if (!profile.streakRemindersEnabled || !profile.email) continue;
      if (profile.currentStreak <= 0) continue;

      // Check timezone match
      const userHour = getUserLocalHour(profile.timezone);
      const preferredHour = profile.preferredNotificationHour ?? DEFAULT_NOTIFICATION_HOUR;
      if (userHour !== preferredHour) continue;

      // Check if they already reflected today
      const todayStr = getTodayInTimezone(profile.timezone);
      if (profile.lastReflectionDate === todayStr) continue;

      // Check cooldown
      const recentLogs = await ctx.runQuery(internal.notificationLogs.getRecentByUserAndType, {
        userId: profile.userId,
        type: "streak",
        withinHours: NOTIFICATION_COOLDOWN_HOURS,
      });
      if (recentLogs.length > 0) continue;

      try {
        const unsubscribeUrl = await generateUnsubscribeUrl(appUrl, profile.userId, "streak", unsubSecret);
        const dashboardUrl = `${appUrl}/dashboard`;

        const html = await render(
          StreakReminderEmail({
            currentStreak: profile.currentStreak,
            dashboardUrl,
            unsubscribeUrl,
          })
        );

        const result = await resend.emails.send({
          from: fromEmail,
          to: profile.email,
          subject: `Your ${profile.currentStreak}-day streak continues`,
          html,
        });

        await ctx.runMutation(internal.notificationLogs.log, {
          userId: profile.userId,
          type: "streak",
          sentAt: new Date().toISOString(),
          emailId: result.data?.id,
        });

        sent++;
      } catch (err) {
        console.error(`[notifications] Failed to send streak reminder to ${profile.userId}:`, err);
      }
    }

    if (sent > 0) {
      console.log(`[notifications] Sent ${sent} streak reminders`);
    }
  },
});

// ────────────────────────────────────────────────────────
// Weekly Summary
// ────────────────────────────────────────────────────────

export const processWeeklySummary = internalAction({
  args: {},
  handler: async (ctx) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const unsubSecret = process.env.NOTIFICATION_UNSUBSCRIBE_SECRET;

    if (!resendApiKey || !fromEmail || !appUrl || !unsubSecret) {
      console.log("[notifications] Missing env vars, skipping weekly summary");
      return;
    }

    const resend = new Resend(resendApiKey);
    const allProfiles = await ctx.runQuery(internal.profiles.getNotificationEligibleProfiles);

    let sent = 0;
    for (const profile of allProfiles) {
      if (sent >= NOTIFICATION_BATCH_SIZE) break;
      if (!profile.weeklySummaryEnabled || !profile.email) continue;

      // Only send on Sundays in user's timezone
      if (getUserLocalDayOfWeek(profile.timezone) !== 0) continue;

      // Check timezone match
      const userHour = getUserLocalHour(profile.timezone);
      const preferredHour = profile.preferredNotificationHour ?? DEFAULT_NOTIFICATION_HOUR;
      if (userHour !== preferredHour) continue;

      // Check cooldown (use longer window for weekly — 6 days)
      const recentLogs = await ctx.runQuery(internal.notificationLogs.getRecentByUserAndType, {
        userId: profile.userId,
        type: "weekly",
        withinHours: 144, // 6 days
      });
      if (recentLogs.length > 0) continue;

      try {
        const stats = await ctx.runQuery(internal.reflections.getWeeklyStats, {
          userId: profile.userId,
        });

        const unsubscribeUrl = await generateUnsubscribeUrl(appUrl, profile.userId, "weekly", unsubSecret);
        const dashboardUrl = `${appUrl}/dashboard`;

        const html = await render(
          WeeklySummaryEmail({
            totalReflections: stats.totalReflections,
            totalWords: stats.totalWords,
            contentTypeBreakdown: stats.contentTypeBreakdown,
            dashboardUrl,
            unsubscribeUrl,
          })
        );

        const result = await resend.emails.send({
          from: fromEmail,
          to: profile.email,
          subject: stats.totalReflections > 0
            ? `Your week: ${stats.totalReflections} reflection${stats.totalReflections !== 1 ? "s" : ""}`
            : "Your weekly summary",
          html,
        });

        await ctx.runMutation(internal.notificationLogs.log, {
          userId: profile.userId,
          type: "weekly",
          sentAt: new Date().toISOString(),
          emailId: result.data?.id,
        });

        sent++;
      } catch (err) {
        console.error(`[notifications] Failed to send weekly summary to ${profile.userId}:`, err);
      }
    }

    if (sent > 0) {
      console.log(`[notifications] Sent ${sent} weekly summaries`);
    }
  },
});

// ────────────────────────────────────────────────────────
// Welcome Sequence (scheduled per-user on signup)
// ────────────────────────────────────────────────────────

export const sendWelcomeEmail = internalAction({
  args: {
    userId: v.string(),
    step: v.number(),
  },
  handler: async (ctx, { userId, step }) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const unsubSecret = process.env.NOTIFICATION_UNSUBSCRIBE_SECRET;

    if (!resendApiKey || !fromEmail || !appUrl || !unsubSecret) {
      console.log("[notifications] Missing env vars, skipping welcome email");
      return;
    }

    const profile = await ctx.runQuery(internal.profiles.getByUserId, { userId });
    if (!profile || !profile.email) return;

    // Skip if user already received this step or later
    if ((profile.welcomeEmailStep ?? 0) >= step) return;

    // Steps 2 and 5 are conditional — skip if user has written a reflection
    if (step === 2 || step === 5) {
      if (profile.reflectionCountLifetime > 0) return;
    }

    const validStep = step as 1 | 2 | 3 | 4 | 5;

    try {
      const resend = new Resend(resendApiKey);
      const unsubscribeUrl = await generateUnsubscribeUrl(appUrl, userId, "welcome", unsubSecret);
      const dashboardUrl = `${appUrl}/dashboard`;

      const html = await render(
        WelcomeEmail({
          step: validStep,
          dashboardUrl,
          unsubscribeUrl,
        })
      );

      const result = await resend.emails.send({
        from: fromEmail,
        to: profile.email,
        subject: getWelcomeSubject(validStep),
        html,
      });

      await ctx.runMutation(internal.profiles.updateSequenceField, {
        userId,
        field: "welcomeEmailStep",
        value: step,
      });

      await ctx.runMutation(internal.notificationLogs.log, {
        userId,
        type: "welcome",
        sentAt: new Date().toISOString(),
        emailId: result.data?.id,
        metadata: { step },
      });

      console.log(`[notifications] Sent welcome email step ${step} to ${userId}`);
    } catch (err) {
      console.error(`[notifications] Failed to send welcome email step ${step} to ${userId}:`, err);
    }
  },
});

// ────────────────────────────────────────────────────────
// Re-Engagement Sequence (cron-based)
// ────────────────────────────────────────────────────────

export const processReEngagementEmails = internalAction({
  args: {},
  handler: async (ctx) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const unsubSecret = process.env.NOTIFICATION_UNSUBSCRIBE_SECRET;

    if (!resendApiKey || !fromEmail || !appUrl || !unsubSecret) {
      console.log("[notifications] Missing env vars, skipping re-engagement emails");
      return;
    }

    const resend = new Resend(resendApiKey);
    const allProfiles = await ctx.runQuery(internal.profiles.getNotificationEligibleProfiles);

    let sent = 0;
    for (const profile of allProfiles) {
      if (sent >= NOTIFICATION_BATCH_SIZE) break;
      if (!profile.email) continue;
      // Must have written at least 1 reflection ever to qualify
      if (profile.reflectionCountLifetime < 1) continue;

      // Calculate days since last reflection
      if (!profile.lastReflectionDate) continue;
      const lastReflection = new Date(profile.lastReflectionDate).getTime();
      const daysSinceReflection = Math.floor((Date.now() - lastReflection) / (24 * 60 * 60 * 1000));

      // Determine which step to send based on inactivity days
      let step: 1 | 2 | 3 | null = null;
      if (daysSinceReflection >= 30 && (profile.reEngagementStep ?? 0) < 3) {
        step = 3;
      } else if (daysSinceReflection >= 21 && (profile.reEngagementStep ?? 0) < 2) {
        step = 2;
      } else if (daysSinceReflection >= 14 && (profile.reEngagementStep ?? 0) < 1) {
        step = 1;
      }

      if (!step) continue;

      // Check cooldown (7 days between re-engagement emails)
      const recentLogs = await ctx.runQuery(internal.notificationLogs.getRecentByUserAndType, {
        userId: profile.userId,
        type: "reengagement",
        withinHours: 168, // 7 days
      });
      if (recentLogs.length > 0) continue;

      try {
        const unsubscribeUrl = await generateUnsubscribeUrl(appUrl, profile.userId, "reengagement", unsubSecret);
        const dashboardUrl = `${appUrl}/dashboard`;

        const html = await render(
          ReEngagementEmail({
            step,
            reflectionCount: profile.reflectionCountLifetime,
            dashboardUrl,
            unsubscribeUrl,
          })
        );

        const result = await resend.emails.send({
          from: fromEmail,
          to: profile.email,
          subject: getReEngagementSubject(step, profile.reflectionCountLifetime),
          html,
        });

        await ctx.runMutation(internal.profiles.updateSequenceField, {
          userId: profile.userId,
          field: "reEngagementStep",
          value: step,
        });

        await ctx.runMutation(internal.notificationLogs.log, {
          userId: profile.userId,
          type: "reengagement",
          sentAt: new Date().toISOString(),
          emailId: result.data?.id,
          metadata: { step },
        });

        sent++;
      } catch (err) {
        console.error(`[notifications] Failed to send re-engagement email to ${profile.userId}:`, err);
      }
    }

    if (sent > 0) {
      console.log(`[notifications] Sent ${sent} re-engagement emails`);
    }
  },
});

// ────────────────────────────────────────────────────────
// Upgrade Sequence (cron-based)
// ────────────────────────────────────────────────────────

export const processUpgradeEmails = internalAction({
  args: {},
  handler: async (ctx) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const unsubSecret = process.env.NOTIFICATION_UNSUBSCRIBE_SECRET;

    if (!resendApiKey || !fromEmail || !appUrl || !unsubSecret) {
      console.log("[notifications] Missing env vars, skipping upgrade emails");
      return;
    }

    const resend = new Resend(resendApiKey);
    const allProfiles = await ctx.runQuery(internal.profiles.getNotificationEligibleProfiles);

    let sent = 0;
    for (const profile of allProfiles) {
      if (sent >= NOTIFICATION_BATCH_SIZE) break;
      if (!profile.email) continue;

      let step: 1 | 2 | 3 | null = null;

      if (profile.plan === "free") {
        // Step 1: at 2/3 deep sessions this month
        if (
          profile.reflectionCountThisMonth >= 2 &&
          (profile.upgradeEmailStep ?? 0) < 1
        ) {
          step = 1;
        }
        // Step 2: hit 3/3 or start of new month after hitting limit
        else if (
          profile.reflectionCountLifetime >= 3 &&
          (profile.upgradeEmailStep ?? 0) < 2 &&
          (profile.upgradeEmailStep ?? 0) >= 1
        ) {
          step = 2;
        }
      } else if (profile.plan === "pro") {
        // Step 3: annual nudge 14 days after upgrading to monthly Pro
        if (
          profile.proUpgradeDate &&
          (profile.upgradeEmailStep ?? 0) < 3
        ) {
          const upgradeDate = new Date(profile.proUpgradeDate).getTime();
          const daysSinceUpgrade = Math.floor((Date.now() - upgradeDate) / (24 * 60 * 60 * 1000));
          if (daysSinceUpgrade >= 14) {
            step = 3;
          }
        }
      }

      if (!step) continue;

      // Check cooldown (7 days between upgrade emails)
      const recentLogs = await ctx.runQuery(internal.notificationLogs.getRecentByUserAndType, {
        userId: profile.userId,
        type: "upgrade",
        withinHours: 168,
      });
      if (recentLogs.length > 0) continue;

      try {
        const unsubscribeUrl = await generateUnsubscribeUrl(appUrl, profile.userId, "upgrade", unsubSecret);
        const dashboardUrl = `${appUrl}/dashboard`;

        const html = await render(
          UpgradeEmail({
            step,
            reflectionCount: profile.reflectionCountThisMonth,
            dashboardUrl,
            unsubscribeUrl,
          })
        );

        const result = await resend.emails.send({
          from: fromEmail,
          to: profile.email,
          subject: getUpgradeSubject(step, profile.reflectionCountThisMonth),
          html,
        });

        await ctx.runMutation(internal.profiles.updateSequenceField, {
          userId: profile.userId,
          field: "upgradeEmailStep",
          value: step,
        });

        await ctx.runMutation(internal.notificationLogs.log, {
          userId: profile.userId,
          type: "upgrade",
          sentAt: new Date().toISOString(),
          emailId: result.data?.id,
          metadata: { step },
        });

        sent++;
      } catch (err) {
        console.error(`[notifications] Failed to send upgrade email to ${profile.userId}:`, err);
      }
    }

    if (sent > 0) {
      console.log(`[notifications] Sent ${sent} upgrade emails`);
    }
  },
});
