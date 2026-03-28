/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LibraryView from "@/components/LibraryView";

// Mock convex/react
const mockUseQuery = vi.fn();
const mockUseMutation = vi.fn(() => vi.fn());

vi.mock("convex/react", () => ({
  useQuery: (...args: any[]) => mockUseQuery(...args),
  useMutation: (...args: any[]) => (mockUseMutation as any)(...args),
}));

vi.mock("@/convex/_generated/api", () => ({
  api: {
    reflections: {
      list: "reflections:list",
      remove: "reflections:remove",
    },
  },
}));

// Mock lucide-react icons as simple spans
vi.mock("lucide-react", () => ({
  Search: (props: Record<string, unknown>) => (
    <span data-testid="icon-search" {...props} />
  ),
  Book: (props: Record<string, unknown>) => (
    <span data-testid="icon-book" {...props} />
  ),
  Video: (props: Record<string, unknown>) => (
    <span data-testid="icon-video" {...props} />
  ),
  FileText: (props: Record<string, unknown>) => (
    <span data-testid="icon-filetext" {...props} />
  ),
  Mic: (props: Record<string, unknown>) => (
    <span data-testid="icon-mic" {...props} />
  ),
  MoreHorizontal: (props: Record<string, unknown>) => (
    <span data-testid="icon-more" {...props} />
  ),
  ChevronRight: (props: Record<string, unknown>) => (
    <span data-testid="icon-chevron" {...props} />
  ),
  Trash2: (props: Record<string, unknown>) => (
    <span data-testid="icon-trash" {...props} />
  ),
  Layers: (props: Record<string, unknown>) => (
    <span data-testid="icon-layers" {...props} />
  ),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

function makeReflection(
  id: string,
  content: string,
  title: string,
  contentType = "book",
) {
  return {
    _id: id,
    _creationTime: Date.now(),
    content,
    thinkingShiftRating: 3,
    layerCount: 0,
    session: { title, contentType },
  };
}

describe("LibraryView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading skeletons when data is undefined", () => {
    mockUseQuery.mockReturnValue(undefined);
    const { container } = render(<LibraryView />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBe(3);
  });

  it("shows empty state when no reflections", () => {
    mockUseQuery.mockReturnValue({ data: [], total: 0 });
    render(<LibraryView />);
    expect(screen.getByText("your archive is silent.")).toBeTruthy();
  });

  it("renders reflection cards", () => {
    mockUseQuery.mockReturnValue({
      data: [
        makeReflection("r1", "My reflection", "Atomic Habits"),
        makeReflection("r2", "Another thought", "Deep Work"),
      ],
      total: 2,
    });
    render(<LibraryView />);
    expect(screen.getByText(/Atomic Habits/)).toBeTruthy();
    expect(screen.getByText(/Deep Work/)).toBeTruthy();
  });

  it("renders search input", () => {
    mockUseQuery.mockReturnValue({ data: [], total: 0 });
    render(<LibraryView />);
    expect(
      screen.getByPlaceholderText("search your archive of thought..."),
    ).toBeTruthy();
  });

  it("renders content type filter buttons", () => {
    mockUseQuery.mockReturnValue({ data: [], total: 0 });
    render(<LibraryView />);
    expect(screen.getByText("all")).toBeTruthy();
    expect(screen.getByText("books")).toBeTruthy();
    expect(screen.getByText("videos")).toBeTruthy();
    expect(screen.getByText("articles")).toBeTruthy();
    expect(screen.getByText("podcasts")).toBeTruthy();
  });

  it("shows 'load more' button when total > limit", () => {
    mockUseQuery.mockReturnValue({
      data: Array.from({ length: 20 }, (_, i) =>
        makeReflection(`r${i}`, `content ${i}`, `title ${i}`),
      ),
      total: 50,
    });
    render(<LibraryView />);
    expect(screen.getByText("load more from archive")).toBeTruthy();
  });

  it("does not show 'load more' when all loaded", () => {
    mockUseQuery.mockReturnValue({
      data: [makeReflection("r1", "content", "title")],
      total: 1,
    });
    render(<LibraryView />);
    expect(screen.queryByText("load more from archive")).toBeNull();
  });

  it("updates search input value on typing", () => {
    mockUseQuery.mockReturnValue({ data: [], total: 0 });
    render(<LibraryView />);
    const input = screen.getByPlaceholderText(
      "search your archive of thought...",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "habits" } });
    expect(input.value).toBe("habits");
  });

  it("shows 'fresh' badge for reflections with no layers", () => {
    mockUseQuery.mockReturnValue({
      data: [makeReflection("r1", "content", "title")],
      total: 1,
    });
    render(<LibraryView />);
    expect(screen.getByText("fresh")).toBeTruthy();
  });
});
