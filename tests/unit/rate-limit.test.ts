import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @upstash/ratelimit before importing the module under test
let mockLimitFn: ReturnType<typeof vi.fn>;

vi.mock("@upstash/ratelimit", () => {
  mockLimitFn = vi.fn();
  return {
    Ratelimit: class {
      limit = mockLimitFn;
      static slidingWindow() {
        return "sliding-window";
      }
    },
  };
});

vi.mock("@upstash/redis", () => ({
  Redis: class {
    constructor() {}
  },
}));

// Provide env vars so the limiter instances are created (not null fallback)
vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://fake.upstash.io");
vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "fake-token");

// Import after mocks are set up
const { authLimiter, apiWriteLimiter, apiReadLimiter, getClientIp } =
  await import("@/lib/rate-limit");

describe("Rate limiters (Upstash)", () => {
  beforeEach(() => {
    mockLimitFn.mockReset();
  });

  it("authLimiter.limit() returns success when under limit", async () => {
    mockLimitFn.mockResolvedValue({
      success: true,
      remaining: 4,
      reset: Date.now() + 60_000,
    });
    const result = await authLimiter.limit("auth:1.2.3.4");
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
    expect(mockLimitFn).toHaveBeenCalledWith("auth:1.2.3.4");
  });

  it("authLimiter.limit() returns failure when over limit", async () => {
    mockLimitFn.mockResolvedValue({
      success: false,
      remaining: 0,
      reset: Date.now() + 30_000,
    });
    const result = await authLimiter.limit("auth:1.2.3.4");
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("apiWriteLimiter delegates to Upstash", async () => {
    mockLimitFn.mockResolvedValue({
      success: true,
      remaining: 29,
      reset: Date.now() + 60_000,
    });
    const result = await apiWriteLimiter.limit("write:1.2.3.4");
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(29);
  });

  it("apiReadLimiter delegates to Upstash", async () => {
    mockLimitFn.mockResolvedValue({
      success: true,
      remaining: 59,
      reset: Date.now() + 60_000,
    });
    const result = await apiReadLimiter.limit("read:1.2.3.4");
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(59);
  });

  it("returns reset timestamp from Upstash", async () => {
    const futureReset = Date.now() + 120_000;
    mockLimitFn.mockResolvedValue({
      success: true,
      remaining: 3,
      reset: futureReset,
    });
    const result = await authLimiter.limit("auth:test");
    expect(result.reset).toBe(futureReset);
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

  it("handles multiple IPs in x-forwarded-for (comma-separated), picks last (rightmost = trusted proxy)", () => {
    const req = new Request("http://localhost", {
      headers: {
        "x-forwarded-for": "203.0.113.1, 70.41.3.18, 150.172.238.178",
      },
    });
    expect(getClientIp(req)).toBe("150.172.238.178");
  });

  it("prefers x-real-ip over x-forwarded-for", () => {
    const req = new Request("http://localhost", {
      headers: { "x-real-ip": "10.0.0.1", "x-forwarded-for": "203.0.113.1" },
    });
    expect(getClientIp(req)).toBe("10.0.0.1");
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
