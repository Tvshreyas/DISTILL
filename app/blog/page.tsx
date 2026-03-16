import { Metadata } from "next";
import Link from "next/link";
import { getSortedPostsData } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Distill",
  description: "Insights on thinking, productivity, and the art of distillation.",
  alternates: {
    canonical: "https://distill.app/blog",
  },
};

export default async function BlogPage() {
  const allPostsData = await getSortedPostsData();

  return (
    <div className="min-h-screen bg-[#FDFCF8] selection:bg-[#FFB7B2] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20">
          <h1 className="text-6xl md:text-8xl font-black text-[#292524] tracking-tightest leading-0.8 mb-8">
            the blog<span className="text-[#FFB7B2]">.</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-[#78716C] max-w-2xl leading-relaxed">
            essays on deep work, compound thinking, and staying human in an automated world.
          </p>
        </header>

        <section className="grid gap-12">
          {allPostsData.map(({ slug, date, title, description, tags }) => (
            <article 
              key={slug}
              className="group relative bg-white border-4 border-[#292524] p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(41,37,36,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-200"
            >
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-[#E8EFE8] border-2 border-[#292524] text-[11px] font-black uppercase tracking-wider text-[#292524]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link href={`/blog/${slug}`} className="block">
                <h2 className="text-3xl md:text-4xl font-black text-[#292524] mb-4 leading-tight group-hover:underline underline-offset-4 decoration-8 decoration-[#FFB7B2]">
                  {title}
                </h2>
              </Link>

              <p className="text-lg text-[#78716C] mb-8 leading-relaxed max-w-3xl">
                {description}
              </p>

              <div className="flex items-center justify-between pt-8 border-t-2 border-[#E8EFE8]">
                <time className="text-sm font-bold text-[#78716C] uppercase tracking-widest">
                  {new Date(date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                
                <Link 
                  href={`/blog/${slug}`}
                  className="text-sm font-black text-[#292524] uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                >
                  Read Post 
                  <span className="text-xl">→</span>
                </Link>
              </div>
            </article>
          ))}
        </section>

        {allPostsData.length === 0 && (
          <div className="py-20 text-center border-4 border-dashed border-[#E8EFE8] rounded-3xl">
            <p className="text-xl font-bold text-[#78716C]">more thoughts coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
