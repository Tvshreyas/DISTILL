import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
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
    reflectionCountThisMonth: v.number(),
    reflectionCountLifetime: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastReflectionDate: v.optional(v.string()),
    streakFreezeUsedThisMonth: v.number(),
    timezone: v.string(),
    onboardingCompleted: v.boolean(),
    lastExportDate: v.optional(v.string()),
    // Notification preferences (all opt-in, default false)
    resurfacingEmailsEnabled: v.optional(v.boolean()),
    streakRemindersEnabled: v.optional(v.boolean()),
    weeklySummaryEnabled: v.optional(v.boolean()),
    preferredNotificationHour: v.optional(v.number()), // 0-23, default 9
    email: v.optional(v.string()),
    // Email sequence tracking
    welcomeEmailStep: v.optional(v.number()), // 1-5, tracks last sent welcome email
    reEngagementStep: v.optional(v.number()), // 1-3, tracks last sent re-engagement email
    upgradeEmailStep: v.optional(v.number()), // 1-3, tracks last sent upgrade email
    proUpgradeDate: v.optional(v.string()), // ISO date when user upgraded to Pro (for annual nudge timing)
    // Acquisition tracking (first-touch UTM params)
    acquisitionSource: v.optional(v.string()),
    acquisitionMedium: v.optional(v.string()),
    acquisitionCampaign: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_stripeCustomerId", ["stripeCustomerId"]),

  sessions: defineTable({
    userId: v.string(),
    title: v.string(),
    contentType: v.union(
      v.literal("book"),
      v.literal("video"),
      v.literal("article"),
      v.literal("podcast"),
      v.literal("other")
    ),
    consumeReason: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("complete"),
      v.literal("abandoned")
    ),
    startedAt: v.string(),
    completedAt: v.optional(v.string()),
    isRetroactive: v.boolean(),
    isDeleted: v.boolean(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_status", ["userId", "status"]),

  reflections: defineTable({
    userId: v.string(),
    sessionId: v.id("sessions"),
    content: v.string(),
    promptUsed: v.optional(v.string()),
    thinkingShiftRating: v.optional(v.number()),
    wordCount: v.number(),
    isDeleted: v.boolean(),
    deletedAt: v.optional(v.string()),
    updatedAt: v.string(),
  })
    .index("by_userId", ["userId", "isDeleted"])
    .index("by_sessionId", ["sessionId"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["userId", "isDeleted"],
    }),

  reflectionLayers: defineTable({
    reflectionId: v.id("reflections"),
    userId: v.string(),
    content: v.string(),
  })
    .index("by_reflectionId", ["reflectionId"])
    .index("by_userId", ["userId"]),

  resurfacingQueue: defineTable({
    reflectionId: v.id("reflections"),
    userId: v.string(),
    intervalType: v.union(
      v.literal("3d"),
      v.literal("7d"),
      v.literal("30d"),
      v.literal("90d")
    ),
    dueDate: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("surfaced"),
      v.literal("dismissed"),
      v.literal("layered")
    ),
    surfacedAt: v.optional(v.string()),
  })
    .index("by_userId_dueDate", ["userId", "dueDate"]),

  notificationLogs: defineTable({
    userId: v.string(),
    type: v.union(
      v.literal("resurfacing"),
      v.literal("streak"),
      v.literal("weekly"),
      v.literal("welcome"),
      v.literal("reengagement"),
      v.literal("upgrade")
    ),
    sentAt: v.string(),
    emailId: v.optional(v.string()),
    metadata: v.optional(v.any()),
  })
    .index("by_userId_type", ["userId", "type"])
    .index("by_userId", ["userId"]),

  processedWebhookEvents: defineTable({
    stripeEventId: v.string(),
    processedAt: v.string(),
  }).index("by_stripeEventId", ["stripeEventId"]),
});
