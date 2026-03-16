import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.NEXT_PUBLIC_CONVEX_URL = "https://test.convex.cloud";

const { mockAuth, mockConvexMutation, mockConvexQuery } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockConvexMutation: vi.fn(),
  mockConvexQuery: vi.fn().mockResolvedValue([]),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

vi.mock("convex/browser", () => ({
  ConvexHttpClient: class MockConvexHttpClient {
    setAuth = vi.fn();
    mutation = mockConvexMutation;
    query = mockConvexQuery;
  },
}));

vi.mock("@/convex/_generated/api", () => ({
  api: {
    profiles: { checkAndRecordExport: "profiles:checkAndRecordExport" },
    reflections: { exportAll: "reflections:exportAll" },
  },
}));

import { GET } from "@/app/api/export/route";

describe("export GET", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConvexMutation.mockResolvedValue({ allowed: true });
    mockConvexQuery.mockResolvedValue([
      { id: "r1", content: "Test reflection", layers: [] },
    ]);
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null, getToken: vi.fn() });
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns 401 when getToken returns null", async () => {
    mockAuth.mockResolvedValue({
      userId: "user_123",
      getToken: vi.fn().mockResolvedValue(null),
    });
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns 429 when export is rate limited", async () => {
    mockAuth.mockResolvedValue({
      userId: "user_123",
      getToken: vi.fn().mockResolvedValue("token_abc"),
    });
    mockConvexMutation.mockRejectedValue(
      new Error("Export rate limited. Try again later.")
    );

    const res = await GET();
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("3600");
  });

  it("returns 200 with JSON data on success", async () => {
    mockAuth.mockResolvedValue({
      userId: "user_123",
      getToken: vi.fn().mockResolvedValue("token_abc"),
    });

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual([
      { id: "r1", content: "Test reflection", layers: [] },
    ]);
  });

  it("sets Content-Disposition header with filename containing today's date", async () => {
    mockAuth.mockResolvedValue({
      userId: "user_123",
      getToken: vi.fn().mockResolvedValue("token_abc"),
    });

    const res = await GET();
    const disposition = res.headers.get("Content-Disposition");
    const today = new Date().toISOString().split("T")[0];
    expect(disposition).toContain(`distill-export-${today}`);
  });
});
