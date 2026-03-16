import { Metadata } from "next";
import Link from "next/link";
import { reflectionGuides } from "@/lib/pseo-data";

export const metadata: Metadata = {
  title: "Reflection Guides — Distill",
  description:
    "Learn how to reflect on books, podcasts, articles, videos, and audiobooks. Practical guides for building a reflection practice.",
  alternates: {
    canonical: "https://distill.app/reflect",
  },
};

const iconMap: Record<string, string> = {
  books: "📖",
  podcasts: "🎙️",
  articles: "📄",
  videos: "📹",
  audiobooks: "🎧",
};

export default function ReflectPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] selection:bg-[#FFB7B2] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20">
          <h1 className="text-6xl md:text-8xl font-black text-[#292524] tracking-tightest leading-0.8 mb-8">
            reflect<span className="text-[#FFB7B2]">.</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-[#78716C] max-w-2xl leading-relaxed">
            practical guides for building a reflection practice around the
            content you consume.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-2">
          {reflectionGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/reflect/${guide.slug}`}
              className="group block bg-white border-4 border-[#292524] p-8 shadow-[8px_8px_0px_0px_rgba(41,37,36,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-200"
            >
              <span className="text-4xl mb-4 block">
                {iconMap[guide.slug] || "📝"}
              </span>
              <h2 className="text-2xl font-black text-[#292524] mb-3 group-hover:underline underline-offset-4 decoration-4 decoration-[#FFB7B2]">
                {guide.title}
              </h2>
              <p className="text-[#78716C] leading-relaxed">
                {guide.description}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
