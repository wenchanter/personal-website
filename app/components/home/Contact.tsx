import { profile } from "@/app/data/profile";

const contactSkillGroups = [
  {
    label: "Java · Go · Python",
    className:
      "border-emerald-500/25 bg-emerald-500/[0.035] text-emerald-600 dark:border-emerald-400/25 dark:text-emerald-400",
  },
  {
    label: "Spring Cloud · Kubernetes",
    className:
      "border-blue-500/25 bg-blue-500/[0.035] text-blue-500 dark:border-blue-400/25 dark:text-blue-400",
  },
  {
    label: "Next.js · React",
    className:
      "border-violet-500/25 bg-violet-500/[0.035] text-violet-500 dark:border-violet-400/25 dark:text-violet-400",
  },
] as const;

export default function Contact() {
  return (
    <section
      className="relative z-10 bg-stone-50 px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-36 dark:bg-zinc-950"
      id="contact"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-20 xl:gap-24">
        <header>
          <p className="font-mono text-sm font-semibold tracking-[0.24em] text-brand uppercase sm:text-base">
            Contact · Get in touch
          </p>
          <h2
            className="mt-7 max-w-[14ch] text-[clamp(3rem,3.35vw,3.75rem)] leading-[1.02] font-extrabold tracking-[-0.055em] text-zinc-950 dark:text-zinc-100"
            id="contact-heading"
          >
            Architecting systems that{" "}
            <span className="relative isolate inline-block">
              outlast
              <span
                className="absolute right-0 bottom-[0.04em] left-0 -z-10 h-[0.18em] bg-emerald-200/90 dark:bg-emerald-500/35"
                aria-hidden="true"
              />
            </span>{" "}
            the teams that build them.
          </h2>
        </header>

        <div className="self-start lg:pt-1">
          <div className="space-y-7 text-lg leading-[1.65] text-pretty text-zinc-600 sm:text-xl lg:text-[1.35rem] dark:text-zinc-300">
            <p>
              I&apos;m a software architect with 15 years of experience
              designing large-scale distributed systems across demanding
              engineering environments — from ByteDance and Alibaba to NetEase,
              Yonyou, and NTT DATA.
            </p>
            <p>
              My core focus is the intersection of{" "}
              <strong className="font-bold text-zinc-950 dark:text-zinc-100">
                Domain-Driven Design
              </strong>
              ,{" "}
              <strong className="font-bold text-zinc-950 dark:text-zinc-100">
                high-concurrency architecture
              </strong>
              , and organisational effectiveness. Good architecture solves the
              right problem at the right abstraction level.
            </p>
            <p>
              These days I&apos;m expanding into full-stack development with
              Next.js and React, bringing a systems-design perspective to the
              frontend and building products that feel as clear as the systems
              behind them.
            </p>
          </div>

          <ul
            className="mt-10 flex flex-wrap gap-3"
            aria-label="Core technology groups"
          >
            {contactSkillGroups.map((group) => (
              <li
                className={`rounded-sm border px-4 py-3 font-mono text-sm font-semibold tracking-[0.025em] sm:px-5 sm:text-base ${group.className}`}
                key={group.label}
              >
                {group.label}
              </li>
            ))}
          </ul>

          <a
            className="group mt-10 inline-flex items-center gap-4 border-b border-zinc-950/20 pb-2 text-xl font-bold tracking-[-0.025em] text-zinc-950 transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:text-2xl dark:border-white/25 dark:text-zinc-100 dark:hover:border-brand dark:hover:text-brand"
            href={`mailto:${profile.email}`}
          >
            {profile.email}
            <span
              className="transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
