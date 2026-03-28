"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { toast } from "sonner";
import {
  Search,
  Book,
  Video,
  FileText,
  Mic,
  MoreHorizontal,
  ChevronRight,
  Trash2,
  Layers,
} from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

interface ReflectionItem {
  _id: Id<"reflections">;
  _creationTime: number;
  content: string;
  thinkingShiftRating?: number;
  layerCount: number;
  session: { title: string; contentType: string } | null;
}

const CONTENT_TYPES = [
  { id: "all", label: "all", icon: MoreHorizontal },
  { id: "book", label: "books", icon: Book },
  { id: "video", label: "videos", icon: Video },
  { id: "article", label: "articles", icon: FileText },
  { id: "podcast", label: "podcasts", icon: Mic },
];

const CONTENT_TYPE_ICONS: Record<string, typeof Book> = {
  book: Book,
  video: Video,
  article: FileText,
  podcast: Mic,
  other: MoreHorizontal,
};

function highlightText(text: string, searchTerm: string): React.ReactNode {
  if (!searchTerm.trim()) return text;

  const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));

  return parts.map((part, idx) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <mark key={`hl-${idx}-${part}`} className="bg-peach/30 rounded px-0.5">
        {part}
      </mark>
    ) : (
      <span key={`t-${idx}`}>{part}</span>
    ),
  );
}

function RatingDots({ rating }: { rating: number | undefined }) {
  if (rating == null) return null;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={`w-2 h-2 rounded-full ${
            n <= rating ? "bg-peach" : "border-2 border-soft-black/20"
          }`}
        />
      ))}
    </div>
  );
}

export default function LibraryView() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [contentType, setContentType] = useState("all");
  const [limit, setLimit] = useState(20);
  const [pendingDelete, setPendingDelete] = useState<Id<"reflections"> | null>(
    null,
  );
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const removeReflection = useMutation(api.reflections.remove);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Cleanup delete timer on unmount
  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    };
  }, []);

  const results = useQuery(api.reflections.list, {
    search: debouncedSearch.trim() || undefined,
    contentType: contentType === "all" ? undefined : contentType,
    limit,
  });

  const reflections = results?.data;
  const total = results?.total || 0;

  const handleDelete = useCallback(
    (reflectionId: Id<"reflections">, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current);
      }

      setPendingDelete(reflectionId);

      const timer = setTimeout(async () => {
        try {
          await removeReflection({ reflectionId });
          setPendingDelete(null);
        } catch {
          toast.error("Failed to delete reflection.");
          setPendingDelete(null);
        }
      }, 5000);

      deleteTimerRef.current = timer;

      toast("Reflection deleted.", {
        action: {
          label: "Undo",
          onClick: () => {
            if (deleteTimerRef.current) {
              clearTimeout(deleteTimerRef.current);
              deleteTimerRef.current = null;
            }
            setPendingDelete(null);
            toast.success("Deletion undone.");
          },
        },
        duration: 5000,
      });
    },
    [removeReflection],
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text group-focus-within:text-soft-black transition-colors" />
          <input
            type="text"
            placeholder="search your archive of thought..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white brutal-border-sm border-2 border-soft-black rounded-2xl outline-none focus:bg-sage/5 transition-all font-medium text-lg"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CONTENT_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = contentType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setContentType(type.id)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full border-2 border-soft-black font-bold text-sm transition-all active:scale-95 ${
                isSelected
                  ? "bg-sage text-soft-black brutal-shadow-xs -translate-x-0.5 -translate-y-0.5"
                  : "bg-white text-muted-text hover:bg-sage/10 hover:text-soft-black"
              }`}
            >
              <Icon className="w-4 h-4" />
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Results Grid */}
      {reflections === undefined ? (
        <div className="space-y-4">
          {["skeleton-1", "skeleton-2", "skeleton-3"].map((id) => (
            <div
              key={id}
              className="h-40 bg-soft-black/5 animate-pulse rounded-[2rem]"
            />
          ))}
        </div>
      ) : reflections.length === 0 ? (
        <div className="py-20 text-center border-4 border-dashed border-soft-black/10 rounded-[2rem] space-y-4">
          <div className="w-16 h-16 bg-soft-black/5 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-8 h-8 text-soft-black/20" />
          </div>
          <div className="space-y-1">
            <h3 className="font-grotesk text-xl font-black lowercase text-soft-black/40">
              your archive is silent.
            </h3>
            <p className="text-muted-text max-w-xs mx-auto">
              try adjusting your search or filters to find what you&apos;re
              looking for.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reflections
            .filter((r: ReflectionItem) => r._id !== pendingDelete)
            .map((reflection: ReflectionItem) => {
              const ct = reflection.session?.contentType as string | undefined;
              const TypeIcon =
                (ct ? CONTENT_TYPE_ICONS[ct] : undefined) || MoreHorizontal;
              const layerCount: number = reflection.layerCount ?? 0;

              return (
                <Link
                  key={reflection._id}
                  href={`/dashboard/library/${reflection._id}`}
                  className="group p-8 rounded-[2rem] bg-white brutal-border border-4 border-soft-black hover:bg-sage/5 transition-all text-left relative overflow-hidden"
                >
                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDelete(reflection._id, e)}
                    className="absolute top-6 right-6 p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-50 text-muted-text hover:text-red-500 transition-all z-10"
                    title="Delete reflection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Subtle background icon */}
                  <div className="absolute top-4 right-16 text-soft-black/5 group-hover:text-soft-black/10 transition-colors">
                    <ChevronRight className="w-12 h-12" />
                  </div>

                  {/* Meta row: badge, date, rating, layers */}
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-peach/20 rounded-lg border-2 border-peach/30">
                      <TypeIcon className="w-3 h-3 text-peach-dark" />
                      <span className="text-[10px] uppercase font-black tracking-widest text-peach-dark">
                        {reflection.session?.contentType || "reflection"}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-muted-text">
                      {new Date(reflection._creationTime).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </span>
                    <RatingDots rating={reflection.thinkingShiftRating} />
                    {layerCount > 0 ? (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-sage/20 rounded-full">
                        <Layers className="w-3 h-3 text-sage-dark" />
                        <span className="text-[10px] uppercase font-black tracking-widest text-sage-dark">
                          {layerCount} {layerCount === 1 ? "layer" : "layers"}
                        </span>
                      </div>
                    ) : (
                      <div className="px-2 py-0.5 bg-soft-black/5 rounded-full">
                        <span className="text-[10px] uppercase font-black tracking-widest text-muted-text">
                          fresh
                        </span>
                      </div>
                    )}
                  </div>

                  <h4 className="font-grotesk text-2xl font-black lowercase tracking-tighter mb-2 group-hover:underline decoration-peach decoration-4 underline-offset-4">
                    {reflection.session?.title
                      ? highlightText(reflection.session.title, debouncedSearch)
                      : "Untitled Reflection"}
                  </h4>
                  <p className="line-clamp-2 text-lg text-muted-text font-medium leading-tight max-w-2xl">
                    &ldquo;{highlightText(reflection.content, debouncedSearch)}
                    &rdquo;
                  </p>
                </Link>
              );
            })}

          {total > limit && (
            <div className="pt-8 flex justify-center">
              <button
                onClick={() => setLimit((prev) => prev + 20)}
                className="px-8 py-3 bg-white brutal-border-sm border-2 border-soft-black rounded-xl font-bold hover:bg-sage transition-all active:scale-95"
              >
                load more from archive
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
