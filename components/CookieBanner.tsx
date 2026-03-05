"use client";

import { useState, useEffect } from "react";

const COOKIE_KEY = "distill_cookies_accepted";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  function handleAccept() {
    try {
      localStorage.setItem(COOKIE_KEY, "true");
    } catch {
      // localStorage unavailable
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 pointer-events-none">
      <div className="max-w-md mx-auto bg-[#111] border border-white/10 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 shadow-2xl pointer-events-auto">
        <p className="text-xs text-gray-400 leading-relaxed">
          We use cookies and analytics to improve your experience.
        </p>
        <button
          onClick={handleAccept}
          className="shrink-0 bg-white/10 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-white/15 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
