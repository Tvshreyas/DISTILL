import { SignUp } from "@clerk/nextjs";
import { ShaderAnimation } from "@/components/ui/shader-lines";
import Link from "next/link";

export default async function SignUpPage({ params }: { params: Promise<{ "sign-up"?: string[] }> }) {
  const resolvedParams = await params;
  const isSSOCallback = resolvedParams["sign-up"]?.includes("sso-callback");

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-warm-bg overflow-hidden font-sans">
      {/* Distilled Focus Shader Background */}
      <div className="absolute inset-0 opacity-40">
        <ShaderAnimation />
      </div>
      
      {/* Grain Overlay for Tactile Feel */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.12] mix-blend-multiply bg-[url('https://grain-y.vercel.app/noise.svg')] bg-repeat z-50" />

      {/* Floating Auth Card */}
      <div className="relative z-10 w-full max-w-[420px] px-6">
        <div className="mb-10 text-center space-y-2">
          <Link href="/" className="inline-block group">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-peach flex items-center justify-center brutal-border mb-4 group-hover:scale-105 transition-transform duration-500 ease-out">
                <span className="font-grotesk font-bold text-2xl">d.</span>
              </div>
              <h1 className="font-grotesk text-4xl font-black lowercase tracking-tighter">distill.</h1>
              <p className="font-medium text-muted-text text-[13px] italic tracking-tight opacity-80">your thinking starts here.</p>
            </div>
          </Link>
        </div>

        <div className={`brutal-card bg-white shadow-2xl relative z-10 ${isSSOCallback ? "p-12 text-center" : "p-10 md:p-14"}`}>
          {isSSOCallback && (
            <div className="flex flex-col items-center justify-center space-y-8">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-[3px] border-sage animate-pulse" />
                <div className="absolute inset-0 w-16 h-16 rounded-full border-t-[3px] border-soft-black animate-spin" />
              </div>
              <div className="space-y-2">
                <p className="font-grotesk font-black text-2xl lowercase tracking-tighter">authenticating...</p>
                <p className="text-[11px] text-muted-text font-bold uppercase tracking-[0.3em] opacity-40">pre-focus sequence active</p>
              </div>
            </div>
          )}
          
          <SignUp
            routing="path"
            path="/sign-up"
            appearance={{
              variables: {
                colorPrimary: "#292524",
                colorText: "#292524",
                colorTextSecondary: "#78716Y",
                fontFamily: "var(--font-outfit)",
                borderRadius: "1rem",
              },
              elements: {
                rootBox: "w-full",
                cardBox: "w-full shadow-none bg-transparent border-none",
                card: "w-full shadow-none bg-transparent border-none p-0",
                main: "w-full space-y-8",
                headerTitle: "font-grotesk font-black text-2xl text-soft-black lowercase tracking-tighter",
                headerSubtitle: "text-[13px] text-muted-text font-medium italic opacity-70",
                socialButtonsBlockButton:
                  "w-full h-14 border-2 border-soft-black bg-white hover:bg-sage/20 transition-all rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98]",
                socialButtonsBlockButtonText: "font-black font-grotesk text-[14px] text-soft-black lowercase tracking-tight",
                socialButtonsBlockButtonArrow: "hidden",
                socialButtonsIconButton: "border-2 border-soft-black rounded-2xl",
                formFieldInput:
                  "w-full h-14 px-6 rounded-2xl border-2 border-soft-black/5 focus:border-peach bg-warm-bg/30 focus:bg-white text-soft-black transition-all outline-none font-medium",
                formButtonPrimary:
                  "w-full h-16 bg-soft-black text-white hover:bg-peach hover:text-soft-black font-black text-xl rounded-2xl transition-all shadow-none hover:shadow-[6px_6px_0px_0px_#292524] hover:translate-x-[-3px] hover:translate-y-[-3px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none mt-6 border-2 border-soft-black",
                footerActionLink: "text-peach hover:text-soft-black font-bold underline decoration-2 underline-offset-4 transition-all",
                identityPreviewEditButton: "text-peach",
                formField: "space-y-3",
                formFieldLabelRow: "px-1 flex justify-between items-center",
                formFieldLabel: "font-grotesk font-black text-soft-black lowercase text-[15px] tracking-tight",
                formFieldLabelSecondary: "hidden", // Hide "Optional" labels for a cleaner look
                dividerLine: "bg-soft-black/5 h-[1px]",
                dividerText: "text-soft-black/20 font-bold font-grotesk text-[10px] uppercase tracking-[0.4em]",
              },
            }}
          />
        </div>

        <p className="mt-8 text-center text-[10px] text-muted-text font-bold uppercase tracking-widest">
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
