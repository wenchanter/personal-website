import type { Metadata } from "next";
import Link from "next/link";

import SiteHeader from "@/app/components/layout/SiteHeader";
import ScrollTriggerBoot from "@/app/components/layout/ScrollTriggerBoot";

import "./globals.css";

const initialAnchorStyles = `
@media (scripting: enabled) {
  html[data-anchor-boot] [data-page-shell],
  html[data-anchor-boot] [data-orb-burst],
  html[data-anchor-boot] [data-orb-flash-stage] {
    visibility: hidden !important;
  }
}

html[data-initial-anchor-entry] .hero-details-reveal {
  opacity: 1;
  transform: none;
  animation: none;
}

html[data-initial-anchor-entry] [data-skill-title-character],
html[data-initial-anchor-entry] [data-skill-summary] {
  visibility: visible;
  opacity: 1;
  filter: blur(0);
  transform: none;
}
`;

const initialScrollGuard = `
(() => {
  const hash = window.location.hash;
  const isHeroEntry =
    hash === "" || hash === "#home" || hash === "#main-content";

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = isHeroEntry ? "manual" : "auto";
  }

  if (!isHeroEntry) {
    document.documentElement.setAttribute("data-anchor-boot", "");
    document.documentElement.setAttribute("data-initial-anchor-entry", "");
    window.setTimeout(() => {
      document.documentElement.removeAttribute("data-anchor-boot");
    }, 6000);
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
  metadataBase: new URL("https://harrison.tech"),
  title: "Harrison Wang — Senior Software Engineer",
  description: "Senior Software Engineer | Architect | Continuous Learner",
  icons: {
    icon: "/icons/hw-monogram.png",
    shortcut: "/icons/hw-monogram.png",
    apple: "/icons/hw-monogram.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Harrison Wang — Senior Software Engineer",
    description: "Senior Software Engineer | Architect | Continuous Learner",
    url: "/",
    siteName: "Harrison Wang",
    type: "website",
    images: [
      {
        url: "https://harrisontech.pages.dev/icons/hw-monogram.png",
        width: 256,
        height: 256,
        alt: "Harrison Wang monogram",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Harrison Wang — Senior Software Engineer",
    description: "Senior Software Engineer | Architect | Continuous Learner",
    images: ["https://harrisontech.pages.dev/icons/hw-monogram.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <style>{initialAnchorStyles}</style>
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
        <ScrollTriggerBoot>{children}</ScrollTriggerBoot>
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
