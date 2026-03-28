import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
} from "@react-email/components";

interface ResurfacingEmailProps {
  daysAgo: number;
  reflectionContent: string;
  contentTitle: string;
  contentType: string;
  dashboardUrl: string;
  unsubscribeUrl: string;
}

export function ResurfacingEmail({
  daysAgo,
  reflectionContent,
  contentTitle,
  contentType,
  dashboardUrl,
  unsubscribeUrl,
}: ResurfacingEmailProps) {
  return (
    <Html>
      <Head>
        <style>{`body { font-family: 'Outfit', Arial, sans-serif; }`}</style>
      </Head>
      <Body style={{ backgroundColor: "#FDFCF8", margin: 0, padding: 0 }}>
        <Container
          style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 20px" }}
        >
          {/* Header */}
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

          {/* Body */}
          <Text
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#292524",
              margin: "0 0 8px",
            }}
          >
            {daysAgo} Days Ago, You Thought...
          </Text>

          <Text
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#78716C",
              textTransform: "uppercase" as const,
              letterSpacing: "0.1em",
              margin: "0 0 16px",
            }}
          >
            {contentType} — {contentTitle}
          </Text>

          {/* Reflection blockquote */}
          <Section
            style={{
              backgroundColor: "#E8EFE8",
              borderRadius: "16px",
              padding: "24px",
              margin: "0 0 24px",
              borderLeft: "4px solid #292524",
            }}
          >
            <Text
              style={{
                fontSize: "15px",
                color: "#292524",
                lineHeight: "1.6",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              &ldquo;
              {reflectionContent.length > 300
                ? reflectionContent.slice(0, 300) + "..."
                : reflectionContent}
              &rdquo;
            </Text>
          </Section>

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
            Revisit on Distill
          </Link>

          <Hr style={{ borderColor: "#E8EFE8", margin: "32px 0 16px" }} />

          {/* Footer */}
          <Text style={{ fontSize: "12px", color: "#78716C", margin: 0 }}>
            You received this because you enabled resurfacing emails.{" "}
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

export default ResurfacingEmail;
