import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import {
  authLimiter,
  apiWriteLimiter,
  apiReadLimiter,
  getClientIp,
} from "@/lib/rate-limit";

const isDev = process.env.NODE_ENV === "development";

const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.clerk.accounts.dev"
  : "script-src 'self' 'unsafe-inline' https://js.stripe.com https://*.clerk.accounts.dev";

const connectSrc = isDev
  ? "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://api.stripe.com https://*.clerk.accounts.dev ws://localhost:*"
  : "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://api.stripe.com https://*.clerk.accounts.dev";

const CSP = [
  "default-src 'self'",
  scriptSrc,
  "frame-src https://js.stripe.com https://*.clerk.accounts.dev",
  "frame-ancestors 'none'",
  connectSrc,
  "img-src 'self' data: blob: https://img.clerk.com",
  "style-src 'self' 'unsafe-inline'",
  "worker-src 'self' blob:",
].join("; ");

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/onboarding/migrate",
]);

function rateLimitedResponse(resetAt: number): NextResponse {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
  return NextResponse.json(
    { error: { code: "RATE_LIMITED", message: "Too many requests. Try again later." } },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    const ip = getClientIp(request);

    if (pathname.startsWith("/api/auth/")) {
      const result = authLimiter.check(`auth:${ip}`);
      if (!result.success) return rateLimitedResponse(result.resetAt);
    } else if (method === "GET") {
      const result = apiReadLimiter.check(`read:${ip}`);
      if (!result.success) return rateLimitedResponse(result.resetAt);
    } else {
      const result = apiWriteLimiter.check(`write:${ip}`);
      if (!result.success) return rateLimitedResponse(result.resetAt);
    }
  }

  // Protect routes requiring auth
  if (isProtectedRoute(request)) {
    await auth.protect();
  }

  // Redirect authenticated users away from sign-in
  const { userId } = await auth();
  if (pathname === "/sign-in" && userId) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Set CSP on the response
  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", CSP);
  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
