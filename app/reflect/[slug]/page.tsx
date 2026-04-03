import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getReflectionGuide, reflectionGuides } from "@/lib/pseo-data";
import { getBookReflection } from "@/lib/pseo-books";
import { getPromptTopic } from "@/lib/pseo-prompts";
import {
  guideToBooks,
  guideToPrompts,
  guideToBlogPosts,
} from "@/lib/pseo-links";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getReflectionGuide(slug);
  if (!guide) return { title: "Not Found" };

  return {
    title: `${guide.title} — Distill`,
    description: guide.description,
    alternates: {
      canonical: `https://distillwise.com/reflect/${slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
    },
  };
}

export function generateStaticParams() {
  return reflectionGuides.map((guide) => ({ slug: guide.slug }));
}

export default async function ReflectionGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getReflectionGuide(slug);
  if (!guide) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.description,
    step: guide.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.heading,
      text: step.body,
    })),
  };

  const relatedGuides = guide.relatedGuides
    .map((slug) => getReflectionGuide(slug))
    .filter(Boolean);

  const bookSlugs = guideToBooks[guide.slug] || [];
  const relatedBooks = bookSlugs
    .map((slug) => getBookReflection(slug))
    .filter(Boolean);

  const promptSlugs = guideToPrompts[guide.slug] || [];
  const relatedPrompts = promptSlugs
    .map((slug) => getPromptTopic(slug))
    .filter(Boolean);

  const blogPosts = guideToBlogPosts[guide.slug] || [];

  return (
    <div className="min-h-screen bg-[#FDFCF8] selection:bg-[#FFB7B2] pt-32 pb-20 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto">
        <Link
          href="/reflect"
          className="inline-flex items-center gap-2 text-sm font-black text-[#78716C] hover:text-[#292524] uppercase tracking-widest mb-12 transition-colors"
        >
          <span className="text-xl">←</span> All Guides
        </Link>

        <header className="mb-12">
          <span className="inline-block px-3 py-1 bg-[#FFB7B2] border-2 border-[#292524] text-[11px] font-black uppercase tracking-wider text-[#292524] mb-6">
            {guide.contentType}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-[#292524] tracking-tightest leading-tight mb-6">
            {guide.title.toLowerCase()}
          </h1>
          <p className="text-xl text-[#78716C] leading-relaxed">
            {guide.intro}
          </p>
        </header>

        <section className="mb-16">
          {guide.steps.map((step, i) => (
            <div key={i} className="mb-12 last:mb-0">
              <div className="flex items-start gap-4 mb-4">
                <span className="shrink-0 w-10 h-10 bg-[#292524] text-white font-black text-lg flex items-center justify-center">
                  {i + 1}
                </span>
                <h2 className="text-2xl font-black text-[#292524] pt-1">
                  {step.heading}
                </h2>
              </div>
              <p className="text-lg text-[#78716C] leading-relaxed ml-14">
                {step.body}
              </p>
            </div>
          ))}
        </section>

        <section className="mb-16 bg-[#E8EFE8] border-4 border-[#292524] p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(41,37,36,1)]">
          <h2 className="text-2xl font-black text-[#292524] mb-6">
            reflection prompts
          </h2>
          <ul className="space-y-4">
            {guide.prompts.map((prompt, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[#FFB7B2] font-black text-xl leading-none mt-0.5">
                  ?
                </span>
                <span className="text-lg text-[#78716C] leading-relaxed italic">
                  {prompt}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-black text-[#292524] mb-6">
            common mistakes
          </h2>
          <ul className="space-y-4">
            {guide.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[#292524] font-black text-lg leading-none mt-0.5">
                  ×
                </span>
                <span className="text-lg text-[#78716C] leading-relaxed">
                  {mistake}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {relatedGuides.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-black text-[#292524] mb-6">
              related guides
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedGuides.map(
                (related) =>
                  related && (
                    <Link
                      key={related.slug}
                      href={`/reflect/${related.slug}`}
                      className="group block bg-white border-3 border-[#292524] p-5 shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                      <h3 className="font-black text-[#292524] mb-2 group-hover:underline decoration-[#FFB7B2] decoration-3 underline-offset-2">
                        {related.title}
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

        {relatedBooks.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-black text-[#292524] mb-6">
              books to reflect on
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedBooks.map(
                (book) =>
                  book && (
                    <Link
                      key={book.slug}
                      href={`/reflect/books/${book.slug}`}
                      className="group block bg-white border-3 border-[#292524] p-5 shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                      <h3 className="font-black text-[#292524] mb-1 group-hover:underline decoration-[#FFB7B2] decoration-3 underline-offset-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-[#A8A29E]">{book.author}</p>
                    </Link>
                  ),
              )}
            </div>
          </section>
        )}

        {relatedPrompts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-black text-[#292524] mb-6">
              explore related prompts
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedPrompts.map(
                (topic) =>
                  topic && (
                    <Link
                      key={topic.slug}
                      href={`/prompts/${topic.slug}`}
                      className="group block bg-white border-3 border-[#292524] p-5 shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                      <h3 className="font-black text-[#292524] mb-2 group-hover:underline decoration-[#C4B5FD] decoration-3 underline-offset-2">
                        {topic.topic} Prompts
                      </h3>
                      <p className="text-sm text-[#78716C] line-clamp-2">
                        {topic.description}
                      </p>
                    </Link>
                  ),
              )}
            </div>
          </section>
        )}

        {blogPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-black text-[#292524] mb-6">
              further reading
            </h2>
            <div className="flex flex-wrap gap-3">
              {blogPosts.map((postSlug) => (
                <Link
                  key={postSlug}
                  href={`/blog/${postSlug}`}
                  className="inline-block px-4 py-2 bg-[#FFB7B2] border-2 border-[#292524] text-sm font-black text-[#292524] hover:bg-[#292524] hover:text-white transition-colors"
                >
                  {postSlug.replace(/-/g, " ")}
                </Link>
              ))}
            </div>
          </section>
        )}

        <footer className="pt-12 border-t-4 border-[#292524]">
          <div className="bg-white border-4 border-[#292524] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(41,37,36,1)]">
            <h3 className="text-2xl font-black text-[#292524] mb-4 text-center">
              start reflecting on {guide.contentType.toLowerCase()}
            </h3>
            <p className="text-lg text-[#78716C] mb-8 text-center max-w-xl mx-auto">
              Distill gives you a private space to capture your thinking after
              consuming content. Your reflections resurface over time, building
              compound knowledge.
            </p>
            <div className="text-center">
              <Link
                href="/start"
                className="inline-block bg-[#FFB7B2] text-[#292524] font-black text-lg px-8 py-4 border-4 border-[#292524] shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
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
