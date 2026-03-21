import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.subject;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) return null;

    // Count deep sessions this month
    const deepSessions = await ctx.db
      .query("sessions")
      .withIndex("by_userId_status", (q) =>
        q.eq("userId", userId).eq("status", "complete")
      )
      .filter((q) =>
        q.and(q.eq(q.field("isDeleted"), false), q.neq(q.field("type"), "quick"))
      )
      .collect();

    return {
      ...profile,
      deepSessionsCount: deepSessions.length,
    };
  },
});

export const createOrGet = mutation({
  args: {
    acquisitionSource: v.optional(v.string()),
    acquisitionMedium: v.optional(v.string()),
    acquisitionCampaign: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      // Sync email if changed
      if (identity.email && existing.email !== identity.email) {
        await ctx.db.patch(existing._id, { email: identity.email });
      }
      return existing;
    }

    const id = await ctx.db.insert("profiles", {
      userId,
      plan: "free",
      reflectionCountThisMonth: 0,
      reflectionCountLifetime: 0,
      currentStreak: 0,
      longestStreak: 0,
      streakFreezeUsedThisMonth: 0,
      timezone: "UTC",
      onboardingCompleted: false,
      email: identity.email,
      welcomeEmailStep: 0,
      ...(args.acquisitionSource && { acquisitionSource: args.acquisitionSource }),
      ...(args.acquisitionMedium && { acquisitionMedium: args.acquisitionMedium }),
      ...(args.acquisitionCampaign && { acquisitionCampaign: args.acquisitionCampaign }),
    });

    // Schedule welcome email sequence
    // Step 1: immediate, Step 2: 1 day, Step 3: 3 days, Step 4: 5 days, Step 5: 10 days
    await ctx.scheduler.runAfter(0, internal.notifications.sendWelcomeEmail, { userId, step: 1 });
    await ctx.scheduler.runAfter(1 * 24 * 60 * 60 * 1000, internal.notifications.sendWelcomeEmail, { userId, step: 2 });
    await ctx.scheduler.runAfter(3 * 24 * 60 * 60 * 1000, internal.notifications.sendWelcomeEmail, { userId, step: 3 });
    await ctx.scheduler.runAfter(5 * 24 * 60 * 60 * 1000, internal.notifications.sendWelcomeEmail, { userId, step: 4 });
    await ctx.scheduler.runAfter(10 * 24 * 60 * 60 * 1000, internal.notifications.sendWelcomeEmail, { userId, step: 5 });

    return await ctx.db.get(id);
  },
});

export const update = mutation({
  args: {
    timezone: v.optional(v.string()),
    onboardingCompleted: v.optional(v.boolean()),
    resurfacingEmailsEnabled: v.optional(v.boolean()),
    streakRemindersEnabled: v.optional(v.boolean()),
    weeklySummaryEnabled: v.optional(v.boolean()),
    preferredNotificationHour: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) throw new Error("Profile not found");

    // Validate notification hour
    if (
      args.preferredNotificationHour !== undefined &&
      (args.preferredNotificationHour < 0 ||
        args.preferredNotificationHour > 23 ||
        !Number.isInteger(args.preferredNotificationHour))
    ) {
      throw new Error("Notification hour must be an integer between 0 and 23.");
    }

    const updates: Record<string, unknown> = {};
    if (args.timezone !== undefined) updates.timezone = args.timezone;
    if (args.onboardingCompleted !== undefined)
      updates.onboardingCompleted = args.onboardingCompleted;
    if (args.resurfacingEmailsEnabled !== undefined)
      updates.resurfacingEmailsEnabled = args.resurfacingEmailsEnabled;
    if (args.streakRemindersEnabled !== undefined)
      updates.streakRemindersEnabled = args.streakRemindersEnabled;
    if (args.weeklySummaryEnabled !== undefined)
      updates.weeklySummaryEnabled = args.weeklySummaryEnabled;
    if (args.preferredNotificationHour !== undefined)
      updates.preferredNotificationHour = args.preferredNotificationHour;

    await ctx.db.patch(profile._id, updates);
  },
});

// Internal mutation for Stripe webhook updates — not callable from client
export const updatePlan = internalMutation({
  args: {
    userId: v.string(),
    plan: v.union(v.literal("free"), v.literal("pro")),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(
      v.union(
        v.literal("active"),
        v.literal("canceled"),
        v.literal("past_due"),
        v.literal("trialing")
      )
    ),
    subscriptionPeriodEnd: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) throw new Error("Resource not found.");

    await ctx.db.patch(profile._id, {
      plan: args.plan,
      ...(args.stripeCustomerId !== undefined && { stripeCustomerId: args.stripeCustomerId }),
      ...(args.stripeSubscriptionId !== undefined && { stripeSubscriptionId: args.stripeSubscriptionId }),
      ...(args.subscriptionStatus !== undefined && { subscriptionStatus: args.subscriptionStatus }),
      ...(args.subscriptionPeriodEnd !== undefined && { subscriptionPeriodEnd: args.subscriptionPeriodEnd }),
      // Track Pro upgrade date for annual nudge email
      ...(args.plan === "pro" && !profile.proUpgradeDate && { proUpgradeDate: new Date().toISOString() }),
    });
  },
});

