"use client";

import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { ContentType } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import LayerEditor from "@/components/LayerEditor";
import UpgradeModal from "@/components/UpgradeModal";
import { MagnetizeButton } from "@/components/ui/magnetize-button";

const TYPE_LABELS: Record<ContentType, string> = {
  book: "Book",
  video: "Video",
  article: "Article",
  podcast: "Podcast",
  realization: "Realization",
  workout: "Workout",
  walk: "Walk",
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

function dynamicTimestamp(sourceDate: number, layerDate: number): string {
  const diffMs = layerDate - sourceDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "hours later...";
  if (diffDays < 7) return "the immediate aftermath...";
  if (diffDays < 30) return `${diffDays} days of distance...`;
  if (diffDays < 90) return "a month of distance...";
  if (diffDays < 365) return "a different person's perspective...";
  return "a year later...";
}

interface ReflectionData {
  _id: Id<"reflections">;
  _creationTime: number;
  content: string;
  wordCount: number;
  thinkingShiftRating?: number;
  updatedAt?: string;
  plan?: string;
  session: {
    title: string;
    contentType: string;
    startedAt: string;
  } | null;
  layers: Array<{
    _id: Id<"reflectionLayers">;
    _creationTime: number;
    content: string;
    thinkingShiftRating?: number;
    createdAt?: string;
  }>;
}

function ConfettiParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 40}%`,
    color: i % 2 === 0 ? "bg-peach" : "bg-sage",
    xOffset: `${(Math.random() - 0.5) * 80}px`,
    rotation: `${Math.random() * 720 - 360}deg`,
    delay: `${Math.random() * 0.3}s`,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`confetti-particle ${p.color}`}
          style={{
            left: p.left,
            top: p.top,
            "--confetti-x": p.xOffset,
            "--confetti-r": p.rotation,
            animationDelay: p.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-2xl space-y-6 animate-pulse">
      <div className="h-4 w-16 bg-soft-black/5 rounded" />
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="h-6 w-16 bg-peach/20 rounded-full" />
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="w-4 h-4 bg-soft-black/5 rounded" />
            ))}
          </div>
        </div>
        <div className="h-14 w-3/4 bg-soft-black/5 rounded-xl" />
        <div className="h-3 w-48 bg-soft-black/5 rounded" />
      </div>
      <div className="brutal-card bg-white p-8 md:p-12">
        <div className="h-32 bg-soft-black/5 rounded-xl" />
      </div>
    </div>
  );
}

export default function LivingArchive({
  reflectionId,
  initialData,
}: {
  reflectionId: Id<"reflections">;
  initialData: ReflectionData;
}) {
  const liveData = useQuery(api.reflections.getById, { reflectionId });
  const reflection = (liveData as ReflectionData | null | undefined) ?? initialData;

  const addLayerMutation = useMutation(api.reflections.addLayer);

  const [isEditing, setIsEditing] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const gutterRef = useRef<HTMLDivElement>(null);

  const isPro = reflection.plan === "pro";

  const wasEdited =
    reflection.updatedAt !== undefined &&
    new Date(reflection.updatedAt).getTime() - reflection._creationTime > 5000;

  const sortedLayers = [...(reflection.layers || [])].sort(
    (a, b) => a._creationTime - b._creationTime
  );

  const handleAddPerspective = useCallback(() => {
    if (isPro) {
      setIsEditing(true);
    } else {
      setShowUpgrade(true);
    }
  }, [isPro]);

  const handleSave = useCallback(
    async (content: string, thinkingShiftRating?: number) => {
      try {
        await addLayerMutation({
          reflectionId,
          content,
          thinkingShiftRating,
        });
        setIsEditing(false);
        toast.success("Saved.");

        // Gutter glow
        if (gutterRef.current) {
          gutterRef.current.classList.add("animate-gutter-glow");
          setTimeout(() => {
            gutterRef.current?.classList.remove("animate-gutter-glow");
          }, 1200);
        }

        // Confetti for rating 5
        if (thinkingShiftRating === 5) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 1500);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "";
        if (message === "PRO_REQUIRED") {
          setIsEditing(false);
          setShowUpgrade(true);
        } else {
          throw e;
        }
      }
    },
    [addLayerMutation, reflectionId]
  );

  if (!reflection) return <LoadingSkeleton />;

  return (
    <div className="max-w-2xl space-y-6 relative">
      {showConfetti && <ConfettiParticles />}

      {/* Back link */}
      <Link
        href="/dashboard/library"
        className="inline-flex items-center gap-1 font-grotesk text-[10px] font-black uppercase tracking-[0.2em] text-soft-black/40 hover:text-soft-black transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Library
      </Link>

      {/* Header */}
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
                  className={`text-sm ${n <= (reflection.thinkingShiftRating ?? 0) ? "text-peach" : "text-soft-black/10"}`}
                >
                  ★
                </span>
              ))}
            </div>
          )}
        </div>
        <h1 className="font-grotesk text-5xl md:text-6xl font-black lowercase tracking-[-0.05em] leading-tight text-soft-black">
          {reflection.session?.title ?? "untitled insight"}
        </h1>
        <div className="flex items-center gap-3 text-[10px] font-grotesk font-black uppercase tracking-[0.2em] text-soft-black/40">
          <span>{formatDate(reflection._creationTime)}</span>
          <span className="w-1 h-1 rounded-full bg-soft-black/20" />
          <span>{reflection.wordCount} words</span>
          {wasEdited && (
            <>
              <span className="w-1 h-1 rounded-full bg-soft-black/20" />
              <span className="italic">
                Edited {formatDate(reflection.updatedAt!)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative pl-12 pt-4">
        {/* The Gutter */}
        <div
          ref={gutterRef}
          className="absolute left-[19px] top-0 bottom-0 w-[3px] bg-soft-black/10 rounded-full"
        />

        {/* Source Node */}
        <div className="relative mb-12">
          {/* Circle on gutter */}
          <div className="absolute -left-12 top-0 w-10 h-10 rounded-full bg-sage brutal-border flex items-center justify-center font-grotesk font-black text-xs text-soft-black">
            0
          </div>
          {/* Horizontal connector */}
          <div className="absolute -left-2 top-[18px] w-2 h-[3px] bg-soft-black/10" />

          {/* Card */}
          <div className="brutal-card bg-sage/5 p-8 md:p-10">
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')] bg-repeat rounded-[2rem]" />
            <p className="font-serif text-3xl md:text-4xl leading-[1.65] text-soft-black italic relative z-10">
              &ldquo;{reflection.content}&rdquo;
            </p>
            {reflection.thinkingShiftRating != null && (
              <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 bg-peach/10 rounded-xl border border-peach/20 relative z-10">
                <span className="font-grotesk text-[10px] font-black uppercase tracking-widest text-peach">
                  Thinking Shift
                </span>
                <span className="font-grotesk text-lg font-black text-soft-black">
                  {reflection.thinkingShiftRating}/5
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Layer Nodes */}
        <AnimatePresence>
          {sortedLayers.map((layer, index) => (
            <motion.div
              key={layer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative mb-12"
            >
              {/* Circle on gutter */}
              <div className="absolute -left-12 top-0 w-10 h-10 rounded-full bg-white brutal-border flex items-center justify-center font-grotesk font-black text-xs text-soft-black">
                {index + 1}
              </div>
              {/* Horizontal connector */}
              <div className="absolute -left-2 top-[18px] w-2 h-[3px] bg-soft-black/10" />

              {/* Dynamic timestamp */}
              <p className="font-grotesk text-[10px] font-black uppercase tracking-[0.2em] text-soft-black/40 mb-2">
                {dynamicTimestamp(reflection._creationTime, layer._creationTime)}
                {" "}
                <span className="normal-case tracking-normal">
                  {formatDate(layer._creationTime)}
                </span>
              </p>

              {/* Card */}
              <div className="brutal-card bg-white p-6 md:p-8">
                <p className="font-serif text-xl md:text-2xl leading-relaxed text-soft-black italic">
                  &ldquo;{layer.content}&rdquo;
                </p>
                {layer.thinkingShiftRating != null && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-peach/10 rounded-lg border border-peach/20">
                    <span className="font-grotesk text-[10px] font-black uppercase tracking-widest text-peach">
                      Shift
                    </span>
                    <span className="font-grotesk text-sm font-black text-soft-black">
                      {layer.thinkingShiftRating}/5
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Perspective Button */}
        {!isEditing && (
          <div className="relative mt-4">
            <div className="absolute -left-12 top-0 w-10 h-10 rounded-full bg-warm-bg border-[3px] border-dashed border-soft-black/20 flex items-center justify-center">
              {isPro ? (
                <span className="text-soft-black/30 text-lg">+</span>
              ) : (
                <Lock className="w-4 h-4 text-soft-black/30" />
              )}
            </div>
            <div className="absolute -left-2 top-[18px] w-2 h-[3px] bg-soft-black/10" />

            {isPro ? (
              <MagnetizeButton onClick={handleAddPerspective}>
                add perspective
              </MagnetizeButton>
            ) : (
              <button
                onClick={handleAddPerspective}
                className="brutal-btn bg-warm-bg text-soft-black/40 hover:text-soft-black font-grotesk font-bold lowercase text-sm flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                add perspective
                <span className="text-[10px] uppercase tracking-widest text-peach font-black ml-1">
                  pro
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Layer Editor */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LayerEditor
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgrade}
        onCloseAction={() => setShowUpgrade(false)}
      />
    </div>
  );
}
