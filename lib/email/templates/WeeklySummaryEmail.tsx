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

interface ContentTypeBreakdown {
  type: string;
  count: number;
}

interface WeeklySummaryEmailProps {
  totalReflections: number;
  totalWords: number;
  contentTypeBreakdown: ContentTypeBreakdown[];
  dashboardUrl: string;
  unsubscribeUrl: string;
}

export function WeeklySummaryEmail({
  totalReflections,
  totalWords,
  contentTypeBreakdown,
  dashboardUrl,
  unsubscribeUrl,
}: WeeklySummaryEmailProps) {
  const typesLabel = contentTypeBreakdown
    .filter((c) => c.count > 0)
    .map((c) => `${c.count} ${c.type}${c.count > 1 ? "s" : ""}`)
    .join(", ");

  const hasReflections = totalReflections > 0;

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
              margin: "0 0 16px",
            }}
          >
            Your Week
          </Text>

          {hasReflections ? (
            <>
              <Section
                style={{
                  backgroundColor: "#E8EFE8",
                  borderRadius: "16px",
                  padding: "24px",
                  margin: "0 0 8px",
                }}
              >
                <Text
                  style={{
                    fontSize: "32px",
                    fontWeight: 900,
                    color: "#292524",
                    margin: "0 0 4px",
                  }}
                >
                  {totalReflections}
                </Text>
                <Text
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#78716C",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.1em",
                    margin: 0,
                  }}
                >
                  reflection{totalReflections !== 1 ? "s" : ""}
                </Text>
              </Section>

              <Text
                style={{
                  fontSize: "15px",
                  color: "#78716C",
                  lineHeight: "1.6",
                  margin: "16px 0 24px",
                }}
              >
                {totalWords.toLocaleString()} words across{" "}
                {typesLabel || "your reflections"}.
              </Text>
            </>
          ) : (
            <Text
              style={{
                fontSize: "15px",
                color: "#78716C",
                lineHeight: "1.6",
                margin: "0 0 24px",
              }}
            >
              No reflections this week. Your library is here when you&apos;re
              ready.
            </Text>
          )}

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
            You received this because you enabled weekly summaries.{" "}
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

export default WeeklySummaryEmail;
