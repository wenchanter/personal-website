import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="grid min-h-[calc(100dvh-4.5rem)] place-items-center bg-stone-50 px-4 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100"
      id="main-content"
    >
      <section className="w-full max-w-2xl border-2 border-dashed border-brand px-6 py-14 text-center sm:px-12 sm:py-20">
        <p className="font-mono text-sm font-semibold tracking-[0.16em] text-brand uppercase">
          Page not found
        </p>
        <h1 className="mt-5 text-5xl font-extrabold tracking-[-0.055em] sm:text-7xl">
          This route is not on the canvas.
        </h1>
        <p className="mx-auto mt-6 max-w-[45ch] text-base leading-7 text-zinc-600 dark:text-zinc-400">
          The page may have moved, or the address may be incomplete.
        </p>
        <Link
          className="mt-9 inline-flex h-12 items-center justify-center rounded-md bg-zinc-900 px-6 font-semibold text-stone-50 transition duration-200 hover:-translate-y-0.5 hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand active:translate-y-px motion-reduce:transform-none motion-reduce:transition-none dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-brand dark:hover:text-white"
          href="/"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}
