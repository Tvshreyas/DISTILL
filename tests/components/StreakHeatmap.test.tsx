import { describe, it, expect, vi } from "vitest";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }: { children?: React.ReactNode; className?: string }) => <div className={className}>{children}</div>,
  },
}));

import { render, screen } from "@testing-library/react";
import StreakHeatmap from "@/components/StreakHeatmap";

const mockDates = new Set(["2026-03-01", "2026-03-05", "2026-03-10"]);
const mockMonthDays = Array.from({ length: 30 }, (_, i) => ({
  dateStr: `2026-03-${String(i + 1).padStart(2, "0")}`,
  isToday: i === 9, // March 10 is "today"
}));

describe("StreakHeatmap", () => {
  it("renders the '30-Day Activity' heading", () => {
    render(<StreakHeatmap dates={mockDates} monthDays={mockMonthDays} />);
    expect(screen.getByText("30-Day Activity")).toBeTruthy();
  });

  it("renders 30 day cells", () => {
    const { container } = render(<StreakHeatmap dates={mockDates} monthDays={mockMonthDays} />);
    const grid = container.querySelector(".grid");
    // Each day is rendered inside a motion.div (mocked as div)
    expect(grid?.children.length).toBe(30);
  });

  it("renders the 'Reflected' legend label", () => {
    render(<StreakHeatmap dates={mockDates} monthDays={mockMonthDays} />);
    expect(screen.getByText("Reflected")).toBeTruthy();
  });

  it("renders the 'Passive' legend label", () => {
    render(<StreakHeatmap dates={mockDates} monthDays={mockMonthDays} />);
    expect(screen.getByText("Passive")).toBeTruthy();
  });

  it("active days have 'bg-peach' in their className", () => {
    const { container } = render(<StreakHeatmap dates={mockDates} monthDays={mockMonthDays} />);
    const grid = container.querySelector(".grid")!;
    // March 1 is index 0, should be active
    const firstDayDot = grid.children[0].querySelector("div");
    expect(firstDayDot?.className).toContain("bg-peach");
  });

  it("today's cell has 'ring-peach' in its className", () => {
    const { container } = render(<StreakHeatmap dates={mockDates} monthDays={mockMonthDays} />);
    const grid = container.querySelector(".grid")!;
    // March 10 is index 9, isToday = true
    const todayDot = grid.children[9].querySelector("div");
    expect(todayDot?.className).toContain("ring-peach");
  });

  it("renders the quote 'Consistency is the compounding of focus.'", () => {
    render(<StreakHeatmap dates={mockDates} monthDays={mockMonthDays} />);
    expect(screen.getByText(/Consistency is the compounding of focus/)).toBeTruthy();
  });
});
