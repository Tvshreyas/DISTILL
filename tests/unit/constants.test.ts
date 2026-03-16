import { describe, it, expect } from "vitest";
import { FREE_TIER_LIMIT, FREE_TIER_NUDGE, RATE_LIMIT } from "@/lib/constants";

describe("free tier constants", () => {
  it("FREE_TIER_LIMIT equals 10", () => {
    expect(FREE_TIER_LIMIT).toBe(10);
  });

  it("FREE_TIER_NUDGE equals 8", () => {
    expect(FREE_TIER_NUDGE).toBe(8);
  });

  it("nudge is strictly less than limit", () => {
    expect(FREE_TIER_NUDGE).toBeLessThan(FREE_TIER_LIMIT);
  });

  it("both are positive integers", () => {
    expect(Number.isInteger(FREE_TIER_LIMIT)).toBe(true);
    expect(Number.isInteger(FREE_TIER_NUDGE)).toBe(true);
    expect(FREE_TIER_LIMIT).toBeGreaterThan(0);
    expect(FREE_TIER_NUDGE).toBeGreaterThan(0);
  });
});

describe("RATE_LIMIT", () => {
  it("has AUTH, API_WRITE, and API_READ configs", () => {
    expect(RATE_LIMIT).toHaveProperty("AUTH");
    expect(RATE_LIMIT).toHaveProperty("API_WRITE");
    expect(RATE_LIMIT).toHaveProperty("API_READ");
  });

  it("AUTH allows 5 requests per 15 minutes", () => {
    expect(RATE_LIMIT.AUTH.maxRequests).toBe(5);
    expect(RATE_LIMIT.AUTH.windowMs).toBe(15 * 60 * 1000);
  });

  it("API_WRITE allows 30 requests per minute", () => {
    expect(RATE_LIMIT.API_WRITE.maxRequests).toBe(30);
    expect(RATE_LIMIT.API_WRITE.windowMs).toBe(60 * 1000);
  });

  it("API_READ allows 60 requests per minute", () => {
    expect(RATE_LIMIT.API_READ.maxRequests).toBe(60);
    expect(RATE_LIMIT.API_READ.windowMs).toBe(60 * 1000);
  });

  it("read limit is higher than write limit", () => {
    expect(RATE_LIMIT.API_READ.maxRequests).toBeGreaterThan(
      RATE_LIMIT.API_WRITE.maxRequests
    );
  });

  it("every config has positive maxRequests and windowMs", () => {
    for (const key of Object.keys(RATE_LIMIT) as (keyof typeof RATE_LIMIT)[]) {
      expect(RATE_LIMIT[key].maxRequests).toBeGreaterThan(0);
      expect(RATE_LIMIT[key].windowMs).toBeGreaterThan(0);
    }
  });
});
