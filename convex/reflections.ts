import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

const FREE_TIER_LIMIT = 10;

function computeWordCount(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function toDateString(date: Date, timezone: string): string {
  try {
    return date.toLocaleDateString("en-CA", { timeZone: timezone });
  } catch {
    return date.toISOString().split("T")[0];
  }
}

export const create = mutation({
  args: {
    sessionId: v.id("sessions"),
    content: v.string(),
    promptUsed: v.optional(v.string()),
    thinkingShiftRating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    // Validate content
    if (args.content.length < 1 || args.content.length > 3000) {
      throw new Error("Reflection must be between 1 and 3,000 characters.");
    }

    // Validate rating
    if (
      args.thinkingShiftRating !== undefined &&
      (args.thinkingShiftRating < 1 ||
        args.thinkingShiftRating > 5 ||
        !Number.isInteger(args.thinkingShiftRating))
    ) {
      throw new Error("Rating must be an integer between 1 and 5.");
    }

    // Verify session ownership and active status
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId || session.isDeleted) {
      throw new Error("Resource not found.");
    }
    if (session.status !== "active") {
      throw new Error("This session is no longer active.");
    }

    // Free tier enforcement
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) throw new Error("Profile not found.");

    if (
      profile.plan === "free" &&
      profile.reflectionCountThisMonth >= FREE_TIER_LIMIT
    ) {
      throw new Error(
        `You've reached your ${FREE_TIER_LIMIT} reflections for this month. Upgrade to Pro for unlimited reflections.`
      );
    }

    const now = new Date();
    const nowIso = now.toISOString();
    const wordCount = computeWordCount(args.content);

    // Create reflection
    const reflectionId = await ctx.db.insert("reflections", {
      userId,
      sessionId: args.sessionId,
      content: args.content,
      promptUsed: args.promptUsed,
      thinkingShiftRating: args.thinkingShiftRating,
      wordCount,
      isDeleted: false,
      updatedAt: nowIso,
    });

    // Update profile counts and streak
    const todayStr = toDateString(now, profile.timezone);
    const lastDate = profile.lastReflectionDate;

    let newStreak = profile.currentStreak;
    if (!lastDate) {
      newStreak = 1;
    } else if (lastDate === todayStr) {
      // Same day — no change
    } else {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = toDateString(yesterday, profile.timezone);
      if (lastDate === yesterdayStr) {
        newStreak = profile.currentStreak + 1;
      } else {
        newStreak = 1;
      }
    }

    await ctx.db.patch(profile._id, {
      reflectionCountThisMonth: profile.reflectionCountThisMonth + 1,
      reflectionCountLifetime: profile.reflectionCountLifetime + 1,
      currentStreak: newStreak,
      longestStreak: Math.max(profile.longestStreak, newStreak),
      lastReflectionDate: todayStr,
    });

    // Auto-complete session
    await ctx.db.patch(args.sessionId, {
      status: "complete",
      completedAt: nowIso,
    });

    // Schedule resurfacing
    const intervals = [
      { type: "3d" as const, days: 3 },
      { type: "7d" as const, days: 7 },
      { type: "30d" as const, days: 30 },
      { type: "90d" as const, days: 90 },
    ];
    for (const interval of intervals) {
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + interval.days);
      await ctx.db.insert("resurfacingQueue", {
        reflectionId,
        userId,
        intervalType: interval.type,
        dueDate: dueDate.toISOString().split("T")[0],
        status: "pending",
      });
    }

    return await ctx.db.get(reflectionId);
  },
});

