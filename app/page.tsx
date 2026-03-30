import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Distill — You forgot 95% of what you read last year",
  description:
    "Distill is a thinking tool. After you read a book, watch a video, or finish a podcast — spend 2 minutes writing what you actually think. Your reflections resurface over time.",
  alternates: {
    canonical: "https://distillwise.com",
  },
  openGraph: {
    title: "Distill — You forgot 95% of what you read last year",
    description:
      "After you read a book, watch a video, or finish a podcast — spend 2 minutes writing what you actually think. Your reflections resurface over time.",
    url: "https://distillwise.com",
    siteName: "Distill",
    type: "website",
    images: [
      {
        url: "https://distillwise.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Distill — a thinking development tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Distill — You forgot 95% of what you read last year",
    description:
      "After you read a book, watch a video, or finish a podcast — spend 2 minutes writing what you actually think. Your reflections resurface over time.",
    images: ["https://distillwise.com/og-image.png"],
  },
  keywords: [
    "reflection app",
    "thinking tool",
    "book reflection",
    "reading notes",
    "content reflection",
    "spaced repetition",
    "personal knowledge",
    "active reading",
    "critical thinking",
  ],
};

// JSON-LD structured data for rich results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Distill",
      url: "https://distillwise.com",
      description:
        "A thinking development tool that helps you build a reflection habit from books, videos, articles, and podcasts.",
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free tier with 10 deep sessions per month",
      },
      featureList: [
        "Session-based reflection capture",
        "Searchable personal library",
        "Spaced resurfacing of past reflections",
        "Data export in JSON format",
        "Streak tracking",
      ],
    },
    {
      "@type": "Organization",
      name: "Distill",
      url: "https://distillwise.com",
      logo: "https://distillwise.com/icon-192.png",
      sameAs: [],
      knowsAbout: [
        "Active Reading",
        "Spaced Repetition",
        "Reflective Thinking",
        "Compound Thinking",
        "Reading Retention",
        "Information Diet",
        "Deep Reading",
        "Metacognition",
      ],
    },
    {
      "@type": "WebSite",
      name: "Distill",
      url: "https://distillwise.com",
      description:
        "A thinking development tool for building a reflection practice.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Distill?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Distill is a thinking development tool where you write short reflections after consuming content like books, videos, articles, and podcasts. Your reflections resurface at intervals so your thinking compounds over time.",
          },
        },
        {
          "@type": "Question",
          name: "How does Distill work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Start a session, consume content externally, write a short reflection capturing your perspective, and your reflections resurface at timed intervals. The core loop takes 2-5 minutes.",
          },
        },
        {
          "@type": "Question",
          name: "Is Distill free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The free tier includes 10 deep sessions per month. Quick Distills are unlimited. Pro unlocks unlimited deep sessions, layered resurfacing, and advanced analytics.",
          },
        },
        {
          "@type": "Question",
          name: "What is a reflection practice?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A reflection practice is the habit of writing what you actually think after consuming content — not a summary, but your own perspective. Each reflection takes about 2 minutes.",
          },
        },
        {
          "@type": "Question",
          name: "What types of content can I reflect on in Distill?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Books, articles, podcasts, videos, audiobooks, and any other content you consume. Distill does not host content — you consume it wherever you normally would, then reflect in Distill.",
          },
        },
        {
          "@type": "Question",
          name: "How is Distill different from Notion or Readwise?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Distill is a single-purpose thinking tool, not a note-taking app or highlight manager. There are no folders, tags, or organizational overhead. You write reflections, and they resurface over time.",
          },
        },
        {
          "@type": "Question",
          name: "Does Distill use AI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Distill does not use AI to generate summaries or reflections. You write your own thinking. The value comes from your perspective, not a model's output.",
          },
        },
        {
          "@type": "Question",
          name: "What is compound thinking?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Compound thinking is the process where small, regular reflections accumulate into a connected web of ideas over time. Each new reflection builds on previous ones, creating intellectual growth that compounds like interest.",
          },
        },
        {
          "@type": "Question",
          name: "I already have a note-taking app. How is Distill different?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Note-taking apps store information. Distill is a thinking tool — it makes you process what you consumed and resurfaces your past thinking so it compounds over time.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need to pay to use Distill?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. You get 10 deep sessions per month for free. Quick reflections are always unlimited.",
          },
        },
        {
          "@type": "Question",
          name: "Can I export my thoughts from Distill?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, your perspectives are yours. You can export them as clean JSON at any time.",
          },
        },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}
