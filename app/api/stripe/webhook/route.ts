import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export const runtime = "nodejs";

/**
 * Call the Convex webhook bridge with the internal auth key.
 * This replaces the old unauthenticated fetch pattern.
 */
async function callConvexBridge(action: string, args: Record<string, unknown>) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const internalKey = process.env.CONVEX_INTERNAL_AUTH_KEY;

  if (!convexUrl || !internalKey) {
    throw new Error("Missing CONVEX_INTERNAL_AUTH_KEY or NEXT_PUBLIC_CONVEX_URL");
  }

  // Convex HTTP actions are served at the site URL, not the cloud API URL.
  // The site URL is derived from the deployment URL.
  const siteUrl = convexUrl.replace(".cloud/", ".site/").replace(".cloud", ".site");

  const response = await fetch(`${siteUrl}/stripe-webhook-bridge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Auth-Key": internalKey,
    },
    body: JSON.stringify({ action, args }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Convex bridge error (${response.status}): ${text}`);
  }

  return response.json();
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (!userId) break;

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;

        let periodEnd: string | undefined;
        if (subscriptionId) {
          const sub = await getStripe().subscriptions.retrieve(subscriptionId);
          const subData = sub as unknown as { current_period_end?: number };
          if (subData.current_period_end) {
            periodEnd = new Date(subData.current_period_end * 1000).toISOString();
          }
        }

        await callConvexBridge("updatePlan", {
          userId,
          plan: "pro",
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          subscriptionStatus: "active",
          subscriptionPeriodEnd: periodEnd,
        });
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        const queryResult = await callConvexBridge("getByStripeCustomerId", {
          stripeCustomerId: customerId,
        });
        const profile = queryResult.value;
        if (!profile) break;

        const status = subscription.status;
        const plan =
          status === "active" || status === "trialing" ? "pro" : "free";
        const subObj = subscription as unknown as { current_period_end?: number };
        const periodEnd = subObj.current_period_end
          ? new Date(subObj.current_period_end * 1000).toISOString()
          : undefined;

        await callConvexBridge("updatePlan", {
          userId: profile.userId,
          plan,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: status,
          subscriptionPeriodEnd: periodEnd,
        });
        break;
      }
    }

    // Record event as processed (idempotency)
    await callConvexBridge("recordWebhookEvent", {
      stripeEventId: event.id,
    });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
