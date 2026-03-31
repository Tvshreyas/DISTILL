import { Metadata } from "next";
import Link from "next/link";
import { bookReflections } from "@/lib/pseo-books";

export const metadata: Metadata = {
  title: "Book Reflection Guides — Distill",
  description:
    "Reflection prompts and guides for 50 popular nonfiction books. Learn what to think about after reading Atomic Habits, Deep Work, Sapiens, and more.",
  alternates: {
    canonical: "https://distillwise.com/reflect/books",
  },
};

export default function BooksIndexPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] selection:bg-[#FFB7B2] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/reflect"
          className="inline-flex items-center gap-2 text-sm font-black text-[#78716C] hover:text-[#292524] uppercase tracking-widest mb-12 transition-colors"
        >
          <span className="text-xl">←</span> Reflection Guides
        </Link>

        <header className="mb-20">
          <h1 className="text-6xl md:text-8xl font-black text-[#292524] tracking-tightest leading-0.8 mb-8">
            books<span className="text-[#FFB7B2]">.</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-[#78716C] max-w-2xl leading-relaxed">
            reflection prompts for 50 popular nonfiction books. pick the one you
            just finished.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {bookReflections.map((book) => (
            <Link
              key={book.slug}
              href={`/reflect/books/${book.slug}`}
              className="group block bg-white border-4 border-[#292524] p-6 shadow-[6px_6px_0px_0px_rgba(41,37,36,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all duration-200"
            >
              <h2 className="text-xl font-black text-[#292524] mb-1 group-hover:underline underline-offset-4 decoration-4 decoration-[#FFB7B2]">
                {book.title}
              </h2>
              <p className="text-sm text-[#A8A29E] mb-3">{book.author}</p>
              <p className="text-[#78716C] text-sm leading-relaxed line-clamp-2">
                {book.description}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
