import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { glossaryTerms, reflectionGuides } from "@/lib/pseo-data";
import { bookReflections } from "@/lib/pseo-books";
import { promptTopics } from "@/lib/pseo-prompts";

/**
 * Read blog post slugs and dates directly here instead of importing
 * getSortedPostsData, so the sitemap stays self-contained and works
 * reliably both at build time and at runtime on Vercel.
 */
function getBlogEntries(): { slug: string; date: string }[] {
  try {
    const dir = path.join(process.cwd(), "content/blog");
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => {
        const { data } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
        return { slug: f.replace(/\.md$/, ""), date: data.date as string };
      });
  } catch {
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.distillwise.com";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/start`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/reflect`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/reflect/books`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/prompts`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2026-04-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date("2026-04-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Blog post URLs
  const blogPages: MetadataRoute.Sitemap = getBlogEntries().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Glossary term pages
  const glossaryPages: MetadataRoute.Sitemap = glossaryTerms.map((term) => ({
    url: `${baseUrl}/glossary/${term.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Reflection guide pages
  const reflectPages: MetadataRoute.Sitemap = reflectionGuides.map((guide) => ({
    url: `${baseUrl}/reflect/${guide.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Book reflection pages
  const bookPages: MetadataRoute.Sitemap = bookReflections.map((book) => ({
    url: `${baseUrl}/reflect/books/${book.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Prompt topic pages
  const promptPages: MetadataRoute.Sitemap = promptTopics.map((topic) => ({
    url: `${baseUrl}/prompts/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...blogPages,
    ...glossaryPages,
    ...reflectPages,
    ...bookPages,
    ...promptPages,
  ];
}
