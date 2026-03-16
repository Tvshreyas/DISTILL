import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

describe("export.getAllData", () => {
  it("throws Unauthorized when not authenticated", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.query(api.export.getAllData)
    ).rejects.toThrowError("Unauthorized");
  });

  it("returns complete data shape", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet);

    // Create session + reflection
    const session = await asUser.mutation(api.sessions.create, {
      title: "Test Book",
      contentType: "book",
    });
    await asUser.mutation(api.reflections.create, {
      sessionId: session!._id,
      content: "My reflection.",
    });

    const data = await asUser.query(api.export.getAllData);
    expect(data).toHaveProperty("exportedAt");
    expect(data).toHaveProperty("profile");
    expect(data).toHaveProperty("sessions");
    expect(data).toHaveProperty("reflections");
    expect(data.profile!.plan).toBe("free");
    expect(data.sessions.length).toBe(1);
    expect(data.reflections.length).toBe(1);
  });

  it("includes layers nested inside reflections", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet);

    const session = await asUser.mutation(api.sessions.create, {
      title: "Test",
      contentType: "book",
    });
    const reflection = await asUser.mutation(api.reflections.create, {
      sessionId: session!._id,
      content: "My reflection.",
    });

    // Add a layer directly
    await t.run(async (ctx) => {
      const profiles = await ctx.db.query("profiles").collect();
      await ctx.db.insert("reflectionLayers", {
        reflectionId: reflection!._id,
        userId: profiles[0].userId,
        content: "Layer content.",
      });
    });

    const data = await asUser.query(api.export.getAllData);
    expect(data.reflections[0].layers.length).toBe(1);
    expect(data.reflections[0].layers[0].content).toBe("Layer content.");
  });

  it("handles user with no data gracefully", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet);

    const data = await asUser.query(api.export.getAllData);
    expect(data.profile).not.toBeNull();
    expect(data.sessions).toEqual([]);
    expect(data.reflections).toEqual([]);
  });
});
