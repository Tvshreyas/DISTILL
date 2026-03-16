import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

// Webhook bridge: allows the Next.js Stripe webhook route to call internal
// Convex mutations after Stripe signature verification. Protected by a shared
// secret so that only our server can invoke these internal mutations.
http.route({
  path: "/stripe-webhook-bridge",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = process.env.CONVEX_INTERNAL_AUTH_KEY;
    if (!secret) {
      return new Response("Server misconfiguration", { status: 500 });
    }

    const authHeader = request.headers.get("X-Internal-Auth-Key");
    if (!authHeader || authHeader !== secret) {
      return new Response("Unauthorized", { status: 401 });
    }

    let body: {
      action: string;
      args: Record<string, unknown>;
    };
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    try {
      switch (body.action) {
        case "updatePlan":
          await ctx.runMutation(internal.profiles.updatePlan, {
            userId: body.args.userId as string,
            plan: body.args.plan as "free" | "pro",
            stripeCustomerId: body.args.stripeCustomerId as string | undefined,
            stripeSubscriptionId: body.args.stripeSubscriptionId as string | undefined,
            subscriptionStatus: body.args.subscriptionStatus as "active" | "canceled" | "past_due" | "trialing" | undefined,
            subscriptionPeriodEnd: body.args.subscriptionPeriodEnd as string | undefined,
          });
          break;

        case "recordWebhookEvent":
          await ctx.runMutation(internal.profiles.recordWebhookEvent, {
            stripeEventId: body.args.stripeEventId as string,
          });
          break;

        case "getByStripeCustomerId": {
          const profile = await ctx.runQuery(internal.profiles.getByStripeCustomerId, {
            stripeCustomerId: body.args.stripeCustomerId as string,
          });
          return new Response(JSON.stringify({ value: profile }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        case "disableNotificationType":
          await ctx.runMutation(internal.profiles.disableNotificationType, {
            userId: body.args.userId as string,
            type: body.args.type as "resurfacing" | "streak" | "weekly",
          });
          break;

        default:
          return new Response("Unknown action", { status: 400 });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Webhook bridge error:", err);
      return new Response("Internal error", { status: 500 });
    }
  }),
});

export default http;
