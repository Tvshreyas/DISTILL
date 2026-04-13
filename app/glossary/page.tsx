import { Metadata } from "next";
import Link from "next/link";
import { glossaryTerms } from "@/lib/pseo-data";

export const metadata: Metadata = {
  title: "Glossary — Distill",
  description:
    "Key concepts in thinking, reading, and reflection. Understand active reading, spaced repetition, metacognition, and more.",
  alternates: {
    canonical: "https://www.distillwise.com/glossary",
  },
};

export default function GlossaryPage() {
  const sortedTerms = [...glossaryTerms].sort((a, b) =>
    a.term.localeCompare(b.term),
  );

  return (
    <div className="min-h-screen bg-[#FDFCF8] selection:bg-[#FFB7B2] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20">
          <h1 className="text-6xl md:text-8xl font-black text-[#292524] tracking-tightest leading-0.8 mb-8">
            glossary<span className="text-[#E8EFE8]">.</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-[#78716C] max-w-2xl leading-relaxed">
            key concepts in thinking, reading, and reflection.
          </p>
        </header>

        <section className="grid gap-6">
          {sortedTerms.map((term) => (
            <Link
              key={term.slug}
              href={`/glossary/${term.slug}`}
              className="group block bg-white border-4 border-[#292524] p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(41,37,36,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#292524] mb-3 group-hover:underline underline-offset-4 decoration-4 decoration-[#E8EFE8]">
                    {term.term}
                  </h2>
                  <p className="text-[#78716C] leading-relaxed">
                    {term.definition}
                  </p>
                </div>
                <span className="text-2xl text-[#78716C] group-hover:translate-x-1 transition-transform shrink-0 mt-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
