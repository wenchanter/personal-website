import Link from "next/link";

import AnimatedProfileHeading from "@/app/components/home/AnimatedProfileHeading";
import ProfileSignals from "@/app/components/home/ProfileSignals";
import { profile } from "@/app/data/profile";

const handlePositions = [
  "-top-2 -left-2",
  "-top-2 left-1/2 -translate-x-1/2",
  "-top-2 -right-2",
  "top-1/2 -left-2 -translate-y-1/2",
  "top-1/2 -right-2 -translate-y-1/2",
  "-bottom-2 -left-2",
  "-bottom-2 left-1/2 -translate-x-1/2",
  "-bottom-2 -right-2 ",
] as const;

function SelectionHandles() {
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden="true">
      {handlePositions.map((position) => (
        <i
          className={`absolute size-3.5 border-[3px] border-brand bg-stone-50 dark:bg-zinc-950 ${position}`}
          key={position}
        />
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section
      className="relative z-10 mx-auto flex min-h-[calc(100dvh-4.5rem)] w-full max-w-6xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-8 lg:py-12"
      id="home"
      aria-labelledby="hero-heading"
    >
      <ProfileSignals signals={profile.signals} />

      <div className="relative flex w-full max-w-4xl flex-col items-center justify-center border-2 border-dashed border-brand px-5 py-10 sm:min-h-64 sm:px-10 sm:py-12">
        <SelectionHandles />
        <AnimatedProfileHeading name={profile.name} roles={profile.roles} />
      </div>

      <div className="hero-details-reveal flex w-full flex-col items-center">
        <p className="mt-8 max-w-[58ch] text-base leading-7 text-pretty text-zinc-600 sm:mt-9 sm:text-lg dark:text-zinc-400">
          {profile.summary}
        </p>

        <div className="mt-8 grid w-full max-w-lg grid-cols-1 gap-3 sm:mt-9 sm:grid-cols-2">
          <Link
            className="inline-flex h-13 items-center justify-center rounded-md bg-zinc-900 px-6 text-base font-semibold whitespace-nowrap text-stone-50 transition duration-200 hover:-translate-y-0.5 hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand active:translate-y-px motion-reduce:transform-none motion-reduce:transition-none dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-brand dark:hover:text-white"
            href="/#writing"
          >
            Read blog
          </Link>
          <Link
            className="inline-flex h-13 items-center justify-center rounded-md border border-zinc-300 bg-stone-50/80 px-6 text-base font-semibold whitespace-nowrap text-zinc-700 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-500 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand active:translate-y-px motion-reduce:transform-none motion-reduce:transition-none dark:border-zinc-700 dark:bg-zinc-950/70 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
            href="/#skills"
          >
            View skills
          </Link>
        </div>
      </div>
    </section>
  );
}
