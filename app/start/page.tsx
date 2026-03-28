import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import StartForm from "@/components/StartForm";

export default function StartPage() {
  return (
    <div className="min-h-screen bg-warm-bg font-sans relative overflow-x-hidden">
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-24 relative">
        {/* Simple navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-text hover:text-soft-black transition-colors mb-16"
        >
          <ArrowLeft className="w-3 h-3" /> back home
        </Link>

        <header className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-peach/10 border border-peach/20 text-[10px] font-bold uppercase tracking-widest text-peach">
            <Zap className="w-3 h-3 fill-current" /> Fast Start
          </div>
          <h1 className="font-grotesk text-5xl md:text-7xl font-black lowercase tracking-tighter leading-[0.85] text-soft-black">
            distill your
            <br />
            first thought.
          </h1>
          <p className="font-serif italic text-xl text-muted-text max-w-lg">
            &ldquo;Knowledge is not what you consume. It is what you
            remember.&rdquo;
          </p>
        </header>

        <StartForm />

        {/* Footer text */}
        <footer className="mt-24 border-t border-soft-black/5 pt-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-text text-center italic">
            * Once saved, this thought will be resurfaced in 3 days.
          </p>
        </footer>
      </main>
    </div>
  );
}
