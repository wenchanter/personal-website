"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import OrbConvergence from "@/app/components/home/OrbConvergence";
import { approachPaths } from "@/app/data/orbs";

const statementLines = [
  "Complex logic should result in",
  "effortless software.",
] as const;

function AnimatedStatement({ lines }: { lines: readonly string[] }) {
  return (
    <>
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden="true">
        {lines.map((line, lineIndex) => (
          <span className="sm:block" key={line}>
            {line.split(" ").map((word, wordIndex) => (
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
            {lineIndex < lines.length - 1 ? " " : null}
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
    const orbBurst = document.querySelector<HTMLElement>("[data-orb-burst]");
    const orbFlashStage = document.querySelector<HTMLElement>(
      "[data-orb-flash-stage]",
    );
    const spheres = section.querySelectorAll<HTMLElement>(
      "[data-converging-orb]",
    );

    if (
      !summary ||
      !background ||
      !orbTarget ||
      !orbBurst ||
      !orbFlashStage ||
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
      const pinnedScrollScreens =
        5.3 + Math.max(0, spheres.length - 5) * sphereStagger;
      const orbRestingScale = 0.7;
      const orbFinalScale = 1.5;
      const orbGrowthDuration = 0.22;
      const postConvergenceTailDuration = 0.32;
      const orbScaleStep =
        spheres.length > 0
          ? (orbFinalScale - orbRestingScale) / spheres.length
          : 0;

      gsap.set(titleCharacters, {
        autoAlpha: 0,
        filter: "blur(12px)",
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
      gsap.set(orbBurst, {
        opacity: 0,
        scale: 0.06,
        visibility: "visible",
        xPercent: -50,
        yPercent: -50,
      });
      gsap.set(orbFlashStage, { opacity: 0 });

      const entranceTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: skillsStrip ?? section,
          start: () =>
            skillsStrip
              ? `top ${Math.round(Math.min(520, window.innerHeight * 0.62))}px`
              : "top 520px",
          endTrigger: section,
          end: "top top",
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
            force3D: false,
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
          end: () => `+=${window.innerHeight * pinnedScrollScreens}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 10,
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
            ease: "power3.out",
            force3D: true,
            scale: orbRestingScale,
          },
          effectsRevealStart,
        )
        .set(background, { willChange: "auto" });

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
          )
          .to(
            orbTarget,
            {
              duration: orbGrowthDuration,
              ease: "power2.out",
              force3D: true,
              scale: orbRestingScale + orbScaleStep * (index + 1),
            },
            startAt + travelDuration - orbGrowthDuration,
          );
      });

      const finalSphereEnd =
        convergenceStart +
        (spheres.length - 1) * sphereStagger +
        travelDuration;

      effectsTimeline
        .to(
          orbTarget,
          {
            autoAlpha: 0,
            duration: 0.32,
            ease: "power2.out",
            force3D: true,
            scale: orbFinalScale * 1.12,
          },
          finalSphereEnd + 0.1,
        )
        .to(
          {},
          // Preserve the established pinned pacing after the orb disappears.
          { duration: postConvergenceTailDuration },
          finalSphereEnd + 0.42,
        )
        .set(orbTarget, { willChange: "auto" });

      const burstLeadDistance = 0.76;
      const flashFadeInDistance = 0.18;
      const flashHoldDistance = 0.48;
      const flashFadeOutDistance = 0.59;
      const flashFadeInStart = burstLeadDistance - flashFadeInDistance;
      const burstOpacityDuration =
        flashFadeInStart + flashFadeInDistance;
      const burstOpacityPeak = flashFadeInStart / burstOpacityDuration;
      const getBurstOpacity = (progress: number) => {
        if (progress <= burstOpacityPeak) {
          return Math.pow(progress / burstOpacityPeak, 3);
        }

        return 1 - (progress - burstOpacityPeak) / (1 - burstOpacityPeak);
      };
      const burstOpacityState = { progress: 0 };
      const setBurstOpacity = gsap.quickSetter(orbBurst, "opacity");
      const flashTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: () =>
            (effectsTimeline.scrollTrigger?.end ?? 0) -
            window.innerHeight * burstLeadDistance,
          end: () =>
            (effectsTimeline.scrollTrigger?.end ?? 0) +
            window.innerHeight *
              (flashHoldDistance + flashFadeOutDistance),
          scrub: true,
          invalidateOnRefresh: true,
          refreshPriority: -10,
        },
      });

      flashTimeline
        .to(
          orbBurst,
          {
            duration: 0.74,
            ease: "power3.in",
            force3D: true,
            scale: 42,
          },
          0,
        )
        .to(
          burstOpacityState,
          {
            duration: burstOpacityDuration,
            ease: "none",
            progress: 1,
            onUpdate: () => {
              setBurstOpacity(getBurstOpacity(burstOpacityState.progress));
            },
          },
          0,
        )
        .to(
          orbFlashStage,
          {
            duration: flashFadeInDistance,
            ease: "none",
            opacity: 1,
          },
          flashFadeInStart,
        )
        .to(orbFlashStage, {
          duration: flashHoldDistance,
          ease: "none",
          opacity: 1,
        })
        .to(orbFlashStage, {
          duration: flashFadeOutDistance,
          ease: "none",
          opacity: 0,
        });
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
          className="pointer-events-none absolute top-18 left-1/2 w-[100vw] -translate-x-1/2 text-[clamp(3.7rem,6.2vw,7.0rem)] leading-[0.95] font-bold tracking-[-0.02em] text-balance text-zinc-950/[0.45] blur-[5px] select-none sm:w-max sm:max-w-none dark:text-white/[0.38]"
          data-skill-background
          aria-hidden="true"
        >
          {statementLines.map((line, lineIndex) => (
            <span className="sm:block sm:whitespace-nowrap" key={line}>
              {line}
              {lineIndex < statementLines.length - 1 ? " " : null}
            </span>
          ))}
        </p>

        <div className="relative mx-auto mt-40 max-w-4xl">
          <h2
            className="text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.06em] text-balance text-zinc-950 dark:text-zinc-100"
            id="skill-show-heading"
          >
            <AnimatedStatement lines={statementLines} />
          </h2>
          <p
            className="mx-auto mt-5 max-w-[46ch] text-sm leading-6 text-pretty text-zinc-600 sm:text-base sm:leading-7 dark:text-zinc-400"
            data-skill-summary
          >
          I blend backend architecture, Domain-Driven Design, and modern frontend craft to build resilient, high-throughput systems that feel simple to use—and now, accelerated by AI.
          </p>
        </div>

        <div className="mt-auto w-full pt-4 sm:pt-6">
          <OrbConvergence />
        </div>
      </div>
    </section>
  );
}
