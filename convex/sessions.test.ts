/* eslint-disable @typescript-eslint/no-explicit-any */
import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

describe("sessions.create", () => {
  it("throws Unauthorized when not authenticated", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.mutation(api.sessions.create, { title: "Test", contentType: "book" })
    ).rejects.toThrowError("Unauthorized");
  });

  it("creates session with valid data", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet);

    const session = await asUser.mutation(api.sessions.create, {
      title: "Deep Work",
      contentType: "book",
    });
    expect(session).toMatchObject({
      title: "Deep Work",
      contentType: "book",
      status: "active",
      isDeleted: false,
    });
  });

  it("rejects empty title", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet);

    await expect(
      asUser.mutation(api.sessions.create, { title: "", contentType: "book" })
    ).rejects.toThrowError("Title must be between 1 and 200 characters.");
  });

  it("rejects title over 200 characters", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet);

    await expect(
      asUser.mutation(api.sessions.create, { title: "X".repeat(201), contentType: "book" })
    ).rejects.toThrowError("Title must be between 1 and 200 characters.");
  });

  it("rejects consumeReason over 140 characters", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet);

    await expect(
      asUser.mutation(api.sessions.create, {
        title: "Test",
        contentType: "book",
        consumeReason: "X".repeat(141),
      })
    ).rejects.toThrowError("Reason must be 140 characters or fewer.");
  });

  it("blocks creation when active session already exists", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet);

    await asUser.mutation(api.sessions.create, { title: "First", contentType: "book" });
    await expect(
      asUser.mutation(api.sessions.create, { title: "Second", contentType: "video" })
    ).rejects.toThrowError("You already have an active session");
  });

  it("enforces free tier limit", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet);

    // Seed 3 completed deep sessions to hit the free tier limit
    await t.run(async (ctx) => {
      const profiles = await ctx.db.query("profiles").collect();
      const userId = profiles[0].userId;
      for (let i = 0; i < 3; i++) {
        await ctx.db.insert("sessions", {
          userId,
          title: `Session ${i}`,
          contentType: "book",
          status: "complete",
          startedAt: new Date().toISOString(),
          isRetroactive: false,
          isDeleted: false,
          type: "deep",
        });
      }
    });

    await expect(
      asUser.mutation(api.sessions.create, { title: "Test", contentType: "book" })
    ).rejects.toThrowError(/reached your 3/);
  });
});

describe("sessions.abandon", () => {
  it("abandons an active session", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet);

    const session = await asUser.mutation(api.sessions.create, {
      title: "Test",
      contentType: "book",
    }) as any;

    await asUser.mutation(api.sessions.abandon, { sessionId: session!._id });

    const active = await asUser.query(api.sessions.getActive);
    expect(active).toBeNull();
  });

  it("throws for non-active session", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet);

    const session = await asUser.mutation(api.sessions.create, {
      title: "Test",
      contentType: "book",
    }) as any;
    await asUser.mutation(api.sessions.abandon, { sessionId: session!._id });

    await expect(
      asUser.mutation(api.sessions.abandon, { sessionId: session!._id })
    ).rejects.toThrowError("Session is not active.");
  });
});

describe("sessions.getActive", () => {
  it("returns null when no active session", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet);

    const active = await asUser.query(api.sessions.getActive);
    expect(active).toBeNull();
  });

  it("returns the active session", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet);

    await asUser.mutation(api.sessions.create, { title: "Active One", contentType: "article" });
    const active = await asUser.query(api.sessions.getActive);
    expect(active).toMatchObject({ title: "Active One", status: "active" });
  });
});

describe("sessions.autoAbandonStaleSessions", () => {
  it("abandons sessions older than 8 hours", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet);

    // Seed a stale session via direct DB insert
    await t.run(async (ctx) => {
      const profiles = await ctx.db.query("profiles").collect();
      const userId = profiles[0].userId;
      const nineHoursAgo = new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString();
      await ctx.db.insert("sessions", {
        userId,
        title: "Stale Session",
        contentType: "book",
        status: "active",
        startedAt: nineHoursAgo,
        isRetroactive: false,
        isDeleted: false,
      });
    });

    await t.mutation(internal.sessions.autoAbandonStaleSessions);

    const active = await asUser.query(api.sessions.getActive);
    expect(active).toBeNull();
  });
});
