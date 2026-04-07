import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SessionStartForm from "@/components/SessionStartForm";

describe("SessionStartForm", () => {
  const defaultProps = {
    onSubmitAction: vi.fn(),
    isSubmitting: false,
  };

  it("renders all form fields", () => {
    render(<SessionStartForm {...defaultProps} />);
    expect(screen.getByPlaceholderText("title of the content...")).toBeTruthy();
    expect(
      screen.getByPlaceholderText("what do you hope to get from this?"),
    ).toBeTruthy();
    expect(screen.getByText("already consumed?")).toBeTruthy();
  });

  it("renders all 5 content type buttons", () => {
    render(<SessionStartForm {...defaultProps} />);
    for (const type of ["book", "video", "article", "podcast", "other"]) {
      expect(screen.getAllByText(type).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("defaults content type to article", () => {
    render(<SessionStartForm {...defaultProps} />);
    const articleBtns = screen.getAllByText("article");
    // At least one article button should have the selected styling (bg-peach)
    const hasSelected = articleBtns.some((btn) =>
      btn.className.includes("bg-peach"),
    );
    expect(hasSelected).toBe(true);
  });

  it("submit button is disabled when title is empty", () => {
    render(<SessionStartForm {...defaultProps} />);
    const submitBtn = screen.getByText("start session") as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(true);
  });

  it("submit button is enabled when title is filled", () => {
    render(<SessionStartForm {...defaultProps} />);
    const input = screen.getByPlaceholderText("title of the content...");
    fireEvent.change(input, { target: { value: "My Book" } });
    const submitBtn = screen.getByText("start session") as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(false);
  });

  it("shows 'starting...' when isSubmitting is true", () => {
    render(<SessionStartForm {...defaultProps} isSubmitting={true} />);
    expect(screen.getByText("starting...")).toBeTruthy();
  });

  it("submit button is disabled when isSubmitting", () => {
    render(<SessionStartForm {...defaultProps} isSubmitting={true} />);
    const submitBtn = screen.getByText("starting...") as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(true);
  });

  it("calls onSubmitAction with form data on submit", () => {
    const onSubmit = vi.fn();
    render(<SessionStartForm onSubmitAction={onSubmit} isSubmitting={false} />);

    fireEvent.change(screen.getByPlaceholderText("title of the content..."), {
      target: { value: "Atomic Habits" },
    });
    fireEvent.click(screen.getAllByText("book")[0]);
    fireEvent.change(
      screen.getByPlaceholderText("what do you hope to get from this?"),
      {
        target: { value: "Build better habits" },
      },
    );

    fireEvent.submit(screen.getByText("start session").closest("form")!);

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Atomic Habits",
      contentType: "book",
      consumeReason: "Build better habits",
      isRetroactive: false,
    });
  });

  it("toggles retroactive switch", () => {
    render(<SessionStartForm {...defaultProps} />);
    const toggle = screen.getByRole("switch");
    expect(toggle.getAttribute("aria-checked")).toBe("false");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-checked")).toBe("true");
  });

  it("shows character count for consume reason", () => {
    render(<SessionStartForm {...defaultProps} />);
    // Character count is rendered as "{count}/30000" — may be split into text nodes
    expect(screen.getByText(/0.*\/.*30000/)).toBeTruthy();
    fireEvent.change(
      screen.getByPlaceholderText("what do you hope to get from this?"),
      {
        target: { value: "Hello" },
      },
    );
    expect(screen.getByText(/5.*\/.*30000/)).toBeTruthy();
  });

  it("omits consumeReason when empty", () => {
    const onSubmit = vi.fn();
    render(<SessionStartForm onSubmitAction={onSubmit} isSubmitting={false} />);
    fireEvent.change(screen.getByPlaceholderText("title of the content..."), {
      target: { value: "Test" },
    });
    fireEvent.submit(screen.getByText("start session").closest("form")!);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ consumeReason: undefined }),
    );
  });
});
