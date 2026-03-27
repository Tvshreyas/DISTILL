import crypto from "crypto";

const SEPARATOR = ":";

function getSecret(): string {
  const secret = process.env.NOTIFICATION_UNSUBSCRIBE_SECRET;
  if (!secret) throw new Error("NOTIFICATION_UNSUBSCRIBE_SECRET not configured");
  return secret;
}

export function generateUnsubscribeToken(
  userId: string,
  type: "resurfacing" | "streak" | "weekly" | "welcome" | "reengagement" | "upgrade"
): string {
  const payload = `${userId}${SEPARATOR}${type}`;
  const hmac = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  const token = Buffer.from(`${payload}${SEPARATOR}${hmac}`).toString("base64url");
  return token;
}

export function verifyUnsubscribeToken(
  token: string
): { userId: string; type: "resurfacing" | "streak" | "weekly" | "welcome" | "reengagement" | "upgrade" } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split(SEPARATOR);
    if (parts.length !== 3) return null;

    const [userId, type, receivedHmac] = parts;
    if (!["resurfacing", "streak", "weekly", "welcome", "reengagement", "upgrade"].includes(type)) return null;

    const payload = `${userId}${SEPARATOR}${type}`;
    const expectedHmac = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");

    const receivedBuf = Buffer.from(receivedHmac, "hex");
    const expectedBuf = Buffer.from(expectedHmac, "hex");

    if (receivedBuf.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(receivedBuf, expectedBuf)) return null;

    return { userId, type: type as "resurfacing" | "streak" | "weekly" | "welcome" | "reengagement" | "upgrade" };
  } catch {
    return null;
  }
}

export function buildUnsubscribeUrl(
  appUrl: string,
  userId: string,
  type: "resurfacing" | "streak" | "weekly" | "welcome" | "reengagement" | "upgrade"
): string {
  const token = generateUnsubscribeToken(userId, type);
  return `${appUrl}/api/notifications/unsubscribe?token=${token}`;
}

