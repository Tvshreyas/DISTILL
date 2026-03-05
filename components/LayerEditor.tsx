"use client";

import { useState } from "react";

interface LayerEditorProps {
  originalContent: string;
  originalDate: string;
  existingLayers?: Array<{ content: string; _creationTime: number }>;
  onSave: (content: string) => Promise<void>;
  onCancel: () => void;
}

export default function LayerEditor({ originalContent, originalDate, existingLayers = [], onSave, onCancel }: LayerEditorProps) {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!content.trim()) return;
    setIsSaving(true);
    setError("");
    try {
      await onSave(content.trim());
    } catch {
      setError("Could not save. Your addition is preserved — try again.");
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-2">Original — {new Date(originalDate).toLocaleDateString()}</p>
        <p className="text-sm text-gray-300 whitespace-pre-wrap">{originalContent}</p>
      </div>
      {existingLayers.map((layer, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-2">Layer — {new Date(layer._creationTime).toLocaleDateString()}</p>
          <p className="text-sm text-gray-300 whitespace-pre-wrap">{layer.content}</p>
        </div>
      ))}
      <div className="border-l-2 border-amber-500 pl-4 space-y-2">
        <p className="text-xs text-gray-500">New perspective — {new Date().toLocaleDateString()}</p>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="How has your thinking changed?" maxLength={3000} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-200" />
        <p className="text-xs text-gray-500 text-right">{content.length}/3000</p>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={!content.trim() || isSaving} className="bg-amber-500 text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
          {isSaving ? "Saving..." : "Add perspective"}
        </button>
        <button onClick={onCancel} className="text-gray-400 px-4 py-2 rounded-xl text-sm hover:bg-white/5 transition-all duration-200">Cancel</button>
      </div>
    </div>
  );
}
