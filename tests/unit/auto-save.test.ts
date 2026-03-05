import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAutoSave } from "@/hooks/useAutoSave";

describe("useAutoSave", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("debounces saves by the specified delay", () => {
    const onSave = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useAutoSave(value, onSave, 3000),
      { initialProps: { value: "initial" } }
    );

    // Change value
    rerender({ value: "updated" });

    // Not called yet — still within debounce window
    expect(onSave).not.toHaveBeenCalled();

    // Advance past the debounce delay
    vi.advanceTimersByTime(3000);

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("updated");
  });

  it("resets the debounce timer on each change", () => {
    const onSave = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useAutoSave(value, onSave, 3000),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "first change" });
    vi.advanceTimersByTime(2000); // 2s into debounce

    // Another change resets the timer
    rerender({ value: "second change" });
    vi.advanceTimersByTime(2000); // 2s into new debounce — 4s total

    // First change should NOT have been saved
    expect(onSave).not.toHaveBeenCalled();

    // Complete the second debounce
    vi.advanceTimersByTime(1000);
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("second change");
  });

  it("saves on unmount if there are unsaved changes", () => {
    const onSave = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ value }) => useAutoSave(value, onSave, 3000),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "unsaved content" });

    // Don't advance timers — unmount while pending
    unmount();

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("unsaved content");
  });

  it("does not save on unmount if there are no changes", () => {
    const onSave = vi.fn();
    const { unmount } = renderHook(
      ({ value }) => useAutoSave(value, onSave, 3000),
      { initialProps: { value: "initial" } }
    );

    // No changes made — just unmount
    unmount();

    expect(onSave).not.toHaveBeenCalled();
  });

  it("does not save empty content", () => {
    const onSave = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useAutoSave(value, onSave, 3000),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "" });
    vi.advanceTimersByTime(3000);

    expect(onSave).not.toHaveBeenCalled();
  });

  it("does not save whitespace-only content", () => {
    const onSave = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useAutoSave(value, onSave, 3000),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "   \t\n  " });
    vi.advanceTimersByTime(3000);

    expect(onSave).not.toHaveBeenCalled();
  });

  it("does not save if value has not changed from initial", () => {
    const onSave = vi.fn();
    renderHook(({ value }) => useAutoSave(value, onSave, 3000), {
      initialProps: { value: "same" },
    });

    vi.advanceTimersByTime(10000);

    expect(onSave).not.toHaveBeenCalled();
  });

  it("does not save whitespace-only content on unmount", () => {
    const onSave = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ value }) => useAutoSave(value, onSave, 3000),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "   " });
    unmount();

    expect(onSave).not.toHaveBeenCalled();
  });

  it("does not double-save: debounced save + unmount", () => {
    const onSave = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ value }) => useAutoSave(value, onSave, 3000),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "changed" });

    // Let the debounce fire
    vi.advanceTimersByTime(3000);
    expect(onSave).toHaveBeenCalledTimes(1);

    // Then unmount — should NOT save again since value was already saved
    unmount();
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
