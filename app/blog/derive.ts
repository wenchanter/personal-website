import { richTextToPlain } from "@/app/blog/types";
import type { ArticleBlock } from "@/app/blog/types";

/**
 * Values the article page shows but the CMS never stores: reading time and the
 * display form of the publish date.
 *
 * These live here rather than inside `scripts/sync-blog.ts` because the live
 * preview at `/preview/` has to derive them the same way. A second
 * implementation would put a wrong reading time in front of the author while
 * they write, which is exactly the drift the preview exists to remove.
 */

/** The table of contents entries, in document order. */
export function getHeadings(content: readonly ArticleBlock[]) {
  return content.flatMap((block) =>
    block.type === "heading"
      ? [
          {
            id: block.id,
            // The table of contents is plain text, but a heading may carry
            // inline marks, so flatten it here.
            text: richTextToPlain(block.text),
            level: block.level ?? 2,
          },
        ]
      : [],
  );
}

/** Every word a reader actually reads, in document order. */
export function textFromContent(content: readonly ArticleBlock[]): string {
  return content
    .flatMap((block) => {
      if (block.type === "list") {
        return block.items.map(richTextToPlain);
      }

      if (block.type === "code") {
        return [block.code];
      }

      if (block.type === "image") {
        return [block.alt];
      }

      return [richTextToPlain(block.text)];
    })
    .join(" ");
}

export function readingTime(content: readonly ArticleBlock[]): string {
  const wordCount = textFromContent(content)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return `${Math.max(1, Math.ceil(wordCount / 220))} min read`;
}

/**
 * Returns null rather than throwing: the preview renders while the author is
 * still typing, so a half-entered date is an ordinary state there. The sync
 * script turns null into a build error itself.
 */
export function formatPublishedAt(value: string): string | null {
  const date = new Date(value);

  if (Number.isNaN(date.valueOf())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
