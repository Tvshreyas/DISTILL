import { NextRequest } from "next/server";
import { verifyUnsubscribeToken } from "@/lib/email/unsubscribe";

const TYPE_LABELS: Record<string, string> = {
  resurfacing: "Resurfacing emails",
  streak: "Streak reminders",
  weekly: "Weekly summaries",
};
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  
  if (!convexUrl) {
    console.error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
    return new Response(renderPage("Configuration Error", "The server is missing a required environment variable."), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }

  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return new Response(renderPage("Invalid Link", "This unsubscribe link is missing or malformed."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const result = verifyUnsubscribeToken(token);
  if (!result) {
    return new Response(renderPage("Invalid Link", "This unsubscribe link is invalid or expired."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

    // Call Convex HTTP bridge to disable the notification type
    try {
      // convexUrl is already checked at the top of the function
    const internalAuthKey = process.env.CONVEX_INTERNAL_AUTH_KEY;

    if (!internalAuthKey) {
      throw new Error("Missing internal auth key");
    }

    // Use the HTTP bridge (same pattern as Stripe webhook)
    const siteUrl = convexUrl.replace(".cloud", ".site");
    const bridgeUrl = `${siteUrl}/stripe-webhook-bridge`;

    await fetch(bridgeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Auth-Key": internalAuthKey,
      },
      body: JSON.stringify({
        action: "disableNotificationType",
        args: {
          userId: result.userId,
          type: result.type,
        },
      }),
    });
  } catch (err) {
    console.error("[unsubscribe] Failed to disable notification:", err);
    return new Response(
      renderPage("Something went wrong", "We couldn't process your request. Please try again or adjust your settings in the app."),
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }

  const label = TYPE_LABELS[result.type] ?? "Notifications";
  return new Response(
    renderPage("Unsubscribed", `${label} have been disabled. You can re-enable them in your Distill settings.`),
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderPage(title: string, message: string): string {
  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle} — Distill</title>
  <style>
    body {
      font-family: 'Outfit', Arial, sans-serif;
      background-color: #FDFCF8;
      color: #292524;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .card {
      max-width: 440px;
      padding: 48px;
      border: 4px solid #292524;
      border-radius: 2rem;
      background: white;
      text-align: center;
    }
    .logo {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.02em;
      text-transform: lowercase;
      margin-bottom: 24px;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      margin: 0 0 12px;
      text-transform: lowercase;
    }
    p {
      font-size: 15px;
      color: #78716C;
      line-height: 1.6;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">distill</div>
    <h1>${safeTitle}</h1>
    <p>${safeMessage}</p>
  </div>
</body>
</html>`;
}
