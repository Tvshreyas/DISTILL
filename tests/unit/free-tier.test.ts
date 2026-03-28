import { describe, it, expect } from "vitest";
import { FREE_TIER_LIMIT, FREE_TIER_NUDGE } from "@/lib/constants";

describe("free tier constants", () => {
  it("FREE_TIER_LIMIT is 3", () => {
    expect(FREE_TIER_LIMIT).toBe(3);
  });

  it("FREE_TIER_NUDGE is 2", () => {
    expect(FREE_TIER_NUDGE).toBe(2);
  });

  it("nudge threshold is below limit", () => {
    expect(FREE_TIER_NUDGE).toBeLessThan(FREE_TIER_LIMIT);
  });
});

describe("deep session limit logic", () => {
  // Mirrors the enforcement in sessions.create and reflections.create:
  //   atLimit  = plan === "free" && completedDeepSessions >= FREE_TIER_LIMIT
  //   nearLimit = plan === "free" && completedDeepSessions >= FREE_TIER_NUDGE
  function computeFlags(plan: "free" | "pro", completedDeepSessions: number) {
    const atLimit = plan === "free" && completedDeepSessions >= FREE_TIER_LIMIT;
    const nearLimit =
      plan === "free" && completedDeepSessions >= FREE_TIER_NUDGE;
    return { atLimit, nearLimit };
  }

  it("at 0 deep sessions: no warnings", () => {
    const { atLimit, nearLimit } = computeFlags("free", 0);
    expect(atLimit).toBe(false);
    expect(nearLimit).toBe(false);
  });

  it("at 1 deep session: no warnings", () => {
    const { atLimit, nearLimit } = computeFlags("free", 1);
    expect(atLimit).toBe(false);
    expect(nearLimit).toBe(false);
  });

  it("at 2 deep sessions (nudge threshold): nearLimit true, atLimit false", () => {
    const { atLimit, nearLimit } = computeFlags("free", 2);
    expect(atLimit).toBe(false);
    expect(nearLimit).toBe(true);
  });

  it("at 3 deep sessions (limit): both true", () => {
    const { atLimit, nearLimit } = computeFlags("free", 3);
    expect(atLimit).toBe(true);
    expect(nearLimit).toBe(true);
  });

  it("at 4 deep sessions (over limit): both true", () => {
    const { atLimit, nearLimit } = computeFlags("free", 4);
    expect(atLimit).toBe(true);
    expect(nearLimit).toBe(true);
  });

  it("pro plan is never limited regardless of count", () => {
    const { atLimit, nearLimit } = computeFlags("pro", 100);
    expect(atLimit).toBe(false);
    expect(nearLimit).toBe(false);
  });
});
