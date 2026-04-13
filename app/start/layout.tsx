import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Reflecting — Distill",
  description:
    "Begin a reflection session. Pick what you consumed and capture your perspective before it fades.",
  alternates: { canonical: "https://www.distillwise.com/start" },
  robots: { index: true, follow: true },
};

export default function StartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
