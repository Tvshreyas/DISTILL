import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { redirect, notFound } from "next/navigation";
import ReflectionCapture from "@/components/ReflectionCapture";
import Link from "next/link";
import AbandonSessionButton from "./AbandonSessionButton";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const TYPE_LABELS: Record<string, string> = {
  book: "Book",
  video: "Video",
  article: "Article",
  podcast: "Podcast",
  other: "Other",
};

export default async function ActiveSessionPage({
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

  const session = await convex.query(api.sessions.getById, {
    sessionId: id as Id<"sessions">,
  });

  if (!session) {
    notFound();
  }

  // Completed session
  if (session.status === "complete") {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Home
        </Link>
        <h1 className="text-xl font-semibold text-white">{session.title}</h1>
        <p className="text-sm text-gray-400">
          This session is complete. Your reflection has been saved.
        </p>
        <div className="flex gap-3">
          <Link
            href="/dashboard/library"
            className="bg-amber-500 text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all duration-200"
          >
            View in Library
          </Link>
          <Link
            href="/dashboard/session/new"
            className="border border-white/10 text-gray-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/5 transition-all duration-200"
          >
            Start New Session
          </Link>
        </div>
      </div>
    );
  }

  // Abandoned session
  if (session.status === "abandoned") {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Home
        </Link>
        <h1 className="text-xl font-semibold text-white">{session.title}</h1>
        <p className="text-sm text-gray-400">This session was abandoned.</p>
        <Link
          href="/dashboard/session/new"
          className="inline-block bg-amber-500 text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all duration-200"
        >
          Start New Session
        </Link>
      </div>
    );
  }

  // Active session
  const profile = await convex.query(api.profiles.get, {});

  // Calculate total word count from user's reflections
  const allReflections = await convex.query(api.reflections.list, { limit: 50 });
  const totalWordCount = allReflections.data.reduce(
    (sum: number, r: { wordCount?: number }) => sum + (r.wordCount || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Home
        </Link>
        <div className="flex items-start justify-between mt-3">
          <div>
            <p className="text-xs text-amber-500 uppercase tracking-wider font-medium">
              {TYPE_LABELS[session.contentType] ?? "Content"}
            </p>
            <h1 className="text-xl font-semibold text-white mt-0.5">
              {session.title}
            </h1>
            {session.consumeReason && (
              <p className="text-sm text-gray-500 mt-1">
                {session.consumeReason}
              </p>
            )}
          </div>
          <AbandonSessionButton sessionId={session._id} />
        </div>
      </div>

      <hr className="border-white/10" />

      <div>
        <h2 className="text-sm font-medium text-gray-300 mb-3">
          Write your reflection
        </h2>
        <ReflectionCapture
          sessionId={session._id}
          sessionTitle={session.title}
          reflectionCountThisMonth={profile?.reflectionCountThisMonth ?? 0}
          plan={profile?.plan ?? "free"}
          totalWordCount={totalWordCount}
        />
      </div>
    </div>
  );
}
