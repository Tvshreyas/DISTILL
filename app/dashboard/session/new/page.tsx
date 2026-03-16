"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import SessionStartForm from "@/components/SessionStartForm";
import Link from "next/link";
import type { ContentType } from "@/types";

export default function NewSessionPage() {
  const router = useRouter();
  const profile = useQuery(api.profiles.get);
  const activeSession = useQuery(api.sessions.getActive);
  const startSession = useMutation(api.sessions.create);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            Complete &ldquo;{activeSession.title}&rdquo; before starting a new one.
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
      <header className="space-y-2 text-center mb-10">
        <h1 className="font-grotesk text-4xl font-black lowercase tracking-tighter">
          new session
        </h1>
        <p className="text-muted-text font-medium text-lg">
          Capture your perspective on something new.
        </p>
      </header>
      <SessionStartForm onSubmitAction={handleStart} isSubmitting={isSubmitting} />
    </main>
  );
}
