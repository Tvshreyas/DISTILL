"use client";

import Link from "next/link";
import type { Doc } from "@/convex/_generated/dataModel";

export default function ActiveSessionBanner({ session }: { session: Doc<"sessions"> }) {
  if (!session) return null;
  return (
    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900 flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-widest text-zinc-600 font-bold">Active Session</span>
        <span className="text-sm font-medium">{session.title}</span>
      </div>
      <Link 
        href={`/dashboard/session/${session._id}`}
        className="text-xs px-3 py-1 bg-white text-black rounded-lg font-bold"
      >
        Continue
      </Link>
    </div>
  );
}
