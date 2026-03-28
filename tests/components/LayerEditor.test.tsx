import { describe, it, expect, vi } from "vitest";

vi.mock("@/components/ui/magnetize-button", () => ({
  MagnetizeButton: ({
    children,
    onClick,
    disabled,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
  }) => (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  ),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

import { render, screen, fireEvent } from "@testing-library/react";
import LayerEditor from "@/components/LayerEditor";

const defaultProps = {
  onSave: vi.fn().mockResolvedValue(undefined),
  onCancel: vi.fn(),
};

describe("LayerEditor", () => {
  it("renders textarea with placeholder 'how has your thinking changed?'", () => {
    render(<LayerEditor {...defaultProps} />);
    expect(
      screen.getByPlaceholderText("how has your thinking changed?"),
    ).toBeTruthy();
  });

  it("shows character count '0/3000' initially", () => {
    render(<LayerEditor {...defaultProps} />);
    expect(screen.getByText("0/3000")).toBeTruthy();
  });

  it("'add perspective' button is disabled when textarea is empty", () => {
    render(<LayerEditor {...defaultProps} />);
    const btn = screen.getByText("add perspective") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it("'add perspective' button is enabled after typing content", () => {
    render(<LayerEditor {...defaultProps} />);
    fireEvent.change(
      screen.getByPlaceholderText("how has your thinking changed?"),
      {
        target: { value: "New thoughts" },
      },
    );
    const btn = screen.getByText("add perspective") as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });

  it("clicking cancel calls onCancel()", () => {
    const onCancel = vi.fn();
    render(<LayerEditor {...defaultProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByText("cancel"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("calls onSave with trimmed content on save", () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<LayerEditor {...defaultProps} onSave={onSave} />);
    fireEvent.change(
      screen.getByPlaceholderText("how has your thinking changed?"),
      {
        target: { value: "  Trimmed thought  " },
      },
    );
    fireEvent.click(screen.getByText("add perspective"));
    expect(onSave).toHaveBeenCalledWith("Trimmed thought", undefined);
  });
});
