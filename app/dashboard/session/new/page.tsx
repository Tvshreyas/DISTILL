"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import SessionStartForm from "@/components/SessionStartForm";
import UpgradeModal from "@/components/UpgradeModal";
import Link from "next/link";
import { FREE_TIER_LIMIT } from "@/lib/constants";
import type { ContentType } from "@/types";

export default function NewSessionPage() {
  const router = useRouter();
  const profile = useQuery(api.profiles.get);
  const activeSession = useQuery(api.sessions.getActive);
  const startSession = useMutation(api.sessions.create);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (profile === undefined || activeSession === undefined)
    return <div className="p-8 text-muted-text animate-pulse">Loading...</div>;

  if (activeSession) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-text hover:text-soft-black transition-colors"
        >
          &larr; Home
        </Link>
        <div className="p-8 rounded-[2rem] bg-white brutal-border border-4 border-soft-black space-y-4">
          <p className="font-black text-soft-black text-xl lowercase">
            active session already exists
          </p>
          <p className="text-sm text-muted-text font-medium">
            Complete &ldquo;{activeSession.title}&rdquo; before starting a new
            one.
          </p>
          <Link
            href={`/dashboard/session/${activeSession._id}`}
            className="inline-block px-6 py-3 bg-soft-black text-white rounded-xl text-sm font-black"
          >
            continue session
          </Link>
        </div>
      </div>
    );
  }

  async function handleStart({
    title,
    contentType,
    consumeReason,
    isRetroactive,
  }: {
    title: string;
    contentType: ContentType;
    consumeReason?: string;
    isRetroactive: boolean;
  }) {
    setIsSubmitting(true);
    try {
      const session = await startSession({
        title,
        contentType,
        consumeReason,
        isRetroactive,
      });
      if (session) {
        router.push(`/dashboard/session/${session._id}`);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-20 relative">
      <header className="space-y-4 text-center mb-10">
        <div className="flex justify-center">
          {profile?.plan === "free" && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sage/20 border border-sage/50 rounded-full">
              <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-soft-black/80">
                {Math.max(
                  0,
                  FREE_TIER_LIMIT - (profile.deepSessionsCount ?? 0),
                )}{" "}
                deep sessions left this month
              </span>
            </div>
          )}
        </div>
        <h1 className="font-grotesk text-4xl font-black lowercase tracking-tighter">
          new deep session
        </h1>
        <p className="text-muted-text font-medium text-lg">
          a 5,000-word space for intensive thinking and archival.
        </p>
      </header>

      {profile?.plan === "free" &&
      (profile.deepSessionsCount ?? 0) >= FREE_TIER_LIMIT ? (
        <div className="p-10 rounded-[2.5rem] bg-white brutal-border border-4 border-soft-black text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage/20 border-2 border-soft-black mb-2">
            <span className="text-2xl font-black text-soft-black">
              {FREE_TIER_LIMIT}/{FREE_TIER_LIMIT}
            </span>
          </div>
          <div className="space-y-2">
            <h2 className="font-grotesk text-2xl font-black lowercase tracking-tight">
              Ritual Fulfilled
            </h2>
            <p className="text-muted-text font-medium max-w-sm mx-auto leading-relaxed">
              You&apos;ve completed your monthly meditation of {FREE_TIER_LIMIT}{" "}
              deep sessions. Your thinking is starting to compound.
            </p>
          </div>
          <div className="pt-4 border-t border-soft-black/10">
            <p className="text-sm text-soft-black font-black mb-4 lowercase">
              Expand your capacity to build your archive
            </p>
            <button
              onClick={() => setShowUpgrade(true)}
              className="inline-block px-8 py-4 bg-soft-black text-white rounded-2xl font-black transition-transform active:scale-95 hover:bg-soft-black/90"
            >
              learn about Pro
            </button>
            <UpgradeModal
              isOpen={showUpgrade}
              onCloseAction={() => setShowUpgrade(false)}
            />
          </div>
        </div>
      ) : (
        <SessionStartForm
          onSubmitAction={handleStart}
          isSubmitting={isSubmitting}
        />
      )}
    </main>
  );
}
