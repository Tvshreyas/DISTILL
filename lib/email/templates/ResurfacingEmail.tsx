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

          {/* Reflection — open directly with their words */}
          <Section
            style={{
              backgroundColor: "#E8EFE8",
              borderRadius: "16px",
              padding: "24px",
              margin: "0 0 16px",
              borderLeft: "4px solid #292524",
            }}
          >
            <Text
              style={{
                fontSize: "17px",
                color: "#292524",
                lineHeight: "1.7",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              &ldquo;
              {reflectionContent.length > 400
                ? reflectionContent.slice(0, 400) + "..."
                : reflectionContent}
              &rdquo;
            </Text>
          </Section>

          <Text
            style={{
              fontSize: "14px",
              color: "#78716C",
              margin: "0 0 4px",
            }}
          >
            You wrote this {daysAgo} days ago after{" "}
            {contentType === "book"
              ? "reading"
              : contentType === "podcast"
                ? "listening to"
                : contentType === "video"
                  ? "watching"
                  : "consuming"}{" "}
            <strong style={{ color: "#292524" }}>{contentTitle}</strong>.
          </Text>

          <Text
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#292524",
              margin: "0 0 24px",
            }}
          >
            Has anything changed?
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
            Add a layer &rarr;
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
