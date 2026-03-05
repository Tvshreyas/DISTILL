import { mutation } from "./_generated/server";

export const deleteAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) throw new Error("Profile not found.");

    // Soft-delete all sessions
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    for (const session of sessions) {
      if (!session.isDeleted) {
        await ctx.db.patch(session._id, { isDeleted: true });
      }
    }

    // Soft-delete all reflections
    const reflections = await ctx.db
      .query("reflections")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const now = new Date().toISOString();
    for (const reflection of reflections) {
      if (!reflection.isDeleted) {
        await ctx.db.patch(reflection._id, {
          isDeleted: true,
          deletedAt: now,
        });
      }
    }

    // Mark profile for deletion
    await ctx.db.patch(profile._id, {
      onboardingCompleted: false,
      currentStreak: 0,
      reflectionCountThisMonth: 0,
    });
  },
});
