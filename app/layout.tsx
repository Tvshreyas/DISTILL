import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Outfit, Reenie_Beanie, Lora } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import PostHogProvider from "@/components/PostHogProvider";
import CookieBanner from "@/components/CookieBanner";
import PWAProvider from "@/components/PWAProvider";
import { Toaster } from "sonner";
import { CustomCursor } from "@/components/ui/custom-cursor";
import ProfileSync from "@/components/ProfileSync";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const reenieBeanie = Reenie_Beanie({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-reenie",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://distillwise.com"),
  title: "Distill — Think more clearly about what you consume",
  description:
    "Distill helps you develop your own thinking from the content you consume. Build a reflection habit. Your thoughts, compounded over time.",
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://distillwise.com",
    types: {
      "application/rss+xml": "https://distillwise.com/sitemap.xml",
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Distill",
  },
  openGraph: {
    title: "Distill — Think More Clearly About What You Consume",
    description:
      "Build a reflection habit from the content you consume. Your perspective, compounded over time.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Distill — a thinking development tool",
      },
    ],
    type: "website",
    siteName: "Distill",
  },
  twitter: {
    card: "summary_large_image",
    title: "Distill — Think More Clearly About What You Consume",
    description:
      "Build a reflection habit from the content you consume. Your perspective, compounded over time.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${outfit.variable} ${reenieBeanie.variable} ${lora.variable} font-sans antialiased text-soft-black`}
      >
        <ClerkProvider>
          <ConvexClientProvider>
            <PostHogProvider>
              <PWAProvider />
              <CustomCursor />
              <ProfileSync />
              {children}
              <Toaster
                theme="light"
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: "#ffffff",
                    border: "2px solid #292524",
                    borderRadius: "1rem",
                    color: "#292524",
                    fontWeight: "700",
                    fontFamily: "var(--font-outfit)",
                  },
                }}
              />
              <CookieBanner />
            </PostHogProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
