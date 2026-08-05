export type BlogPostSummary = {
  slug: string;
  category: string;
  eyebrow: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
  tags: readonly string[];
  featured?: boolean;
};

/**
 * A run of text with optional marks. The CMS compiles Markdown into this
 * shape; keep it in sync with `lib/blocks.ts` in the blog-cms repo.
 *
 * One node type carrying a `marks` array (rather than nested nodes) keeps
 * rendering a flat map while still expressing combinations such as a bolded
 * link.
 */
export type InlineMark = "strong" | "em" | "code" | "underline" | "strike";

export type InlineNode = {
  type: "text";
  text: string;
  marks?: readonly InlineMark[];
  /** Present when the run is a link. */
  href?: string;
};

/** Plain strings remain valid, so hand-written posts keep working unchanged. */
export type RichText = string | readonly InlineNode[];

export type ArticleBlock =
  | { type: "lead"; text: RichText }
  | { type: "heading"; id: string; text: RichText; level?: 2 | 3 }
  | { type: "paragraph"; text: RichText }
  | { type: "list"; items: readonly RichText[]; ordered?: boolean }
  | { type: "quote"; text: RichText; cite?: string }
  | { type: "code"; language: string; code: string }
  /**
   * `width`/`height` are the image's intrinsic pixel size, sent by the CMS so
   * the page can reserve space and avoid layout shift.
   */
  | {
      type: "image";
      src: string;
      alt: string;
      width?: number;
      height?: number;
    };

export type BlogPost = BlogPostSummary & {
  content: readonly ArticleBlock[];
};

/** Flattens rich text to a plain string (headings, search, excerpts). */
export function richTextToPlain(value: RichText): string {
  return typeof value === "string"
    ? value
    : value.map((node) => node.text).join("");
}
