import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Hr,
} from "@react-email/components";

interface WelcomeEmailProps {
  step: 1 | 2 | 3 | 4 | 5;
  dashboardUrl: string;
  unsubscribeUrl: string;
}

const STEPS: Record<
  1 | 2 | 3 | 4 | 5,
  {
    subject: string;
    heading: string;
    body: string;
    cta: string;
    ctaPath: string;
  }
> = {
  1: {
    subject: "your first reflection is waiting",
    heading: "your first reflection is waiting.",
    body: `Distill is one thing: a place to write what you actually think after you read, watch, or listen to something.\n\nFinish something today — a book chapter, a podcast episode, an article. Then open Distill and write your reaction. Not a summary. What you thought.\n\nTomorrow, we'll send it back to you. You'll be surprised what you wrote.`,
    cta: "Start your first session",
    ctaPath: "/dashboard/session/new",
  },
  2: {
    subject: "The simplest way to start",
    heading: "You don't need to read something new.",
    body: `Think of the last book you read. The last article. The last podcast episode. Anything.\n\nOpen Distill. Start a session. Write 2-3 sentences about what you thought. Not a summary — your perspective.\n\nThat's it. There's no minimum length and no required format.`,
    cta: "Start a session",
    ctaPath: "/dashboard/session/new",
  },
  3: {
    subject: "You consume plenty. How much do you keep?",
    heading: "The gap between consuming and thinking.",
    body: `Most people read dozens of books a year. Thousands of articles. Hundreds of hours of podcasts.\n\nAsk them what they thought about any of it — not what the author said, but what they thought — and the answer is usually nothing.\n\nThat gap between consuming and thinking is where your own ideas disappear. You absorb the author's perspective and never form your own.\n\nDistill exists to close that gap. One reflection at a time.`,
    cta: "Write a reflection",
    ctaPath: "/dashboard/session/new",
  },
  4: {
    subject: "Your reflections come back",
    heading: "Spaced resurfacing.",
    body: `Here's something that happens after you've used Distill for a while:\n\nA reflection you wrote weeks ago appears in your dashboard. You read what past-you thought. Sometimes you agree. Sometimes you don't. Either way, you're thinking about it again.\n\nThis is spaced resurfacing. Your past thinking comes back at intervals, so it compounds instead of disappearing.\n\nThe more reflections you write, the more you have to resurface.`,
    cta: "Start building your library",
    ctaPath: "/dashboard/session/new",
  },
  5: {
    subject: "Still here if you want it",
    heading: "No pressure.",
    body: `You signed up for Distill 10 days ago. You haven't written a reflection yet.\n\nThat's fine. There's no streak to break, no algorithm to feed, no daily quota.\n\nWhenever you finish reading, watching, or listening to something and want to capture what you thought — Distill is there.`,
    cta: "Open Distill",
    ctaPath: "/dashboard",
  },
};

export function WelcomeEmail({
  step,
  dashboardUrl,
  unsubscribeUrl,
}: WelcomeEmailProps) {
  const content = STEPS[step];
  const ctaUrl = `${dashboardUrl.replace(/\/dashboard$/, "")}${content.ctaPath}`;

  return (
    <Html>
      <Head>
        <style>{`body { font-family: 'Outfit', Arial, sans-serif; }`}</style>
      </Head>
      <Body style={{ backgroundColor: "#FDFCF8", margin: 0, padding: 0 }}>
        <Container
          style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 20px" }}
        >
          <Text
            style={{
              fontSize: "24px",
              fontWeight: 900,
              color: "#292524",
              letterSpacing: "-0.02em",
              textTransform: "lowercase" as const,
            }}
          >
            distill
          </Text>

          <Hr style={{ borderColor: "#E8EFE8", margin: "24px 0" }} />

          <Text
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#292524",
              margin: "0 0 16px",
            }}
          >
            {content.heading}
          </Text>

          {content.body.split("\n\n").map((paragraph, i) => (
            <Text
              key={i}
              style={{
                fontSize: "15px",
                color: "#78716C",
                lineHeight: "1.6",
                margin: "0 0 16px",
              }}
            >
              {paragraph}
            </Text>
          ))}

          <Link
            href={ctaUrl}
            style={{
              display: "inline-block",
              backgroundColor: "#FFB7B2",
              color: "#292524",
              fontWeight: 800,
              fontSize: "14px",
              padding: "14px 28px",
              borderRadius: "12px",
              textDecoration: "none",
              border: "3px solid #292524",
            }}
          >
            {content.cta}
          </Link>

          <Hr style={{ borderColor: "#E8EFE8", margin: "32px 0 16px" }} />

          <Text style={{ fontSize: "12px", color: "#78716C", margin: 0 }}>
            You received this because you signed up for Distill.{" "}
            <Link
              href={unsubscribeUrl}
              style={{ color: "#78716C", textDecoration: "underline" }}
            >
              Unsubscribe
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export function getWelcomeSubject(step: 1 | 2 | 3 | 4 | 5): string {
  return STEPS[step].subject;
}

export default WelcomeEmail;
