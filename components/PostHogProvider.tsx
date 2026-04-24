"use client";

import { useEffect, useRef } from "react";

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const phRef = useRef<typeof import("posthog-js").default | null>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    import("posthog-js").then(({ default: posthog }) => {
      posthog.init(key, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
        loaded: (ph) => {
          if (process.env.NODE_ENV === "development") {
            ph.debug();
          }
        },
      });
      phRef.current = posthog;
    });
  }, []);

  return <>{children}</>;
}
