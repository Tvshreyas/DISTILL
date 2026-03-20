import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGlossaryTerm, glossaryTerms } from "@/lib/pseo-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) return { title: "Not Found" };

  return {
    title: `What Is ${term.term}? — Distill Glossary`,
    description: term.definition,
    alternates: {
      canonical: `https://distillwise.com/glossary/${slug}`,
    },
    openGraph: {
      title: `What Is ${term.term}?`,
      description: term.definition,
      type: "article",
    },
  };
}

export function generateStaticParams() {
  return glossaryTerms.map((term) => ({ slug: term.slug }));
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.definition,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Distill Thinking Glossary",
      url: "https://distillwise.com/glossary",
    },
  };

  const relatedTerms = term.relatedTerms
    .map((slug) => getGlossaryTerm(slug))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FDFCF8] selection:bg-[#FFB7B2] pt-32 pb-20 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto">
        <Link
          href="/glossary"
          className="inline-flex items-center gap-2 text-sm font-black text-[#78716C] hover:text-[#292524] uppercase tracking-widest mb-12 transition-colors"
        >
          <span className="text-xl">←</span> Glossary
        </Link>

        <header className="mb-12">
          <span className="inline-block px-3 py-1 bg-[#E8EFE8] border-2 border-[#292524] text-[11px] font-black uppercase tracking-wider text-[#292524] mb-6">
            Definition
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-[#292524] tracking-tightest leading-tight mb-6">
            what is {term.term.toLowerCase()}?
          </h1>
          <p className="text-xl md:text-2xl text-[#78716C] leading-relaxed border-l-8 border-[#FFB7B2] pl-6">
            {term.definition}
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-[#292524] mb-6">
            understanding {term.term.toLowerCase()}
          </h2>
          {term.explanation.split("\n\n").map((para, i) => (
            <p
              key={i}
              className="text-lg text-[#78716C] leading-relaxed mb-6"
            >
              {para}
            </p>
          ))}
        </section>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-[#292524] mb-6">
            why it matters
          </h2>
          {term.whyItMatters.split("\n\n").map((para, i) => (
            <p
              key={i}
              className="text-lg text-[#78716C] leading-relaxed mb-6"
            >
              {para}
            </p>
          ))}
        </section>

        <section className="mb-16 bg-[#E8EFE8] border-4 border-[#292524] p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(41,37,36,1)]">
          <h2 className="text-2xl md:text-3xl font-black text-[#292524] mb-6">
            how to apply it
          </h2>
          {term.howToApply.split("\n\n").map((para, i) => (
            <p
              key={i}
              className="text-lg text-[#78716C] leading-relaxed mb-6 last:mb-0"
            >
              {para}
            </p>
          ))}
        </section>

        {relatedTerms.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-black text-[#292524] mb-6">
              related concepts
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedTerms.map(
                (related) =>
                  related && (
                    <Link
                      key={related.slug}
                      href={`/glossary/${related.slug}`}
                      className="group block bg-white border-3 border-[#292524] p-5 shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                      <h3 className="font-black text-[#292524] mb-2 group-hover:underline decoration-[#FFB7B2] decoration-3 underline-offset-2">
                        {related.term}
                      </h3>
                      <p className="text-sm text-[#78716C] line-clamp-2">
                        {related.definition}
                      </p>
                    </Link>
                  )
              )}
            </div>
          </section>
        )}

        {term.relatedBlogPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-black text-[#292524] mb-6">
              further reading
            </h2>
            <div className="flex flex-wrap gap-3">
              {term.relatedBlogPosts.map((slug) => (
                <Link
                  key={slug}
                  href={`/blog/${slug}`}
                  className="inline-block px-4 py-2 bg-[#FFB7B2] border-2 border-[#292524] text-sm font-black text-[#292524] hover:bg-[#292524] hover:text-white transition-colors"
                >
                  {slug.replace(/-/g, " ")}
                </Link>
              ))}
            </div>
          </section>
        )}

        <footer className="pt-12 border-t-4 border-[#292524]">
          <div className="bg-white border-4 border-[#292524] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(41,37,36,1)]">
            <h3 className="text-2xl font-black text-[#292524] mb-4 text-center">
              put {term.term.toLowerCase()} into practice
            </h3>
            <p className="text-lg text-[#78716C] mb-8 text-center max-w-xl mx-auto">
              Distill helps you build a reflection practice around the content
              you consume. Your thinking, compounded over time.
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
