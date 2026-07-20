import { profile } from "@/app/data/profile";

export default function ExperienceStrip() {
  return (
    <section
      className="relative z-10 border-y border-zinc-950/7 bg-stone-100/75 dark:border-white/8 dark:bg-zinc-900/55"
      id="experience"
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[12rem_1fr] md:items-center md:gap-10 lg:px-8">
        <h2
          className="text-sm font-semibold tracking-tight text-zinc-600 dark:text-zinc-300"
          id="experience-heading"
        >
          Experience across
        </h2>
        <ul className="grid grid-cols-2 gap-x-5 gap-y-4 font-mono text-sm font-semibold tracking-tight text-zinc-500 sm:grid-cols-3 lg:grid-cols-5 dark:text-zinc-400">
          {profile.companies.map((company) => (
            <li
              className="border-l-2 border-brand/45 pl-3 transition-colors duration-200 hover:text-zinc-950 dark:hover:text-zinc-100"
              key={company.name}
            >
              {company.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
