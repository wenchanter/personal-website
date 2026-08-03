import type { Metadata } from "next";

import BlogHero from "@/app/components/blog/BlogHero";
import BlogIndex from "@/app/components/blog/BlogIndex";
import SiteFooter from "@/app/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Blog — Harrison Wang",
  description:
    "Thoughts on distributed systems, architecture patterns, and engineering at scale.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/blog/",
  },
  openGraph: {
    title: "Blog — Harrison Wang",
    description:
      "Thoughts on distributed systems, architecture patterns, and engineering at scale.",
    url: "/blog/",
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
        <BlogIndex />
      </main>
      <SiteFooter />
    </>
  );
}
