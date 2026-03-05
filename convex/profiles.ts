import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.subject;

    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const createOrGet = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing) return existing;

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
    });

    return await ctx.db.get(id);
  },
});

export const update = mutation({
  args: {
    timezone: v.optional(v.string()),
    onboardingCompleted: v.optional(v.boolean()),
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

    const updates: Record<string, unknown> = {};
    if (args.timezone !== undefined) updates.timezone = args.timezone;
    if (args.onboardingCompleted !== undefined)
      updates.onboardingCompleted = args.onboardingCompleted;

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

    if (!profile) throw new Error("Profile not found for userId: " + args.userId);

    await ctx.db.patch(profile._id, {
      plan: args.plan,
      ...(args.stripeCustomerId !== undefined && { stripeCustomerId: args.stripeCustomerId }),
      ...(args.stripeSubscriptionId !== undefined && { stripeSubscriptionId: args.stripeSubscriptionId }),
      ...(args.subscriptionStatus !== undefined && { subscriptionStatus: args.subscriptionStatus }),
      ...(args.subscriptionPeriodEnd !== undefined && { subscriptionPeriodEnd: args.subscriptionPeriodEnd }),
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
    let count = 0;
    for (const profile of profiles) {
      await ctx.db.patch(profile._id, {
        reflectionCountThisMonth: 0,
        streakFreezeUsedThisMonth: 0,
      });
      count++;
    }
    console.log(`[cron] Reset monthly counts for ${count} profiles`);
  },
});

// Query to get profile by userId (for server-side API routes)
export const getByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
  },
});
