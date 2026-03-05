import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import ReflectionDetail from "@/components/ReflectionDetail";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { ContentType } from "@/types";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const TYPE_LABELS: Record<ContentType, string> = {
  book: "Book",
  video: "Video",
  article: "Article",
  podcast: "Podcast",
  other: "Content",
};

function formatDate(dateStr: string | number): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ReflectionViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId, getToken } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const token = await getToken({ template: "convex" });
  if (token) {
    convex.setAuth(token);
  }

  const reflection = await convex.query(api.reflections.getById, {
    reflectionId: id as Id<"reflections">,
  });

  if (!reflection) {
    notFound();
  }

  const wasEdited =
    reflection.updatedAt !== undefined &&
    new Date(reflection.updatedAt).getTime() - reflection._creationTime > 5000;

  return (
    <div className="max-w-2xl space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/library"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Library
      </Link>

      {/* Session info header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center text-xs bg-white/10 text-gray-300 px-2.5 py-1 rounded-full capitalize">
            {reflection.session
              ? TYPE_LABELS[reflection.session.contentType as ContentType]
              : "Content"}
          </span>
          {reflection.thinkingShiftRating != null && (
            <span className="text-xs text-amber-500">
              {"★".repeat(reflection.thinkingShiftRating)}
              {"☆".repeat(5 - reflection.thinkingShiftRating)}
            </span>
          )}
        </div>
        <h1 className="text-xl font-semibold text-white">
          {reflection.session?.title ?? "Untitled"}
        </h1>
        <p className="text-sm text-gray-500">
          {formatDate(reflection._creationTime)} &middot;{" "}
          {reflection.wordCount} words
          {wasEdited && (
            <span>
              {" "}
              &middot; Edited{" "}
              {new Date(reflection.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </p>
      </div>

      {/* Reflection content + edit/delete */}
      <ReflectionDetail
        reflectionId={reflection._id}
        initialContent={reflection.content}
      />

      {/* Layers */}
      {reflection.layers && reflection.layers.length > 0 && (
        <div className="border-t border-white/10 pt-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">
            Layers ({reflection.layers.length})
          </h2>
          {reflection.layers
            .sort((a, b) => a._creationTime - b._creationTime)
            .map((layer) => (
              <div
                key={layer._id}
                className="border-l-2 border-amber-500/40 pl-4 py-1"
              >
                <p className="text-xs text-gray-500 mb-1">
                  Added{" "}
                  {new Date(layer._creationTime).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">
                  {layer.content}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
