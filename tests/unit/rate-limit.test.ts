import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { RateLimiter, getClientIp } from "@/lib/rate-limit";

describe("RateLimiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests under the limit", () => {
    const limiter = new RateLimiter({ maxRequests: 5, windowMs: 60_000 });
    const result = limiter.check("user1");
    expect(result.success).toBe(true);
  });

  it("first request always succeeds with remaining = maxRequests - 1", () => {
    const limiter = new RateLimiter({ maxRequests: 10, windowMs: 60_000 });
    const result = limiter.check("user1");
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(9);
  });

  it("returns correct remaining count (maxRequests - currentCount)", () => {
    const limiter = new RateLimiter({ maxRequests: 5, windowMs: 60_000 });
    limiter.check("user1"); // count=1, remaining=4
    limiter.check("user1"); // count=2, remaining=3
    const result = limiter.check("user1"); // count=3, remaining=2
    expect(result.remaining).toBe(2);
  });

  it("increments count correctly on successive calls", () => {
    const limiter = new RateLimiter({ maxRequests: 10, windowMs: 60_000 });
    for (let i = 0; i < 5; i++) {
      limiter.check("user1");
    }
    const result = limiter.check("user1"); // count=6, remaining=4
    expect(result.remaining).toBe(4);
    expect(result.success).toBe(true);
  });

  it("blocks requests when limit is exceeded (success === false, remaining === 0)", () => {
    const limiter = new RateLimiter({ maxRequests: 3, windowMs: 60_000 });
    limiter.check("user1"); // 1
    limiter.check("user1"); // 2
    limiter.check("user1"); // 3 — last allowed
    const result = limiter.check("user1"); // 4 — blocked
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("edge case: exactly at maxRequests (last allowed request, remaining === 0, success === true)", () => {
    const limiter = new RateLimiter({ maxRequests: 3, windowMs: 60_000 });
    limiter.check("user1"); // 1
    limiter.check("user1"); // 2
    const result = limiter.check("user1"); // 3 — exactly at max
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("returns resetAt in the future (resetAt > Date.now())", () => {
    const limiter = new RateLimiter({ maxRequests: 5, windowMs: 60_000 });
    const now = Date.now();
    const result = limiter.check("user1");
    expect(result.resetAt).toBeGreaterThan(now);
  });

  it("resets the window after windowMs expires", () => {
    const limiter = new RateLimiter({ maxRequests: 2, windowMs: 10_000 });
    limiter.check("user1"); // 1
    limiter.check("user1"); // 2 — at limit
    const blocked = limiter.check("user1"); // 3 — blocked
    expect(blocked.success).toBe(false);

    vi.advanceTimersByTime(10_000);

    const result = limiter.check("user1"); // fresh window
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(1);
  });

  it("after window expiry, count resets to 1", () => {
    const limiter = new RateLimiter({ maxRequests: 5, windowMs: 5_000 });
    limiter.check("user1"); // 1
    limiter.check("user1"); // 2
    limiter.check("user1"); // 3

    vi.advanceTimersByTime(5_000);

    const result = limiter.check("user1"); // reset — count=1
    expect(result.remaining).toBe(4); // maxRequests(5) - count(1) = 4
  });

  it("handles multiple independent keys without interference", () => {
    const limiter = new RateLimiter({ maxRequests: 2, windowMs: 60_000 });
    limiter.check("user1"); // user1: count=1
    limiter.check("user1"); // user1: count=2
    limiter.check("user1"); // user1: blocked

    const result = limiter.check("user2"); // user2: count=1, fresh
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(1);
  });
});

describe("getClientIp", () => {
  it("extracts first IP from x-forwarded-for header", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "192.168.1.1" },
    });
    expect(getClientIp(req)).toBe("192.168.1.1");
  });

  it("trims whitespace from forwarded IP", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "  10.0.0.1  " },
    });
    expect(getClientIp(req)).toBe("10.0.0.1");
  });

  it("handles multiple IPs in x-forwarded-for (comma-separated), picks first", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "203.0.113.1, 70.41.3.18, 150.172.238.178" },
    });
    expect(getClientIp(req)).toBe("203.0.113.1");
  });

  it("falls back to x-real-ip if no x-forwarded-for", () => {
    const req = new Request("http://localhost", {
      headers: { "x-real-ip": "172.16.0.1" },
    });
    expect(getClientIp(req)).toBe("172.16.0.1");
  });

  it("returns 'unknown' if no IP headers present", () => {
    const req = new Request("http://localhost");
    expect(getClientIp(req)).toBe("unknown");
  });
});
