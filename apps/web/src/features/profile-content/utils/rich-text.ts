/**
 * Styling untuk HTML hasil rich text editor. Dipakai di editor admin dan saat
 * merender kontennya di halaman publik supaya tampilannya sama.
 */
export const richTextClass =
  "[&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-foreground [&_em]:italic [&_u]:underline [&_s]:line-through [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-accent [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs";

/** Legacy project descriptions were plain text before the rich text editor. */
export function projectDescriptionHtml(value: string) {
  const escapeText = (text: string) => text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

  if (!/^\s*<(?:p|ul|ol|blockquote|h[1-6])(?:\s|>)/i.test(value)) {
    return escapeText(value).replaceAll("\n", "<br />");
  }

  // The editor produces HTML. Keep its formatting without forwarding attributes or scripts.
  const allowed = new Set(["p", "strong", "em", "u", "s", "ul", "ol", "li", "blockquote", "code", "pre", "br", "hr", "h1", "h2", "h3", "h4", "h5", "h6"]);
  const parsed = new DOMParser().parseFromString(value, "text/html");
  const render = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return escapeText(node.textContent ?? "");
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const tag = node.nodeName.toLowerCase();
    const children = Array.from(node.childNodes).map(render).join("");
    if (!allowed.has(tag)) return children;
    if (tag === "br" || tag === "hr") return `<${tag} />`;
    return `<${tag}>${children}</${tag}>`;
  };
  return Array.from(parsed.body.childNodes).map(render).join("");
}

export function projectDescriptionPreview(value: string) {
  if (!/^\s*<(?:p|ul|ol|blockquote|h[1-6])(?:\s|>)/i.test(value)) return value;
  return value
    .replace(/<\/(?:p|li|blockquote)>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}
