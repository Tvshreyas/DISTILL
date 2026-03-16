"use client";

import { useState } from "react";
import { PRICING, PPP_COUNTRIES } from "@/lib/constants";

type BillingPeriod = "monthly" | "yearly";
type CurrencyKey = keyof typeof PRICING;

function getCurrencyFromCookie(): CurrencyKey {
  if (typeof document === "undefined") return "USD";
  const match = document.cookie.match(/(?:^|; )x-user-country=([^;]*)/);
  const country = match?.[1] || "US";
  return PPP_COUNTRIES[country] || "USD";
}

export default function UpgradeModal({ onCloseAction, isOpen }: { onCloseAction: () => void; isOpen: boolean }) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const currency = getCurrencyFromCookie();
  const pricing = PRICING[currency];
  const amount = pricing[billingPeriod];

  async function handleCheckout() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: billingPeriod === "yearly" ? "annual" : "monthly",
          currency: pricing.code,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-6">
        <h2 className="text-2xl font-bold uppercase tracking-tight">Upgrade</h2>
        <p className="text-zinc-400">Unlock unlimited reflections and analytics.</p>

        {/* Billing toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center border border-zinc-700 rounded-full p-1">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                billingPeriod === "monthly"
                  ? "bg-white text-black"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all relative ${
                billingPeriod === "yearly"
                  ? "bg-white text-black"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Yearly
              <span className="absolute -top-2.5 -right-2 text-[10px] text-emerald-400 font-bold">
                -25%
              </span>
            </button>
          </div>
        </div>

        {/* Price display */}
        <div>
          <span className="text-4xl font-bold">{pricing.symbol}{amount}</span>
          <span className="text-zinc-500 ml-1">{billingPeriod === "monthly" ? "/mo" : "/yr"}</span>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full py-4 bg-white text-black rounded-2xl font-bold transition-transform active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Upgrade Now"}
          </button>
          <button onClick={onCloseAction} className="w-full py-2 text-zinc-600 font-bold hover:text-zinc-400 transition-colors">Maybe Later</button>
        </div>
      </div>
    </div>
  );
}
