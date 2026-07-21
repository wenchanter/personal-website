"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import OrbConvergence, {
  approachPaths,
} from "@/app/components/home/OrbConvergence";

const statement = "Complex systems should feel simple to use.";

function AnimatedStatement({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <span
            className="mr-[0.22em] inline-block whitespace-nowrap last:mr-0"
            key={`${word}-${wordIndex}`}
          >
            {Array.from(word).map((character, characterIndex) => (
              <span
                className="inline-block"
                data-skill-title-character
                key={`${character}-${characterIndex}`}
              >
                {character}
              </span>
            ))}
          </span>
        ))}
      </span>
    </>
  );
}

export default function SkillShow() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const skillsStrip = document.querySelector<HTMLElement>("#skills");
    const titleCharacters = section.querySelectorAll<HTMLElement>(
      "[data-skill-title-character]",
    );
    const summary = section.querySelector<HTMLElement>("[data-skill-summary]");
    const background = section.querySelector<HTMLElement>(
      "[data-skill-background]",
    );
    const orbTarget = section.querySelector<HTMLElement>("[data-orb-target]");
    const spheres = section.querySelectorAll<HTMLElement>(
      "[data-converging-orb]",
    );

    if (
      !summary ||
      !background ||
      !orbTarget ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      const characterDuration = 0.28;
      const characterStagger = 0.021;
      const titleRevealDuration =
        characterDuration +
        Math.max(0, titleCharacters.length - 1) * characterStagger;
      const backgroundRevealDuration = 0.68;
      const effectsRevealStart = 0.38;
      const convergenceStart =
        effectsRevealStart + backgroundRevealDuration;
      const travelDuration = 1.15;
      const sphereStagger = 0.58;
      const introPinnedDistance = () =>
        Math.round(Math.min(320, window.innerHeight * 0.35));

      gsap.set(titleCharacters, {
        autoAlpha: 0,
        filter: "blur(12px)",
        willChange: "transform, filter, opacity",
        y: "-0.7em",
      });
      gsap.set(summary, {
        autoAlpha: 0,
        filter: "blur(14px)",
        willChange: "filter, opacity",
      });
      gsap.set(background, {
        autoAlpha: 0,
        filter: "blur(28px)",
        willChange: "filter, opacity",
      });
      gsap.set(orbTarget, {
        autoAlpha: 0,
        scale: 0.06,
        willChange: "transform, opacity",
      });

      const entranceTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: skillsStrip ?? section,
          start: skillsStrip ? "top 280px" : "top 360px",
          endTrigger: section,
          end: () => `top top-=${introPinnedDistance()}`,
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });

      entranceTimeline
        .to(
          titleCharacters,
          {
            autoAlpha: 1,
            duration: characterDuration,
            ease: "power2.out",
            filter: "blur(0px)",
            force3D: true,
            stagger: characterStagger,
            y: 0,
          },
          0,
        )
        .to(
          summary,
          {
            autoAlpha: 1,
            duration: titleRevealDuration,
            ease: "power2.out",
            filter: "blur(0px)",
          },
          0,
        )
        .set(titleCharacters, { willChange: "auto" })
        .set(summary, { willChange: "auto" }, "<");

      const effectsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 4.4}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      effectsTimeline
        .to(
          background,
          {
            autoAlpha: 1,
            duration: backgroundRevealDuration,
            ease: "power2.out",
            filter: "blur(9px)",
          },
          effectsRevealStart,
        )
        .to(
          orbTarget,
          {
            autoAlpha: 1,
            duration: backgroundRevealDuration,
            ease: "back.out(1.35)",
            force3D: true,
            scale: 1,
          },
          effectsRevealStart,
        )
        .set([background, orbTarget], { willChange: "auto" });

      spheres.forEach((sphere, index) => {
        const path = approachPaths[index];
        const startAt = convergenceStart + index * sphereStagger;

        effectsTimeline
          .set(
            sphere,
            {
              autoAlpha: 0,
              force3D: true,
              rotation: path.rotation,
              scale: 0.45,
              x: path.fromX,
              xPercent: -50,
              y: path.fromY,
              yPercent: 50,
            },
            startAt,
          )
          .to(
            sphere,
            {
              duration: travelDuration,
              ease: "none",
              rotation: 0,
              x: 0,
              y: 0,
            },
            startAt,
          )
          .to(
            sphere,
            {
              autoAlpha: 0.92,
              duration: 0.14,
              ease: "none",
            },
            startAt,
          )
          .to(
            sphere,
            {
              duration: 0.28,
              ease: "power1.out",
              scale: 1,
            },
            startAt,
          )
          .to(
            sphere,
            {
              autoAlpha: 0,
              duration: 0.28,
              ease: "power2.in",
              scale: 0.04,
            },
            startAt + travelDuration - 0.28,
          );
      });

      const finalSphereEnd =
        convergenceStart +
        (spheres.length - 1) * sphereStagger +
        travelDuration;

      effectsTimeline.to(
        spheres,
        {
          autoAlpha: 0,
          duration: 0.18,
          ease: "none",
        },
        finalSphereEnd,
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 h-[100dvh] overflow-hidden bg-stone-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 dark:bg-zinc-950"
      aria-labelledby="skill-show-heading"
    >
      <div className="relative mx-auto flex h-full max-w-6xl flex-col items-center text-center">
        <p
          className="pointer-events-none absolute top-18 left-1/2 w-[100vw] max-w-7.2xl -translate-x-1/2 text-[clamp(3.7rem,9.5vw,7.5rem)] leading-[0.84] font-bold tracking-[-0.075em] text-balance text-zinc-950/[0.3] blur-[9px] select-none dark:text-white/[0.2]"
          data-skill-background
          aria-hidden="true"
        >
          {statement}
        </p>

        <div className="relative mx-auto mt-40 max-w-4xl">
          <h2
            className="text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.06em] text-balance text-zinc-950 dark:text-zinc-100"
            id="skill-show-heading"
          >
            <AnimatedStatement text={statement} />
          </h2>
          <p
            className="mx-auto mt-5 max-w-[46ch] text-sm leading-6 text-pretty text-zinc-600 sm:text-base sm:leading-7 dark:text-zinc-400"
            data-skill-summary
          >
            I connect architecture, product thinking, and frontend craft to
            build software that stays resilient and feels clear.
          </p>
        </div>

        <div className="mt-auto w-full pt-4 sm:pt-6">
          <OrbConvergence />
        </div>
      </div>
    </section>
  );
}
