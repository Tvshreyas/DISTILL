import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { getPostData, getAllPostSlugs } from "@/lib/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const postData = await getPostData(slug);
    return {
      title: `${postData.title} — Distill`,
      description: postData.description,
      alternates: {
        canonical: `https://distillwise.com/blog/${slug}`,
      },
      openGraph: {
        title: postData.title,
        description: postData.description,
        type: "article",
        publishedTime: postData.date,
        authors: [postData.author],
      },
    };
  } catch {
    return {
      title: "Post Not Found",
    };
  }
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((s) => ({
    slug: s.params.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let postData;
  try {
    postData = await getPostData(slug);
  } catch {
    notFound();
  }

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: postData.title,
    description: postData.description,
    datePublished: postData.date,
    author: {
      "@type": "Organization",
      name: "Distill",
      url: "https://distillwise.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Distill",
      logo: {
        "@type": "ImageObject",
        url: "https://distillwise.com/icon.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://distillwise.com/blog/${slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] selection:bg-[#FFB7B2] pt-32 pb-20 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-black text-[#78716C] hover:text-[#292524] uppercase tracking-widest mb-12 transition-colors"
        >
          <span className="text-xl">←</span> Back to Blog
        </Link>

        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-6">
            {postData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-[#E8EFE8] border-2 border-[#292524] text-[11px] font-black uppercase tracking-wider text-[#292524]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-[#292524] tracking-tightest leading-tight mb-6">
            {postData.title}
          </h1>

          <div className="flex items-center gap-4 text-sm font-bold text-[#78716C] uppercase tracking-widest">
            <time>
              {new Date(postData.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span>•</span>
            <span>By {postData.author}</span>
          </div>
        </header>

        <div
          className="prose prose-stone prose-xl max-w-none
            prose-headings:text-[#292524] prose-headings:font-black prose-headings:tracking-tight
            prose-p:text-[#78716C] prose-p:leading-relaxed
            prose-strong:text-[#292524] prose-strong:font-black
            prose-a:text-[#292524] prose-a:font-black prose-a:underline prose-a:decoration-[#FFB7B2] prose-a:decoration-4 hover:prose-a:bg-[#FFB7B2]/20
            prose-blockquote:border-l-8 prose-blockquote:border-[#FFB7B2] prose-blockquote:bg-[#E8EFE8] prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic
            prose-img:border-4 prose-img:border-[#292524] prose-img:shadow-[8px_8px_0px_0px_rgba(41,37,36,1)]
            prose-hr:border-4 prose-hr:border-[#E8EFE8]"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(postData.contentHtml, {
              ALLOWED_TAGS: [
                "p",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "ul",
                "ol",
                "li",
                "blockquote",
                "strong",
                "em",
                "a",
                "code",
                "pre",
                "hr",
                "br",
                "img",
                "table",
                "thead",
                "tbody",
                "tr",
                "th",
                "td",
                "span",
                "del",
                "sup",
                "sub",
              ],
              ALLOWED_ATTR: [
                "href",
                "src",
                "alt",
                "title",
                "class",
                "id",
                "target",
                "rel",
              ],
              FORBID_ATTR: [
                "style",
                "onerror",
                "onload",
                "onclick",
                "onmouseover",
              ],
              ALLOW_DATA_ATTR: false,
            }),
          }}
        />

        <footer className="mt-20 pt-12 border-t-4 border-[#292524]">
          <div className="bg-[#E8EFE8] border-4 border-[#292524] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(41,37,36,1)]">
            <h3 className="text-2xl font-black text-[#292524] mb-4 text-center">
              Want to see more clearly?
            </h3>
            <p className="text-lg text-[#78716C] mb-8 text-center max-w-xl mx-auto">
              Distill is your private space for deep reflection. Build a
              compounding library of your own perspective.
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
