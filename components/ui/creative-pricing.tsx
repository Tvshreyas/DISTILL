import * as React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingTier {
  name: string;
  icon: React.ReactNode;
  priceLabel: string;
  periodLabel: string;
  description: string;
  features: string[];
  popular?: boolean;
  color: "peach" | "sage" | "lavender" | "soft-black";
  onCtaClick?: () => void;
  ctaText?: string;
}

function CreativePricing({
  tag = "simple pricing",
  title = "reclaim your space",
  description = "find clarity in the chaos",
  tiers,
}: {
  tag?: string;
  title?: string;
  description?: string;
  tiers: PricingTier[];
}) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-20 relative overflow-hidden">
      <div className="text-center space-y-4 mb-16 relative z-10">
        <div className="font-reenie text-3xl text-peach active:rotate-3 transition-transform hover:scale-110 inline-block cursor-default">
          {tag}
        </div>
        <div className="relative">
          <h2 className="text-5xl md:text-7xl font-bold font-grotesk text-soft-black lowercase tracking-tight">
            {title}
          </h2>
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 h-2 bg-peach/20 
                        rotate-[-1deg] rounded-full blur-sm"
          />
        </div>
        <p className="font-outfit text-xl text-muted-text max-w-lg mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {tiers.map((tier, index) => (
          <div
            key={tier.name}
            className={cn(
              "relative group",
              "transition-all duration-500",
              index === 0 && "rotate-[-1deg] hover:rotate-0",
              index === 1 && "rotate-[1deg] hover:rotate-0",
              index === 2 && "rotate-[-2deg] hover:rotate-0",
            )}
          >
            <div
              className={cn(
                "absolute inset-0 bg-white",
                "brutal-border brutal-shadow shadow-none",
                "rounded-[2.5rem] transition-all duration-300",
                "group-hover:shadow-[8px_8px_0px_0px_#292524]",
                "group-hover:-translate-x-1 group-hover:-translate-y-1",
              )}
            />

            <div className="relative p-8">
              {tier.popular && (
                <div
                  className="absolute -top-4 -right-2 bg-peach text-soft-black 
                                    font-reenie text-2xl px-5 py-1 rounded-full rotate-12 brutal-border shadow-sm"
                >
                  Popular!
                </div>
              )}

              <div className="mb-6">
                <div
                  className={cn(
                    "w-14 h-14 rounded-full mb-6",
                    "flex items-center justify-center",
                    "brutal-border",
                    tier.color === "peach"
                      ? "bg-peach"
                      : tier.color === "sage"
                        ? "bg-sage"
                        : tier.color === "lavender"
                          ? "bg-lavender"
                          : "bg-white",
                  )}
                >
                  <span className="text-soft-black">{tier.icon}</span>
                </div>
                <h3 className="font-grotesk text-3xl font-bold text-soft-black lowercase mb-2">
                  {tier.name}
                </h3>
                <p className="font-outfit text-muted-text text-sm">
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <span className="text-5xl font-bold font-grotesk text-soft-black">
                  {tier.priceLabel}
                </span>
                <span className="text-muted-text font-outfit ml-2 lowercase">
                  {tier.periodLabel}
                </span>
              </div>

              <div className="space-y-4 mb-10">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full brutal-border-sm 
                                            flex items-center justify-center bg-white"
                    >
                      <Check className="w-3 h-3 text-soft-black" />
                    </div>
                    <span className="font-outfit text-soft-black lowercase">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={tier.onCtaClick}
                className={cn(
                  "w-full h-14 font-grotesk font-bold text-lg relative",
                  "brutal-border brutal-shadow shadow-none lowercase",
                  "transition-all duration-300",
                  "hover:shadow-[4px_4px_0px_0px_#292524]",
                  "hover:-translate-x-0.5 hover:-translate-y-0.5",
                  tier.popular
                    ? "bg-peach text-soft-black hover:bg-peach/90"
                    : "bg-white text-soft-black hover:bg-zinc-50",
                )}
              >
                {tier.ctaText ?? "start journey"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative Hand-drawn elements */}
      <div className="absolute top-20 right-10 font-reenie text-6xl text-sage/40 -rotate-12 pointer-events-none select-none">
        ✨
      </div>
      <div className="absolute bottom-10 left-10 font-reenie text-5xl text-lavender/40 rotate-12 pointer-events-none select-none">
        ✎
      </div>
      <div className="absolute top-1/2 left-0 font-reenie text-4xl text-peach/30 -rotate-90 pointer-events-none select-none">
        collect everything.
      </div>
    </div>
  );
}

export { CreativePricing, type PricingTier };
