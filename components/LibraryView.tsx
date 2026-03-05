"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { ContentType } from "@/types";

const CONTENT_TYPES: { value: ContentType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "book", label: "Book" },
  { value: "video", label: "Video" },
  { value: "article", label: "Article" },
  { value: "podcast", label: "Podcast" },
  { value: "other", label: "Other" },
];

const TYPE_ICONS: Record<ContentType, string> = {
  book: "\u{1F4D6}",
  video: "\u{1F3AC}",
  article: "\u{1F4F0}",
  podcast: "\u{1F3A7}",
  other: "\u{1F4CC}",
};

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

function formatDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface ReflectionWithSession {
  _id: string;
  _creationTime: number;
  content: string;
  wordCount: number;
  thinkingShiftRating?: number;
  updatedAt: string;
  session: {
    title: string;
    contentType: ContentType;
  } | null;
}

function ReflectionCard({ reflection }: { reflection: ReflectionWithSession }) {
  const contentType = (reflection.session?.contentType ?? "other") as ContentType;
  const title = reflection.session?.title ?? "Untitled";

  return (
    <Link
      href={`/dashboard/library/${reflection._id}`}
      className="block bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] hover:border-white/15 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">
              <span>{TYPE_ICONS[contentType]}</span>
              <span className="capitalize">{contentType}</span>
            </span>
            {reflection.thinkingShiftRating != null && (
              <span className="text-xs text-amber-500/70">
                {"★".repeat(reflection.thinkingShiftRating)}
                {"☆".repeat(5 - reflection.thinkingShiftRating)}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-white truncate">{title}</p>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {truncate(reflection.content, 150)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
        <span>{formatDate(reflection._creationTime)}</span>
        <span>{reflection.wordCount} words</span>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-5 w-16 skeleton rounded-full" />
      </div>
      <div className="h-4 w-3/4 skeleton mb-2" />
      <div className="h-4 w-full skeleton mb-1" />
      <div className="h-4 w-2/3 skeleton" />
      <div className="flex gap-3 mt-3">
        <div className="h-3 w-20 skeleton" />
        <div className="h-3 w-16 skeleton" />
      </div>
    </div>
  );
}

export default function LibraryView() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<ContentType | "all">("all");
  const [limit, setLimit] = useState(20);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setLimit(20);
    }, 300);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [search]);

  useEffect(() => {
    setLimit(20);
  }, [activeFilter]);

  const result = useQuery(api.reflections.list, {
    search: debouncedSearch || undefined,
    contentType: activeFilter !== "all" ? activeFilter : undefined,
    limit,
    offset: 0,
  });

  const loading = result === undefined;
  const reflections = result?.data ?? [];
  const total = result?.total ?? 0;
  const hasMore = reflections.length < total;

  function handleLoadMore() {
    setLimit((prev) => prev + 20);
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your reflections..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Content type filter tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {CONTENT_TYPES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveFilter(value)}
            aria-pressed={activeFilter === value}
            className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap transition-all duration-200 ${
              activeFilter === value
                ? "bg-amber-500 text-black font-medium"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-gray-500">
          {total} reflection{total !== 1 ? "s" : ""}
          {debouncedSearch && " found"}
        </p>
      )}

      {/* Loading state */}
      {loading && (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Empty state */}
      {!loading && reflections.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          {debouncedSearch || activeFilter !== "all" ? (
            <div>
              <p className="text-gray-400 text-sm">
                No reflections match{debouncedSearch ? ` '${debouncedSearch}'` : " this filter"}.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveFilter("all");
                }}
                className="text-sm text-amber-500 hover:text-amber-400 mt-2 transition-colors"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 text-sm mb-4">
                No reflections yet. Start a session and write your first reflection.
              </p>
              <Link
                href="/dashboard/session/new"
                className="inline-block bg-amber-500 text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all duration-200"
              >
                Start your first session
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Reflection cards */}
      {!loading && reflections.length > 0 && (
        <div className="space-y-3">
          {reflections.map((r) => (
            <ReflectionCard key={r._id} reflection={r as ReflectionWithSession} />
          ))}
        </div>
      )}

      {/* Load more */}
      {!loading && hasMore && (
        <div className="text-center pt-2">
          <button
            onClick={handleLoadMore}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
