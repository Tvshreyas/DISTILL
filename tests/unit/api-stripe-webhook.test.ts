/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Set env vars before imports
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
process.env.NEXT_PUBLIC_CONVEX_URL = "https://test.convex.cloud";
process.env.CONVEX_INTERNAL_AUTH_KEY = "test-key";

const mockConstructEvent = vi.fn();
const mockRetrieveSubscription = vi.fn().mockResolvedValue({
  current_period_end: 1700000000,
});

vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(() => ({
    webhooks: {
      constructEvent: mockConstructEvent,
    },
    subscriptions: {
      retrieve: mockRetrieveSubscription,
    },
  })),
}));

// Mock fetch for callConvexBridge
const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: vi.fn().mockResolvedValue({ value: { userId: "user123" } }),
  text: vi.fn().mockResolvedValue("ok"),
});
vi.stubGlobal("fetch", mockFetch);

// Must import AFTER mocks
import { POST } from "@/app/api/stripe/webhook/route";

function makeRequest(
  body = "raw-body",
  headers: Record<string, string> = { "stripe-signature": "sig_test" },
) {
  return new Request("http://localhost/api/stripe/webhook", {
    method: "POST",
    body,
    headers,
  });
}

describe("Stripe Webhook POST", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    process.env.NEXT_PUBLIC_CONVEX_URL = "https://test.convex.cloud";
    process.env.CONVEX_INTERNAL_AUTH_KEY = "test-key";
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ value: { userId: "user123" } }),
      text: vi.fn().mockResolvedValue("ok"),
    });
  });

  it("returns 400 when stripe-signature header is missing", async () => {
    const req = makeRequest("body", {});
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/Missing signature/);
  });

  it("returns 400 when STRIPE_WEBHOOK_SECRET is not set", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const req = makeRequest();
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when signature verification fails", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });
    const req = makeRequest();
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid signature");
  });

  it("handles checkout.session.completed → calls updatePlan", async () => {
    mockConstructEvent.mockReturnValue({
      id: "evt_checkout_1",
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: { userId: "user_abc" },
          subscription: "sub_123",
          customer: "cus_456",
        },
      },
    });

    const req = makeRequest();
    const res = await POST(req);
    expect(res.status).toBe(200);

    // Should call bridge with updatePlan
    const updateCall = mockFetch.mock.calls.find((c: any[]) => {
      const body = JSON.parse(c[1]?.body as string);
      return body.action === "updatePlan";
    });
    expect(updateCall).toBeDefined();
    const updateArgs = JSON.parse(updateCall![1].body).args;
    expect(updateArgs.plan).toBe("pro");
    expect(updateArgs.stripeCustomerId).toBe("cus_456");
    expect(updateArgs.stripeSubscriptionId).toBe("sub_123");
  });

  it("handles customer.subscription.updated → calls updatePlan with correct plan", async () => {
    mockConstructEvent.mockReturnValue({
      id: "evt_sub_update_1",
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_789",
          customer: "cus_existing",
          status: "active",
          current_period_end: 1700000000,
        },
      },
    });

    const req = makeRequest();
    const res = await POST(req);
    expect(res.status).toBe(200);

    const updateCall = mockFetch.mock.calls.find((c: any[]) => {
      const body = JSON.parse(c[1]?.body as string);
      return body.action === "updatePlan";
    });
    expect(updateCall).toBeDefined();
    const updateArgs = JSON.parse(updateCall![1].body).args;
    expect(updateArgs.plan).toBe("pro");
  });

  it("handles customer.subscription.deleted → downgrades to free", async () => {
    mockConstructEvent.mockReturnValue({
      id: "evt_sub_del_1",
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: "sub_789",
          customer: "cus_existing",
          status: "canceled",
          current_period_end: 1700000000,
        },
      },
    });

    const req = makeRequest();
    const res = await POST(req);
    expect(res.status).toBe(200);

    const updateCall = mockFetch.mock.calls.find((c: any[]) => {
      const body = JSON.parse(c[1]?.body as string);
      return body.action === "updatePlan";
    });
    expect(updateCall).toBeDefined();
    const updateArgs = JSON.parse(updateCall![1].body).args;
    expect(updateArgs.plan).toBe("free");
  });

  it("records event via recordWebhookEvent call", async () => {
    mockConstructEvent.mockReturnValue({
      id: "evt_record_1",
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: { userId: "user_abc" },
          subscription: "sub_123",
          customer: "cus_456",
        },
      },
    });

    const req = makeRequest();
    await POST(req);

    const recordCall = mockFetch.mock.calls.find((c: any[]) => {
      const body = JSON.parse(c[1]?.body as string);
      return body.action === "recordWebhookEvent";
    });
    expect(recordCall).toBeDefined();
    const recordArgs = JSON.parse(recordCall![1].body);
    expect(recordArgs.args.stripeEventId).toBe("evt_record_1");
  });

  it("returns { received: true } on success", async () => {
    mockConstructEvent.mockReturnValue({
      id: "evt_success_1",
      type: "unknown.event.type",
      data: { object: {} },
    });

    const req = makeRequest();
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.received).toBe(true);
  });

  it("returns 500 when fetch to bridge fails", async () => {
    mockConstructEvent.mockReturnValue({
      id: "evt_fail_1",
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: { userId: "user_abc" },
          subscription: "sub_123",
          customer: "cus_456",
        },
      },
    });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: vi.fn().mockResolvedValue("Internal Server Error"),
    });

    const req = makeRequest();
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
