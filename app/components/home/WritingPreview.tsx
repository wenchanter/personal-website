export default function WritingPreview() {
  return (
    <section
      className="relative z-10 bg-stone-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 dark:bg-zinc-950"
      id="writing"
      aria-labelledby="writing-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          className="max-w-2xl text-4xl font-bold tracking-[-0.045em] text-balance text-zinc-950 sm:text-5xl dark:text-zinc-100"
          id="writing-heading"
        >
          Notes on systems that need to last.
        </h2>
        <p className="mt-6 max-w-[58ch] text-base leading-7 text-pretty text-zinc-600 dark:text-zinc-400">
          Writing about distributed architecture, domain-driven design, and the
          practical shift from backend systems to full-stack product work.
        </p>
        <div className="mt-10 border-l-2 border-brand pl-5">
          <p className="font-mono text-sm font-medium text-zinc-500 dark:text-zinc-400">
            The first article is in progress.
          </p>
        </div>
      </div>
    </section>
  );
}
