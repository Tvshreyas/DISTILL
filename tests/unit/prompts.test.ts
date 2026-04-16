import { describe, it, expect } from "vitest";
import {
  REFLECTION_PROMPTS,
  PROMPTS_BY_TYPE,
  getPromptForSession,
  getNextPrompt,
} from "@/lib/prompts";

describe("REFLECTION_PROMPTS", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(REFLECTION_PROMPTS)).toBe(true);
    expect(REFLECTION_PROMPTS.length).toBeGreaterThan(0);
  });

  it("contains at least 10 prompts", () => {
    expect(REFLECTION_PROMPTS.length).toBeGreaterThanOrEqual(10);
  });

  it("every prompt is a non-empty string", () => {
    for (const prompt of REFLECTION_PROMPTS) {
      expect(typeof prompt).toBe("string");
      expect(prompt.trim().length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate prompts", () => {
    const unique = new Set(REFLECTION_PROMPTS);
    expect(unique.size).toBe(REFLECTION_PROMPTS.length);
  });

  it("every prompt ends with a question mark", () => {
    for (const prompt of REFLECTION_PROMPTS) {
      expect(prompt.trim().endsWith("?")).toBe(true);
    }
  });
});

describe("PROMPTS_BY_TYPE", () => {
  const expectedTypes = [
    "book",
    "video",
    "article",
    "podcast",
    "realization",
    "workout",
    "walk",
    "other",
  ];

  it("has all expected content types", () => {
    for (const type of expectedTypes) {
      expect(PROMPTS_BY_TYPE).toHaveProperty(type);
    }
  });

  it("each type has at least 5 prompts", () => {
    for (const type of expectedTypes) {
      expect(PROMPTS_BY_TYPE[type].length).toBeGreaterThanOrEqual(5);
    }
  });

  it("every prompt in every type ends with a question mark", () => {
    for (const prompts of Object.values(PROMPTS_BY_TYPE)) {
      for (const prompt of prompts) {
        expect(prompt.trim().endsWith("?")).toBe(true);
      }
    }
  });
});

describe("getPromptForSession", () => {
  it("returns a prompt from the correct type pool", () => {
    const prompt = getPromptForSession("book", "session123");
    expect(PROMPTS_BY_TYPE["book"]).toContain(prompt);
  });

  it("returns the same prompt for the same sessionId (deterministic)", () => {
    const a = getPromptForSession("article", "abc123");
    const b = getPromptForSession("article", "abc123");
    expect(a).toBe(b);
  });

  it("falls back to 'other' for unknown content types", () => {
    const prompt = getPromptForSession("unknown_type", "session999");
    expect(PROMPTS_BY_TYPE["other"]).toContain(prompt);
  });
});

describe("getNextPrompt", () => {
  it("returns the next prompt in the pool", () => {
    const pool = PROMPTS_BY_TYPE["book"];
    const next = getNextPrompt("book", pool[0]);
    expect(next).toBe(pool[1]);
  });

  it("wraps around at the end of the pool", () => {
    const pool = PROMPTS_BY_TYPE["book"];
    const last = pool[pool.length - 1];
    const next = getNextPrompt("book", last);
    expect(next).toBe(pool[0]);
  });

  it("falls back gracefully for a prompt not in the pool", () => {
    const result = getNextPrompt("book", "a prompt that does not exist");
    expect(PROMPTS_BY_TYPE["book"]).toContain(result);
  });
});
