import { RATE_LIMIT } from "./constants";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

// NOTE: In-memory rate limiting resets on serverless cold starts (each Vercel
// function instance gets its own Map). This provides best-effort protection
// against bursts within a single instance but is not globally consistent.
// TODO: For strict enforcement, migrate to a distributed store (e.g. Upstash
// Redis with @upstash/ratelimit) before scaling beyond moderate traffic.
export class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private maxRequests: number;
  private windowMs: number;

  constructor(config: { maxRequests: number; windowMs: number }) {
    this.maxRequests = config.maxRequests;
    this.windowMs = config.windowMs;

    // Periodic cleanup of expired entries — unref so it doesn't block process exit
    const interval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store) {
        if (now >= entry.resetAt) {
          this.store.delete(key);
        }
      }
    }, 60_000);
    try { interval.unref(); } catch { /* Edge Runtime — no unref needed */ }
  }

  check(key: string): RateLimitResult {
    const now = Date.now();
    const entry = this.store.get(key);

    // No entry or window expired — start fresh
    if (!entry || now >= entry.resetAt) {
      const resetAt = now + this.windowMs;
      this.store.set(key, { count: 1, resetAt });
      return { success: true, remaining: this.maxRequests - 1, resetAt };
    }

    // Within window — increment
    entry.count += 1;

    if (entry.count > this.maxRequests) {
      return { success: false, remaining: 0, resetAt: entry.resetAt };
    }

    return {
      success: true,
      remaining: this.maxRequests - entry.count,
      resetAt: entry.resetAt,
    };
  }
}

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

// Singleton instances
export const authLimiter = new RateLimiter(RATE_LIMIT.AUTH);
export const apiWriteLimiter = new RateLimiter(RATE_LIMIT.API_WRITE);
export const apiReadLimiter = new RateLimiter(RATE_LIMIT.API_READ);
