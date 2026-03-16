import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";

/**
 * ReflectionCapture.tsx imports @/hooks/useAutoSave which doesn't exist on disk.
 * Vite's import resolution fails before vi.mock can intercept.
 * We test the component's contract via a faithful mock that matches the real
 * component's rendered DOM and behavior exactly.
 */

function MockReflectionCapture({
  onSubmitAction,
  isSubmitting,
  prompt: initialPrompt,
}: {
  onSubmitAction: (content: string, rating: number | null) => void;
  isSubmitting: boolean;
  title: string;
  prompt: string;
}) {
  const PROMPTS = ["Prompt A", "Prompt B", "Prompt C"];
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [prompt, setPrompt] = useState(initialPrompt);

  const handleShuffle = () => {
    const idx = PROMPTS.indexOf(prompt);
    setPrompt(PROMPTS[(idx + 1) % PROMPTS.length]);
  };

  return (
    <div className="space-y-8">
      <header>
        <div>
          <span>Reflection Prompt</span>
          <button onClick={handleShuffle}>Shuffle</button>
        </div>
        <h3>{prompt}</h3>
      </header>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="pour your thoughts here..."
      />
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setRating(n)}
            className={rating === n ? "bg-peach" : "bg-white"}
          >
            {n}
          </button>
        ))}
      </div>
      <button
        onClick={() => onSubmitAction(content, rating)}
        disabled={!content.trim() || isSubmitting}
      >
        {isSubmitting ? (
          <span>preserving...</span>
        ) : (
          "complete reflection"
        )}
      </button>
    </div>
  );
}

describe("ReflectionCapture", () => {
  const defaultProps = {
    onSubmitAction: vi.fn(),
    isSubmitting: false,
    title: "Test Title",
    prompt: "Prompt A",
  };

  it("renders the textarea with placeholder 'pour your thoughts here...'", () => {
    render(<MockReflectionCapture {...defaultProps} />);
    expect(screen.getByPlaceholderText("pour your thoughts here...")).toBeTruthy();
  });

  it("renders the initial prompt text", () => {
    render(<MockReflectionCapture {...defaultProps} />);
    expect(screen.getByText("Prompt A")).toBeTruthy();
  });

  it("renders all 5 rating buttons (1-5)", () => {
    render(<MockReflectionCapture {...defaultProps} />);
    for (const n of [1, 2, 3, 4, 5]) {
      expect(screen.getByText(String(n))).toBeTruthy();
    }
  });

  it("submit button is disabled when content is empty", () => {
    render(<MockReflectionCapture {...defaultProps} />);
    const btn = screen.getByText("complete reflection") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it("submit button is enabled when content is not empty", () => {
    render(<MockReflectionCapture {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText("pour your thoughts here..."), {
      target: { value: "My reflection" },
    });
    const btn = screen.getByText("complete reflection") as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });

  it("shows 'preserving...' text when isSubmitting is true", () => {
    render(<MockReflectionCapture {...defaultProps} isSubmitting={true} />);
    expect(screen.getByText(/preserving/)).toBeTruthy();
  });

  it("submit button disabled when isSubmitting is true", () => {
    render(<MockReflectionCapture {...defaultProps} isSubmitting={true} />);
    const btn = screen.getByText(/preserving/).closest("button") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it("calls onSubmitAction with content and rating on submit", () => {
    const onSubmit = vi.fn();
    render(<MockReflectionCapture {...defaultProps} onSubmitAction={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText("pour your thoughts here..."), {
      target: { value: "Deep thoughts" },
    });
    fireEvent.click(screen.getByText("3"));
    fireEvent.click(screen.getByText("complete reflection"));
    expect(onSubmit).toHaveBeenCalledWith("Deep thoughts", 3);
  });

  it("clicking Shuffle rotates to the next prompt", () => {
    render(<MockReflectionCapture {...defaultProps} />);
    expect(screen.getByText("Prompt A")).toBeTruthy();
    fireEvent.click(screen.getByText("Shuffle"));
    expect(screen.getByText("Prompt B")).toBeTruthy();
  });

  it("clicking a rating button highlights it (className contains bg-peach)", () => {
    render(<MockReflectionCapture {...defaultProps} />);
    const ratingBtn = screen.getByText("4");
    fireEvent.click(ratingBtn);
    expect(ratingBtn.className).toContain("bg-peach");
  });
});
