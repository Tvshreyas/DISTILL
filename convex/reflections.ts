import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { checkContentSafety } from "./safety";

/** Strip HTML tags server-side (no DOM dependency for Convex edge runtime) */
function sanitizeContent(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

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

    // Free tier enforcement — only "deep" sessions count against the limit
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) throw new Error("Profile not found.");

    if (profile.plan === "free") {
      // Count completed deep sessions this month (type === "deep" or undefined for legacy sessions)
      const completedSessions = await ctx.db
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

      if (completedSessions.length >= FREE_TIER_LIMIT) {
        throw new Error(
          `You've reached your ${FREE_TIER_LIMIT} monthly Deep Sessions. You can still use Quick Distill on the dashboard, or upgrade to Pro for unlimited Deep Sessions.`
        );
      }
    }

    const now = new Date();
    const nowIso = now.toISOString();
    const wordCount = computeWordCount(args.content);

    // Create reflection
    const cleanContent = sanitizeContent(args.content);

    const safetyResult = checkContentSafety(cleanContent);
    if (!safetyResult.safe && safetyResult.category === "A") {
      throw new Error("This content cannot be saved.");
    }

    const reflectionId = await ctx.db.insert("reflections", {
      userId,
      sessionId: args.sessionId,
      content: cleanContent,
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

    const reflection = await ctx.db.get(reflectionId);
    const totalReflections = profile.reflectionCountLifetime + 1;
    const milestones = [1, 10, 50, 100];
    const milestoneReached = milestones.includes(totalReflections)
      ? totalReflections
      : null;

    return { ...reflection, milestoneReached };
  },
});

export const quickCreate = mutation({
  args: {
    content: v.string(),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    // Validate content
    if (args.content.length < 1 || args.content.length > 3000) {
      throw new Error("Reflection must be between 1 and 3,000 characters.");
    }

    const cleanContent = sanitizeContent(args.content);

    const safetyResult = checkContentSafety(cleanContent);
    if (!safetyResult.safe && safetyResult.category === "A") {
      throw new Error("This content cannot be saved.");
    }

    // Get profile (needed for streak logic and stats)
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) throw new Error("Profile not found.");

    // Quick captures skip free tier enforcement entirely —
    // only "deep" sessions count against the limit.

    const now = new Date();
    const nowIso = now.toISOString();
    const sessionTitle = args.title ?? "Quick Distill";
    const wordCount = computeWordCount(cleanContent);

    // Create a pre-completed "quick" session
    const sessionId = await ctx.db.insert("sessions", {
      userId,
      title: sessionTitle,
      contentType: "other",
      status: "complete",
      type: "quick",
      startedAt: nowIso,
      completedAt: nowIso,
      isRetroactive: false,
      isDeleted: false,
    });

    // Create reflection linked to the quick session
    const reflectionId = await ctx.db.insert("reflections", {
      userId,
      sessionId,
      content: cleanContent,
      wordCount,
      isDeleted: false,
      updatedAt: nowIso,
    });

    // Update profile: streak + counters
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

    // Schedule resurfacing (3d, 7d, 30d, 90d)
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

    const reflection = await ctx.db.get(reflectionId);
    const totalReflections = profile.reflectionCountLifetime + 1;
    const milestones = [1, 10, 50, 100];
    const milestoneReached = milestones.includes(totalReflections)
      ? totalReflections
      : null;

    return { ...reflection, milestoneReached };
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

    const cleanContent = sanitizeContent(args.content);

    const safetyResult = checkContentSafety(cleanContent);
    if (!safetyResult.safe && safetyResult.category === "A") {
      throw new Error("This content cannot be saved.");
    }

    await ctx.db.patch(args.reflectionId, {
      content: cleanContent,
      wordCount: computeWordCount(cleanContent),
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

    // Sanitize search input: strip special characters that could cause unexpected behavior
    const sanitizedSearch = args.search?.replace(/[<>{}[\]\\]/g, "").trim();
    if (sanitizedSearch && sanitizedSearch.length > 0) {
      // Use search index
      reflections = await ctx.db
        .query("reflections")
        .withSearchIndex("search_content", (q) =>
          q
            .search("content", sanitizedSearch)
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

    // Join with sessions and count layers
    let withSessions = await Promise.all(
      reflections.map(async (r) => {
        const session = await ctx.db.get(r.sessionId);
        const layers = await ctx.db
          .query("reflectionLayers")
          .withIndex("by_reflectionId", (q) => q.eq("reflectionId", r._id))
          .collect();
        return {
          ...r,
          layerCount: layers.length,
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
      }
    }
  },
});

export const recent = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const userId = identity.subject;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const reflections = await ctx.db
      .query("reflections")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("isDeleted"), false),
          q.gte(q.field("_creationTime"), thirtyDaysAgo.getTime())
        )
      )
      .order("desc")
      .collect();

    return reflections.map((r) => ({
      _creationTime: r._creationTime,
    }));
  },
});

export const exportAll = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const userId = identity.subject;

    const reflections = await ctx.db
      .query("reflections")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isDeleted"), false))
      .collect();

    return await Promise.all(
      reflections.map(async (r) => {
        const session = await ctx.db.get(r.sessionId);
        const layers = await ctx.db
          .query("reflectionLayers")
          .withIndex("by_reflectionId", (q) => q.eq("reflectionId", r._id))
          .collect();

        return {
          id: r._id,
          content: r.content,
          promptUsed: r.promptUsed,
          thinkingShiftRating: r.thinkingShiftRating,
          wordCount: r.wordCount,
          createdAt: new Date(r._creationTime).toISOString(),
          updatedAt: r.updatedAt,
          session: session
            ? {
              title: session.title,
              contentType: session.contentType,
              startedAt: session.startedAt,
              completedAt: session.completedAt,
            }
            : null,
          layers: layers.map((l) => ({
            content: l.content,
            createdAt: new Date(l._creationTime).toISOString(),
          })),
        };
      })
    );
  },
});

// Internal query for weekly summary notifications
export const getWeeklyStats = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const reflections = await ctx.db
      .query("reflections")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("isDeleted"), false),
          q.gte(q.field("_creationTime"), sevenDaysAgo.getTime())
        )
      )
      .collect();

    const totalReflections = reflections.length;
    const totalWords = reflections.reduce((sum, r) => sum + r.wordCount, 0);

    // Build content type breakdown by joining with sessions
    const typeMap: Record<string, number> = {};
    for (const r of reflections) {
      const session = await ctx.db.get(r.sessionId);
      const ct = session?.contentType ?? "other";
      typeMap[ct] = (typeMap[ct] || 0) + 1;
    }

    const contentTypeBreakdown = Object.entries(typeMap).map(
      ([type, count]) => ({ type, count })
    );

    return { totalReflections, totalWords, contentTypeBreakdown };
  },
});
