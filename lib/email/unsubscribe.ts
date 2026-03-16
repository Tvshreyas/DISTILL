import crypto from "crypto";

const SEPARATOR = ":";

function getSecret(): string {
  const secret = process.env.NOTIFICATION_UNSUBSCRIBE_SECRET;
  if (!secret) throw new Error("NOTIFICATION_UNSUBSCRIBE_SECRET not configured");
  return secret;
}

export function generateUnsubscribeToken(
  userId: string,
  type: "resurfacing" | "streak" | "weekly"
): string {
  const payload = `${userId}${SEPARATOR}${type}`;
  const hmac = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  const token = Buffer.from(`${payload}${SEPARATOR}${hmac}`).toString("base64url");
  return token;
}

export function verifyUnsubscribeToken(
  token: string
): { userId: string; type: "resurfacing" | "streak" | "weekly" } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split(SEPARATOR);
    if (parts.length !== 3) return null;

    const [userId, type, receivedHmac] = parts;
    if (!["resurfacing", "streak", "weekly"].includes(type)) return null;

    const payload = `${userId}${SEPARATOR}${type}`;
    const expectedHmac = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");

    const receivedBuf = Buffer.from(receivedHmac, "hex");
    const expectedBuf = Buffer.from(expectedHmac, "hex");

    if (receivedBuf.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(receivedBuf, expectedBuf)) return null;

    return { userId, type: type as "resurfacing" | "streak" | "weekly" };
  } catch {
    return null;
  }
}

export function buildUnsubscribeUrl(
  appUrl: string,
  userId: string,
  type: "resurfacing" | "streak" | "weekly"
): string {
  const token = generateUnsubscribeToken(userId, type);
  return `${appUrl}/api/notifications/unsubscribe?token=${token}`;
}

/**
 * WebCrypto variant for use in Convex actions (V8 runtime without Node.js crypto)
 */
export async function generateUnsubscribeTokenWebCrypto(
  userId: string,
  type: "resurfacing" | "streak" | "weekly",
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const payload = `${userId}${SEPARATOR}${type}`;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const hmacHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const token = btoa(`${payload}${SEPARATOR}${hmacHex}`)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return token;
}
