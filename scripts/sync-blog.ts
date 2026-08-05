import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadEnvConfig } from "@next/env";

import { blogPosts as seedPosts } from "../app/data/blog";
// Reading time and the date format are shared with the live preview, so the
// figures an author sees while writing are the ones the build will emit.
import {
  formatPublishedAt as formatDate,
  readingTime,
} from "../app/blog/derive";
import type {
  ArticleBlock,
  BlogPost,
  InlineMark,
  InlineNode,
  RichText,
} from "../app/blog/types";

type UnknownRecord = Record<string, unknown>;

const outputPath = path.join(
  process.cwd(),
  "app",
  "generated",
  "blog-data.json",
);

loadEnvConfig(process.cwd());

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(
  value: unknown,
  field: string,
  postIndex: number,
): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`CMS post ${postIndex + 1} has an invalid ${field}`);
  }

  return value.trim();
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== ""
    ? value.trim()
    : undefined;
}

function namedValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    return optionalString(value);
  }

  if (!isRecord(value)) {
    return undefined;
  }

  return (
    optionalString(value.name) ??
    optionalString(value.label) ??
    optionalString(value.title) ??
    optionalString(value.slug)
  );
}

const INLINE_MARKS: readonly InlineMark[] = [
  "strong",
  "em",
  "code",
  "underline",
  "strike",
];

/**
 * Accepts either a plain string or the CMS's inline-node array. Anything else
 * is a hard error: a malformed block must fail the build rather than render as
 * "[object Object]" on the live site.
 */
function requiredRichText(
  value: unknown,
  field: string,
  postIndex: number,
): RichText {
  if (typeof value === "string") {
    return requiredString(value, field, postIndex);
  }

  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`CMS post ${postIndex + 1} has an invalid ${field}`);
  }

  const nodes = value.map((rawNode, nodeIndex): InlineNode => {
    if (!isRecord(rawNode)) {
      throw new Error(
        `CMS post ${postIndex + 1} ${field}[${nodeIndex}] is not an object`,
      );
    }

    if (rawNode.type !== "text" || typeof rawNode.text !== "string") {
      throw new Error(
        `CMS post ${postIndex + 1} ${field}[${nodeIndex}] is not a text node`,
      );
    }

    const node: InlineNode = { type: "text", text: rawNode.text };

    if (rawNode.marks !== undefined) {
      if (!Array.isArray(rawNode.marks)) {
        throw new Error(
          `CMS post ${postIndex + 1} ${field}[${nodeIndex}].marks must be an array`,
        );
      }

      const marks = rawNode.marks.map((mark) => {
        if (!INLINE_MARKS.includes(mark as InlineMark)) {
          throw new Error(
            `CMS post ${postIndex + 1} ${field}[${nodeIndex}] has unsupported mark "${String(mark)}"`,
          );
        }

        return mark as InlineMark;
      });

      if (marks.length > 0) {
        node.marks = marks;
      }
    }

    const href = optionalString(rawNode.href);
    if (href) {
      node.href = href;
    }

    return node;
  });

  if (nodes.every((node) => node.text.trim() === "")) {
    throw new Error(`CMS post ${postIndex + 1} has an empty ${field}`);
  }

  return nodes;
}

