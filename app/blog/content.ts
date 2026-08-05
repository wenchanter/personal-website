import generatedPosts from "@/app/generated/blog-data.json";

import { richTextToPlain } from "@/app/blog/types";
import type {
  ArticleBlock,
  BlogPost,
  BlogPostSummary,
} from "@/app/blog/types";

export type { ArticleBlock, BlogPost, BlogPostSummary };

export const blogAuthor = {
  name: "Harrison Wang",
  initial: "H",
  role: "Senior Software Engineer | Architect",
} as const;

export const blogPosts = generatedPosts as readonly BlogPost[];

export const blogFilters: readonly string[] = [
  "All",
  ...Array.from(new Set(blogPosts.flatMap((post) => post.tags))),
];

function toSummary(post: BlogPost): BlogPostSummary {
  return {
    slug: post.slug,
    category: post.category,
    eyebrow: post.eyebrow,
    title: post.title,
    description: post.description,
    publishedAt: post.publishedAt,
    readingTime: post.readingTime,
    tags: post.tags,
    featured: post.featured,
  };
}

export const blogPostSummaries: readonly BlogPostSummary[] =
  blogPosts.map(toSummary);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

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

export function getRelatedPosts(slug: string, limit = 3): BlogPostSummary[] {
  const post = getPostBySlug(slug);

  if (!post) {
    return [];
  }

  return blogPosts
    .filter((candidate) => candidate.slug !== slug)
    .map((candidate) => ({
      candidate,
      shared: candidate.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map(({ candidate }) => toSummary(candidate));
}

export function getAdjacentPosts(slug: string): {
  previous: BlogPostSummary | null;
  next: BlogPostSummary | null;
} {
  const index = blogPosts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: blogPosts[index - 1]
      ? toSummary(blogPosts[index - 1])
      : null,
    next: blogPosts[index + 1] ? toSummary(blogPosts[index + 1]) : null,
  };
}
