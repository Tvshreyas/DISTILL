import { query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

export const getAllData = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    // Fetch profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    // Fetch all sessions (including deleted for completeness)
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Fetch all reflections (including deleted)
    const reflections = await ctx.db
      .query("reflections")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Fetch all layers for this user's reflections
    const layers: Doc<"reflectionLayers">[] = [];
    for (const reflection of reflections) {
      const reflectionLayers = await ctx.db
        .query("reflectionLayers")
        .withIndex("by_reflectionId", (q) =>
          q.eq("reflectionId", reflection._id)
        )
        .collect();
      layers.push(...reflectionLayers);
    }

    // Build human-readable export
    return {
      exportedAt: new Date().toISOString(),
      profile: profile
        ? {
            plan: profile.plan,
            timezone: profile.timezone,
            reflectionCountLifetime: profile.reflectionCountLifetime,
            currentStreak: profile.currentStreak,
            longestStreak: profile.longestStreak,
            onboardingCompleted: profile.onboardingCompleted,
          }
        : null,
      sessions: sessions.map((s) => ({
        title: s.title,
        contentType: s.contentType,
        consumeReason: s.consumeReason ?? null,
        status: s.status,
        startedAt: s.startedAt,
        completedAt: s.completedAt ?? null,
        isRetroactive: s.isRetroactive,
        isDeleted: s.isDeleted,
      })),
      reflections: reflections.map((r) => {
        const reflectionLayers = layers
          .filter((l) => l.reflectionId === r._id)
          .map((l) => ({
            content: l.content,
            addedAt: new Date(l._creationTime).toISOString(),
          }));

        const session = sessions.find((s) => s._id === r.sessionId);

        return {
          content: r.content,
          sessionTitle: session?.title ?? "Unknown",
          contentType: session?.contentType ?? "unknown",
          promptUsed: r.promptUsed ?? null,
          thinkingShiftRating: r.thinkingShiftRating ?? null,
          wordCount: r.wordCount,
          createdAt: new Date(r._creationTime).toISOString(),
          updatedAt: r.updatedAt,
          isDeleted: r.isDeleted,
          deletedAt: r.deletedAt ?? null,
          layers: reflectionLayers,
        };
      }),
    };
  },
});
