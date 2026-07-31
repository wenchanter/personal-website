export default function BlogHero() {
  return (
    <section
      className="relative mx-auto flex min-h-[clamp(21rem,40svh,25rem)] w-full max-w-6xl items-start px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
      aria-labelledby="blog-heading"
    >
      <div className="max-w-3xl">
        <p className="font-mono text-xs font-semibold tracking-[0.28em] text-brand uppercase sm:text-sm">
          Writing <span aria-hidden="true">·</span> 技术博客
        </p>

        <h1
          className="mt-7 text-[clamp(4.25rem,9vw,8rem)] leading-[0.82] font-black tracking-[-0.075em] text-zinc-950 dark:text-zinc-50"
          id="blog-heading"
        >
          Writing.
        </h1>

        <p className="mt-9 max-w-2xl text-lg leading-8 text-pretty text-zinc-500 sm:text-xl sm:leading-9 dark:text-zinc-400">
          Thoughts on distributed systems, architecture patterns, and the craft
          of engineering at scale.
        </p>
      </div>
    </section>
  );
}
