import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import PostHogProvider from "@/components/PostHogProvider";
import CookieBanner from "@/components/CookieBanner";
import { Toaster } from "sonner";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Distill — Think more clearly about what you consume",
  description:
    "Distill helps you develop your own thinking from the content you consume. Build a reflection habit. Your thoughts, compounded over time.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Distill",
  },
  openGraph: {
    title: "Distill — Think more clearly about what you consume",
    description:
      "Build a reflection habit. Your thoughts, compounded over time.",
    images: ["/og-image.svg"],
    type: "website",
    siteName: "Distill",
  },
  twitter: {
    card: "summary_large_image",
    title: "Distill — Think more clearly about what you consume",
    description:
      "Build a reflection habit. Your thoughts, compounded over time.",
    images: ["/og-image.svg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${instrumentSerif.variable} ${plusJakarta.variable} font-sans antialiased`}>
        <ClerkProvider>
          <ConvexClientProvider>
            <PostHogProvider>
              {children}
              <Toaster
                theme="dark"
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: "#111",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#e5e5e5",
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
