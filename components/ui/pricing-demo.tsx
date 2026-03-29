"use client";

import {
  CreativePricing,
  type PricingTier,
} from "@/components/ui/creative-pricing";
import { Pencil, Star } from "lucide-react";
import { toast } from "sonner";

export function CreativePricingDemo() {

  const tiers: PricingTier[] = [
    {
      name: "Beta Access",
      icon: <Pencil className="w-6 h-6" />,
      priceLabel: "free",
      periodLabel: "",
      description: "everything you need to start thinking",
      color: "sage",
      features: [
        "10 deep sessions per month",
        "unlimited quick captures",
        "personal search library",
        "basic streak tracking",
        "spaced resurfacing",
      ],
      ctaText: "start distilling",
      onCtaClick: () => {
        window.location.href = "/sign-up";
      },
    },
    {
      name: "Pro",
      icon: <Star className="w-6 h-6" />,
      priceLabel: "coming soon",
      periodLabel: "",
      description: "unlimited everything",
      color: "peach",
      features: [
        "unlimited deep sessions",
        "unlimited perspective layers",
        "layer from your library anytime",
        "lifetime resurfacing schedule",
      ],
      popular: true,
      ctaText: "notify me when available",
      onCtaClick: () => {
        toast.success("You'll be notified when Pro launches.");
      },
    },
  ];

  return <CreativePricing tiers={tiers} />;
}
