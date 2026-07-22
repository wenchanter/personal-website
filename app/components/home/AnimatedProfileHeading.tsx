"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type AnimatedProfileHeadingProps = {
  name: string;
  roles: readonly string[];
};

type AnimatedCharactersProps = {
  text: string;
  target: "name" | "role";
};

function AnimatedCharacters({ text, target }: AnimatedCharactersProps) {
  return (
    <span aria-hidden="true" className="whitespace-pre">
      {Array.from(text).map((character, index) => (
        <span
          className={`inline-block ${target === "name" ? "profile-name-character" : ""}`}
          data-profile-character={target}
          key={`${character}-${index}`}
        >
          {character === " " ? "\u00a0" : character}
        </span>
      ))}
    </span>
  );
}

export default function AnimatedProfileHeading({
  name,
  roles,
}: AnimatedProfileHeadingProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const nameCharacters = root.querySelectorAll<HTMLElement>(
      '[data-profile-character="name"]',
    );
    const roleGroups = root.querySelectorAll<HTMLElement>("[data-role-group]");
    const roleCursors = root.querySelectorAll<HTMLElement>(
      "[data-role-cursor]",
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(nameCharacters, { clearProps: "all" });
      gsap.set(roleCursors, { display: "none" });
      return;
    }

    const context = gsap.context(() => {
      gsap.set(nameCharacters, {
        autoAlpha: 0,
        willChange: "transform, opacity",
        x: "-0.7em",
      });

      gsap
        .timeline({
          defaults: {
            duration: 0.48,
            ease: "power2.out",
          },
        })
        .to(
          nameCharacters,
          {
            autoAlpha: 1,
            x: 0,
            stagger: 0.075,
            force3D: false,
          },
        )
        .set(nameCharacters, { willChange: "auto" });

      gsap.set(roleGroups, { autoAlpha: 0 });

      const roleTimeline = gsap.timeline({ delay: 0.85, repeat: -1 });

      roleGroups.forEach((group, roleIndex) => {
        const roleCharacters = group.querySelectorAll<HTMLElement>(
          '[data-profile-character="role"]',
        );
        const cursor = group.querySelector<HTMLElement>("[data-role-cursor]");

        if (!cursor) {
          return;
        }

        const cycleStart = roleIndex * 2;
        const typingDuration = Math.max(
          0,
          (roleCharacters.length - 1) * 0.035,
        );

        gsap.set(roleCharacters, { display: "none" });

        roleTimeline
          .set(group, { autoAlpha: 1 }, cycleStart)
          .set(cursor, { autoAlpha: 1 }, cycleStart)
          .set(
            roleCharacters,
            {
              autoAlpha: 1,
              display: "inline-block",
              stagger: 0.035,
            },
            cycleStart,
          )
          .fromTo(
            cursor,
            { autoAlpha: 1 },
            {
              autoAlpha: 0,
              duration: 0.5,
              ease: "steps(1)",
              repeat: 2,
              yoyo: true,
            },
            cycleStart + typingDuration + 0.08,
          )
          .set(cursor, { autoAlpha: 1 }, cycleStart + 1.68)
          .set(
            roleCharacters,
            {
              display: "none",
              stagger: { each: 0.012, from: "end" },
            },
            cycleStart + 1.7,
          )
          .set(group, { autoAlpha: 0 }, cycleStart + 2);
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex flex-col items-center">
      <h1
        className="text-[clamp(3.5rem,10vw,7rem)] leading-[0.88] font-extrabold tracking-[-0.075em] text-zinc-950 text-balance dark:text-zinc-50"
        id="hero-heading"
      >
        <span className="sr-only">{name}</span>
        <AnimatedCharacters text={name} target="name" />
      </h1>
      <p className="mt-7 text-[clamp(1.6rem,4vw,3rem)] leading-none font-semibold tracking-[-0.04em] text-zinc-700 dark:text-zinc-300">
        <span className="sr-only">{roles.join(", ")}</span>
        <span aria-hidden="true" className="grid">
          {roles.map((role, index) => (
            <span
              className={`col-start-1 row-start-1 grid justify-self-center ${index === 0 ? "" : "invisible"}`}
              data-role-group
              key={role}
            >
              <span className="invisible col-start-1 row-start-1 whitespace-pre">
                {role}_
              </span>
              <span className="col-start-1 row-start-1 justify-self-start whitespace-nowrap">
                <AnimatedCharacters text={role} target="role" />
                <span className="inline-block" data-role-cursor>
                  _
                </span>
              </span>
            </span>
          ))}
        </span>
      </p>
    </div>
  );
}
