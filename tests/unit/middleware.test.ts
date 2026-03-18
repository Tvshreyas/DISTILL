import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse, NextRequest } from "next/server";

// Mock rate-limit module
const mockAuthCheck = vi.fn().mockReturnValue({ success: true, remaining: 4, resetAt: Date.now() + 60_000 });
const mockReadCheck = vi.fn().mockReturnValue({ success: true, remaining: 59, resetAt: Date.now() + 60_000 });
const mockWriteCheck = vi.fn().mockReturnValue({ success: true, remaining: 29, resetAt: Date.now() + 60_000 });
const mockGetClientIp = vi.fn().mockReturnValue("127.0.0.1");

vi.mock("@/lib/rate-limit", () => ({
  authLimiter: { check: (...args: unknown[]) => mockAuthCheck(...args) },
  apiWriteLimiter: { check: (...args: unknown[]) => mockWriteCheck(...args) },
  apiReadLimiter: { check: (...args: unknown[]) => mockReadCheck(...args) },
  getClientIp: (...args: unknown[]) => mockGetClientIp(...args),
}));

// Track protect calls and auth state
let mockProtect: ReturnType<typeof vi.fn>;
let mockUserId: string | null;

vi.mock("@clerk/nextjs/server", () => ({
  clerkMiddleware: (handler: (auth: unknown, request: NextRequest) => Promise<NextResponse | void>) => {
    // Return an async function that acts as the middleware
    return async (request: NextRequest) => {
      const authFn = Object.assign(
        async () => ({ userId: mockUserId }),
        { protect: mockProtect }
      );
      return handler(authFn, request);
    };
  },
  createRouteMatcher: (patterns: string[]) => (req: NextRequest) =>
    patterns.some((p) =>
      new RegExp("^" + p.replace("(.*)", ".*") + "$").test(req.nextUrl.pathname)
    ),
}));

// Deterministic nonce
vi.stubGlobal("crypto", {
  getRandomValues: (arr: Uint8Array) => {
    for (let i = 0; i < arr.length; i++) arr[i] = i + 1;
    return arr;
  },
});

// Helper to create a NextRequest
function makeRequest(path: string, method = "GET"): NextRequest {
  return new NextRequest(new URL(path, "http://localhost:3000"), { method });
}

// Import the middleware after mocks are set up
async function runMiddleware(path: string, method = "GET") {
  // Dynamic import to get fresh module with mocks applied
  const mod = await import("@/middleware");
  const middleware = mod.default as (request: NextRequest) => Promise<NextResponse>;
  return middleware(makeRequest(path, method));
}

describe("middleware - rate limiting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockProtect = vi.fn();
    mockUserId = null;
    mockAuthCheck.mockReturnValue({ success: true, remaining: 4, resetAt: Date.now() + 60_000 });
    mockReadCheck.mockReturnValue({ success: true, remaining: 59, resetAt: Date.now() + 60_000 });
    mockWriteCheck.mockReturnValue({ success: true, remaining: 29, resetAt: Date.now() + 60_000 });
  });

  it("rate limits auth API routes using authLimiter", async () => {
    await runMiddleware("/api/auth/login");
    expect(mockAuthCheck).toHaveBeenCalledWith("auth:127.0.0.1");
  });

  it("rate limits GET API routes using apiReadLimiter", async () => {
    await runMiddleware("/api/sessions", "GET");
    expect(mockReadCheck).toHaveBeenCalledWith("read:127.0.0.1");
  });

  it("rate limits POST/PUT/DELETE API routes using apiWriteLimiter", async () => {
    await runMiddleware("/api/reflections", "POST");
    expect(mockWriteCheck).toHaveBeenCalledWith("write:127.0.0.1");
  });

  it("returns 429 with Retry-After header when rate limited", async () => {
    const resetAt = Date.now() + 30_000;
    mockAuthCheck.mockReturnValue({ success: false, remaining: 0, resetAt });

    const response = await runMiddleware("/api/auth/login");
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBeTruthy();
  });

  it("does not rate limit non-API routes", async () => {
    await runMiddleware("/dashboard");
    expect(mockAuthCheck).not.toHaveBeenCalled();
    expect(mockReadCheck).not.toHaveBeenCalled();
    expect(mockWriteCheck).not.toHaveBeenCalled();
  });
});

describe("middleware - route protection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockProtect = vi.fn();
    mockUserId = null;
  });

  it("calls auth.protect() for /dashboard routes", async () => {
    await runMiddleware("/dashboard");
    expect(mockProtect).toHaveBeenCalled();
  });

  it("calls auth.protect() for /onboarding/migrate", async () => {
    await runMiddleware("/onboarding/migrate");
    expect(mockProtect).toHaveBeenCalled();
  });

  it("does not protect public routes like / or /sign-in", async () => {
    await runMiddleware("/");
    expect(mockProtect).not.toHaveBeenCalled();

    vi.clearAllMocks();
    await runMiddleware("/sign-in");
    expect(mockProtect).not.toHaveBeenCalled();
  });
});

describe("middleware - auth redirect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockProtect = vi.fn();
  });

  it("redirects authenticated users from /sign-in to /dashboard", async () => {
    mockUserId = "user_123";
    const response = await runMiddleware("/sign-in");
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get("Location")!).pathname).toBe("/dashboard");
  });

  it("does not redirect unauthenticated users from /sign-in", async () => {
    mockUserId = null;
    const response = await runMiddleware("/sign-in");
    expect(response.status).not.toBe(307);
  });
});

describe("middleware - CSP headers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockProtect = vi.fn();
    mockUserId = null;
  });

  it("sets Content-Security-Policy header on response", async () => {
    const response = await runMiddleware("/about");
    expect(response.headers.get("Content-Security-Policy")).toBeTruthy();
  });

  it("sets x-nonce header on response", async () => {
    const response = await runMiddleware("/about");
    expect(response.headers.get("x-nonce")).toBeTruthy();
  });

  it("CSP includes nonce in script-src", async () => {
    const response = await runMiddleware("/about");
    const csp = response.headers.get("Content-Security-Policy")!;
    const nonce = response.headers.get("x-nonce")!;
    expect(csp).toContain(`'nonce-${nonce}'`);
  });

  it("CSP includes frame-ancestors 'none' (clickjacking protection)", async () => {
    const response = await runMiddleware("/about");
    const csp = response.headers.get("Content-Security-Policy")!;
    expect(csp).toContain("frame-ancestors 'none'");
  });
});
