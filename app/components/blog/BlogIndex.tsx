"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import type { BlogPostSummary } from "@/app/blog/types";

function ArrowUpRight({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 17 17 7M8 7h9v9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
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

function FeaturedPost({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      className="group block rounded-lg transition duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand motion-reduce:transform-none motion-reduce:transition-none"
      href={`/blog/${post.slug}/`}
    >
      <article className="relative overflow-hidden rounded-lg border border-brand/35 bg-white/65 px-6 py-7 shadow-[inset_0_3px_0_0_var(--color-brand)] backdrop-blur-[2px] transition-shadow duration-300 group-hover:shadow-[inset_0_3px_0_0_var(--color-brand),0_18px_45px_rgba(24,24,27,0.07)] sm:px-9 sm:py-8 lg:px-10 dark:bg-zinc-950/65">
        <ArrowUpRight className="absolute top-6 right-6 size-7 text-brand transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none sm:top-7 sm:right-8" />

        <div className="flex flex-wrap items-center gap-3 pr-12 font-mono text-xs font-semibold tracking-[0.1em] sm:text-sm">
          <span className="rounded-sm bg-emerald-50 px-3 py-2 text-brand dark:bg-emerald-950/45">
            {post.category}
          </span>
          <span className="rounded-sm bg-amber-100 px-3 py-2 text-amber-600 dark:bg-amber-950/45 dark:text-amber-400">
            Featured
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-10">
          <div className="max-w-5xl">
            <p className="font-mono text-sm font-medium text-zinc-400 dark:text-zinc-500">
              {post.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl leading-tight font-extrabold tracking-[-0.04em] text-brand sm:text-4xl lg:text-[2.6rem]">
              {post.title}
            </h2>
            <p className="mt-4 max-w-5xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8 dark:text-zinc-400">
              {post.description}
            </p>
          </div>

          <div className="font-mono text-xs leading-6 font-medium text-zinc-400 lg:pt-0 lg:text-right dark:text-zinc-500">
            <p>{post.publishedAt}</p>
            <p>{post.readingTime}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}

function BlogCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className="group relative flex min-h-[22rem] flex-col rounded-lg border border-zinc-950/10 bg-white/55 p-5 backdrop-blur-[2px] transition duration-300 focus-within:border-brand/45 hover:-translate-y-1 hover:border-brand/45 hover:shadow-[0_18px_45px_rgba(24,24,27,0.07)] motion-reduce:transform-none motion-reduce:transition-none dark:border-white/10 dark:bg-zinc-950/55 dark:hover:border-brand/50">
      <div className="flex items-start justify-between gap-5">
        <span className="rounded-sm bg-emerald-50 px-3 py-2 font-mono text-xs font-semibold tracking-[0.1em] text-brand dark:bg-emerald-950/45">
          {post.category}
        </span>
        <ArrowUpRight className="size-5 text-zinc-300 transition-colors group-hover:text-brand dark:text-zinc-700" />
      </div>

      <p className="mt-5 font-mono text-xs font-medium text-zinc-400 dark:text-zinc-500">
        {post.eyebrow}
      </p>
      <h3 className="mt-3 text-2xl leading-tight font-bold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100">
        <Link
          className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          href={`/blog/${post.slug}/`}
        >
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-3 text-base leading-7 text-zinc-500 dark:text-zinc-400">
        {post.description}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-zinc-950/8 pt-5 font-mono text-xs font-medium text-zinc-400 dark:border-white/10 dark:text-zinc-500">
        <span className="inline-flex items-center gap-1.5">
          <CalendarIcon />
          {post.publishedAt}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ClockIcon />
          {post.readingTime}
        </span>
      </div>
    </article>
  );
}

type BlogIndexProps = {
  filters: readonly string[];
  posts: readonly BlogPostSummary[];
};

export default function BlogIndex({ filters, posts }: BlogIndexProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const featuredPost = posts.find((post) => post.featured) ?? posts[0];
  const filteredPosts = useMemo(
    () =>
      activeFilter === "All"
        ? posts
        : posts.filter((post) => post.tags.includes(activeFilter)),
    [activeFilter, posts],
  );

  return (
    <section
      className="relative mx-auto w-full max-w-6xl px-4 pt-10 pb-20 sm:px-6 sm:pt-12 sm:pb-24 lg:px-8 lg:pb-28"
      aria-label="Writing index"
    >
      {featuredPost ? <FeaturedPost post={featuredPost} /> : null}

      <div
        className="mt-9 flex gap-2 overflow-x-auto pb-2 sm:mt-10 sm:flex-wrap sm:overflow-visible"
        aria-label="Filter articles"
      >
        {filters.map((filter) => {
          const isActive = filter === activeFilter;

          return (
            <button
              className={`shrink-0 rounded-sm border px-4 py-2.5 font-mono text-xs font-semibold transition-colors sm:text-sm ${
                isActive
                  ? "border-brand bg-emerald-50/70 text-brand dark:bg-emerald-950/35"
                  : "border-zinc-950/10 bg-white/45 text-zinc-400 hover:border-brand/40 hover:text-brand dark:border-white/10 dark:bg-zinc-950/45 dark:text-zinc-500"
              }`}
              type="button"
              aria-pressed={isActive}
              key={filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <BlogCard post={post} key={post.slug} />
        ))}
      </div>
    </section>
  );
}
