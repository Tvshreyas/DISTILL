"use client";

import { useEffect } from "react";

export default function PWAProvider() {
  useEffect(() => {
    if (
      "serviceWorker" in navigator &&
      window.location.hostname !== "localhost"
    ) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then(() => {
            // SW registered
          })
          .catch(() => {
            // SW registration failed
          });
      });
    }
  }, []);

  return null;
}
