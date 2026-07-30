import ContactBallPit from "@/app/components/home/ContactBallPit";
import { profile } from "@/app/data/profile";

export default function Contact() {
  return (
    <section
      className="relative z-10 bg-stone-50 dark:bg-zinc-950 lg:min-h-[calc(100dvh-12rem)]"
      id="contact"
      aria-labelledby="contact-heading"
    >
      <div className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:min-h-[calc(100dvh-12rem)] lg:px-8 lg:pt-16 lg:pb-6">
        <ContactBallPit />

        <div className="relative z-10 mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-12 xl:gap-16">
          <header>
            <p className="font-mono text-xs font-semibold tracking-[0.24em] text-brand uppercase sm:text-sm">
              Contact · Get in touch
            </p>
            <h2
              className="mt-8 max-w-[12ch] text-[clamp(2.5rem,3.35vw,3.5rem)] leading-[1.06] font-extrabold tracking-[-0.05em] text-zinc-950 sm:mt-9 dark:text-zinc-100"
              id="contact-heading"
            >
              Turning Complexity into{" "}
              <span className="relative isolate inline-block">
                Scalable
                <span
                  className="absolute right-0 bottom-[0.04em] left-0 -z-10 h-[0.18em] bg-emerald-200/90 dark:bg-emerald-500/35"
                  aria-hidden="true"
                />
              </span>{" "}
              Software Solutions
            </h2>

            <a
              className="mt-10 inline-flex min-h-14 items-center gap-4 rounded-full bg-[#0a66c2] px-6 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(10,102,194,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#004182] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a66c2] motion-reduce:transform-none motion-reduce:transition-none"
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <span
                className="flex size-6 items-center justify-center rounded-[0.2rem] border border-current text-[0.68rem] leading-none font-bold"
                aria-hidden="true"
              >
                in
              </span>
              <span>LinkedIn</span>
              <span className="text-base opacity-60" aria-hidden="true">
                ↗
              </span>
            </a>
          </header>

          <div className="text-base leading-[1.65] text-pretty text-zinc-700 sm:text-lg lg:text-[1.08rem] dark:text-zinc-300">
            <div className="space-y-6 lg:space-y-7">
              <p>
                I&apos;m a software engineer with 15+ years of experience
                turning complex business requirements into scalable,
                extensible systems. My career has centred on high-throughput
                backend platforms serving massive user bases.
              </p>
              <p>
                At Alibaba, I supported three Double 11 shopping festivals,
                helping design reliable systems that processed hundreds of
                thousands of orders per second during extreme traffic peaks.
              </p>
              <p>
                Building systems with both heavy traffic and complex business
                logic taught me that architecture has no silver bullets. I use
                Domain-Driven Design to model difficult domains, then make
                deliberate trade-offs for each context.
              </p>
              <p>
                I&apos;m now expanding into full-stack development with
                Next.js. This site was built through vibe coding, reflecting my
                belief that developers who use AI well can learn faster and
                create more value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
