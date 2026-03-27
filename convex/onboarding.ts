import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { checkContentSafety } from "./safety";

const VALID_CONTENT_TYPES = ["book", "video", "article", "podcast", "other"] as const;
const FREE_TIER_LIMIT = 3;

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

export const migrate = mutation({
  args: {
    title: v.string(),
    contentType: v.string(),
    consumeReason: v.optional(v.string()),
    reflectionContent: v.string(),
    promptUsed: v.optional(v.string()),
    thinkingShiftRating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    // Get or create profile
    let profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) {
      const profileId = await ctx.db.insert("profiles", {
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
      profile = (await ctx.db.get(profileId))!;
    }

    // Idempotency guard: already onboarded
    if (profile.onboardingCompleted) {
      return { migrated: true };
    }

    // Second idempotency guard: session already exists
    const existingSession = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existingSession) {
      await ctx.db.patch(profile._id, { onboardingCompleted: true });
      return { migrated: true };
    }

    // Validate inputs
    if (args.title.length < 1 || args.title.length > 200) {
      throw new Error("Title must be between 1 and 200 characters.");
    }

    if (!VALID_CONTENT_TYPES.includes(args.contentType as typeof VALID_CONTENT_TYPES[number])) {
      throw new Error("Invalid content type.");
    }

    if (args.reflectionContent.length < 1 || args.reflectionContent.length > 800) {
      throw new Error("Reflection must be between 1 and 800 characters.");
    }

    if (
      args.thinkingShiftRating !== undefined &&
      (args.thinkingShiftRating < 1 ||
        args.thinkingShiftRating > 5 ||
        !Number.isInteger(args.thinkingShiftRating))
    ) {
      throw new Error("Rating must be an integer between 1 and 5.");
    }

    // Free tier enforcement
    if (profile.plan === "free") {
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
          `You've reached your ${FREE_TIER_LIMIT} monthly Deep Sessions.`
        );
      }
    }

    const now = new Date();
    const nowIso = now.toISOString();

    // Create session
    const sessionId = await ctx.db.insert("sessions", {
      userId,
      title: args.title,
      contentType: args.contentType as typeof VALID_CONTENT_TYPES[number],
      consumeReason: args.consumeReason,
      status: "complete",
      startedAt: nowIso,
      completedAt: nowIso,
      isRetroactive: false,
      isDeleted: false,
    });

    // Create reflection — sanitize content (strip HTML tags, check safety)
    const cleanContent = args.reflectionContent.replace(/<[^>]*>/g, "").trim();
    const safetyResult = checkContentSafety(cleanContent);
    if (!safetyResult.safe && safetyResult.category === "A") {
      throw new Error("This content cannot be saved.");
    }

    const wordCount = computeWordCount(cleanContent);
    const reflectionId = await ctx.db.insert("reflections", {
      userId,
      sessionId,
      content: cleanContent,
      promptUsed: args.promptUsed,
      thinkingShiftRating: args.thinkingShiftRating,
      wordCount,
      isDeleted: false,
      updatedAt: nowIso,
    });

    // Update profile: counts, streak, onboarding
    const todayStr = toDateString(now, profile.timezone);
    await ctx.db.patch(profile._id, {
      reflectionCountThisMonth: profile.reflectionCountThisMonth + 1,
      reflectionCountLifetime: profile.reflectionCountLifetime + 1,
      currentStreak: 1,
      longestStreak: Math.max(profile.longestStreak, 1),
      lastReflectionDate: todayStr,
      onboardingCompleted: true,
    });

    // Schedule resurfacing — 1d first to collapse time-to-magic
    const intervals = [
      { type: "1d" as const, days: 1 },
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

    return { migrated: true };
  },
});
