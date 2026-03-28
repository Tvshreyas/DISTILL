import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

describe("profiles.createOrGet", () => {
  it("creates profile with correct defaults", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });

    const profile = await asUser.mutation(api.profiles.createOrGet, {});
    expect(profile).toMatchObject({
      plan: "free",
      reflectionCountThisMonth: 0,
      reflectionCountLifetime: 0,
      currentStreak: 0,
      longestStreak: 0,
      streakFreezeUsedThisMonth: 0,
      timezone: "UTC",
      onboardingCompleted: false,
    });
  });

  it("returns existing profile on second call (idempotent)", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });

    const first = await asUser.mutation(api.profiles.createOrGet, {});
    const second = await asUser.mutation(api.profiles.createOrGet, {});
    expect(first!._id).toBe(second!._id);
  });
});

describe("profiles.update", () => {
  it("updates timezone", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet, {});

    await asUser.mutation(api.profiles.update, {
      timezone: "America/New_York",
    });
    const profile = await asUser.query(api.profiles.get, {});
    expect(profile!.timezone).toBe("America/New_York");
  });

  it("updates onboardingCompleted", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet, {});

    await asUser.mutation(api.profiles.update, { onboardingCompleted: true });
    const profile = await asUser.query(api.profiles.get, {});
    expect(profile!.onboardingCompleted).toBe(true);
  });
});

describe("profiles.updatePlan", () => {
  it("updates plan to pro (internal mutation)", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    const profile = await asUser.mutation(api.profiles.createOrGet, {});

    await t.mutation(internal.profiles.updatePlan, {
      userId: profile!.userId,
      plan: "pro",
    });
    const updated = await asUser.query(api.profiles.get, {});
    expect(updated!.plan).toBe("pro");
  });

  it("updates stripe fields", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    const profile = await asUser.mutation(api.profiles.createOrGet, {});

    await t.mutation(internal.profiles.updatePlan, {
      userId: profile!.userId,
      plan: "pro",
      stripeCustomerId: "cus_123",
      stripeSubscriptionId: "sub_456",
      subscriptionStatus: "active",
    });
    const updated = await asUser.query(api.profiles.get, {});
    expect(updated!.stripeCustomerId).toBe("cus_123");
    expect(updated!.stripeSubscriptionId).toBe("sub_456");
    expect(updated!.subscriptionStatus).toBe("active");
  });
});

describe("profiles.applyStreakFreeze", () => {
  it("allows pro user to freeze streak", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    const profile = await asUser.mutation(api.profiles.createOrGet, {});

    // Upgrade to pro
    await t.mutation(internal.profiles.updatePlan, {
      userId: profile!.userId,
      plan: "pro",
    });

    await asUser.mutation(api.profiles.applyStreakFreeze, {});
    const updated = await asUser.query(api.profiles.get, {});
    expect(updated!.streakFreezeUsedThisMonth).toBe(1);
  });

  it("allows free user to apply streak freeze", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet, {});

    // Free users can now apply streak freeze (1/month for all users)
    await asUser.mutation(api.profiles.applyStreakFreeze, {});

    await t.run(async (ctx) => {
      const profiles = await ctx.db.query("profiles").collect();
      expect(profiles[0].streakFreezeUsedThisMonth).toBe(1);
    });
  });

  it("rejects second freeze in same month", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet, {});

    await asUser.mutation(api.profiles.applyStreakFreeze, {});
    await expect(
      asUser.mutation(api.profiles.applyStreakFreeze, {}),
    ).rejects.toThrowError(
      "You've already used your streak freeze this month.",
    );
  });
});

describe("profiles.checkAndRecordExport", () => {
  it("allows first export", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet, {});

    const result = await asUser.mutation(api.profiles.checkAndRecordExport, {});
    expect(result).toMatchObject({ allowed: true });
  });

  it("blocks export within 24 hours", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet, {});

    await asUser.mutation(api.profiles.checkAndRecordExport, {});
    await expect(
      asUser.mutation(api.profiles.checkAndRecordExport, {}),
    ).rejects.toThrowError(/Export rate limited/);
  });
});

describe("profiles.resetMonthlyCounts", () => {
  it("resets reflectionCountThisMonth and streakFreezeUsedThisMonth", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet, {});

    // Seed some counts via creating a session + reflection flow
    await t.run(async (ctx) => {
      const profiles = await ctx.db.query("profiles").collect();
      for (const p of profiles) {
        await ctx.db.patch(p._id, {
          reflectionCountThisMonth: 5,
          streakFreezeUsedThisMonth: 1,
        });
      }
    });

    await t.mutation(internal.profiles.resetMonthlyCounts, {});

    const profile = await asUser.query(api.profiles.get, {});
    expect(profile!.reflectionCountThisMonth).toBe(0);
    expect(profile!.streakFreezeUsedThisMonth).toBe(0);
  });
});

describe("profiles.removeAccount", () => {
  it("deletes profile and all associated data", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet, {});

    // Create a session
    await asUser.mutation(api.sessions.create, {
      title: "Test Book",
      contentType: "book",
    });

    await asUser.mutation(api.profiles.removeAccount, {});

    const profile = await asUser.query(api.profiles.get, {});
    expect(profile).toBeNull();
  });
});
