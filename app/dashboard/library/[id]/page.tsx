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
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center text-[10px] bg-peach/20 text-soft-black px-3 py-1 rounded-full font-black uppercase tracking-widest border border-soft-black/10">
            {reflection.session
              ? TYPE_LABELS[reflection.session.contentType as ContentType]
              : "Content"}
          </span>
          {reflection.thinkingShiftRating != null && (
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={`text-sm ${n - 1 < (reflection.thinkingShiftRating ?? 0) ? "text-peach" : "text-soft-black/10"}`}
                >
                  ★
                </span>
              ))}
            </div>
          )}
        </div>
        <h1 className="font-grotesk text-4xl md:text-5xl font-black lowercase tracking-tighter leading-tight text-soft-black">
          {reflection.session?.title ?? "Untitled Insight"}
        </h1>
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-text">
          <span>{formatDate(reflection._creationTime)}</span>
          <span className="w-1 h-1 rounded-full bg-soft-black/20" />
          <span>{reflection.wordCount} words</span>
          {wasEdited && (
            <>
              <span className="w-1 h-1 rounded-full bg-soft-black/20" />
              <span className="italic">Edited {formatDate(reflection.updatedAt!)}</span>
            </>
          )}
        </div>
      </div>

      <div className="brutal-card bg-white p-8 md:p-12 relative overflow-hidden">
        {/* Analog Grain Overlay inside card */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://grain-y.vercel.app/noise.svg')] bg-repeat" />
        
        <ReflectionDetail
          reflection={reflection}
        />
      </div>

      {/* Layers - Thinking Evolution */}
      {reflection.layers && reflection.layers.length > 0 && (
        <div className="space-y-8 pt-8 border-t-4 border-soft-black/5">
          <div className="flex items-center gap-3">
            <h2 className="font-grotesk text-xs font-black uppercase tracking-[0.2em] text-muted-text">
              Thinking Evolution
            </h2>
            <div className="flex-1 h-[1px] bg-soft-black/5" />
          </div>
          
          <div className="space-y-12">
            {reflection.layers
              .sort((a, b) => a._creationTime - b._creationTime)
              .map((layer, index) => (
                <div
                  key={layer._id}
                  className="relative pl-12"
                >
                  {/* Timeline branch line */}
                  <div className="absolute left-[19px] top-0 bottom-0 w-1 bg-sage/30 rounded-full" />
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-sage border-4 border-[#FDFCF8] flex items-center justify-center font-grotesk font-black text-xs text-sage-dark brutal-shadow-xs">
                    {index + 1}
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-text">
                      Layered {formatDate(layer._creationTime)}
                    </p>
                    <p className="text-xl font-serif text-soft-black leading-relaxed italic pr-4">
                      &ldquo;{layer.content}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
