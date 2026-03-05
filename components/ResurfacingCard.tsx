"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import LayerEditor from "./LayerEditor";

export default function ResurfacingCard() {
  const pending = useQuery(api.resurfacing.getPending);
  const respond = useMutation(api.resurfacing.respond);
  const profile = useQuery(api.profiles.get);

  const [showLayerEditor, setShowLayerEditor] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [error, setError] = useState("");

  if (pending === undefined || pending === null) return null;

  async function handleRespond(action: "surfaced" | "dismissed") {
    setIsResponding(true);
    setError("");
    try {
      await respond({ queueId: pending!.queueId, action });
    } catch {
      setError("Something went wrong. Please try again.");
      setIsResponding(false);
    }
  }

  async function handleLayerSave(content: string) {
    await respond({ queueId: pending!.queueId, action: "layered", layerContent: content });
  }

  function handleViewChanged() {
    if (profile && profile.plan === "free") {
      setError("Adding new perspectives is a Pro feature.");
      return;
    }
    setShowLayerEditor(true);
  }

  if (showLayerEditor) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <LayerEditor
          originalContent={pending.reflection.content}
          originalDate={pending.reflection.createdAt}
          onSave={handleLayerSave}
          onCancel={() => setShowLayerEditor(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-amber-500/20 rounded-2xl p-5 space-y-4">
      <div className="space-y-1">
        <p className="text-sm text-amber-500">
          A thought you had {pending.daysAgo} days ago is waiting.
        </p>
        {pending.session && (
          <p className="text-xs text-gray-500">From: {pending.session.title}</p>
        )}
      </div>
      <blockquote className="border-l-2 border-amber-500/40 pl-4 text-sm text-gray-300 whitespace-pre-wrap">
        {pending.reflection.content.length > 500
          ? pending.reflection.content.slice(0, 500) + "..."
          : pending.reflection.content}
      </blockquote>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button onClick={handleViewChanged} disabled={isResponding} className="text-sm bg-amber-500 text-black px-4 py-2 rounded-xl font-semibold hover:bg-amber-400 disabled:opacity-50 transition-all duration-200">
          My view has changed
        </button>
        <button onClick={() => handleRespond("surfaced")} disabled={isResponding} className="text-sm border border-white/10 text-gray-300 px-4 py-2 rounded-xl hover:bg-white/5 disabled:opacity-50 transition-all duration-200">
          Still relevant
        </button>
        <button onClick={() => handleRespond("dismissed")} disabled={isResponding} className="text-sm text-gray-500 px-4 py-2 rounded-xl hover:bg-white/5 disabled:opacity-50 transition-all duration-200">
          Dismiss
        </button>
      </div>
    </div>
  );
}
