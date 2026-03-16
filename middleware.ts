import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import {
  authLimiter,
  apiWriteLimiter,
  apiReadLimiter,
  getClientIp,
} from "@/lib/rate-limit";

const isDev = process.env.NODE_ENV === "development";

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

function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
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

  // Generate per-request nonce for CSP
  const nonce = generateNonce();

  const scriptSrc = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://js.stripe.com https://*.clerk.accounts.dev https://challenges.cloudflare.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/`
    : `script-src 'self' 'nonce-${nonce}' https://js.stripe.com https://*.clerk.accounts.dev https://challenges.cloudflare.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/`;

  const styleSrc = isDev
    ? `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`
    : `style-src 'self' 'nonce-${nonce}'`;

  const connectSrc = isDev
    ? "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://api.stripe.com https://*.clerk.accounts.dev https://challenges.cloudflare.com https://us.i.posthog.com https://app.posthog.com ws://localhost:*"
    : "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://api.stripe.com https://*.clerk.accounts.dev https://challenges.cloudflare.com https://us.i.posthog.com https://app.posthog.com";

  const CSP = [
    "default-src 'self'",
    scriptSrc,
    "frame-src https://js.stripe.com https://*.clerk.accounts.dev https://challenges.cloudflare.com https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",
    "frame-ancestors 'none'",
    connectSrc,
    "img-src 'self' data: blob: https://img.clerk.com https://us.i.posthog.com https://app.posthog.com",
    styleSrc,
    "worker-src 'self' blob:",
    "font-src 'self' https://fonts.gstatic.com",
  ].join("; ");

  // Set CSP and pass nonce to layout via header
  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", CSP);
  response.headers.set("x-nonce", nonce);

  // Set country cookie for PPP pricing (Vercel injects x-vercel-ip-country on Edge)
  const country = request.headers.get("x-vercel-ip-country") || "US";
  response.cookies.set("x-user-country", country, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });

  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