function plainText(value: RichText): string {
  return typeof value === "string"
    ? value
    : value.map((node) => node.text).join("");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseContent(value: unknown, postIndex: number): ArticleBlock[] {
  if (!Array.isArray(value)) {
    throw new Error(`CMS post ${postIndex + 1} content must be an array`);
  }

  return value.map((rawBlock, blockIndex) => {
    if (!isRecord(rawBlock)) {
      throw new Error(
        `CMS post ${postIndex + 1} block ${blockIndex + 1} is invalid`,
      );
    }

    const type = requiredString(
      rawBlock.type ?? rawBlock.blockType,
      `content[${blockIndex}].type`,
      postIndex,
    );

    switch (type) {
      case "lead":
      case "paragraph":
        return {
          type,
          text: requiredRichText(
            rawBlock.text,
            `content[${blockIndex}].text`,
            postIndex,
          ),
        };

      case "heading": {
        const text = requiredRichText(
          rawBlock.text,
          `content[${blockIndex}].text`,
          postIndex,
        );
        const requestedLevel = Number(rawBlock.level);

        return {
          type,
          id:
            optionalString(rawBlock.id) ??
            (slugify(plainText(text)) || `heading-${blockIndex + 1}`),
          text,
          level: requestedLevel === 3 ? 3 : 2,
        };
      }

      case "list":
        if (!Array.isArray(rawBlock.items)) {
          throw new Error(
            `CMS post ${postIndex + 1} content[${blockIndex}].items must be an array`,
          );
        }

        return {
          type,
          items: rawBlock.items.map((item, itemIndex) =>
            requiredRichText(
              isRecord(item) && !Array.isArray(item) && "text" in item
                ? item.text
                : item,
              `content[${blockIndex}].items[${itemIndex}]`,
              postIndex,
            ),
          ),
          ordered: rawBlock.ordered === true,
        };

      case "quote":
        return {
          type,
          text: requiredRichText(
            rawBlock.text,
            `content[${blockIndex}].text`,
            postIndex,
          ),
          cite: optionalString(rawBlock.cite),
        };

      case "code":
        return {
          type,
          language: optionalString(rawBlock.language) ?? "text",
          code: requiredString(
            rawBlock.code,
            `content[${blockIndex}].code`,
            postIndex,
          ),
        };

      case "image": {
        const dimension = (value: unknown): number | undefined => {
          const parsed = Number(value);
          return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
        };

        return {
          type,
          src: requiredString(
            rawBlock.src,
            `content[${blockIndex}].src`,
            postIndex,
          ),
          // Alt may legitimately be empty for a decorative image.
          alt: typeof rawBlock.alt === "string" ? rawBlock.alt : "",
          width: dimension(rawBlock.width),
          height: dimension(rawBlock.height),
        };
      }

      default:
        throw new Error(
          `CMS post ${postIndex + 1} uses unsupported block type "${type}"`,
        );
    }
  });
}

function formatPublishedAt(value: string, postIndex: number): string {
  const formatted = formatDate(value);

  if (formatted === null) {
    throw new Error(`CMS post ${postIndex + 1} has an invalid publishedAt`);
  }

  return formatted;
}

function normalisePost(rawPost: unknown, postIndex: number): BlogPost | null {
  if (!isRecord(rawPost)) {
    throw new Error(`CMS post ${postIndex + 1} is not an object`);
  }

  const status = optionalString(rawPost.status ?? rawPost._status);

  if (status && status !== "published") {
    return null;
  }

  const content = parseContent(rawPost.content ?? rawPost.blocks, postIndex);
  const rawTags = Array.isArray(rawPost.tags) ? rawPost.tags : [];
  const tags = rawTags
    .map(namedValue)
    .filter((tag): tag is string => Boolean(tag));
  const publishedAt = requiredString(
    rawPost.publishedAt ?? rawPost.date,
    "publishedAt",
    postIndex,
  );

  return {
    slug: requiredString(rawPost.slug, "slug", postIndex),
    category:
      namedValue(rawPost.category) ??
      tags[0] ??
      requiredString(rawPost.category, "category", postIndex),
    eyebrow: optionalString(rawPost.eyebrow) ?? "",
    title: requiredString(rawPost.title, "title", postIndex),
    description: requiredString(
      rawPost.description ?? rawPost.excerpt,
      "description",
      postIndex,
    ),
    publishedAt: formatPublishedAt(publishedAt, postIndex),
    readingTime:
      optionalString(rawPost.readingTime) ?? readingTime(content),
    tags,
    featured: rawPost.featured === true,
    content,
  };
}

function extractPage(payload: unknown): {
  posts: unknown[];
  hasNextPage: boolean;
  nextPage: number | null;
} {
  if (Array.isArray(payload)) {
    return { posts: payload, hasNextPage: false, nextPage: null };
  }

  if (!isRecord(payload)) {
    throw new Error("CMS response must be an array or object");
  }

  const nestedData = isRecord(payload.data) ? payload.data : null;
  const posts =
    (Array.isArray(payload.docs) && payload.docs) ||
    (Array.isArray(payload.items) && payload.items) ||
    (Array.isArray(payload.data) && payload.data) ||
    (nestedData && Array.isArray(nestedData.docs) && nestedData.docs) ||
    (nestedData && Array.isArray(nestedData.items) && nestedData.items);

  if (!posts) {
    throw new Error("CMS response does not contain docs, items, or data");
  }

  const pageSource = nestedData ?? payload;

  return {
    posts,
    hasNextPage: pageSource.hasNextPage === true,
    nextPage:
      typeof pageSource.nextPage === "number" ? pageSource.nextPage : null,
  };
}

async function fetchCmsPosts(endpoint: string): Promise<unknown[]> {
  const posts: unknown[] = [];
  let nextUrl: URL | null = new URL(endpoint);
  const token = process.env.CMS_API_TOKEN;

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!response.ok) {
      throw new Error(
        `CMS request failed with ${response.status} ${response.statusText}`,
      );
    }

    const page = extractPage(await response.json());
    posts.push(...page.posts);

    if (page.hasNextPage && page.nextPage !== null) {
      nextUrl.searchParams.set("page", String(page.nextPage));
    } else {
      nextUrl = null;
    }
  }

  return posts;
}

async function main() {
  const endpoint = process.env.CMS_API_URL;
  const sourcePosts = endpoint
    ? await fetchCmsPosts(endpoint)
    : [...seedPosts];
  const posts = sourcePosts
    .map(normalisePost)
    .filter((post): post is BlogPost => post !== null)
    .sort(
      (left, right) =>
        new Date(right.publishedAt).valueOf() -
        new Date(left.publishedAt).valueOf(),
    );

  if (posts.length === 0) {
    throw new Error("The CMS returned no published blog posts");
  }

  const slugs = new Set<string>();

  for (const post of posts) {
    if (slugs.has(post.slug)) {
      throw new Error(`The CMS returned duplicate slug "${post.slug}"`);
    }

    slugs.add(post.slug);
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");

  console.log(
    endpoint
      ? `Synced ${posts.length} published posts from CMS.`
      : `CMS_API_URL is not set; generated ${posts.length} local seed posts.`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
