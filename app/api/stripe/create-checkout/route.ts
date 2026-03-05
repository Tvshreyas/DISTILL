import { getStripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { plan } = body; // 'monthly' or 'annual'

    const priceId =
      plan === "annual"
        ? process.env.STRIPE_PRO_ANNUAL_PRICE_ID
        : process.env.STRIPE_PRO_MONTHLY_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: { code: "SERVER_ERROR", message: "Price not configured" } },
        { status: 500 }
      );
    }

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
      metadata: { userId },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
