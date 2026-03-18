import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  
  if (!convexUrl) {
    console.error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
    return NextResponse.json({ error: "Internal Server Error: Missing Configuration" }, { status: 500 });
  }

  const { userId, getToken } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = await getToken({ template: "convex" });

    if (!token) {
      return NextResponse.json({ error: "Could not retrieve auth token" }, { status: 401 });
    }

    const convex = new ConvexHttpClient(convexUrl);
    convex.setAuth(token);

    // Check 24h export rate limit and record timestamp
    try {
      await convex.mutation(api.profiles.checkAndRecordExport, {});
    } catch (err) {
      const message = err instanceof Error ? err.message : "Export rate limited.";
      if (message.includes("rate limited")) {
        return NextResponse.json(
          { error: message },
          { status: 429, headers: { "Retry-After": "3600" } }
        );
      }
      throw err;
    }

    // Fetch the export data
    const data = await convex.query(api.reflections.exportAll, {});

    return new NextResponse(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="distill-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (err) {
    console.error("Export API error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
