import { describe, it, expect, vi, beforeEach } from "vitest";

// Set env vars before imports
process.env.STRIPE_PRO_MONTHLY_PRICE_ID = "price_monthly";
process.env.STRIPE_PRO_ANNUAL_PRICE_ID = "price_annual";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
process.env.NEXT_PUBLIC_CONVEX_URL = "https://test.convex.cloud";

const { mockAuth, mockCheckoutCreate, mockPortalCreate, mockConvexQuery } =
  vi.hoisted(() => ({
    mockAuth: vi.fn(),
    mockCheckoutCreate: vi.fn().mockResolvedValue({
      url: "https://checkout.stripe.com/xxx",
    }),
    mockPortalCreate: vi.fn().mockResolvedValue({
      url: "https://billing.stripe.com/xxx",
    }),
    mockConvexQuery: vi.fn().mockResolvedValue({
      stripeCustomerId: "cus_test123",
    }),
  }));

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(() => ({
    checkout: {
      sessions: { create: mockCheckoutCreate },
    },
    billingPortal: {
      sessions: { create: mockPortalCreate },
    },
  })),
}));

vi.mock("convex/browser", () => ({
  ConvexHttpClient: class MockConvexHttpClient {
    setAuth = vi.fn();
    query = mockConvexQuery;
  },
}));

vi.mock("@/convex/_generated/api", () => ({
  api: { profiles: { get: "profiles:get" } },
}));

import { POST as checkoutPOST } from "@/app/api/stripe/create-checkout/route";
import { POST as portalPOST } from "@/app/api/stripe/create-portal/route";

describe("create-checkout POST", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_PRO_MONTHLY_PRICE_ID = "price_monthly";
    process.env.STRIPE_PRO_ANNUAL_PRICE_ID = "price_annual";
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  });

  it("returns 401 when user is not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const req = new Request("http://localhost/api/stripe/create-checkout", {
      method: "POST",
      body: JSON.stringify({ plan: "monthly", currency: "USD" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await checkoutPOST(req);
    expect(res.status).toBe(401);
  });

  it("creates monthly checkout session with correct price ID", async () => {
    mockAuth.mockResolvedValue({ userId: "user_123" });
    const req = new Request("http://localhost/api/stripe/create-checkout", {
      method: "POST",
      body: JSON.stringify({ plan: "monthly", currency: "USD" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await checkoutPOST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.url).toBe("https://checkout.stripe.com/xxx");

    expect(mockCheckoutCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: "price_monthly", quantity: 1 }],
      })
    );
  });

  it("creates annual checkout session with correct price ID", async () => {
    mockAuth.mockResolvedValue({ userId: "user_123" });
    const req = new Request("http://localhost/api/stripe/create-checkout", {
      method: "POST",
      body: JSON.stringify({ plan: "annual", currency: "USD" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await checkoutPOST(req);
    expect(res.status).toBe(200);

    expect(mockCheckoutCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: "price_annual", quantity: 1 }],
      })
    );
  });

  it("returns 500 when price ID is not configured", async () => {
    mockAuth.mockResolvedValue({ userId: "user_123" });
    delete process.env.STRIPE_PRO_MONTHLY_PRICE_ID;
    delete process.env.STRIPE_PRO_ANNUAL_PRICE_ID;

    const req = new Request("http://localhost/api/stripe/create-checkout", {
      method: "POST",
      body: JSON.stringify({ plan: "monthly", currency: "USD" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await checkoutPOST(req);
    expect(res.status).toBe(500);
  });
});

describe("create-portal POST", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConvexQuery.mockResolvedValue({ stripeCustomerId: "cus_test123" });
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const res = await portalPOST();
    expect(res.status).toBe(401);
  });

  it("returns 404 when profile has no stripeCustomerId", async () => {
    mockAuth.mockResolvedValue({
      userId: "user_123",
      getToken: vi.fn().mockResolvedValue("token_abc"),
    });
    mockConvexQuery.mockResolvedValue({ stripeCustomerId: null });

    const res = await portalPOST();
    expect(res.status).toBe(404);
  });

  it("returns billing portal URL on success", async () => {
    mockAuth.mockResolvedValue({
      userId: "user_123",
      getToken: vi.fn().mockResolvedValue("token_abc"),
    });
    mockConvexQuery.mockResolvedValue({ stripeCustomerId: "cus_test123" });

    const res = await portalPOST();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.url).toBe("https://billing.stripe.com/xxx");
  });
});