export const update = mutation({
  args: {
    reflectionId: v.id("reflections"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    if (args.content.length < 1 || args.content.length > 3000) {
      throw new Error("Reflection must be between 1 and 3,000 characters.");
    }

    const reflection = await ctx.db.get(args.reflectionId);
    if (
      !reflection ||
      reflection.userId !== userId ||
      reflection.isDeleted
    ) {
      throw new Error("Resource not found.");
    }

    await ctx.db.patch(args.reflectionId, {
      content: args.content,
      wordCount: computeWordCount(args.content),
      updatedAt: new Date().toISOString(),
    });

    return await ctx.db.get(args.reflectionId);
  },
});

export const remove = mutation({
  args: {
    reflectionId: v.id("reflections"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    const reflection = await ctx.db.get(args.reflectionId);
    if (
      !reflection ||
      reflection.userId !== userId ||
      reflection.isDeleted
    ) {
      throw new Error("Resource not found.");
    }

    await ctx.db.patch(args.reflectionId, {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    });
  },
});

export const getById = query({
  args: { reflectionId: v.id("reflections") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.subject;

    const reflection = await ctx.db.get(args.reflectionId);
    if (
      !reflection ||
      reflection.userId !== userId ||
      reflection.isDeleted
    ) {
      return null;
    }

    // Get session info
    const session = await ctx.db.get(reflection.sessionId);

    // Get layers
    const layers = await ctx.db
      .query("reflectionLayers")
      .withIndex("by_reflectionId", (q) =>
        q.eq("reflectionId", args.reflectionId)
      )
      .collect();

    return {
      ...reflection,
      session: session
        ? {
            title: session.title,
            contentType: session.contentType,
            startedAt: session.startedAt,
          }
        : null,
      layers,
    };
  },
});

export const list = query({
  args: {
    search: v.optional(v.string()),
    contentType: v.optional(v.string()),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { data: [], total: 0 };
    const userId = identity.subject;

    const limit = Math.min(Math.max(args.limit ?? 20, 1), 50);
    const offset = Math.max(args.offset ?? 0, 0);

    let reflections;

    if (args.search && args.search.trim()) {
      // Use search index
      reflections = await ctx.db
        .query("reflections")
        .withSearchIndex("search_content", (q) =>
          q
            .search("content", args.search!)
            .eq("userId", userId)
            .eq("isDeleted", false)
        )
        .collect();
    } else {
      // Regular query
      reflections = await ctx.db
        .query("reflections")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .filter((q) => q.eq(q.field("isDeleted"), false))
        .order("desc")
        .collect();
    }

    // Filter by content type (requires joining with sessions)
    let withSessions = await Promise.all(
      reflections.map(async (r) => {
        const session = await ctx.db.get(r.sessionId);
        return {
          ...r,
          session: session
            ? { title: session.title, contentType: session.contentType }
            : null,
        };
      })
    );

    if (
      args.contentType &&
      ["book", "video", "article", "podcast", "other"].includes(
        args.contentType
      )
    ) {
      withSessions = withSessions.filter(
        (r) => r.session?.contentType === args.contentType
      );
    }

    const total = withSessions.length;
    const data = withSessions.slice(offset, offset + limit);

    return { data, total };
  },
});

// Internal mutation for daily cron: permanently delete reflections soft-deleted more than 30 days ago
export const purgeSoftDeletedReflections = internalMutation({
  args: {},
  handler: async (ctx) => {
    const deletedReflections = await ctx.db
      .query("reflections")
      .filter((q) => q.eq(q.field("isDeleted"), true))
      .collect();

    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    let count = 0;

    for (const reflection of deletedReflections) {
      if (!reflection.deletedAt) continue;
      const deletedAt = new Date(reflection.deletedAt).getTime();
      if (now - deletedAt > thirtyDaysMs) {
        // Delete associated reflection layers
        const layers = await ctx.db
          .query("reflectionLayers")
          .withIndex("by_reflectionId", (q) =>
            q.eq("reflectionId", reflection._id)
          )
          .collect();
        for (const layer of layers) {
          await ctx.db.delete(layer._id);
        }

        // Delete associated resurfacing queue entries
        const queueEntries = await ctx.db
          .query("resurfacingQueue")
          .filter((q) => q.eq(q.field("reflectionId"), reflection._id))
          .collect();
        for (const entry of queueEntries) {
          await ctx.db.delete(entry._id);
        }

        // Delete the reflection itself
        await ctx.db.delete(reflection._id);
        count++;
      }
    }

    console.log(`[cron] Purged ${count} soft-deleted reflections`);
  },
});

export const recent = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const userId = identity.subject;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const reflections = await ctx.db
      .query("reflections")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("isDeleted"), false),
          q.gte(q.field("_creationTime"), sevenDaysAgo.getTime())
        )
      )
      .order("desc")
      .collect();

    return reflections.map((r) => ({
      _creationTime: r._creationTime,
    }));
  },
});
