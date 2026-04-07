import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { RATE_LIMIT } from "./constants";

function createRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redis = createRedis();

function createLimiter(
  prefix: string,
  config: { maxRequests: number; windowMs: number },
): Ratelimit | null {
  if (!redis) return null;
  const windowSec = `${Math.round(config.windowMs / 1000)} s` as const;
  return new Ratelimit({
    redis,
    prefix: `ratelimit:${prefix}`,
    limiter: Ratelimit.slidingWindow(config.maxRequests, windowSec),
    analytics: false,
  });
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // Unix timestamp ms when window resets
}

// Singleton instances — null when Upstash env vars are missing (local dev)
const authRL = createLimiter("auth", RATE_LIMIT.AUTH);
const apiWriteRL = createLimiter("api-write", RATE_LIMIT.API_WRITE);
const apiReadRL = createLimiter("api-read", RATE_LIMIT.API_READ);

async function checkLimit(
  limiter: Ratelimit | null,
  key: string,
): Promise<RateLimitResult> {
  // Graceful fallback: no Redis = allow all (rate limiting is best-effort)
  if (!limiter) {
    return { success: true, remaining: 999, reset: Date.now() + 60_000 };
  }
  const result = await limiter.limit(key);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}

export const authLimiter = {
  limit: (key: string) => checkLimit(authRL, key),
};

export const apiWriteLimiter = {
  limit: (key: string) => checkLimit(apiWriteRL, key),
};

export const apiReadLimiter = {
  limit: (key: string) => checkLimit(apiReadRL, key),
};

export function getClientIp(request: Request): string {
  // Prefer x-real-ip — set by Vercel infrastructure, not client-controllable.
  // x-forwarded-for leftmost entry is user-supplied and spoofable.
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim());
    return ips[ips.length - 1]; // rightmost = last trusted proxy
  }
  return "unknown";
}
