"use client";

import Link from "next/link";
import type { Doc } from "@/convex/_generated/dataModel";

export default function ActiveSessionBanner({
  session,
}: {
  session: Doc<"sessions">;
}) {
  if (!session) return null;
  return (
    <div className="p-4 rounded-2xl border-2 border-soft-black bg-peach/10 flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-widest text-muted-text font-bold">
          Active Session
        </span>
        <span className="text-sm font-medium text-soft-black">
          {session.title}
        </span>
      </div>
      <Link
        href={`/dashboard/session/${session._id}`}
        className="text-xs px-3 py-1 bg-soft-black text-white rounded-lg font-bold hover:bg-peach hover:text-soft-black transition-colors"
      >
        Continue
      </Link>
    </div>
  );
}
