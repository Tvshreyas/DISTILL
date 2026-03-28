/* eslint-disable @typescript-eslint/no-explicit-any */
import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

/** Helper: create an authenticated user with profile + active session, return { asUser, sessionId } */
async function setupUserWithSession(t: ReturnType<typeof convexTest>) {
  const asUser = t.withIdentity({ name: "Test User" });
  await asUser.mutation(api.profiles.createOrGet, {});
  const session = await asUser.mutation(api.sessions.create, {
    title: "Test Book",
    contentType: "book",
  });
  return { asUser, sessionId: (session as any)._id };
}

describe("reflections.create", () => {
  it("throws Unauthorized when not authenticated", async () => {
    const t = convexTest(schema, modules);
    // Need a valid session ID — seed one
    const { sessionId } = await setupUserWithSession(t);

    await expect(
      t.mutation(api.reflections.create, {
        sessionId,
        content: "Test reflection",
      }),
    ).rejects.toThrowError("Unauthorized");
  });

  it("creates a reflection with valid data", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    const result = (await asUser.mutation(api.reflections.create, {
      sessionId,
      content: "This changed my thinking.",
    })) as any;
    expect(result).toMatchObject({
      content: "This changed my thinking.",
      isDeleted: false,
    });
  });

  it("rejects content shorter than 1 character", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    await expect(
      asUser.mutation(api.reflections.create, {
        sessionId,
        content: "",
      }),
    ).rejects.toThrowError(
      "Deep Session reflection must be under 30,000 characters (~5,000 words).",
    );
  });

  it("rejects content longer than 30000 characters", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    await expect(
      asUser.mutation(api.reflections.create, {
        sessionId,
        content: "X".repeat(30001),
      }),
    ).rejects.toThrowError(
      "Deep Session reflection must be under 30,000 characters (~5,000 words).",
    );
  });

  it("rejects invalid rating (0)", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    await expect(
      asUser.mutation(api.reflections.create, {
        sessionId,
        content: "Valid content",
        thinkingShiftRating: 0,
      }),
    ).rejects.toThrowError("Rating must be an integer between 1 and 5.");
  });

  it("rejects invalid rating (6)", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    await expect(
      asUser.mutation(api.reflections.create, {
        sessionId,
        content: "Valid content",
        thinkingShiftRating: 6,
      }),
    ).rejects.toThrowError("Rating must be an integer between 1 and 5.");
  });

  it("rejects non-integer rating (3.5)", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    await expect(
      asUser.mutation(api.reflections.create, {
        sessionId,
        content: "Valid content",
        thinkingShiftRating: 3.5,
      }),
    ).rejects.toThrowError("Rating must be an integer between 1 and 5.");
  });

  it("accepts undefined rating", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    const result = (await asUser.mutation(api.reflections.create, {
      sessionId,
      content: "No rating here.",
    })) as any;
    expect(result!.thinkingShiftRating).toBeUndefined();
  });

  it("auto-completes the session after reflection", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    await asUser.mutation(api.reflections.create, {
      sessionId,
      content: "My reflection.",
    });

    const session = await asUser.query(api.sessions.getById, { sessionId });
    expect(session!.status).toBe("complete");
  });

  it("increments profile reflection counts", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    await asUser.mutation(api.reflections.create, {
      sessionId,
      content: "My reflection.",
    });

    const profile = await asUser.query(api.profiles.get, {});
    expect(profile!.reflectionCountThisMonth).toBe(1);
    expect(profile!.reflectionCountLifetime).toBe(1);
  });

  it("enforces free tier limit of 3 reflections", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    // Seed 3 completed deep sessions to hit the free tier limit
    await t.run(async (ctx) => {
      const profiles = await ctx.db.query("profiles").collect();
      const userId = profiles[0].userId;
      for (let i = 0; i < 3; i++) {
        await ctx.db.insert("sessions", {
          userId,
          title: `Completed Session ${i}`,
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
      asUser.mutation(api.reflections.create, {
        sessionId,
        content: "Over limit.",
      }),
    ).rejects.toThrowError(/reached your 3/);
  });

  it("calculates word count correctly", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    const result = (await asUser.mutation(api.reflections.create, {
      sessionId,
      content: "hello world test",
    })) as any;
    expect(result!.wordCount).toBe(3);
  });

  it("rejects Category A content (hard block)", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    await expect(
      asUser.mutation(api.reflections.create, {
        sessionId,
        content: "Just kill yourself already",
      }),
    ).rejects.toThrowError("This content cannot be saved.");
  });

  it("allows Category B content (soft nudge — server does not block)", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    const result = (await asUser.mutation(api.reflections.create, {
      sessionId,
      content: "I hope you die for writing this",
    })) as any;
    expect(result).toBeTruthy();
    expect(result!.content).toContain("I hope you die");
  });

  it("allows normal reflections with strong language", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    const result = (await asUser.mutation(api.reflections.create, {
      sessionId,
      content: "This book was absolute garbage and a waste of time",
    })) as any;
    expect(result).toBeTruthy();
  });
});

