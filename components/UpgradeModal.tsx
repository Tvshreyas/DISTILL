"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";

export default function UpgradeModal({
  onCloseAction,
  isOpen,
}: {
  onCloseAction: () => void;
  isOpen: boolean;
}) {
  const [notified, setNotified] = useState(false);

  if (!isOpen) return null;

  function handleNotify() {
    setNotified(true);
    toast.success("You'll be notified when Pro launches.");
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="max-w-md w-full bg-white border-4 border-soft-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(41,37,36,1)] p-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sage/20 border-2 border-sage/40 rounded-full">
          <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-soft-black">
            invite-only beta
          </span>
        </div>

        <h2 className="text-2xl font-bold uppercase tracking-tight text-soft-black">
          Pro is coming soon
        </h2>
        <p className="text-muted-text">
          Pro is currently in invite-only beta. When it launches, you&apos;ll
          unlock everything below.
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

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={handleNotify}
            disabled={notified}
            className="w-full py-4 bg-soft-black text-white rounded-2xl font-bold transition-transform active:scale-95 disabled:opacity-50 hover:bg-peach hover:text-soft-black"
          >
            {notified ? "you're on the list." : "notify me when Pro is available"}
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
