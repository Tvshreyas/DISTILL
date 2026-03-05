import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getPending = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.subject;

    const today = new Date().toISOString().split("T")[0];

    // Get all pending items for this user, ordered by due date
    const pendingItems = await ctx.db
      .query("resurfacingQueue")
      .withIndex("by_userId_dueDate", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "pending"),
          q.lte(q.field("dueDate"), today)
        )
      )
      .collect();

    if (pendingItems.length === 0) return null;

    // Return the oldest one first
    const item = pendingItems[0];

    // Fetch the reflection
    const reflection = await ctx.db.get(item.reflectionId);
    if (!reflection || reflection.isDeleted) return null;

    // Fetch the session for context
    const session = await ctx.db.get(reflection.sessionId);

    // Calculate days ago
    const createdDate = new Date(reflection._creationTime);
    const now = new Date();
    const daysAgo = Math.floor(
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      queueId: item._id,
      reflectionId: item.reflectionId,
      intervalType: item.intervalType,
      dueDate: item.dueDate,
      reflection: {
        content: reflection.content,
        wordCount: reflection.wordCount,
        createdAt: new Date(reflection._creationTime).toISOString(),
      },
      session: session
        ? {
            title: session.title,
            contentType: session.contentType,
          }
        : null,
      daysAgo,
    };
  },
});

export const respond = mutation({
  args: {
    queueId: v.id("resurfacingQueue"),
    action: v.union(
      v.literal("layered"),
      v.literal("surfaced"),
      v.literal("dismissed")
    ),
    layerContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    // Verify queue entry ownership
    const queueEntry = await ctx.db.get(args.queueId);
    if (!queueEntry || queueEntry.userId !== userId) {
      throw new Error("Resource not found.");
    }

    if (queueEntry.status !== "pending") {
      throw new Error("This item has already been responded to.");
    }

    // If layered, validate and create layer
    if (args.action === "layered") {
      if (!args.layerContent || args.layerContent.trim().length === 0) {
        throw new Error("Layer content is required.");
      }
      if (args.layerContent.length > 3000) {
        throw new Error("Layer must be 3,000 characters or fewer.");
      }

      // Verify reflection ownership (full chain)
      const reflection = await ctx.db.get(queueEntry.reflectionId);
      if (!reflection || reflection.userId !== userId || reflection.isDeleted) {
        throw new Error("Resource not found.");
      }

      // Pro-only check
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .unique();

      if (!profile || profile.plan === "free") {
        throw new Error(
          "Adding new perspectives is a Pro feature. Upgrade to continue."
        );
      }

      await ctx.db.insert("reflectionLayers", {
        reflectionId: queueEntry.reflectionId,
        userId,
        content: args.layerContent,
      });
    }

    // Update queue entry status
    await ctx.db.patch(args.queueId, {
      status: args.action,
      surfacedAt: new Date().toISOString(),
    });
  },
});
