import { describe, it, expect, vi } from "vitest";
import { REFLECTION_PROMPTS, getRandomPrompt } from "@/lib/prompts";

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

describe("getRandomPrompt", () => {
  it("returns a string from the REFLECTION_PROMPTS array", () => {
    const prompt = getRandomPrompt();
    expect(REFLECTION_PROMPTS).toContain(prompt);
  });

  it("returns different prompts across many calls (not always the same)", () => {
    // With 13+ prompts, 50 calls should produce at least 2 unique values
    const results = new Set(
      Array.from({ length: 50 }, () => getRandomPrompt()),
    );
    expect(results.size).toBeGreaterThan(1);
  });

  it("uses Math.random internally", () => {
    const spy = vi.spyOn(Math, "random").mockReturnValue(0);
    const prompt = getRandomPrompt();
    expect(prompt).toBe(REFLECTION_PROMPTS[0]);
    spy.mockRestore();
  });
});
