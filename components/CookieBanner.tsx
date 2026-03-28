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
    <div className="fixed bottom-6 inset-x-0 z-50 p-4 pointer-events-none">
      <div className="max-w-md mx-auto bg-white brutal-border border-4 border-soft-black rounded-[2rem] px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[12px_12px_0px_0px_rgba(41,37,36,1)] pointer-events-auto">
        <p className="text-xs font-bold text-soft-black/80 leading-relaxed text-center sm:text-left">
          We use cookies to ensure you have the most intentional experience
          possible on Distill.
        </p>
        <button
          onClick={handleAccept}
          className="shrink-0 bg-peach text-soft-black text-xs font-black px-8 py-3 rounded-2xl border-2 border-soft-black hover:bg-peach/90 hover:-translate-y-1 transition-all brutal-shadow-sm"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
