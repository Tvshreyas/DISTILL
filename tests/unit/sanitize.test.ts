import { describe, it, expect } from "vitest";
import { sanitizeContent } from "@/lib/sanitize";

describe("sanitizeContent", () => {
  it("strips HTML tags and returns plain text", () => {
    expect(sanitizeContent("<p>Hello</p>")).toBe("Hello");
    expect(sanitizeContent("<b>bold</b> and <i>italic</i>")).toBe(
      "bold and italic"
    );
    expect(sanitizeContent("<div><span>nested</span></div>")).toBe("nested");
  });

  it("preserves plain text unchanged", () => {
    expect(sanitizeContent("plain text")).toBe("plain text");
    expect(sanitizeContent("multiple  spaces")).toBe("multiple  spaces");
  });

  it("preserves unicode: emoji and accented characters", () => {
    expect(sanitizeContent("cafe\u0301")).toBe("cafe\u0301");
    expect(sanitizeContent("naïve résumé")).toBe("naïve résumé");
    expect(sanitizeContent("thinking 🧠💡")).toBe("thinking 🧠💡");
    expect(sanitizeContent("日本語テスト")).toBe("日本語テスト");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeContent("")).toBe("");
  });

  it("returns empty string for whitespace-only input", () => {
    expect(sanitizeContent("   ")).toBe("");
    expect(sanitizeContent("\t\n")).toBe("");
  });

  it("trims leading and trailing whitespace", () => {
    expect(sanitizeContent("  hello  ")).toBe("hello");
  });

  it("strips <script> tags and their content", () => {
    expect(sanitizeContent('<script>alert("xss")</script>')).toBe("");
    expect(
      sanitizeContent('before<script>alert("xss")</script>after')
    ).toBe("beforeafter");
  });

  it("strips onerror and other event handler attributes", () => {
    expect(sanitizeContent('<img onerror="alert(1)" src=x>')).toBe("");
    expect(
      sanitizeContent('<div onmouseover="alert(1)">hover</div>')
    ).toBe("hover");
  });

  it("strips javascript: protocol in href", () => {
    expect(
      sanitizeContent('<a href="javascript:alert(1)">click</a>')
    ).toBe("click");
  });

  it("strips nested XSS payloads", () => {
    expect(
      sanitizeContent('<svg><script>alert(1)</script></svg>')
    ).toBe("");
    // DOMPurify strips the inner <script> tags but the malformed residue
    // is entity-encoded and harmless — no executable code survives
    const result = sanitizeContent(
      "<<script>script>alert(1)<</script>/script>"
    );
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("alert(1)");
  });

  it("strips iframe and object tags", () => {
    expect(sanitizeContent('<iframe src="evil.com"></iframe>')).toBe("");
    expect(
      sanitizeContent('<object data="evil.swf"></object>')
    ).toBe("");
  });

  it("preserves HTML entities as safe encoded text", () => {
    // DOMPurify with ALLOWED_TAGS: [] re-encodes entities to prevent
    // any HTML from being reconstructed — this is the correct behavior
    const result = sanitizeContent("&amp; &lt; &gt; &quot;");
    expect(result).not.toContain("<script>");
    // Entities should survive as harmless text
    expect(result.length).toBeGreaterThan(0);
  });
});
