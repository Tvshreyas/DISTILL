import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Hr,
} from "@react-email/components";

interface StreakReminderEmailProps {
  currentStreak: number;
  dashboardUrl: string;
  unsubscribeUrl: string;
}

export function StreakReminderEmail({
  currentStreak,
  dashboardUrl,
  unsubscribeUrl,
}: StreakReminderEmailProps) {
  return (
    <Html>
      <Head>
        <style>{`body { font-family: 'Outfit', Arial, sans-serif; }`}</style>
      </Head>
      <Body style={{ backgroundColor: "#FDFCF8", margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 20px" }}>
          {/* Header */}
          <Text style={{ fontSize: "24px", fontWeight: 900, color: "#292524", letterSpacing: "-0.02em", textTransform: "lowercase" as const }}>
            distill
          </Text>

          <Hr style={{ borderColor: "#E8EFE8", margin: "24px 0" }} />

          {/* Body */}
          <Text style={{ fontSize: "20px", fontWeight: 800, color: "#292524", margin: "0 0 16px" }}>
            Your {currentStreak}-day streak continues.
          </Text>

          <Text style={{ fontSize: "15px", color: "#78716C", lineHeight: "1.6", margin: "0 0 24px" }}>
            No reflection recorded today. Your streak is still active.
          </Text>

          {/* CTA */}
          <Link
            href={dashboardUrl}
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
            Open Distill
          </Link>

          <Hr style={{ borderColor: "#E8EFE8", margin: "32px 0 16px" }} />

          {/* Footer */}
          <Text style={{ fontSize: "12px", color: "#78716C", margin: 0 }}>
            You received this because you enabled streak reminders.{" "}
            <Link href={unsubscribeUrl} style={{ color: "#78716C", textDecoration: "underline" }}>
              Unsubscribe
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default StreakReminderEmail;
