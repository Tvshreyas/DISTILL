import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ReflectionDetail from "@/components/ReflectionDetail";
import type { Doc } from "@/convex/_generated/dataModel";

function makeReflection(overrides: Partial<Doc<"reflections">> = {}): Doc<"reflections"> {
  return {
    _id: "reflection1" as Doc<"reflections">["_id"],
    _creationTime: Date.now(),
    userId: "user1",
    sessionId: "session1" as Doc<"reflections">["sessionId"],
    content: "This is my reflection content",
    thinkingShiftRating: undefined,
    isDeleted: false,
    ...overrides,
  } as Doc<"reflections">;
}

describe("ReflectionDetail", () => {
  it("renders the reflection content wrapped in smart quotes", () => {
    render(<ReflectionDetail reflection={makeReflection({ content: "Test content" })} />);
    // The component uses &ldquo; and &rdquo; entities
    expect(screen.getByText(/Test content/)).toBeTruthy();
    const paragraph = screen.getByText(/Test content/);
    expect(paragraph.textContent).toContain("\u201C");
    expect(paragraph.textContent).toContain("\u201D");
  });

  it("renders null when reflection is falsy", () => {
    const { container } = render(<ReflectionDetail reflection={null as unknown as Doc<"reflections">} />);
    expect(container.innerHTML).toBe("");
  });

  it("shows thinking shift rating when present", () => {
    render(<ReflectionDetail reflection={makeReflection({ thinkingShiftRating: 4 })} />);
    expect(screen.getByText("4/5")).toBeTruthy();
    expect(screen.getByText("Thinking Shift Impact")).toBeTruthy();
  });

  it("hides thinking shift rating when null", () => {
    render(<ReflectionDetail reflection={makeReflection({ thinkingShiftRating: undefined })} />);
    expect(screen.queryByText("Thinking Shift Impact")).toBeNull();
  });

  it("hides thinking shift rating when undefined", () => {
    render(<ReflectionDetail reflection={makeReflection({ thinkingShiftRating: undefined } as Partial<Doc<"reflections">>)} />);
    expect(screen.queryByText("Thinking Shift Impact")).toBeNull();
  });

  it("renders long content without truncation", () => {
    const longContent = "A".repeat(2000);
    render(<ReflectionDetail reflection={makeReflection({ content: longContent })} />);
    expect(screen.getByText(new RegExp("A{100}"))).toBeTruthy();
  });
});
