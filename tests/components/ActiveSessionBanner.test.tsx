import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ActiveSessionBanner from "@/components/ActiveSessionBanner";
import type { Doc } from "@/convex/_generated/dataModel";
import { vi } from "vitest";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

function makeSession(overrides: Partial<Doc<"sessions">> = {}): Doc<"sessions"> {
  return {
    _id: "session123" as Doc<"sessions">["_id"],
    _creationTime: Date.now(),
    userId: "user1",
    title: "Reading Atomic Habits",
    contentType: "book",
    status: "active",
    isRetroactive: false,
    ...overrides,
  } as Doc<"sessions">;
}

describe("ActiveSessionBanner", () => {
  it("renders session title and continue link", () => {
    render(<ActiveSessionBanner session={makeSession()} />);
    expect(screen.getByText("Reading Atomic Habits")).toBeTruthy();
    expect(screen.getByText("Continue")).toBeTruthy();
    expect(screen.getByText("Active Session")).toBeTruthy();
  });

  it("links to the correct session page", () => {
    render(<ActiveSessionBanner session={makeSession()} />);
    const link = screen.getByText("Continue");
    expect(link.getAttribute("href")).toBe("/dashboard/session/session123");
  });

  it("renders null when session is falsy", () => {
    const { container } = render(
      <ActiveSessionBanner session={null as unknown as Doc<"sessions">} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("displays different session titles correctly", () => {
    render(<ActiveSessionBanner session={makeSession({ title: "Watching a TED Talk" })} />);
    expect(screen.getByText("Watching a TED Talk")).toBeTruthy();
  });
});
