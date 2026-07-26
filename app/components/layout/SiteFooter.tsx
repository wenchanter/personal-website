import Image from "next/image";
import Link from "next/link";

import BlogComingSoonButton from "@/app/components/ui/BlogComingSoonButton";
import { profile } from "@/app/data/profile";

const footerNavigation = [
  { label: "Home", href: "/#home" },
  { label: "Blog", href: "/#writing" },
] as const;

const footerLinkClass =
  "w-fit text-sm text-zinc-500 transition-colors hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand dark:text-zinc-400 dark:hover:text-zinc-100";

function ExternalArrow() {
  return (
    <svg
      className="size-4"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5.25 3.25h7.5v7.5M12.5 3.5l-9 9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative z-10 overflow-hidden border-t border-zinc-950/8 bg-stone-50 px-4 py-6 sm:px-6 lg:px-8 lg:py-5 dark:border-white/10 dark:bg-zinc-950"
      id="footer"
    >
      <span
        className="absolute top-0"
        id="writing"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(24,24,27,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(24,24,27,0.035)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:linear-gradient(to_bottom,black,transparent_68%)] dark:bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-y-1.5 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-x-10 lg:gap-x-14">
          <Link
            className="order-1 inline-flex w-fit items-center gap-1.5 text-lg font-extrabold tracking-[-0.05em] text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:col-start-1 sm:row-start-1 dark:text-zinc-100"
            href="/#home"
            aria-label="Harrison dot arch, home"
          >
            <Image
              className="size-7 shrink-0 object-contain"
              src="/icons/hw-monogram.png"
              alt=""
              width={256}
              height={256}
            />
            <span>
              harrison.<span className="text-brand">arch</span>
            </span>
          </Link>

          <p
            className="order-3 mt-3 font-mono text-[0.65rem] font-semibold tracking-[0.2em] text-zinc-400 uppercase sm:col-start-2 sm:row-start-1 sm:mt-0 sm:self-center dark:text-zinc-500"
            id="footer-navigation-heading"
          >
            Navigation
          </p>

          <p className="order-5 mt-3 font-mono text-[0.65rem] font-semibold tracking-[0.2em] text-zinc-400 uppercase sm:col-start-3 sm:row-start-1 sm:mt-0 sm:self-center dark:text-zinc-500">
            Contact
          </p>

          <p className="order-2 text-sm leading-5 text-zinc-500 sm:col-start-1 sm:row-start-2 xl:whitespace-nowrap dark:text-zinc-400">
            High-concurrency and high-availability systems | Distributed systems
            | DDD practitioner | Scalable architecture and extensible systems.
          </p>

          <nav
            className="order-4 flex items-center gap-4 sm:col-start-2 sm:row-start-2"
            aria-labelledby="footer-navigation-heading"
          >
            {footerNavigation.map((item) => (
              item.label === "Blog" ? (
                <BlogComingSoonButton
                  className={footerLinkClass}
                  key={item.href}
                >
                  {item.label}
                </BlogComingSoonButton>
              ) : (
                <Link
                  className={footerLinkClass}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          <a
            className={`${footerLinkClass} order-6 inline-flex items-center gap-1.5 sm:col-start-3 sm:row-start-2`}
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
            <ExternalArrow />
          </a>
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-zinc-950/8 pt-3 font-mono text-[0.65rem] font-medium tracking-[0.05em] text-zinc-400 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:text-zinc-500">
          <p>
            © {currentYear}
            {" Harrison Wang"}
          </p>
          <p>Senior Software Engineer | Architect | Continuous Learner</p>
        </div>
      </div>
    </footer>
  );
}
