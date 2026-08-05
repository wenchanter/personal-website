import Link from "next/link";

import type { BlogPostSummary } from "@/app/blog/types";

function ArrowRight() {
  return (
    <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 10h12m0 0-5-5m5 5-5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default function ArticleFooter({ post }: { post: BlogPostSummary }) {
  return (
    <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-950/8 pt-6 font-mono text-xs font-semibold tracking-[0.16em] uppercase dark:border-white/10">
      <p className="text-zinc-400 dark:text-zinc-500">
        End of article <span aria-hidden="true">·</span> {post.readingTime}
      </p>

      <Link
        className="inline-flex items-center gap-2 text-brand transition-transform duration-200 hover:translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand motion-reduce:transform-none"
        href="/blog/"
      >
        More posts
        <ArrowRight />
      </Link>
    </div>
  );
}