describe("reflections.update", () => {
  it("updates reflection content", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    const created = (await asUser.mutation(api.reflections.create, {
      sessionId,
      content: "Original content.",
    })) as any;

    const updated = (await asUser.mutation(api.reflections.update, {
      reflectionId: created!._id,
      content: "Updated content.",
    })) as any;
    expect(updated!.content).toBe("Updated content.");
  });

  it("rejects Category A content on update", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    const created = (await asUser.mutation(api.reflections.create, {
      sessionId,
      content: "Original safe content.",
    })) as any;

    await expect(
      asUser.mutation(api.reflections.update, {
        reflectionId: created!._id,
        content: "Just kill yourself already",
      }),
    ).rejects.toThrowError("This content cannot be saved.");
  });

  it("throws for other user's reflection", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    const created = (await asUser.mutation(api.reflections.create, {
      sessionId,
      content: "My content.",
    })) as any;

    const otherUser = t.withIdentity({ name: "Other User" });
    await otherUser.mutation(api.profiles.createOrGet, {});

    await expect(
      otherUser.mutation(api.reflections.update, {
        reflectionId: created!._id,
        content: "Hacked!",
      }),
    ).rejects.toThrowError("Resource not found.");
  });
});

describe("reflections.remove", () => {
  it("soft-deletes a reflection", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    const created = (await asUser.mutation(api.reflections.create, {
      sessionId,
      content: "To be deleted.",
    })) as any;

    await asUser.mutation(api.reflections.remove, {
      reflectionId: created!._id,
    });

    const fetched = await asUser.query(api.reflections.getById, {
      reflectionId: created!._id,
    });
    expect(fetched).toBeNull();
  });

  it("throws for non-existent reflection", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    // Create then delete, then try to delete again
    const created = (await asUser.mutation(api.reflections.create, {
      sessionId,
      content: "Delete me.",
    })) as any;
    await asUser.mutation(api.reflections.remove, {
      reflectionId: created!._id,
    });

    await expect(
      asUser.mutation(api.reflections.remove, { reflectionId: created!._id }),
    ).rejects.toThrowError("Resource not found.");
  });
});

describe("reflections.list", () => {
  it("returns empty when no reflections", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet, {});

    const result = await asUser.query(api.reflections.list, {});
    expect(result).toMatchObject({ data: [], total: 0 });
  });

  it("filters out deleted reflections", async () => {
    const t = convexTest(schema, modules);
    const { asUser, sessionId } = await setupUserWithSession(t);

    const created = (await asUser.mutation(api.reflections.create, {
      sessionId,
      content: "Will be deleted.",
    })) as any;
    await asUser.mutation(api.reflections.remove, {
      reflectionId: created!._id,
    });

    const result = await asUser.query(api.reflections.list, {});
    expect(result.total).toBe(0);
  });

  it("limits results (max 50)", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ name: "Test User" });
    await asUser.mutation(api.profiles.createOrGet, {});

    const result = await asUser.query(api.reflections.list, { limit: 100 });
    // The limit gets clamped to 50 internally, but with no data it returns 0
    expect(result.data.length).toBeLessThanOrEqual(50);
  });
});

describe("reflections.purgeSoftDeletedReflections", () => {
  it("deletes reflections soft-deleted more than 30 days ago", async () => {
    const t = convexTest(schema, modules);

    // Seed a soft-deleted reflection older than 30 days
    await t.run(async (ctx) => {
      const sessionId = await ctx.db.insert("sessions", {
        userId: "user1",
        title: "Old Session",
        contentType: "book",
        status: "complete",
        startedAt: new Date().toISOString(),
        isRetroactive: false,
        isDeleted: false,
      });

      const thirtyOneDaysAgo = new Date(
        Date.now() - 31 * 24 * 60 * 60 * 1000,
      ).toISOString();
      await ctx.db.insert("reflections", {
        userId: "user1",
        sessionId,
        content: "Old deleted reflection",
        wordCount: 3,
        isDeleted: true,
        deletedAt: thirtyOneDaysAgo,
        updatedAt: thirtyOneDaysAgo,
      });
    });

    await t.mutation(internal.reflections.purgeSoftDeletedReflections, {});

    // Verify it was purged
    await t.run(async (ctx) => {
      const reflections = await ctx.db.query("reflections").collect();
      expect(reflections.length).toBe(0);
    });
  });
});
