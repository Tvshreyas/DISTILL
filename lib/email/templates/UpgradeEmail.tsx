import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Hr,
} from "@react-email/components";

interface UpgradeEmailProps {
  step: 1 | 2 | 3;
  reflectionCount: number;
  dashboardUrl: string;
  unsubscribeUrl: string;
}

export function UpgradeEmail({
  step,
  reflectionCount,
  dashboardUrl,
  unsubscribeUrl,
}: UpgradeEmailProps) {
  const appUrl = dashboardUrl.replace(/\/dashboard$/, "");
  const settingsUrl = `${appUrl}/dashboard/settings`;

  const content = {
    1: {
      heading: `You've used ${reflectionCount} of 10 deep sessions this month.`,
      body: `${10 - reflectionCount} deep session${10 - reflectionCount !== 1 ? "s" : ""} remaining this month.\n\nAfter 10, you'll need to wait until next month for more deep sessions.\n\nRemember: Quick Distills on the dashboard are always unlimited.\n\nNo pressure. Your sessions reset on the 1st of every month.`,
      cta: "open distill",
    },
    2: {
      heading: "Your deep sessions have reset.",
      body: `Your monthly deep session count has reset. You have 10 more sessions available.\n\nPro is coming soon — we'll let you know when unlimited deep sessions, spaced resurfacing, and multi-layer reflections are available.\n\nFor now, enjoy the beta.`,
      cta: "start a session",
    },
    3: {
      heading: "Pro is coming soon.",
      body: `Thanks for using Distill during the beta.\n\nWhen Pro launches, you'll get unlimited deep sessions, spaced resurfacing, and multi-layer reflections.\n\nWe'll notify you when it's available.`,
      cta: "open distill",
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
            href={settingsUrl}
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
            You received this because you use Distill.{" "}
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

export function getUpgradeSubject(
  step: 1 | 2 | 3,
  reflectionCount: number,
): string {
  const subjects = {
    1: `You've used ${reflectionCount} of 10 deep sessions this month`,
    2: "Your deep sessions reset — or go unlimited",
    3: "Save 25% with annual billing",
  };
  return subjects[step];
}

export default UpgradeEmail;
