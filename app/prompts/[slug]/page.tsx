import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPromptTopic, promptTopics } from "@/lib/pseo-prompts";
import { getReflectionGuide } from "@/lib/pseo-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getPromptTopic(slug);
  if (!topic) return { title: "Not Found" };

  return {
    title: `${topic.topic} Reflection Prompts — Distill`,
    description: topic.description,
    alternates: {
      canonical: `https://distillwise.com/prompts/${slug}`,
    },
    openGraph: {
      title: `${topic.topic} Reflection Prompts — Distill`,
      description: topic.description,
      type: "article",
    },
  };
}

export function generateStaticParams() {
  return promptTopics.map((topic) => ({ slug: topic.slug }));
}

export default async function PromptTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getPromptTopic(slug);
  if (!topic) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    name: `${topic.topic} Reflection Prompts`,
    description: topic.description,
    author: {
      "@type": "Organization",
      name: "Distill",
      url: "https://distillwise.com",
    },
  };

  const relatedTopics = topic.relatedTopics
    .map((slug) => getPromptTopic(slug))
    .filter(Boolean);

  const relatedGuides = topic.relatedGuides
    .map((slug) => getReflectionGuide(slug))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FDFCF8] selection:bg-[#FFB7B2] pt-32 pb-20 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto">
        <Link
          href="/prompts"
          className="inline-flex items-center gap-2 text-sm font-black text-[#78716C] hover:text-[#292524] uppercase tracking-widest mb-12 transition-colors"
        >
          <span className="text-xl">←</span> All Topics
        </Link>

        <header className="mb-12">
          <span className="inline-block px-3 py-1 bg-[#C4B5FD] border-2 border-[#292524] text-[11px] font-black uppercase tracking-wider text-[#292524] mb-6">
            Reflection Prompts
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-[#292524] tracking-tightest leading-tight mb-6">
            {topic.topic.toLowerCase()} prompts
          </h1>
          <div className="text-lg text-[#78716C] leading-relaxed space-y-4">
            {topic.intro.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </header>

        <section className="mb-16 bg-[#E8EFE8] border-4 border-[#292524] p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(41,37,36,1)]">
          <h2 className="text-2xl font-black text-[#292524] mb-6">
            prompts to use after reading or watching
          </h2>
          <ol className="space-y-5">
            {topic.prompts.map((prompt, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="shrink-0 w-8 h-8 bg-[#292524] text-white font-black text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-lg text-[#78716C] leading-relaxed italic pt-0.5">
                  {prompt}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-black text-[#292524] mb-4">
            why these prompts work
          </h2>
          <div className="text-lg text-[#78716C] leading-relaxed space-y-4">
            {topic.whyTheseWork.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>

        {relatedTopics.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-black text-[#292524] mb-6">
              related topics
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedTopics.map(
                (related) =>
                  related && (
                    <Link
                      key={related.slug}
                      href={`/prompts/${related.slug}`}
                      className="group block bg-white border-3 border-[#292524] p-5 shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                      <h3 className="font-black text-[#292524] mb-2 group-hover:underline decoration-[#C4B5FD] decoration-3 underline-offset-2">
                        {related.topic} Prompts
                      </h3>
                      <p className="text-sm text-[#78716C] line-clamp-2">
                        {related.description}
                      </p>
                    </Link>
                  ),
              )}
            </div>
          </section>
        )}

        {relatedGuides.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-black text-[#292524] mb-6">
              reflection guides
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedGuides.map(
                (guide) =>
                  guide && (
                    <Link
                      key={guide.slug}
                      href={`/reflect/${guide.slug}`}
                      className="group block bg-white border-3 border-[#292524] p-5 shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                      <h3 className="font-black text-[#292524] mb-2 group-hover:underline decoration-[#FFB7B2] decoration-3 underline-offset-2">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-[#78716C] line-clamp-2">
                        {guide.description}
                      </p>
                    </Link>
                  ),
              )}
            </div>
          </section>
        )}

        <footer className="pt-12 border-t-4 border-[#292524]">
          <div className="bg-white border-4 border-[#292524] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(41,37,36,1)]">
            <h3 className="text-2xl font-black text-[#292524] mb-4 text-center">
              try these prompts in distill
            </h3>
            <p className="text-lg text-[#78716C] mb-8 text-center max-w-xl mx-auto">
              Pick a prompt, start a session, and write what you think. Your
              reflections build up over time into a personal library of your own
              thinking.
            </p>
            <div className="text-center">
              <Link
                href="/start"
                className="inline-block bg-[#C4B5FD] text-[#292524] font-black text-lg px-8 py-4 border-4 border-[#292524] shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Try Distill for Free
              </Link>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
