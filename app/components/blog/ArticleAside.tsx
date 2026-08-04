"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import type { BlogPostSummary } from "@/app/blog/types";

export type ArticleHeading = {
  id: string;
  text: string;
  level: number;
};

// Distance below the fixed header where a heading counts as "current".
const ACTIVE_OFFSET = 140;

function useActiveHeading(headings: readonly ArticleHeading[]) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    let frame: number | null = null;

    const sync = () => {
      frame = null;

      // Sections near the page end never reach the offset line, so pin the last
      // heading once the document bottom is in view.
      const atDocumentEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (atDocumentEnd) {
        setActiveId(headings[headings.length - 1].id);

        return;
      }

      const current = headings.reduce((found: string, heading) => {
        const element = document.getElementById(heading.id);

        if (!element) {
          return found;
        }

        return element.getBoundingClientRect().top <= ACTIVE_OFFSET
          ? heading.id
          : found;
      }, headings[0].id);

      setActiveId(current);
    };

    const queueSync = () => {
      if (frame === null) {
        frame = window.requestAnimationFrame(sync);
      }
    };

    sync();
    window.addEventListener("scroll", queueSync, { passive: true });
    window.addEventListener("resize", queueSync);

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", queueSync);
      window.removeEventListener("resize", queueSync);
    };
  }, [headings]);

  return activeId;
}

type ArticleAsideProps = {
  headings: readonly ArticleHeading[];
  related: readonly BlogPostSummary[];
};

export default function ArticleAside({
  headings,
  related,
}: ArticleAsideProps) {
  const activeId = useActiveHeading(headings);

  return (
    <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
      {headings.length > 0 ? (
        <nav aria-labelledby="article-contents-heading">
          <p
            className="font-mono text-[0.65rem] font-semibold tracking-[0.2em] text-zinc-400 uppercase dark:text-zinc-500"
            id="article-contents-heading"
          >
            Contents
          </p>

          <ul className="mt-4 space-y-0.5">
            {headings.map((heading) => {
              const isActive = heading.id === activeId;

              return (
                <li key={heading.id}>
                  <Link
                    className={`block border-l-2 py-1.5 text-sm leading-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${
                      heading.level > 2 ? "pl-7 text-[0.8125rem]" : "pl-4"
                    } ${
                      isActive
                        ? "border-brand font-semibold text-brand"
                        : "border-zinc-950/10 text-zinc-400 hover:text-zinc-700 dark:border-white/10 dark:text-zinc-500 dark:hover:text-zinc-300"
                    }`}
                    href={`#${heading.id}`}
                    aria-current={isActive ? "location" : undefined}
                  >
                    {heading.text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}

      {related.length > 0 ? (
        <nav className="mt-12" aria-labelledby="article-related-heading">
          <p
            className="font-mono text-[0.65rem] font-semibold tracking-[0.2em] text-zinc-400 uppercase dark:text-zinc-500"
            id="article-related-heading"
          >
            Related
          </p>

          <ul className="mt-4 space-y-5">
            {related.map((post) => (
              <li key={post.slug}>
                <p className="font-mono text-xs font-medium text-brand">
                  {post.category}
                </p>
                <Link
                  className="mt-1 block text-sm leading-6 text-zinc-600 transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand dark:text-zinc-400"
                  href={`/blog/${post.slug}/`}
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </aside>
  );
}
