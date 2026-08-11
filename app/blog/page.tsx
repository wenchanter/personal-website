import type { Metadata } from "next";

import BlogHero from "@/app/components/blog/BlogHero";
import BlogIndex from "@/app/components/blog/BlogIndex";
import SiteFooter from "@/app/components/layout/SiteFooter";
import { blogFilters, blogPostSummaries } from "@/app/blog/content";
import {
  BLOG_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
} from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Blog — Harrison Wang",
  description: BLOG_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  authors: [{ name: SITE_NAME }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/blog/",
  },
  openGraph: {
    title: "Blog — Harrison Wang",
    description: BLOG_DESCRIPTION,
    url: "/blog/",
    siteName: SITE_NAME,
    locale: "en_NZ",
    type: "website",
    images: [
      {
        url: "/icons/hw-monogram.png",
        width: 256,
        height: 256,
        alt: "Harrison Wang monogram",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Blog — Harrison Wang",
    description: BLOG_DESCRIPTION,
    images: ["/icons/hw-monogram.png"],
  },
};

export default function BlogPage() {
  return (
    <>
      <main
        className="relative min-h-[100dvh] overflow-hidden bg-stone-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100"
        id="main-content"
      >
        <div className="relative isolate overflow-hidden bg-[linear-gradient(rgba(24,24,27,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(24,24,27,0.055)_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4.5rem_4.5rem] dark:bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)]">
          <BlogHero />
        </div>
        <BlogIndex filters={blogFilters} posts={blogPostSummaries} />
      </main>
      <SiteFooter />
    </>
  );
}
