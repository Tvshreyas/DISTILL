import { describe, it, expect } from "vitest";
import { sanitizeContent } from "@/lib/sanitize";

describe("reflection content validation", () => {
    describe("length boundaries", () => {
        it("accepts exactly 1 character", () => {
            const result = sanitizeContent("A");
            expect(result.length).toBe(1);
            expect(result.length >= 1 && result.length <= 3000).toBe(true);
        });

        it("accepts exactly 3000 characters", () => {
            const input = "a".repeat(3000);
            const result = sanitizeContent(input);
            expect(result.length).toBe(3000);
            expect(result.length >= 1 && result.length <= 3000).toBe(true);
        });

        it("rejects 3001 characters (over limit)", () => {
            const input = "a".repeat(3001);
            const result = sanitizeContent(input);
            // sanitizeContent doesn't truncate — validation logic in API route rejects this
            expect(result.length).toBe(3001);
            expect(result.length > 3000).toBe(true);
        });

        it("empty string after trim is invalid", () => {
            const result = sanitizeContent("");
            expect(result.length).toBe(0);
            expect(result.length < 1).toBe(true);
        });

        it("whitespace-only input trims to empty (invalid)", () => {
            const result = sanitizeContent("    \n\t   ");
            expect(result.length).toBe(0);
        });

        it("accepts content at near-boundary (2999 chars)", () => {
            const input = "b".repeat(2999);
            const result = sanitizeContent(input);
            expect(result.length).toBe(2999);
            expect(result.length >= 1 && result.length <= 3000).toBe(true);
        });
    });

    describe("content sanitization with length", () => {
        it("HTML tags are removed — effective length is shorter", () => {
            const input = "<b>hello</b> world";
            const result = sanitizeContent(input);
            expect(result).toBe("hello world");
            expect(result.length).toBe(11);
        });

        it("3000 chars of content with HTML tags — tags stripped, content shorter", () => {
            // 2990 chars of text + 10 chars of tags
            const text = "x".repeat(2990);
            const input = `<b>${text}</b><i></i>`;
            const result = sanitizeContent(input);
            expect(result).toBe(text);
            expect(result.length).toBe(2990);
        });

        it("single character surrounded by tags still valid", () => {
            const result = sanitizeContent("<div><span>A</span></div>");
            expect(result).toBe("A");
            expect(result.length).toBe(1);
        });

        it("all tags, no text content — strips to empty (invalid)", () => {
            const result = sanitizeContent("<div><span></span></div>");
            expect(result.length).toBe(0);
        });
    });

    describe("unicode and special character boundaries", () => {
        it("preserves multi-byte unicode at exactly 3000 chars", () => {
            // Each emoji is typically 2 UTF-16 code units, but we're counting string length
            const emoji = "🧠";
            const repeated = emoji.repeat(1500); // 1500 * 2 = 3000 UTF-16 units
            const result = sanitizeContent(repeated);
            expect(result).toBe(repeated);
            expect(result.length).toBe(3000);
        });

        it("preserves accented characters at boundary", () => {
            const input = "é".repeat(3000);
            const result = sanitizeContent(input);
            expect(result).toBe(input);
            expect(result.length).toBe(3000);
        });

        it("handles mixed unicode + ASCII", () => {
            const input = "Hello 🌍 world — it's a café résumé";
            const result = sanitizeContent(input);
            expect(result).toBe(input);
        });

        it("preserves newlines in content", () => {
            const input = "First line\nSecond line\n\nThird paragraph";
            const result = sanitizeContent(input);
            expect(result).toBe(input);
        });
    });

    describe("word count calculation", () => {
        // Mirrors the word count logic used in ReflectionCapture component
        function countWords(text: string): number {
            const trimmed = text.trim();
            return trimmed ? trimmed.split(/\s+/).length : 0;
        }

        it("counts single word", () => {
            expect(countWords("hello")).toBe(1);
        });

        it("counts multiple words", () => {
            expect(countWords("hello world foo")).toBe(3);
        });

        it("handles multiple spaces between words", () => {
            expect(countWords("hello    world")).toBe(2);
        });

        it("handles leading/trailing whitespace", () => {
            expect(countWords("  hello world  ")).toBe(2);
        });

        it("returns 0 for empty string", () => {
            expect(countWords("")).toBe(0);
        });

        it("returns 0 for whitespace only", () => {
            expect(countWords("   \n\t  ")).toBe(0);
        });

        it("counts words with newlines and tabs as separators", () => {
            expect(countWords("hello\nworld\tfoo")).toBe(3);
        });

        it("counts unicode words correctly", () => {
            expect(countWords("café résumé naïve")).toBe(3);
        });
    });

    describe("thinking shift rating validation", () => {
        // Mirrors the validation logic in POST /api/reflections
        function isValidRating(
            rating: unknown
        ): rating is number | null | undefined {
            if (rating === undefined || rating === null) return true;
            return (
                typeof rating === "number" &&
                Number.isInteger(rating) &&
                rating >= 1 &&
                rating <= 5
            );
        }

        it("accepts null (optional)", () => {
            expect(isValidRating(null)).toBe(true);
        });

        it("accepts undefined (optional)", () => {
            expect(isValidRating(undefined)).toBe(true);
        });

        it("accepts 1 (minimum)", () => {
            expect(isValidRating(1)).toBe(true);
        });

        it("accepts 5 (maximum)", () => {
            expect(isValidRating(5)).toBe(true);
        });

        it("accepts 3 (middle value)", () => {
            expect(isValidRating(3)).toBe(true);
        });

        it("rejects 0 (below minimum)", () => {
            expect(isValidRating(0)).toBe(false);
        });

        it("rejects 6 (above maximum)", () => {
            expect(isValidRating(6)).toBe(false);
        });

        it("rejects decimals", () => {
            expect(isValidRating(3.5)).toBe(false);
        });

        it("rejects negative numbers", () => {
            expect(isValidRating(-1)).toBe(false);
        });

        it("rejects strings", () => {
            expect(isValidRating("3")).toBe(false);
        });

        it("rejects NaN", () => {
            expect(isValidRating(NaN)).toBe(false);
        });

        it("rejects Infinity", () => {
            expect(isValidRating(Infinity)).toBe(false);
        });
    });
});
