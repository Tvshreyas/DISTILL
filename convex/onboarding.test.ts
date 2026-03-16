import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

describe("onboarding.migrate", () => {
  const validArgs = {
    deviceToken: "test-device-token",
    title: "Atomic Habits",
    contentType: "book",
    reflectionContent: "This book changed how I think about habits.",
  };

  it("creates session, reflection, and profile on first call", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });

    const result = await asUser.mutation(api.onboarding.migrate, validArgs);
    expect(result).toMatchObject({ migrated: true });

    const profile = await asUser.query(api.profiles.get);
    expect(profile!.onboardingCompleted).toBe(true);
    expect(profile!.reflectionCountLifetime).toBe(1);
  });

  it("is idempotent (second call returns { migrated: true })", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });

    await asUser.mutation(api.onboarding.migrate, validArgs);
    const second = await asUser.mutation(api.onboarding.migrate, validArgs);
    expect(second).toMatchObject({ migrated: true });
  });

  it("rejects invalid content type", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });

    await expect(
      asUser.mutation(api.onboarding.migrate, {
        ...validArgs,
        contentType: "invalid",
      })
    ).rejects.toThrowError("Invalid content type.");
  });

  it("rejects title over 200 characters", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });

    await expect(
      asUser.mutation(api.onboarding.migrate, {
        ...validArgs,
        title: "X".repeat(201),
      })
    ).rejects.toThrowError("Title must be between 1 and 200 characters.");
  });

  it("rejects reflection content over 3000 characters", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });

    await expect(
      asUser.mutation(api.onboarding.migrate, {
        ...validArgs,
        reflectionContent: "X".repeat(3001),
      })
    ).rejects.toThrowError("Reflection must be between 1 and 3,000 characters.");
  });

  it("creates 4 resurfacing queue entries", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });

    await asUser.mutation(api.onboarding.migrate, validArgs);

    await t.run(async (ctx) => {
      const queue = await ctx.db.query("resurfacingQueue").collect();
      expect(queue.length).toBe(4);
      const types = queue.map((q) => q.intervalType).sort();
      expect(types).toEqual(["30d", "3d", "7d", "90d"]);
    });
  });
});
