import { describe, it, expect } from "vitest";
import { FREE_TIER_LIMIT, FREE_TIER_NUDGE } from "@/lib/constants";

describe("free tier constants", () => {
  it("FREE_TIER_LIMIT is 10", () => {
    expect(FREE_TIER_LIMIT).toBe(10);
  });

  it("FREE_TIER_NUDGE is 8", () => {
    expect(FREE_TIER_NUDGE).toBe(8);
  });

  it("nudge threshold is below limit", () => {
    expect(FREE_TIER_NUDGE).toBeLessThan(FREE_TIER_LIMIT);
  });
});

describe("free tier flag logic", () => {
  // Mirrors the logic in ReflectionCapture.tsx:
  //   atLimit  = plan === "free" && reflectionCountThisMonth >= FREE_TIER_LIMIT
  //   nearLimit = plan === "free" && reflectionCountThisMonth >= FREE_TIER_NUDGE
  function computeFlags(
    plan: "free" | "pro",
    reflectionCountThisMonth: number
  ) {
    const atLimit =
      plan === "free" && reflectionCountThisMonth >= FREE_TIER_LIMIT;
    const nearLimit =
      plan === "free" && reflectionCountThisMonth >= FREE_TIER_NUDGE;
    return { atLimit, nearLimit };
  }

  it("at 7 reflections: no warnings", () => {
    const { atLimit, nearLimit } = computeFlags("free", 7);
    expect(atLimit).toBe(false);
    expect(nearLimit).toBe(false);
  });

  it("at 8 reflections (nudge threshold): nearLimit true, atLimit false", () => {
    const { atLimit, nearLimit } = computeFlags("free", 8);
    expect(atLimit).toBe(false);
    expect(nearLimit).toBe(true);
  });

  it("at 9 reflections: nearLimit true, atLimit false", () => {
    const { atLimit, nearLimit } = computeFlags("free", 9);
    expect(atLimit).toBe(false);
    expect(nearLimit).toBe(true);
  });

  it("at 10 reflections (limit): both true", () => {
    const { atLimit, nearLimit } = computeFlags("free", 10);
    expect(atLimit).toBe(true);
    expect(nearLimit).toBe(true);
  });

  it("at 11 reflections (over limit): both true", () => {
    const { atLimit, nearLimit } = computeFlags("free", 11);
    expect(atLimit).toBe(true);
    expect(nearLimit).toBe(true);
  });

  it("pro plan is never limited regardless of count", () => {
    const { atLimit, nearLimit } = computeFlags("pro", 100);
    expect(atLimit).toBe(false);
    expect(nearLimit).toBe(false);
  });

  it("at 0 reflections: no warnings", () => {
    const { atLimit, nearLimit } = computeFlags("free", 0);
    expect(atLimit).toBe(false);
    expect(nearLimit).toBe(false);
  });
});
