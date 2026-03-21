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

  // Reject oversized request bodies (1MB limit for API routes)
  const contentLength = request.headers.get("content-length");
  if (pathname.startsWith("/api/") && contentLength && parseInt(contentLength, 10) > 1_048_576) {
    return NextResponse.json(
      { error: { code: "PAYLOAD_TOO_LARGE", message: "Request body too large." } },
      { status: 413 }
    );
  }

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

  // --- CSP Directive Construction ---
  // Each external domain is explicitly listed with its purpose.

  const scriptSrc = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://js.stripe.com https://*.clerk.accounts.dev https://challenges.cloudflare.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://cdnjs.cloudflare.com`
    //                                     ^unsafe-eval: Next.js HMR     ^Stripe Elements         ^Clerk auth UI                     ^Cloudflare Turnstile            ^reCAPTCHA                       ^reCAPTCHA assets                  ^Three.js (landing animation)
    : `script-src 'self' 'nonce-${nonce}' https://js.stripe.com https://*.clerk.accounts.dev https://challenges.cloudflare.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://cdnjs.cloudflare.com`;

  const styleSrc = isDev
    ? `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`
    : `style-src 'self' 'nonce-${nonce}'`;

  const connectSrc = isDev
    ? "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://api.stripe.com https://*.clerk.accounts.dev https://challenges.cloudflare.com https://us.i.posthog.com https://app.posthog.com https://*.ingest.sentry.io ws://localhost:*"
    //                      ^Convex DB queries      ^Convex realtime       ^Stripe API            ^Clerk auth               ^Turnstile                       ^PostHog analytics          ^PostHog                     ^Sentry error reports          ^Next.js HMR
    : "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://api.stripe.com https://*.clerk.accounts.dev https://challenges.cloudflare.com https://us.i.posthog.com https://app.posthog.com https://*.ingest.sentry.io";

  const upgradeInsecure = isDev ? "" : "upgrade-insecure-requests";

  const CSP = [
    "default-src 'self'",
    scriptSrc,
    "frame-src https://js.stripe.com https://*.clerk.accounts.dev https://challenges.cloudflare.com https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",
    "frame-ancestors 'none'",
    connectSrc,
    "img-src 'self' data: blob: https://img.clerk.com https://grain-y.vercel.app https://us.i.posthog.com https://app.posthog.com",
    styleSrc,
    "worker-src 'self' blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    upgradeInsecure,
  ].filter(Boolean).join("; ");

  // Set CSP and pass nonce to layout via header
  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", CSP);
  response.headers.set("x-nonce", nonce);

  // Capture UTM params in cookies (survives Clerk auth redirect)
  const utmParams = ["utm_source", "utm_medium", "utm_campaign"] as const;
  for (const param of utmParams) {
    const value = request.nextUrl.searchParams.get(param);
    if (value) {
      response.cookies.set(param, value, {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }
  }

  // Set country cookie for PPP pricing (Vercel injects x-vercel-ip-country on Edge)
  const country = request.headers.get("x-vercel-ip-country") || "US";
  response.cookies.set("x-user-country", country, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
