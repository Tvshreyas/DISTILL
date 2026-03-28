"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ResurfacingCard() {
  const pending = useQuery(api.resurfacing.getPending);
  const respond = useMutation(api.resurfacing.respond);
  const [isResponding, setIsResponding] = useState(false);
  const [isLayering, setIsLayering] = useState(false);
  const [layerContent, setLayerContent] = useState("");

  const handleAction = async (action: "surfaced" | "dismissed" | "layered") => {
    if (!pending) return;
    setIsResponding(true);
    try {
      await respond({
        queueId: pending.queueId,
        action,
        layerContent: action === "layered" ? layerContent : undefined,
      });
      toast.success(
        action === "layered"
          ? "Perspective layered."
          : action === "surfaced"
            ? "Acknowledged."
            : "Dismissed.",
      );
      setIsLayering(false);
      setLayerContent("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update status.",
      );
    } finally {
      setIsResponding(false);
    }
  };

  if (pending === undefined) {
    return (
      <div className="h-48 bg-soft-black/5 animate-pulse rounded-[2rem]" />
    );
  }

  if (!pending) {
    return (
      <div className="p-8 md:p-12 rounded-[2rem] bg-white brutal-border border-4 border-soft-black text-center space-y-4">
        <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-sage-dark" />
        </div>
        <div className="space-y-1">
          <h3 className="font-grotesk text-xl font-black lowercase">
            all caught up.
          </h3>
          <p className="text-muted-text max-w-xs mx-auto text-sm font-medium">
            No reflections due for resurfacing today. Take a break or capture
            something new.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group p-8 md:p-10 rounded-[2rem] bg-white brutal-border border-4 border-soft-black overflow-hidden bg-[url('https://grain-y.vercel.app/noise.svg')] bg-repeat">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-peach opacity-10 rounded-bl-full -translate-y-8 translate-x-8" />

      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-sage/20 rounded-lg border-2 border-sage/30">
            <span className="text-[10px] uppercase font-black tracking-widest text-sage-dark">
              Resurfacing from {pending.daysAgo} days ago
            </span>
          </div>
          <Sparkles className="w-4 h-4 text-peach animate-pulse" />
        </div>

        <div className="space-y-2">
          <h3 className="font-grotesk text-3xl font-black lowercase tracking-tighter leading-none">
            {pending.session?.title || "Untitled Insight"}
          </h3>
          <p className="text-lg md:text-xl text-muted-text font-medium leading-relaxed line-clamp-4 italic border-l-4 border-peach/30 pl-6 py-2">
            &ldquo;{pending.reflection.content}&rdquo;
          </p>
        </div>

        {isLayering ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-grotesk text-[10px] font-black uppercase tracking-widest text-muted-text">
                    How has your view changed?
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-text">
                    {layerContent.length} / 3000
                  </span>
                </div>
                <textarea
                  value={layerContent}
                  onChange={(e) => setLayerContent(e.target.value)}
                  placeholder="Add a new layer of thinking..."
                  maxLength={3000}
                  className="w-full bg-sage/5 brutal-border-sm p-4 text-sm font-medium focus:outline-none focus:bg-white transition-colors min-h-[120px] rounded-xl resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleAction("layered")}
                disabled={isResponding || !layerContent.trim()}
                className="px-6 py-3 bg-peach text-soft-black rounded-xl font-bold text-sm brutal-border-sm shadow-[2px_2px_0px_#292524] hover:bg-peach/90 disabled:opacity-50"
              >
                {isResponding ? "Saving..." : "Save Layer"}
              </button>
              <button
                onClick={() => {
                  setIsLayering(false);
                  setLayerContent("");
                }}
                className="px-6 py-3 text-muted-text font-bold text-sm hover:text-soft-black"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-3 pt-4">
            <button
              onClick={() => handleAction("surfaced")}
              disabled={isResponding}
              className="flex-1 px-6 py-4 bg-soft-black text-white rounded-2xl font-black text-lg hover:bg-soft-black/90 transition-all flex items-center justify-center gap-2 group/btn"
            >
              Acknowledge{" "}
              <Check className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            </button>
            {/* Free users: 1 layer per reflection. Pro users: unlimited. */}
            {!(pending.plan === "free" && pending.hasExistingLayer) && (
              <button
                onClick={() => setIsLayering(true)}
                className="px-6 py-4 bg-white brutal-border-sm border-2 border-soft-black rounded-2xl font-bold hover:bg-sage/10 transition-all flex items-center gap-2 group/layer"
              >
                View Changed
                <ArrowRight className="w-4 h-4 group-hover/layer:translate-x-1 transition-transform" />
              </button>
            )}
            <button
              onClick={() => handleAction("dismissed")}
              disabled={isResponding}
              className="px-4 py-4 text-muted-text font-bold hover:text-soft-black text-sm"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
