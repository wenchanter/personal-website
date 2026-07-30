import Image from "next/image";
import Link from "next/link";

import AnimatedHeaderShell from "@/app/components/layout/AnimatedHeaderShell";
import BlogComingSoonButton from "@/app/components/ui/BlogComingSoonButton";

const navigation = [
  { label: "Home", href: "/#home", mobileHidden: true },
  { label: "Blog", href: "/#writing" },
] as const;

const navLinkClass =
  "inline-flex h-9 items-center justify-center px-2 text-xs font-medium text-zinc-500 transition-colors duration-200 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand active:translate-y-px dark:text-zinc-400 dark:hover:text-zinc-100 sm:h-11 sm:px-4 sm:text-sm";

export default function SiteHeader() {
  return (
    <AnimatedHeaderShell>
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-2 px-3 sm:px-6 lg:px-9">
        <Link
          className="inline-flex min-w-0 shrink items-center gap-1.5 text-base font-extrabold tracking-[-0.045em] text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand dark:text-zinc-100 sm:gap-2 sm:text-2xl"
          href="/#home"
          aria-label="Harrison dot tech, home"
        >
          <Image
            className="size-8 shrink-0 object-contain sm:size-10"
            src="/icons/hw-monogram.png"
            alt=""
            width={256}
            height={256}
          />
          <span className="whitespace-nowrap">
            harrison.<span className="text-brand">tech</span>
          </span>
        </Link>

        <nav
          className="flex shrink-0 items-center gap-0 sm:gap-0.5"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            item.label === "Blog" ? (
              <BlogComingSoonButton
                className={navLinkClass}
                key={item.href}
              >
                {item.label}
              </BlogComingSoonButton>
            ) : (
              <Link
                className={`${navLinkClass} ${item.mobileHidden ? "max-[359px]:hidden" : ""}`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            )
          ))}
          <Link
            className="ml-0.5 inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-3 text-xs font-semibold whitespace-nowrap text-stone-50 transition duration-200 hover:-translate-y-0.5 hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand active:translate-y-px dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-brand dark:hover:text-white sm:ml-2 sm:h-11 sm:px-5 sm:text-sm"
            href="/#contact"
          >
            Contact
          </Link>
        </nav>
      </div>
    </AnimatedHeaderShell>
  );
}
