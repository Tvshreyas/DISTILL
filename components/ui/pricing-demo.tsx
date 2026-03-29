"use client";

import { useState, useEffect } from "react";
import {
  CreativePricing,
  type PricingTier,
} from "@/components/ui/creative-pricing";
import { PRICING, PPP_COUNTRIES } from "@/lib/constants";
import { Pencil, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type BillingPeriod = "monthly" | "yearly";
type CurrencyKey = keyof typeof PRICING;

function getCountryFromCookie(): string {
  if (typeof document === "undefined") return "US";
  const match = document.cookie.match(/(?:^|; )x-user-country=([^;]*)/);
  return match?.[1] || "US";
}

function getCurrency(country: string): CurrencyKey {
  return PPP_COUNTRIES[country] || "USD";
}

export function CreativePricingDemo() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [currency, setCurrency] = useState<CurrencyKey>("USD");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const country = getCountryFromCookie();
    setCurrency(getCurrency(country));
  }, []);

  const pricing = PRICING[currency];
  const amount = pricing[billingPeriod];
  const periodLabel = billingPeriod === "monthly" ? "/mo" : "/yr";

  async function handleProCheckout() {
    setIsCheckingOut(true);
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
        const parsed = new URL(data.url);
        if (
          !["checkout.stripe.com", "billing.stripe.com"].includes(
            parsed.hostname,
          )
        ) {
          return;
        }
        window.location.href = data.url;
      }
    } finally {
      setIsCheckingOut(false);
    }
  }

  const tiers: PricingTier[] = [
    {
      name: "Seeker",
      icon: <Pencil className="w-6 h-6" />,
      priceLabel: "$0",
      periodLabel: "/mo",
      description: "start your clarity journey",
      color: "sage",
      features: [
        "10 deep sessions per month",
        "unlimited quick captures",
        "personal search library",
        "basic streak tracking",
        "secure local storage",
      ],
      ctaText: "get started",
      onCtaClick: () => {
        window.location.href = "/sign-up";
      },
    },
    {
      name: "Refiner",
      icon: <Star className="w-6 h-6" />,
      priceLabel: `${pricing.symbol}${amount}`,
      periodLabel,
      description: "deepen your perspective",
      color: "peach",
      features: [
        "unlimited reflections",
        "bi-weekly spaced resurfacing",
        "multi-layer reflections",
        "custom insight reports",
      ],
      popular: true,
      ctaText: isCheckingOut ? "loading..." : "start journey",
      onCtaClick: handleProCheckout,
    },
  ];

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center brutal-border rounded-full p-1 bg-white">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={cn(
              "px-5 py-2 rounded-full font-grotesk font-bold text-sm lowercase transition-all",
              billingPeriod === "monthly"
                ? "bg-peach text-soft-black brutal-border"
                : "text-muted-text hover:text-soft-black",
            )}
          >
            monthly
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={cn(
              "px-5 py-2 rounded-full font-grotesk font-bold text-sm lowercase transition-all relative",
              billingPeriod === "yearly"
                ? "bg-peach text-soft-black brutal-border"
                : "text-muted-text hover:text-soft-black",
            )}
          >
            yearly
            <span className="absolute -top-3 -right-3 bg-sage text-soft-black font-reenie text-xs px-2 py-0.5 rounded-full rotate-6 brutal-border-sm">
              save 25%
            </span>
          </button>
        </div>
      </div>

      <CreativePricing tiers={tiers} />
    </div>
  );
}
