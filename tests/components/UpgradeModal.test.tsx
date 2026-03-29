import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import UpgradeModal from "@/components/UpgradeModal";

describe("UpgradeModal", () => {
  it("renders nothing when isOpen is false", () => {
    const { container } = render(
      <UpgradeModal isOpen={false} onCloseAction={vi.fn()} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders the modal when isOpen is true", () => {
    render(<UpgradeModal isOpen={true} onCloseAction={vi.fn()} />);
    expect(screen.getByText("Pro is coming soon")).toBeTruthy();
  });

  it("shows notify and dismiss buttons", () => {
    render(<UpgradeModal isOpen={true} onCloseAction={vi.fn()} />);
    expect(screen.getByText("notify me when Pro is available")).toBeTruthy();
    expect(screen.getByText("not now")).toBeTruthy();
  });

  it("calls onCloseAction when dismiss is clicked", () => {
    const onClose = vi.fn();
    render(<UpgradeModal isOpen={true} onCloseAction={onClose} />);
    fireEvent.click(screen.getByText("not now"));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
