import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ "sign-up"?: string[] }>;
}) {
  const resolvedParams = await params;
  const isSSOCallback = resolvedParams["sign-up"]?.includes("sso-callback");

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-warm-bg overflow-hidden font-sans">
      {/* Grain Overlay for Tactile Feel */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.12] mix-blend-multiply bg-[url('https://grain-y.vercel.app/noise.svg')] bg-repeat z-50" />

      {/* Floating Auth Card */}
      <div className="relative z-10 w-full max-w-[520px] px-6">
        <div className="mb-12 text-center space-y-2">
          <Link href="/" className="inline-block group">
            <div className="flex flex-col items-center">
              {/* 9-Dot Logo with Brutal JITTER - Centered & Saturated Pink */}
              <div className="brutal-jitter flex items-center justify-center w-20 h-20 mb-6 group-hover:scale-110 transition-transform duration-500 ease-out bg-peach brutal-border border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="grid grid-cols-3 gap-2 place-items-center">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="w-3.5 h-3.5 rounded-full bg-soft-black"
                    />
                  ))}
                </div>
              </div>
              <h1 className="font-grotesk text-7xl font-black lowercase tracking-tighter">
                distill.
              </h1>
              <p className="font-medium text-muted-text text-[16px] italic tracking-tight opacity-80 mt-1">
                your thinking starts here.
              </p>

              {/* Rite of Passage Disclaimer - Gargantuan Padding */}
              <div className="mt-8 px-24 py-12 border-4 border-soft-black bg-warm-bg/50 w-max mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-grotesk font-black text-[10px] uppercase tracking-[0.1em] text-soft-black leading-none whitespace-nowrap">
                  archive of original thought. no generative noise allowed.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div
          className={`brutal-card bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative z-10 p-0 overflow-hidden ${isSSOCallback ? "p-12 text-center" : ""}`}
        >
          {isSSOCallback && (
            <div className="flex flex-col items-center justify-center space-y-8 p-14">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-[3px] border-sage animate-pulse" />
                <div className="absolute inset-0 w-16 h-16 rounded-full border-t-[3px] border-soft-black animate-spin" />
              </div>
              <div className="space-y-2">
                <p className="font-grotesk font-black text-2xl lowercase tracking-tighter">
                  authenticating...
                </p>
                <p className="text-[11px] text-muted-text font-bold uppercase tracking-[0.3em] opacity-40">
                  signing you in...
                </p>
              </div>
            </div>
          )}

          <SignUp
            routing="path"
            path="/sign-up"
            forceRedirectUrl="/onboarding/migrate"
            appearance={{
              variables: {
                colorPrimary: "#0A0A0A",
                colorText: "#0A0A0A",
                colorTextSecondary: "#44403C",
                fontFamily: "var(--font-outfit)",
                borderRadius: "0px",
              },
              elements: {
                rootBox: "w-full",
                cardBox: "w-full shadow-none bg-transparent border-none",
                card: "w-full shadow-none bg-transparent border-none p-10 md:p-14",
                main: "w-full",
                headerTitle:
                  "font-grotesk font-black text-4xl text-soft-black lowercase tracking-tighter mb-2",
                headerSubtitle: { display: "none" },
                footer: { display: "none" },
                socialButtonsBlockButton:
                  "border-4 border-soft-black bg-white hover:bg-peach/10 transition-all rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0 active:translate-y-0 text-soft-black mb-4",
                socialButtonsBlockButtonText:
                  "font-black font-grotesk text-[16px] lowercase tracking-tight",
                socialButtonsBlockButtonArrow: "hidden",
                socialButtonsIconButton:
                  "border-4 border-soft-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                formFieldInput:
                  "w-full h-14 px-6 rounded-none border-4 border-soft-black focus:border-soft-black bg-warm-bg/30 focus:bg-white text-soft-black transition-all outline-none font-medium",
                formButtonPrimary:
                  "w-full h-16 bg-soft-black text-white hover:bg-peach hover:text-soft-black font-black text-xl rounded-none transition-all shadow-none hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none mt-8 border-4 border-soft-black",
                footerActionLink:
                  "text-peach hover:text-soft-black font-black underline decoration-4 underline-offset-8 transition-all",
                identityPreviewEditButton: "text-peach font-black",
                formField: "mb-6",
                formFieldLabelRow:
                  "px-1 flex justify-between items-center mb-2",
                formFieldLabel:
                  "font-grotesk font-black text-soft-black lowercase text-[16px] tracking-tight",
                formFieldLabelSecondary: "hidden",
                dividerLine: "bg-soft-black h-[2px]",
                dividerText:
                  "text-soft-black font-black font-grotesk text-[11px] uppercase tracking-[0.4em] px-4",
              },
            }}
          />
        </div>

        <p className="mt-6 text-center text-sm text-muted-text font-medium">
          already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-soft-black hover:text-peach font-black underline decoration-2 underline-offset-4 transition-colors"
          >
            log in
          </Link>
        </p>

        <p className="mt-4 text-center text-[10px] text-muted-text font-bold uppercase tracking-widest">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="text-soft-black hover:text-peach transition-colors underline underline-offset-4"
          >
            Terms
          </Link>{" "}
          &{" "}
          <Link
            href="/privacy"
            className="text-soft-black hover:text-peach transition-colors underline underline-offset-4"
          >
            Privacy
          </Link>
        </p>
      </div>
    </main>
  );
}
