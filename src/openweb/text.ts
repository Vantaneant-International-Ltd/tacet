// Shared, protocol-agnostic text helpers. Open-web content (ActivityStreams `content`,
// actor `summary`, Mastodon `note`) is HTML; the product shows calm plain text, never
// rendered source markup.
export function toPlainText(html: string): string {
  return html
    .replace(/<\/(p|br|div|li)>/gi, "\n")
    .replace(/<br\s*\/?>(?=)/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
