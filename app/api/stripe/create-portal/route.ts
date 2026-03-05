import { getStripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST() {
  try {
    const { userId, getToken } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const token = await getToken({ template: "convex" });
    if (token) {
      convex.setAuth(token);
    }

    const profile = await convex.query(api.profiles.get, {});

    if (!profile?.stripeCustomerId) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "No billing account found." } },
        { status: 404 }
      );
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: profile.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe portal error:", error);
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
