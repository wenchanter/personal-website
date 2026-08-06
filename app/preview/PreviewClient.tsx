"use client";

import { useEffect, useState } from "react";

import ArticleAside from "@/app/components/blog/ArticleAside";
import ArticleBody from "@/app/components/blog/ArticleBody";
import ArticleFooter from "@/app/components/blog/ArticleFooter";
import ArticleHero from "@/app/components/blog/ArticleHero";
import { formatPublishedAt, getHeadings, readingTime } from "@/app/blog/derive";
import {
  PREVIEW_CHANNEL,
  PREVIEW_VERSION,
  isPreviewMessage,
  parseOrigins,
  type PreviewPost,
  type PreviewReadyMessage,
} from "@/app/blog/preview-protocol";
import type { BlogPostSummary } from "@/app/blog/types";

/**
 * The layout below is deliberately a copy of `app/blog/[slug]/page.tsx`'s
 * markup — same wrappers, same components, same order — so what the author
 * sees is what the build produces. If that page's chrome changes, change it
 * here too; the golden test in the CMS covers `ArticleBody`, which is where
 * the content actually lives.
 *
 * `SiteFooter` is the one omission — it is site-wide navigation the editor has
 * no data for. Everything that depends on the post being written is real.
 */

const ALLOWED_ORIGINS = parseOrigins(process.env.NEXT_PUBLIC_CMS_ORIGIN);

function toSummary(post: PreviewPost): BlogPostSummary {
  return {
    slug: "preview",
    category: post.category || "Uncategorised",
    eyebrow: post.eyebrow,
    title: post.title || "Untitled",
    description: post.description,
    // An unparseable date is normal mid-edit; show the raw text rather than
    // an error, so the author can see what they typed.
    publishedAt: formatPublishedAt(post.publishedAt) ?? post.publishedAt,
    readingTime: readingTime(post.content),
    tags: post.tags,
    featured: post.featured,
  };
}

export default function PreviewClient() {
  const [post, setPost] = useState<PreviewPost | null>(null);

  useEffect(() => {
    if (ALLOWED_ORIGINS.length === 0) {
      return;
    }

    function onMessage(event: MessageEvent) {
      // Origin first: postMessage is reachable by anything embedding this page.
      if (!ALLOWED_ORIGINS.includes(event.origin)) {
        return;
      }

      if (!isPreviewMessage(event.data) || event.data.type !== "render") {
        return;
      }

      setPost(event.data.post);
    }

    window.addEventListener("message", onMessage);

    const ready: PreviewReadyMessage = {
      channel: PREVIEW_CHANNEL,
      version: PREVIEW_VERSION,
      type: "ready",
    };

    // Announced to each configured origin rather than "*". The message carries
    // nothing, but a narrow target keeps the habit intact.
    for (const origin of ALLOWED_ORIGINS) {
      window.parent.postMessage(ready, origin);
    }

    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (ALLOWED_ORIGINS.length === 0) {
    return (
      <main className="flex min-h-[60dvh] items-center justify-center px-6 text-center">
        <p className="max-w-md font-mono text-sm text-zinc-500">
          Preview is not configured. Set NEXT_PUBLIC_CMS_ORIGIN to the CMS
          origin and rebuild.
        </p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="flex min-h-[60dvh] items-center justify-center px-6 text-center">
        <p className="font-mono text-sm text-zinc-400">Waiting for content…</p>
      </main>
    );
  }

  const summary = toSummary(post);
  const headings = getHeadings(post.content);

  return (
    <main
      className="relative min-h-[100dvh] bg-stone-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100"
      id="main-content"
      /*
       * Links are live markup, but following one would replace the preview with
       * a real page and strand the author. In-page anchors still work so the
       * table of contents stays usable.
       */
      onClick={(event) => {
        const anchor = (event.target as HTMLElement).closest("a");

        if (anchor && !anchor.getAttribute("href")?.startsWith("#")) {
          event.preventDefault();
        }
      }}
    >
      <div className="relative isolate overflow-hidden bg-[linear-gradient(rgba(24,24,27,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(24,24,27,0.055)_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4.5rem_4.5rem] dark:bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)]">
        <ArticleHero post={summary} />
      </div>

      <div className="relative mx-auto w-full max-w-[66.5rem] px-4 pt-12 pb-20 sm:px-6 sm:pt-14 sm:pb-24 lg:px-8 lg:pb-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14">
          <article className="min-w-0 max-w-[44rem]">
            <ArticleBody content={post.content} />
            <ArticleFooter post={summary} />
          </article>

          <ArticleAside headings={headings} related={[]} />
        </div>
      </div>
    </main>
  );
}
