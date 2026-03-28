import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Hr,
} from "@react-email/components";

interface ReEngagementEmailProps {
  step: 1 | 2 | 3;
  reflectionCount: number;
  dashboardUrl: string;
  unsubscribeUrl: string;
}

export function ReEngagementEmail({
  step,
  reflectionCount,
  dashboardUrl,
  unsubscribeUrl,
}: ReEngagementEmailProps) {
  const appUrl = dashboardUrl.replace(/\/dashboard$/, "");

  const content = {
    1: {
      heading: "It's been a while.",
      body: `You haven't opened Distill in 2 weeks.\n\nYour library has ${reflectionCount} reflection${reflectionCount !== 1 ? "s" : ""} in it. ${reflectionCount > 0 ? "They're still there." : ""}\n\nIf you've read, watched, or listened to anything recently, consider writing a quick reflection. Even one sentence counts.`,
      cta: "Open your library",
      ctaPath: "/dashboard/library",
    },
    2: {
      heading: `${reflectionCount} reflection${reflectionCount !== 1 ? "s" : ""}, waiting.`,
      body: `You've written ${reflectionCount} reflection${reflectionCount !== 1 ? "s" : ""} in Distill. That's ${reflectionCount} moment${reflectionCount !== 1 ? "s" : ""} where you stopped consuming and started thinking.\n\nThose reflections are still in your library. They can still resurface. But only if you keep adding to them.\n\nThink of the last thing you read. What did you actually think about it?`,
      cta: "Write a reflection",
      ctaPath: "/dashboard/session/new",
    },
    3: {
      heading: "Your reflections are still here.",
      body: `This is the last email you'll get from Distill about coming back.\n\nYour ${reflectionCount} reflection${reflectionCount !== 1 ? "s" : ""} ${reflectionCount > 0 ? "are" : "is"} still in your library. If you want to pick up where you left off, the tool is there. If not, no hard feelings.\n\nYou can always unsubscribe from these emails in Settings.`,
      cta: "Open Distill",
      ctaPath: "/dashboard",
    },
  }[step];

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
            href={`${appUrl}${content.ctaPath}`}
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
            You received this because you have a Distill account.{" "}
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

export function getReEngagementSubject(
  step: 1 | 2 | 3,
  reflectionCount: number,
): string {
  const subjects = {
    1: "It's been a while",
    2: `${reflectionCount} reflection${reflectionCount !== 1 ? "s" : ""}, waiting`,
    3: "Your reflections are still here",
  };
  return subjects[step];
}

export default ReEngagementEmail;
