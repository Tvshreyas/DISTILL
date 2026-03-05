"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAutoSave } from "@/hooks/useAutoSave";
import { sanitizeContent } from "@/lib/sanitize";
import type { Id } from "@/convex/_generated/dataModel";

interface Props {
  reflectionId: Id<"reflections">;
  initialContent: string;
}

export default function ReflectionDetail({
  reflectionId,
  initialContent,
}: Props) {
  const router = useRouter();
  const updateReflection = useMutation(api.reflections.update);
  const removeReflection = useMutation(api.reflections.remove);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [savedContent, setSavedContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isSavingRef = useRef(false);

  const saveEdit = useCallback(
    async (value: string) => {
      if (value.trim() === savedContent.trim()) return;
      if (isSavingRef.current) return;
      isSavingRef.current = true;
      setSaving(true);
      setSaveError(null);
      try {
        await updateReflection({
          reflectionId,
          content: sanitizeContent(value),
        });
        setSavedContent(value);
      } catch (err) {
        setSaveError(
          err instanceof Error ? err.message : "Failed to save."
        );
      } finally {
        isSavingRef.current = false;
        setSaving(false);
      }
    },
    [reflectionId, savedContent, updateReflection]
  );

  useAutoSave(content, saveEdit, 3000);

  function handleContentChange(value: string) {
    if (value.length <= 3000) {
      setContent(value);
    }
  }

  function handleCancelEdit() {
    setContent(savedContent);
    setEditing(false);
    setSaveError(null);
  }

  async function handleDoneEditing() {
    if (content.trim() !== savedContent.trim()) {
      await saveEdit(content);
    }
    setEditing(false);
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await removeReflection({ reflectionId });
      router.push("/dashboard/library");
      router.refresh();
    } catch {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Content display or edit */}
      {editing ? (
        <div className="space-y-2">
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            rows={10}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent resize-y transition-all duration-200"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {saving ? "Saving..." : saveError ? "" : "Auto-saves as you type"}
            </span>
            <span>{content.length}/3000</span>
          </div>
          {saveError && (
            <p className="text-sm text-red-400" role="alert">
              {saveError}
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleDoneEditing}
              className="bg-amber-500 text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all duration-200"
            >
              Save changes
            </button>
            <button
              onClick={handleCancelEdit}
              className="border border-white/10 text-gray-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/5 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
            {savedContent}
          </p>
        </div>
      )}

      {/* Action buttons */}
      {!editing && (
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Delete
          </button>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          onKeyDown={(e) => {
            if (e.key === "Escape" && !deleting) setShowDeleteConfirm(false);
          }}
        >
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
            <h3 id="delete-dialog-title" className="text-sm font-semibold text-white">
              Delete this reflection?
            </h3>
            <p className="text-sm text-gray-400 mt-2">
              This reflection will be permanently deleted in 30 days.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-500 disabled:opacity-50 transition-all duration-200"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="border border-white/10 text-gray-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/5 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
