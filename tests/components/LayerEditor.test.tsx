import { describe, it, expect, vi } from "vitest";

vi.mock("@/components/ui/magnetize-button", () => ({
  MagnetizeButton: ({ children, onClick, disabled, className }: any) => (
    <button onClick={onClick} disabled={disabled} className={className}>{children}</button>
  ),
}));

import { render, screen, fireEvent } from "@testing-library/react";
import LayerEditor from "@/components/LayerEditor";

const defaultProps = {
  originalContent: "My original thought about focus.",
  originalDate: "2026-03-01T10:00:00.000Z",
  existingLayers: [
    { content: "I now think differently.", _creationTime: 1709300000000 },
  ],
  onSave: vi.fn().mockResolvedValue(undefined),
  onCancel: vi.fn(),
};

describe("LayerEditor", () => {
  it("renders original content text", () => {
    render(<LayerEditor {...defaultProps} />);
    expect(screen.getByText("My original thought about focus.")).toBeTruthy();
  });

  it("renders original date formatted", () => {
    render(<LayerEditor {...defaultProps} />);
    const formatted = new Date("2026-03-01T10:00:00.000Z").toLocaleDateString();
    expect(screen.getByText(`Original — ${formatted}`)).toBeTruthy();
  });

  it("renders existing layers with their dates", () => {
    render(<LayerEditor {...defaultProps} />);
    expect(screen.getByText("I now think differently.")).toBeTruthy();
    const layerDate = new Date(1709300000000).toLocaleDateString();
    expect(screen.getByText(`Layer — ${layerDate}`)).toBeTruthy();
  });

  it("renders textarea with placeholder 'How has your thinking changed?'", () => {
    render(<LayerEditor {...defaultProps} />);
    expect(screen.getByPlaceholderText("How has your thinking changed?")).toBeTruthy();
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
    fireEvent.change(screen.getByPlaceholderText("How has your thinking changed?"), {
      target: { value: "New thoughts" },
    });
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
    fireEvent.change(screen.getByPlaceholderText("How has your thinking changed?"), {
      target: { value: "  Trimmed thought  " },
    });
    fireEvent.click(screen.getByText("add perspective"));
    expect(onSave).toHaveBeenCalledWith("Trimmed thought");
  });
});
