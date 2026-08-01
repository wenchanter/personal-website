import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArticleAside from "@/app/components/blog/ArticleAside";
import ArticleBody from "@/app/components/blog/ArticleBody";
import ArticleFooter from "@/app/components/blog/ArticleFooter";
import ArticleHero from "@/app/components/blog/ArticleHero";
import SiteFooter from "@/app/components/layout/SiteFooter";
import {
  blogPosts,
  getHeadings,
  getPostBySlug,
  getRelatedPosts,
} from "@/app/data/blog";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const title = `${post.title} — Harrison Wang`;

  return {
    title,
    description: post.description,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `/blog/${post.slug}/`,
    },
    openGraph: {
      title,
      description: post.description,
      url: `/blog/${post.slug}/`,
      type: "article",
    },
  };
}

export default async function BlogArticlePage(
  props: PageProps<"/blog/[slug]">,
) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const headings = getHeadings(post.content);
  const related = getRelatedPosts(post.slug);

  return (
    <>
      <main
        className="relative min-h-[100dvh] bg-stone-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100"
        id="main-content"
      >
        <div className="relative isolate overflow-hidden bg-[linear-gradient(rgba(24,24,27,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(24,24,27,0.055)_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4.5rem_4.5rem] dark:bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)]">
          <ArticleHero post={post} />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 pt-12 pb-20 sm:px-6 sm:pt-14 sm:pb-24 lg:px-8 lg:pb-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14 xl:gap-20">
            <article className="max-w-3xl">
              <ArticleBody content={post.content} />
              <ArticleFooter post={post} />
            </article>

            <ArticleAside headings={headings} related={related} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
