import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

const notificationType = v.union(
  v.literal("resurfacing"),
  v.literal("streak"),
  v.literal("weekly"),
  v.literal("welcome"),
  v.literal("reengagement"),
  v.literal("upgrade")
);

export const log = internalMutation({
  args: {
    userId: v.string(),
    type: notificationType,
    sentAt: v.string(),
    emailId: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("notificationLogs", {
      userId: args.userId,
      type: args.type,
      sentAt: args.sentAt,
      emailId: args.emailId,
      metadata: args.metadata,
    });
  },
});

export const getRecentByUserAndType = internalQuery({
  args: {
    userId: v.string(),
    type: notificationType,
    withinHours: v.number(),
  },
  handler: async (ctx, args) => {
    const cutoff = new Date(Date.now() - args.withinHours * 60 * 60 * 1000).toISOString();

    const logs = await ctx.db
      .query("notificationLogs")
      .withIndex("by_userId_type", (q) =>
        q.eq("userId", args.userId).eq("type", args.type)
      )
      .filter((q) => q.gte(q.field("sentAt"), cutoff))
      .collect();

    return logs;
  },
});
