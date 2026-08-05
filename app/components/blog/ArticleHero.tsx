import Link from "next/link";

import { blogAuthor } from "@/app/blog/content";
import type { BlogPostSummary } from "@/app/blog/types";

function BackArrow() {
  return (
    <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M16 10H4m0 0 5-5m-5 5 5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5.5 2.75v2.5m9-2.5v2.5M3.25 7.5h13.5m-12.5-3h11.5a1 1 0 0 1 1 1v10.25a1 1 0 0 1-1 1H4.25a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10 6.25v4l2.75 1.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

const MONTH_NUMBERS: Record<string, string> = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

// "Nov 15, 2024" -> "2024-11-15" for a machine-readable <time> value.
function toIsoDate(publishedAt: string) {
  const match = /^(\w{3}) (\d{1,2}), (\d{4})$/.exec(publishedAt);

  if (!match) {
    return undefined;
  }

  const [, month, day, year] = match;
  const monthNumber = MONTH_NUMBERS[month];

  return monthNumber
    ? `${year}-${monthNumber}-${day.padStart(2, "0")}`
    : undefined;
}

export default function ArticleHero({ post }: { post: BlogPostSummary }) {
  return (
    <header
      className="relative mx-auto w-full max-w-6xl px-4 pt-8 pb-12 sm:px-6 sm:pt-10 sm:pb-16 lg:px-8"
      aria-labelledby="article-heading"
    >
      <Link
        className="inline-flex items-center gap-2.5 font-mono text-xs font-medium text-zinc-400 transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:text-sm dark:text-zinc-500"
        href="/blog/"
      >
        <BackArrow />
        Back to Writing
      </Link>

      <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-xs font-semibold tracking-[0.1em] sm:text-sm">
        <span className="rounded-sm bg-emerald-50 px-3 py-2 text-brand dark:bg-emerald-950/45">
          {post.category}
        </span>
        {post.featured ? (
          <span className="rounded-sm bg-amber-100 px-3 py-2 text-amber-600 uppercase dark:bg-amber-950/45 dark:text-amber-400">
            Featured
          </span>
        ) : null}
      </div>

      <p className="mt-7 font-mono text-sm font-medium text-zinc-400 dark:text-zinc-500">
        {post.eyebrow}
      </p>

      <h1
        className="mt-4 max-w-4xl text-[clamp(2.5rem,6.4vw,4.5rem)] leading-[1.02] font-black tracking-[-0.055em] text-balance text-zinc-950 dark:text-zinc-50"
        id="article-heading"
      >
        {post.title}
      </h1>

      <p className="mt-8 max-w-3xl text-lg leading-8 text-pretty text-zinc-500 sm:text-xl sm:leading-9 dark:text-zinc-400">
        {post.description}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
        <span className="inline-flex items-center gap-3">
          <span
            className="inline-flex size-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white"
            aria-hidden="true"
          >
            {blogAuthor.initial}
          </span>
          <span className="text-base font-medium text-zinc-950 dark:text-zinc-100">
            {blogAuthor.name}
          </span>
        </span>

        <span
          className="hidden h-6 w-px bg-zinc-950/12 sm:block dark:bg-white/15"
          aria-hidden="true"
        />

        <span className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs font-medium text-zinc-400 sm:text-sm dark:text-zinc-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarIcon />
            <time dateTime={toIsoDate(post.publishedAt)}>
              {post.publishedAt}
            </time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon />
            {post.readingTime}
          </span>
        </span>
      </div>
    </header>
  );
}
