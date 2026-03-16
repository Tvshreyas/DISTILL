/* eslint-disable @typescript-eslint/no-explicit-any */
import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

/** Helper: creates a user with profile, session, reflection, and resurfacing queue entry */
async function setupWithResurfacing(t: ReturnType<typeof convexTest>) {
  const asUser = t.withIdentity({ name: "Test User" });
  await asUser.mutation(api.profiles.createOrGet);

  const session = await asUser.mutation(api.sessions.create, {
    title: "Deep Work",
    contentType: "book",
  });

  const reflection = await asUser.mutation(api.reflections.create, {
    sessionId: (session as any)._id,
    content: "Focus is everything.",
  }) as any;

  // The reflection.create mutation auto-creates 4 resurfacing queue entries.
  // Make one of them due today so getPending can find it.
  const today = new Date().toISOString().split("T")[0];
  let queueId: any;
  await t.run(async (ctx) => {
    const entries = await ctx.db.query("resurfacingQueue").collect();
    if (entries.length > 0) {
      await ctx.db.patch(entries[0]._id, { dueDate: today });
      queueId = entries[0]._id;
    }
  });

  return { asUser, queueId, reflectionId: reflection!._id };
}

describe("resurfacing.getPending", () => {
  it("returns null when nothing pending", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet);

    const pending = await asUser.query(api.resurfacing.getPending);
    expect(pending).toBeNull();
  });

  it("returns pending item with reflection content and session title", async () => {
    const t = convexTest(schema, modules);
    const { asUser } = await setupWithResurfacing(t);

    const pending = await asUser.query(api.resurfacing.getPending);
    expect(pending).not.toBeNull();
    expect(pending!.reflection.content).toBe("Focus is everything.");
    expect(pending!.session!.title).toBe("Deep Work");
  });
});

describe("resurfacing.respond", () => {
  it("marks item as surfaced", async () => {
    const t = convexTest(schema, modules);
    const { asUser, queueId } = await setupWithResurfacing(t);

    await asUser.mutation(api.resurfacing.respond, {
      queueId,
      action: "surfaced",
    });

    await t.run(async (ctx) => {
      const entry = await ctx.db.get(queueId);
      expect((entry as any).status).toBe("surfaced");
    });
  });

  it("marks item as dismissed", async () => {
    const t = convexTest(schema, modules);
    const { asUser, queueId } = await setupWithResurfacing(t);

    await asUser.mutation(api.resurfacing.respond, {
      queueId,
      action: "dismissed",
    });

    await t.run(async (ctx) => {
      const entry = await ctx.db.get(queueId);
      expect((entry as any).status).toBe("dismissed");
    });
  });

  it("creates layer and marks as layered (pro user)", async () => {
    const t = convexTest(schema, modules);
    const { asUser, queueId } = await setupWithResurfacing(t);

    // Upgrade to pro
    await t.run(async (ctx) => {
      const profiles = await ctx.db.query("profiles").collect();
      for (const p of profiles) {
        await ctx.db.patch(p._id, { plan: "pro" });
      }
    });

    await asUser.mutation(api.resurfacing.respond, {
      queueId,
      action: "layered",
      layerContent: "My thinking has evolved.",
    });

    await t.run(async (ctx) => {
      const entry = await ctx.db.get(queueId);
      expect((entry as any).status).toBe("layered");

      const layers = await ctx.db.query("reflectionLayers").collect();
      expect(layers.length).toBe(1);
      expect(layers[0].content).toBe("My thinking has evolved.");
    });
  });

  it("rejects layering for free user", async () => {
    const t = convexTest(schema, modules);
    const { asUser, queueId } = await setupWithResurfacing(t);

    await expect(
      asUser.mutation(api.resurfacing.respond, {
        queueId,
        action: "layered",
        layerContent: "New perspective.",
      })
    ).rejects.toThrowError(/Pro feature/);
  });

  it("rejects empty layer content", async () => {
    const t = convexTest(schema, modules);
    const { asUser, queueId } = await setupWithResurfacing(t);

    await expect(
      asUser.mutation(api.resurfacing.respond, {
        queueId,
        action: "layered",
        layerContent: "",
      })
    ).rejects.toThrowError("Layer content is required.");
  });

  it("rejects response to already-responded item", async () => {
    const t = convexTest(schema, modules);
    const { asUser, queueId } = await setupWithResurfacing(t);

    await asUser.mutation(api.resurfacing.respond, {
      queueId,
      action: "surfaced",
    });

    await expect(
      asUser.mutation(api.resurfacing.respond, {
        queueId,
        action: "dismissed",
      })
    ).rejects.toThrowError("This item has already been responded to.");
  });
});
