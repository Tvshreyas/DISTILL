import { Metadata } from "next";
import Link from "next/link";
import { promptTopics } from "@/lib/pseo-prompts";

export const metadata: Metadata = {
  title: "Reflection Prompts by Topic — Distill",
  description:
    "Curated reflection prompts for philosophy, psychology, business, history, science, and 15 more topics. Questions to ask yourself after reading or watching.",
  alternates: {
    canonical: "https://www.distillwise.com/prompts",
  },
};

const iconMap: Record<string, string> = {
  philosophy: "🏛️",
  psychology: "🧠",
  business: "📊",
  history: "📜",
  science: "🔬",
  "self-improvement": "🎯",
  economics: "💹",
  technology: "💻",
  politics: "🏢",
  sociology: "👥",
  health: "🫀",
  creativity: "🎨",
  leadership: "🧭",
  relationships: "🤝",
  spirituality: "🕊️",
  education: "📚",
  environment: "🌍",
  ethics: "⚖️",
  fiction: "✨",
  parenting: "🌱",
};

export default function PromptsIndexPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] selection:bg-[#C4B5FD] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20">
          <h1 className="text-6xl md:text-8xl font-black text-[#292524] tracking-tightest leading-0.8 mb-8">
            prompts<span className="text-[#C4B5FD]">.</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-[#78716C] max-w-2xl leading-relaxed">
            questions to ask yourself after reading, watching, or listening.
            pick a topic.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {promptTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/prompts/${topic.slug}`}
              className="group block bg-white border-4 border-[#292524] p-6 shadow-[6px_6px_0px_0px_rgba(41,37,36,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all duration-200"
            >
              <span className="text-3xl mb-3 block">
                {iconMap[topic.slug] || "📝"}
              </span>
              <h2 className="text-xl font-black text-[#292524] mb-2 group-hover:underline underline-offset-4 decoration-4 decoration-[#C4B5FD]">
                {topic.topic}
              </h2>
              <p className="text-[#78716C] text-sm leading-relaxed line-clamp-2">
                {topic.description}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
