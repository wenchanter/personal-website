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

export type ArticleBlock =
  | { type: "lead"; text: string }
  | { type: "heading"; id: string; text: string; level?: 2 | 3 }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: readonly string[]; ordered?: boolean }
  | { type: "quote"; text: string; cite?: string }
  | { type: "code"; language: string; code: string };

export type BlogPost = BlogPostSummary & {
  content: readonly ArticleBlock[];
};
