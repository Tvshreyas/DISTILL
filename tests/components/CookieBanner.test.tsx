import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CookieBanner from "@/components/CookieBanner";

// Provide a working localStorage mock since jsdom's may be broken
const storageMap = new Map<string, string>();
const localStorageMock = {
  getItem: vi.fn((key: string) => storageMap.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => storageMap.set(key, value)),
  removeItem: vi.fn((key: string) => storageMap.delete(key)),
  clear: vi.fn(() => storageMap.clear()),
  get length() { return storageMap.size; },
  key: vi.fn((i: number) => Array.from(storageMap.keys())[i] ?? null),
};

Object.defineProperty(window, "localStorage", { value: localStorageMock, writable: true });

describe("CookieBanner", () => {
  beforeEach(() => {
    storageMap.clear();
    vi.clearAllMocks();
  });

  it("shows the banner when cookies were not previously accepted", () => {
    render(<CookieBanner />);
    expect(screen.getByText("Got it")).toBeTruthy();
  });

  it("does NOT show the banner when cookies were previously accepted", () => {
    storageMap.set("distill_cookies_accepted", "true");
    const { container } = render(<CookieBanner />);
    expect(container.innerHTML).toBe("");
  });

  it("shows the cookie notice text containing 'intentional experience'", () => {
    render(<CookieBanner />);
    expect(screen.getByText(/intentional experience/)).toBeTruthy();
  });

  it("clicking 'Got it' hides the banner", () => {
    const { container } = render(<CookieBanner />);
    expect(screen.getByText("Got it")).toBeTruthy();
    fireEvent.click(screen.getByText("Got it"));
    expect(container.innerHTML).toBe("");
  });

  it("clicking 'Got it' persists acceptance to localStorage", () => {
    render(<CookieBanner />);
    fireEvent.click(screen.getByText("Got it"));
    expect(storageMap.get("distill_cookies_accepted")).toBe("true");
  });
});
