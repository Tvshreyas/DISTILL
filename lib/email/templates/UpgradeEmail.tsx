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

export function UpgradeEmail({ step, reflectionCount, dashboardUrl, unsubscribeUrl }: UpgradeEmailProps) {
  const appUrl = dashboardUrl.replace(/\/dashboard$/, "");
  const settingsUrl = `${appUrl}/dashboard/settings`;

  const content = {
    1: {
      heading: `You've used ${reflectionCount} of 10 reflections this month.`,
      body: `${10 - reflectionCount} reflection${10 - reflectionCount !== 1 ? "s" : ""} remaining on the free tier.\n\nAfter 10, you'll need to wait until next month to write more — or upgrade to Pro for unlimited reflections.\n\nPro also includes spaced resurfacing and streak tracking.\n\nNo pressure. The free tier resets on the 1st of every month.`,
      cta: "See Pro details",
    },
    2: {
      heading: "Your free reflections have reset.",
      body: `Your monthly reflection count has reset. You have 10 more reflections available.\n\nLast month you used all 10. That's more active thinking than most people do in a year.\n\nIf the limit feels like it's getting in the way, Pro removes it entirely:\n\n— Unlimited reflections\n— Spaced resurfacing (past reflections come back at intervals)\n— Streak tracking\n— $5/month or $36/year\n\nThe free tier stays free. Upgrade only if the limit doesn't work for you.`,
      cta: "Upgrade to Pro",
    },
    3: {
      heading: "Save 40% with annual billing.",
      body: `You've been on Distill Pro for 2 weeks.\n\nMonthly Pro is $5/month ($60/year). Annual Pro is $36/year — that's 40% less.\n\nYou can switch in Settings. Your current billing period will be prorated.`,
      cta: "Switch to annual",
    },
  }[step];

  return (
    <Html>
      <Head>
        <style>{`body { font-family: 'Outfit', Arial, sans-serif; }`}</style>
      </Head>
      <Body style={{ backgroundColor: "#FDFCF8", margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 20px" }}>
          <Text style={{ fontSize: "24px", fontWeight: 900, color: "#292524", letterSpacing: "-0.02em", textTransform: "lowercase" as const }}>
            distill
          </Text>

          <Hr style={{ borderColor: "#E8EFE8", margin: "24px 0" }} />

          <Text style={{ fontSize: "20px", fontWeight: 800, color: "#292524", margin: "0 0 16px" }}>
            {content.heading}
          </Text>

          {content.body.split("\n\n").map((paragraph, i) => (
            <Text key={i} style={{ fontSize: "15px", color: "#78716C", lineHeight: "1.6", margin: "0 0 16px" }}>
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
            <Link href={unsubscribeUrl} style={{ color: "#78716C", textDecoration: "underline" }}>
              Unsubscribe
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export function getUpgradeSubject(step: 1 | 2 | 3, reflectionCount: number): string {
  const subjects = {
    1: `You've used ${reflectionCount} of 10 reflections this month`,
    2: "Your free reflections reset — or go unlimited",
    3: "Save 40% with annual billing",
  };
  return subjects[step];
}

export default UpgradeEmail;