// Internal mutation to record processed webhook events
export const recordWebhookEvent = internalMutation({
  args: {
    stripeEventId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("processedWebhookEvents", {
      stripeEventId: args.stripeEventId,
      processedAt: new Date().toISOString(),
    });
  },
});

// Internal mutation for monthly cron: reset reflectionCountThisMonth and streakFreezeUsedThisMonth for all profiles
export const resetMonthlyCounts = internalMutation({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();
    for (const profile of profiles) {
      await ctx.db.patch(profile._id, {
        reflectionCountThisMonth: 0,
        streakFreezeUsedThisMonth: 0,
      });
    }
  },
});

// Internal query for webhook: get profile by stripe customer ID (not client-callable)
export const getByStripeCustomerId = internalQuery({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_stripeCustomerId", (q) => q.eq("stripeCustomerId", args.stripeCustomerId))
      .unique();
  },
});
// Apply a streak freeze (Pro only, 1 per month)
export const applyStreakFreeze = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) throw new Error("Resource not found.");

    if (profile.plan !== "pro") {
      throw new Error("Streak freeze is a Pro feature.");
    }

    if (profile.streakFreezeUsedThisMonth >= 1) {
      throw new Error("You've already used your streak freeze this month.");
    }

    await ctx.db.patch(profile._id, {
      streakFreezeUsedThisMonth: profile.streakFreezeUsedThisMonth + 1,
    });
  },
});

// Internal mutation for unsubscribe endpoint (HMAC token is the auth)
export const disableNotificationType = internalMutation({
  args: {
    userId: v.string(),
    type: v.union(
      v.literal("resurfacing"),
      v.literal("streak"),
      v.literal("weekly"),
      v.literal("welcome"),
      v.literal("reengagement"),
      v.literal("upgrade")
    ),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) return; // Silently ignore — user may have been deleted

    const fieldMap: Record<string, string | undefined> = {
      resurfacing: "resurfacingEmailsEnabled",
      streak: "streakRemindersEnabled",
      weekly: "weeklySummaryEnabled",
    };

    const field = fieldMap[args.type];
    if (field) {
      await ctx.db.patch(profile._id, {
        [field]: false,
      });
    }
    // welcome/reengagement/upgrade don't have toggle fields — unsubscribe stops by logging
  },
});

// Internal query for notification actions
export const getNotificationEligibleProfiles = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("profiles").collect();
  },
});

// Delete user account and all associated data
export const removeAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) throw new Error("Profile not found");

    // Cascading delete
    const reflections = await ctx.db
      .query("reflections")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    for (const ref of reflections) {
      await ctx.db.delete(ref._id);
    }

    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    for (const sess of sessions) {
      await ctx.db.delete(sess._id);
    }

    const layers = await ctx.db
      .query("reflectionLayers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    for (const layer of layers) {
      await ctx.db.delete(layer._id);
    }

    const queueEntries = await ctx.db
      .query("resurfacingQueue")
      .withIndex("by_userId_dueDate", (q) => q.eq("userId", userId))
      .collect();

    for (const entry of queueEntries) {
      await ctx.db.delete(entry._id);
    }

    // Delete notification logs
    const notifLogs = await ctx.db
      .query("notificationLogs")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    for (const log of notifLogs) {
      await ctx.db.delete(log._id);
    }

    // Delete profile
    await ctx.db.delete(profile._id);
  },
});

// Internal mutation to update email sequence step on a profile
export const updateSequenceField = internalMutation({
  args: {
    userId: v.string(),
    field: v.union(
      v.literal("welcomeEmailStep"),
      v.literal("reEngagementStep"),
      v.literal("upgradeEmailStep"),
      v.literal("proUpgradeDate")
    ),
    value: v.union(v.number(), v.string()),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) return;

    await ctx.db.patch(profile._id, {
      [args.field]: args.value,
    });
  },
});

// Internal query to get a profile by userId (for notification actions)
export const getByUserId = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
  },
});

// Check if export is allowed (24h cooldown) and record the export timestamp
export const checkAndRecordExport = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("401 Unauthorized");
    const userId = identity.subject;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) throw new Error("Resource not found.");

    const now = Date.now();
    if (profile.lastExportDate) {
      const lastExport = new Date(profile.lastExportDate).getTime();
      const twentyFourHoursMs = 24 * 60 * 60 * 1000;
      if (now - lastExport < twentyFourHoursMs) {
        const retryAfterMs = twentyFourHoursMs - (now - lastExport);
        const retryAfterHours = Math.ceil(retryAfterMs / (60 * 60 * 1000));
        throw new Error(`Export rate limited. Try again in ${retryAfterHours} hour(s).`);
      }
    }

    await ctx.db.patch(profile._id, {
      lastExportDate: new Date(now).toISOString(),
    });

    return { allowed: true };
  },
});
