import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { redirect } from "next/navigation";
import SessionStartForm from "@/components/SessionStartForm";
import Link from "next/link";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function NewSessionPage() {
  const { userId, getToken } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const token = await getToken({ template: "convex" });
  if (token) {
    convex.setAuth(token);
  }

  const activeSession = await convex.query(api.sessions.getActive, {});

  if (activeSession) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Home
        </Link>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5">
          <p className="text-sm text-amber-500 font-medium">Active session</p>
          <p className="text-white mt-1">
            You have an open session for &ldquo;{activeSession.title}&rdquo;. Complete or abandon it first.
          </p>
          <Link
            href={`/dashboard/session/${activeSession._id}`}
            className="inline-block mt-3 bg-amber-500 text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all duration-200"
          >
            Go to session
          </Link>
        </div>
      </div>
    );
  }

  // Free tier limit check
  const profile = await convex.query(api.profiles.get, {});

  if (
    profile &&
    profile.plan === "free" &&
    profile.reflectionCountThisMonth >= 10
  ) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Home
        </Link>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
          <p className="text-sm text-red-400 font-medium">Monthly limit reached</p>
          <p className="text-white mt-1">
            You&apos;ve used all 10 reflections this month. Upgrade to Pro to keep reflecting.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <Link
              href="/dashboard/settings"
              className="inline-block bg-amber-500 text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all duration-200"
            >
              Upgrade to Pro
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        <h1 className="text-xl font-semibold text-white mt-3">Start a Session</h1>
        <p className="text-sm text-gray-400 mt-1">
          What are you about to read, watch, or listen to?
        </p>
      </div>
      <SessionStartForm />
    </div>
  );
}
