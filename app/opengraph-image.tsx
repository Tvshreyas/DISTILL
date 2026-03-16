import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Distill — a thinking development tool";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FDFCF8",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#FFB7B2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid #292524",
              fontSize: "28px",
              fontWeight: 800,
              color: "#292524",
            }}
          >
            D
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: "#292524",
              letterSpacing: "-0.02em",
            }}
          >
            distill.
          </span>
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 800,
            color: "#292524",
            textAlign: "center",
            lineHeight: 1.1,
            maxWidth: "800px",
          }}
        >
          think more clearly about what you consume.
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#78716C",
            marginTop: "24px",
            fontWeight: 500,
          }}
        >
          your perspective, compounded over time.
        </div>
      </div>
    ),
    { ...size }
  );
}
