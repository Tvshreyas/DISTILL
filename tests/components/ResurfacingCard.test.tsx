import { describe, it, expect, vi, beforeEach } from "vitest";

const mockRespond = vi.fn().mockResolvedValue(undefined);
let mockProfileValue: Record<string, unknown> | null | undefined = { plan: "pro" };
let mockPendingValue: Record<string, unknown> | null | undefined = {
  queueId: "q1",
  daysAgo: 3,
  session: { title: "Deep Work" },
  reflection: { content: "Focus is everything." },
};

vi.mock("convex/react", () => ({
  useQuery: vi.fn((queryFn: { _name?: string }) => {
    const name = queryFn?._name || "";
    if (name.includes("profile")) return mockProfileValue;
    return mockPendingValue;
  }),
  useMutation: vi.fn(() => mockRespond),
}));

vi.mock("@/convex/_generated/api", () => ({
  api: {
    profiles: { get: { _name: "profiles.get" } },
    resurfacing: {
      getPending: { _name: "resurfacing.getPending" },
      respond: { _name: "resurfacing.respond" },
    },
  },
}));

vi.mock("lucide-react", () => ({
  Sparkles: () => <span>sparkles-icon</span>,
  ArrowRight: () => <span>arrow-icon</span>,
  Check: () => <span>check-icon</span>,
}));

import { render, screen, fireEvent } from "@testing-library/react";
import { toast } from "sonner";
import ResurfacingCard from "@/components/ResurfacingCard";

describe("ResurfacingCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockProfileValue = { plan: "pro" };
    mockPendingValue = {
      queueId: "q1",
      daysAgo: 3,
      session: { title: "Deep Work" },
      reflection: { content: "Focus is everything." },
    };
  });

  it("shows loading skeleton when pending is undefined", () => {
    mockPendingValue = undefined;
    const { container } = render(<ResurfacingCard />);
    expect(container.querySelector(".animate-pulse")).toBeTruthy();
  });

  it("shows 'all caught up' message when pending is null", () => {
    mockPendingValue = null;
    render(<ResurfacingCard />);
    expect(screen.getByText("all caught up.")).toBeTruthy();
  });

  it("displays reflection content when pending item exists", () => {
    render(<ResurfacingCard />);
    expect(screen.getByText(/Focus is everything/)).toBeTruthy();
  });

  it("displays session title", () => {
    render(<ResurfacingCard />);
    expect(screen.getByText("Deep Work")).toBeTruthy();
  });

  it("displays 'Resurfacing from 3 days ago' pill", () => {
    render(<ResurfacingCard />);
    expect(screen.getByText(/Resurfacing from 3 days ago/)).toBeTruthy();
  });

  it("clicking Acknowledge calls respond with action 'surfaced'", async () => {
    render(<ResurfacingCard />);
    fireEvent.click(screen.getByText(/Acknowledge/));
    await vi.waitFor(() => {
      expect(mockRespond).toHaveBeenCalledWith(
        expect.objectContaining({ queueId: "q1", action: "surfaced" })
      );
    });
  });

  it("clicking Dismiss calls respond with action 'dismissed'", async () => {
    render(<ResurfacingCard />);
    fireEvent.click(screen.getByText("Dismiss"));
    await vi.waitFor(() => {
      expect(mockRespond).toHaveBeenCalledWith(
        expect.objectContaining({ queueId: "q1", action: "dismissed" })
      );
    });
  });

  it("clicking 'View Changed' (free plan) shows toast error", () => {
    mockProfileValue = { plan: "free" };
    render(<ResurfacingCard />);
    fireEvent.click(screen.getByText(/View Changed/));
    expect(toast.error).toHaveBeenCalledWith("Adding new perspectives is a Pro feature.");
    // Should NOT show the layer textarea
    expect(screen.queryByPlaceholderText("Add a new layer of thinking...")).toBeNull();
  });

  it("clicking 'View Changed' (pro plan) opens the layer textarea", () => {
    mockProfileValue = { plan: "pro" };
    render(<ResurfacingCard />);
    fireEvent.click(screen.getByText(/View Changed/));
    expect(screen.getByPlaceholderText("Add a new layer of thinking...")).toBeTruthy();
  });

  it("layer Save button is disabled when textarea is empty", () => {
    render(<ResurfacingCard />);
    fireEvent.click(screen.getByText(/View Changed/));
    const saveBtn = screen.getByText("Save Layer") as HTMLButtonElement;
    expect(saveBtn.disabled).toBe(true);
  });
});
