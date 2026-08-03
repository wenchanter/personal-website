import type { CSSProperties } from "react";

const codeLines = [
  [
    { text: "// ", tone: "comment" },
    { text: "every answer widens the surface", tone: "comment" },
  ],
  [{ text: "// that touches the unknown.", tone: "comment" }],
  [
    { text: "func ", tone: "keyword" },
    { text: "(m *", tone: "plain" },
    { text: "Mind", tone: "type" },
    { text: ") ", tone: "plain" },
    { text: "Learn", tone: "fn" },
    { text: "(f ", tone: "plain" },
    { text: "Fact", tone: "type" },
    { text: ") {", tone: "plain" },
  ],
  [
    { text: "  m.known", tone: "plain" },
    { text: "++", tone: "keyword" },
  ],
  [
    { text: "  m.unknown ", tone: "plain" },
    { text: "+= ", tone: "keyword" },
    { text: "f.", tone: "plain" },
    { text: "Questions", tone: "fn" },
    { text: "()", tone: "plain" },
  ],
  [{ text: "}", tone: "plain" }],
  [],
  [
    { text: "func ", tone: "keyword" },
    { text: "(m *", tone: "plain" },
    { text: "Mind", tone: "type" },
    { text: ") ", tone: "plain" },
    { text: "Wise", tone: "fn" },
    { text: "() ", tone: "plain" },
    { text: "bool", tone: "type" },
    { text: " {", tone: "plain" },
  ],
  [
    { text: "  return ", tone: "keyword" },
    { text: "m.known < m.unknown ", tone: "plain" },
    { text: "// always", tone: "comment" },
  ],
  [{ text: "}", tone: "plain" }],
] as const;

const toneClass = {
  comment: "text-zinc-400 dark:text-zinc-600",
  keyword: "text-brand",
  type: "text-amber-600 dark:text-amber-400",
  fn: "text-zinc-950 dark:text-zinc-100",
  plain: "text-zinc-500 dark:text-zinc-400",
} as const;

export default function BlogHero() {
  return (
    <section
      className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
      aria-labelledby="blog-heading"
    >
      <div className="grid min-h-[clamp(18rem,34svh,22rem)] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
        <div className="max-w-2xl">
          <p
            className="blog-hero-rise font-mono text-xs font-semibold tracking-[0.28em] text-brand uppercase sm:text-sm"
            style={{ "--blog-hero-delay": "80ms" } as CSSProperties}
          >
            Blog <span aria-hidden="true">·</span> Thinking
          </p>

          <blockquote className="relative mt-8">
            <span
              className="blog-hero-quote pointer-events-none absolute -top-[0.42em] -left-[0.1em] font-serif text-[clamp(9rem,17vw,13rem)] leading-none text-brand/15 select-none dark:text-brand/20"
              aria-hidden="true"
            >
              &ldquo;
            </span>

            <h1
              className="blog-hero-rise relative text-[clamp(2.5rem,5.6vw,4rem)] leading-[1.04] font-black tracking-[-0.055em] text-balance text-zinc-950 dark:text-zinc-50"
              style={{ "--blog-hero-delay": "240ms" } as CSSProperties}
              id="blog-heading"
            >
              <span className="text-brand">All</span> I know is that I know{" "}
              <span className="text-brand">nothing.</span>
            </h1>

            <footer className="mt-7 flex items-center gap-4">
              <span
                className="blog-hero-rule h-0.5 w-12 bg-brand sm:w-16"
                style={{ "--blog-hero-delay": "620ms" } as CSSProperties}
                aria-hidden="true"
              />
              <cite
                className="blog-hero-rise font-mono text-xs font-semibold tracking-[0.28em] text-zinc-400 uppercase not-italic sm:text-sm dark:text-zinc-500"
                style={{ "--blog-hero-delay": "740ms" } as CSSProperties}
              >
                Socrates
              </cite>
            </footer>
          </blockquote>
        </div>

        <div
          className="blog-hero-rise w-full overflow-hidden rounded-lg border border-zinc-950/10 bg-white/55 backdrop-blur-[2px] transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(24,24,27,0.07)] lg:w-[24rem] dark:border-white/10 dark:bg-zinc-950/55"
          style={{ "--blog-hero-delay": "460ms" } as CSSProperties}
          aria-hidden="true"
        >
          <div className="flex items-center justify-between gap-4 border-b border-zinc-950/8 px-5 py-3 dark:border-white/10">
            <span className="font-mono text-xs font-medium text-zinc-400 dark:text-zinc-500">
              mind.go
            </span>
            <span className="flex gap-1.5">
              <i className="size-2 rounded-full bg-brand/70" />
              <i className="size-2 rounded-full bg-amber-400/70" />
              <i className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </span>
          </div>

          <pre className="overflow-x-auto px-5 py-4 font-mono text-xs leading-6 sm:text-[0.8125rem]">
            <code>
              {codeLines.map((line, lineIndex) => (
                <span className="block min-h-6" key={lineIndex}>
                  {line.map((token, tokenIndex) => (
                    <span className={toneClass[token.tone]} key={tokenIndex}>
                      {token.text}
                    </span>
                  ))}
                </span>
              ))}
              <span className="blog-hero-caret ml-px inline-block h-[1.05em] w-[0.5em] translate-y-[0.18em] bg-brand/60" />
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
