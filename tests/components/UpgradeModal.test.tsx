import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import UpgradeModal from "@/components/UpgradeModal";

describe("UpgradeModal", () => {
  it("renders nothing when isOpen is false", () => {
    const { container } = render(<UpgradeModal isOpen={false} onCloseAction={vi.fn()} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders the modal when isOpen is true", () => {
    render(<UpgradeModal isOpen={true} onCloseAction={vi.fn()} />);
    expect(screen.getByText("Upgrade to Refiner")).toBeTruthy();
    expect(screen.getByText("Unlock unlimited deep sessions, bi-weekly spaced resurfacing, and multi-layer reflections.")).toBeTruthy();
  });

  it("shows Upgrade Now and Maybe Later buttons", () => {
    render(<UpgradeModal isOpen={true} onCloseAction={vi.fn()} />);
    expect(screen.getByText("Upgrade Now")).toBeTruthy();
    expect(screen.getByText("Maybe Later")).toBeTruthy();
  });

  it("calls onCloseAction when Maybe Later is clicked", () => {
    const onClose = vi.fn();
    render(<UpgradeModal isOpen={true} onCloseAction={onClose} />);
    fireEvent.click(screen.getByText("Maybe Later"));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
