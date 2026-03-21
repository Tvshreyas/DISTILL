import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    title: v.string(),
    contentType: v.union(
      v.literal("book"),
      v.literal("video"),
      v.literal("article"),
      v.literal("podcast"),
      v.literal("other")
    ),
    consumeReason: v.optional(v.string()),
    isRetroactive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    // Validate title
    if (args.title.length < 1 || args.title.length > 200) {
      throw new Error("Title must be between 1 and 200 characters.");
    }

    // Validate optional reason
    if (args.consumeReason && args.consumeReason.length > 140) {
      throw new Error("Reason must be 140 characters or fewer.");
    }

    // Check for existing active session
    const activeSession = await ctx.db
      .query("sessions")
      .withIndex("by_userId_status", (q) =>
        q.eq("userId", userId).eq("status", "active")
      )
      .filter((q) => q.eq(q.field("isDeleted"), false))
      .first();

    if (activeSession) {
      throw new Error(
        "You already have an active session. Complete or abandon it first."
      );
    }

    // Free tier enforcement — only deep sessions count against the limit
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) throw new Error("Profile not found.");

    if (profile.plan === "free") {
      // Count completed deep sessions (type === "deep" or undefined for legacy sessions)
      const completedDeepSessions = await ctx.db
        .query("sessions")
        .withIndex("by_userId_status", (q) =>
          q.eq("userId", userId).eq("status", "complete")
        )
        .filter((q) =>
          q.and(
            q.eq(q.field("isDeleted"), false),
            q.neq(q.field("type"), "quick")
          )
        )
        .collect();

      if (completedDeepSessions.length >= 3) {
        throw new Error(
          "You've reached your 3 Deep Sessions for this month. You can still use Quick Distill, or upgrade to Pro for unlimited Deep Sessions."
        );
      }
    }

    const id = await ctx.db.insert("sessions", {
      userId,
      title: args.title,
      contentType: args.contentType,
      consumeReason: args.consumeReason,
      status: "active",
      type: "deep",
      startedAt: new Date().toISOString(),
      isRetroactive: args.isRetroactive ?? false,
      isDeleted: false,
    });

    // Race condition guard: verify no other active session was created concurrently
    const activeSessions = await ctx.db
      .query("sessions")
      .withIndex("by_userId_status", (q) =>
        q.eq("userId", userId).eq("status", "active")
      )
      .filter((q) => q.eq(q.field("isDeleted"), false))
      .collect();

    if (activeSessions.length > 1) {
      // Another session was created concurrently — roll back this one
      await ctx.db.delete(id);
      throw new Error(
        "You already have an active session. Complete or abandon it first."
      );
    }

    return await ctx.db.get(id);
  },
});

export const abandon = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId || session.isDeleted) {
      throw new Error("Resource not found.");
    }
    if (session.status !== "active") {
      throw new Error("Session is not active.");
    }

    await ctx.db.patch(args.sessionId, {
      status: "abandoned",
      completedAt: new Date().toISOString(),
    });
  },
});

export const getActive = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.subject;

    return await ctx.db
      .query("sessions")
      .withIndex("by_userId_status", (q) =>
        q.eq("userId", userId).eq("status", "active")
      )
      .filter((q) => q.eq(q.field("isDeleted"), false))
      .first();
  },
});

// Internal mutation for hourly cron: abandon sessions active for more than 8 hours
export const autoAbandonStaleSessions = internalMutation({
  args: {},
  handler: async (ctx) => {
    const activeSessions = await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    const now = Date.now();
    const eightHoursMs = 8 * 60 * 60 * 1000;
    let count = 0;

    for (const session of activeSessions) {
      const startedAt = new Date(session.startedAt).getTime();
      if (now - startedAt > eightHoursMs) {
        await ctx.db.patch(session._id, { status: "abandoned", completedAt: new Date().toISOString() });
        count++;
      }
    }

    console.log(`[cron] Auto-abandoned ${count} stale sessions`);
  },
});

export const getById = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.subject;

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId || session.isDeleted) {
      return null;
    }
    return session;
  },
});
