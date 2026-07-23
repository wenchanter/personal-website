import type { Metadata } from "next";
import Link from "next/link";

import SiteHeader from "@/app/components/layout/SiteHeader";
import SmoothScroll from "@/app/components/layout/SmoothScroll";

import "./globals.css";

const initialScrollGuard = `
(() => {
  const hash = window.location.hash;
  const isHeroEntry =
    hash === "" || hash === "#home" || hash === "#main-content";

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = isHeroEntry ? "manual" : "auto";
  }

  if (!isHeroEntry) {
    return;
  }

  const resetToHero = () => {
    document.documentElement.scrollTop = 0;

    if (document.body) {
      document.body.scrollTop = 0;
    }

    window.scrollTo(0, 0);
  };

  resetToHero();
  window.addEventListener("pageshow", resetToHero, { once: true });
})();
`;

export const metadata: Metadata = {
  title: "Zhang Wei - Software Architect",
  description:
    "Senior software architect specialising in distributed systems, DDD, and high-concurrency design.",
  openGraph: {
    title: "Zhang Wei - Software Architect",
    description:
      "Senior software architect specialising in distributed systems, DDD, and high-concurrency design.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Zhang Wei - Software Architect",
    description:
      "Senior software architect specialising in distributed systems, DDD, and high-concurrency design.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script dangerouslySetInnerHTML={{ __html: initialScrollGuard }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Link
          className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0 dark:bg-zinc-100 dark:text-zinc-950"
          href="#main-content"
        >
          Skip to content
        </Link>
        <SiteHeader />
        <SmoothScroll>{children}</SmoothScroll>
        <div className="orb-burst" data-orb-burst aria-hidden="true" />
        <div
          className="orb-flash-stage bg-white"
          data-orb-flash-stage
          aria-hidden="true"
        />
      </body>
    </html>
  );
}
