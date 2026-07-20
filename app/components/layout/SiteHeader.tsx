import Link from "next/link";

import AnimatedHeaderShell from "@/app/components/layout/AnimatedHeaderShell";
import { profile } from "@/app/data/profile";

const navigation = [
  { label: "Home", href: "/#home" },
  { label: "Blog", href: "/#writing" },
] as const;

const navLinkClass =
  "inline-flex h-11 items-center justify-center px-3 text-sm font-medium text-zinc-500 transition-colors duration-200 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand active:translate-y-px dark:text-zinc-400 dark:hover:text-zinc-100 sm:px-4";

export default function SiteHeader() {
  return (
    <AnimatedHeaderShell>
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-9">
        <Link
          className="text-xl font-extrabold tracking-[-0.045em] text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand dark:text-zinc-100 sm:text-2xl"
          href="/#home"
          aria-label="Zhang dot arch, home"
        >
          zhang.<span className="text-brand">arch</span>
        </Link>

        <nav className="flex items-center gap-0.5" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link className={navLinkClass} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <a
            className="ml-1 inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-semibold whitespace-nowrap text-stone-50 transition duration-200 hover:-translate-y-0.5 hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand active:translate-y-px dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-brand dark:hover:text-white sm:ml-2 sm:px-5"
            href={`mailto:${profile.email}`}
          >
            Contact
          </a>
        </nav>
      </div>
    </AnimatedHeaderShell>
  );
}
