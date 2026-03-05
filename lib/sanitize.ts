import DOMPurify from "isomorphic-dompurify";

/** Strip all HTML tags — returns plain text only */
export function sanitizeContent(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }).trim();
}
