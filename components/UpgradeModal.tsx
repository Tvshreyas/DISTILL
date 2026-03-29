"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { PRICING, PPP_COUNTRIES } from "@/lib/constants";

type BillingPeriod = "monthly" | "yearly";
type CurrencyKey = keyof typeof PRICING;

function getCurrencyFromCookie(): CurrencyKey {
  if (typeof document === "undefined") return "USD";
  const match = document.cookie.match(/(?:^|; )x-user-country=([^;]*)/);
  const country = match?.[1] || "US";
  return PPP_COUNTRIES[country] || "USD";
}

export default function UpgradeModal({
  onCloseAction,
  isOpen,
}: {
  onCloseAction: () => void;
  isOpen: boolean;
}) {
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
      <div className="max-w-md w-full bg-white border-4 border-soft-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(41,37,36,1)] p-8 text-center space-y-6">
        <h2 className="text-2xl font-bold uppercase tracking-tight text-soft-black">
          Commit to your thinking ritual
        </h2>
        <p className="text-muted-text">
          Don&apos;t let your momentum fade. Your archive of original thought is
          a lifelong asset. Upgrade to Pro to unlock unlimited capacity and
          lifelong resurfacing.
        </p>

        {/* Feature comparison */}
        <div className="text-left space-y-2">
          {[
            "unlimited deep sessions (free: 10/month)",
            "unlimited perspective layers",
            "layer from your library anytime",
            "lifetime resurfacing schedule",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-sage-dark shrink-0" />
              <span className="text-sm font-bold text-soft-black">{feature}</span>
            </div>
          ))}
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center border-2 border-soft-black/20 rounded-full p-1">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                billingPeriod === "monthly"
                  ? "bg-soft-black text-white"
                  : "text-muted-text hover:text-soft-black"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all relative ${
                billingPeriod === "yearly"
                  ? "bg-soft-black text-white"
                  : "text-muted-text hover:text-soft-black"
              }`}
            >
              Yearly
              <span className="absolute -top-2.5 -right-2 text-[10px] text-emerald-600 font-bold">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Price display */}
        <div>
          <span className="text-4xl font-bold text-soft-black">
            {pricing.symbol}
            {amount}
          </span>
          <span className="text-muted-text ml-1">
            {billingPeriod === "monthly" ? "/mo" : "/yr"}
          </span>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full py-4 bg-soft-black text-white rounded-2xl font-bold transition-transform active:scale-95 disabled:opacity-50 hover:bg-peach hover:text-soft-black"
          >
            {isLoading ? "Loading..." : "Upgrade to Pro"}
          </button>
          <button
            onClick={onCloseAction}
            className="w-full py-2 text-muted-text font-bold hover:text-soft-black transition-colors lowercase"
          >
            not now
          </button>
        </div>
      </div>
    </div>
  );
}
