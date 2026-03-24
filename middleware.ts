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

function rateLimitedResponse(reset: number): NextResponse {
  const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
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
      const result = await authLimiter.limit(`auth:${ip}`);
      if (!result.success) return rateLimitedResponse(result.reset);
    } else if (method === "GET") {
      const result = await apiReadLimiter.limit(`read:${ip}`);
      if (!result.success) return rateLimitedResponse(result.reset);
    } else {
      const result = await apiWriteLimiter.limit(`write:${ip}`);
      if (!result.success) return rateLimitedResponse(result.reset);
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
  // Reporting endpoint for CSP violations (set NEXT_PUBLIC_CSP_REPORT_URI to enable)
  const reportUri = process.env.NEXT_PUBLIC_CSP_REPORT_URI || "";

  // script-src: nonce-based with explicit allowlist for third-party scripts
  // - js.stripe.com — Stripe Elements payment form
  // - *.clerk.accounts.dev — Clerk auth UI widgets
  // - challenges.cloudflare.com — Cloudflare Turnstile bot protection
  // - www.google.com/recaptcha/ — reCAPTCHA bot protection (Clerk fallback)
  // - www.gstatic.com/recaptcha/ — reCAPTCHA static assets
  // - cdnjs.cloudflare.com — Three.js CDN (landing page animation)
  const scriptSrc = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://js.stripe.com https://*.clerk.accounts.dev https://challenges.cloudflare.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://cdnjs.cloudflare.com`
    : `script-src 'self' 'nonce-${nonce}' https://js.stripe.com https://*.clerk.accounts.dev https://challenges.cloudflare.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://cdnjs.cloudflare.com`;

  // style-src: nonce-based; unsafe-inline only in dev for HMR hot-reload styles
  const styleSrc = isDev
    ? `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`
    : `style-src 'self' 'nonce-${nonce}'`;

  // connect-src: API/WebSocket/fetch destinations
  // - *.convex.cloud / wss://*.convex.cloud — Convex DB queries + realtime subscriptions
  // - api.stripe.com — Stripe payment API (client-side tokenization)
  // - *.clerk.accounts.dev — Clerk auth API
  // - challenges.cloudflare.com — Turnstile verification
  // - us.i.posthog.com / app.posthog.com — PostHog analytics ingest
  // - *.ingest.sentry.io — Sentry error reporting
  const connectSrc = isDev
    ? "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://api.stripe.com https://*.clerk.accounts.dev https://*.clerk.com https://clerk-telemetry.com https://challenges.cloudflare.com https://us.i.posthog.com https://app.posthog.com https://*.ingest.sentry.io ws://localhost:*"
    : "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://api.stripe.com https://*.clerk.accounts.dev https://*.clerk.com https://clerk-telemetry.com https://challenges.cloudflare.com https://us.i.posthog.com https://app.posthog.com https://*.ingest.sentry.io";

  const upgradeInsecure = isDev ? "" : "upgrade-insecure-requests";

  const CSP = [
    "default-src 'self'",
    scriptSrc,
    // frame-src: embedded iframes for payment + auth + bot protection
    "frame-src https://js.stripe.com https://*.clerk.accounts.dev https://challenges.cloudflare.com https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",
    // frame-ancestors: prevent clickjacking — no embedding allowed
    "frame-ancestors 'none'",
    connectSrc,
    // img-src: user avatars (Clerk), noise texture (grain-y), analytics pixels (PostHog)
    "img-src 'self' data: blob: https://img.clerk.com https://grain-y.vercel.app https://us.i.posthog.com https://app.posthog.com",
    styleSrc,
    // worker-src: service worker + Three.js blob workers
    "worker-src 'self' blob:",
    // font-src: next/font self-hosts Google Fonts; gstatic kept as safety net
    "font-src 'self' https://fonts.gstatic.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    upgradeInsecure,
    // Violation reporting — enable by setting NEXT_PUBLIC_CSP_REPORT_URI
    reportUri ? `report-uri ${reportUri}` : "",
    reportUri ? `report-to csp-endpoint` : "",
  ].filter(Boolean).join("; ");

  // Set CSP and pass nonce to layout via header
  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", CSP);
  response.headers.set("x-nonce", nonce);

  // Report-To header for CSP violation reporting (Reporting API v1)
  if (reportUri) {
    response.headers.set(
      "Report-To",
      JSON.stringify({
        group: "csp-endpoint",
        max_age: 86400,
        endpoints: [{ url: reportUri }],
      })
    );
  }

  // Capture UTM params in cookies (survives Clerk auth redirect)
  // Sanitize: strip control chars, limit length, alphanumeric + common UTM chars only
  const utmParams = ["utm_source", "utm_medium", "utm_campaign"] as const;
  const UTM_PATTERN = /^[a-zA-Z0-9_\-.:+%]{1,128}$/;
  for (const param of utmParams) {
    const value = request.nextUrl.searchParams.get(param);
    if (value && UTM_PATTERN.test(value)) {
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
  // Validate: ISO 3166-1 alpha-2 codes are exactly 2 uppercase letters
  const rawCountry = request.headers.get("x-vercel-ip-country") || "US";
  const country = /^[A-Z]{2}$/.test(rawCountry) ? rawCountry : "US";
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
