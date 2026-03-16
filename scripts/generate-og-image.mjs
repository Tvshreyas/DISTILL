#!/usr/bin/env node
/**
 * Generate a static OG image PNG fallback.
 * Run after `npm run build` and `npm run start`:
 *   node scripts/generate-og-image.mjs
 *
 * Fetches the auto-generated OG image from the running Next.js server
 * and saves it to public/og-image.png for email/offline use.
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function main() {
  const url = `${APP_URL}/opengraph-image`;
  console.log(`Fetching OG image from ${url}...`);

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Failed to fetch: ${res.status} ${res.statusText}`);
    console.error("Make sure the Next.js server is running (npm run start).");
    process.exit(1);
  }

  const buffer = Buffer.from(await res.arrayBuffer());

  const { writeFileSync } = await import("fs");
  const { join } = await import("path");
  const outPath = join(import.meta.dirname, "..", "public", "og-image.png");
  writeFileSync(outPath, buffer);

  console.log(`Saved to ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

main().catch(console.error);
