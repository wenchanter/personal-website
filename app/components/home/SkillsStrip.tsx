import { profile } from "@/app/data/profile";

function SkillsList({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      aria-hidden={duplicate || undefined}
      className={`flex shrink-0 items-center ${duplicate ? "motion-reduce:hidden" : ""}`}
    >
      {profile.skills.map((skill) => (
        <li
          className="flex shrink-0 items-center gap-4 px-7 font-mono text-base font-medium tracking-tight whitespace-nowrap text-zinc-500 sm:gap-5 sm:px-10 sm:text-lg dark:text-zinc-400"
          key={skill}
        >
          <span
            className="size-2 shrink-0 rounded-full bg-brand"
            aria-hidden="true"
          />
          {skill}
        </li>
      ))}
    </ul>
  );
}

export default function SkillsStrip() {
  return (
    <section
      className="relative z-10 border-y border-zinc-950/8 bg-stone-50/80 py-6 sm:py-7 dark:border-white/10 dark:bg-zinc-900/45"
      id="skills"
      aria-labelledby="skills-heading"
    >
      <h2 className="sr-only" id="skills-heading">
        Technical skills
      </h2>
      <div className="skills-marquee overflow-hidden">
        <div className="skills-marquee-track flex w-max">
          <SkillsList />
          <SkillsList duplicate />
        </div>
      </div>
    </section>
  );
}
