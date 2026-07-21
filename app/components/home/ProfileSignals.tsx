"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type ProfileSignalsProps = {
  signals: readonly string[];
};

export default function ProfileSignals({ signals }: ProfileSignalsProps) {
  const rootRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(root, { clearProps: "all" });
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        root,
        {
          autoAlpha: 0,
          y: 24,
          willChange: "transform, opacity",
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 3.0,
          ease: "power3.out",
          force3D: true,
          clearProps: "transform,opacity,visibility,willChange",
        },
      );
    }, root);

    return () => context.revert();
  }, []);

  return (
    <ul
      ref={rootRef}
      className="mb-7 flex max-w-full flex-wrap items-center justify-center font-mono text-[0.7rem] font-semibold tracking-[0.16em] text-brand uppercase sm:mb-9 sm:text-xs sm:tracking-[0.2em]"
      aria-label="Professional summary"
    >
      {signals.map((signal) => (
        <li
          className="my-1 border-l border-brand/35 px-3 first:border-l-0 sm:px-5"
          key={signal}
        >
          {signal}
        </li>
      ))}
    </ul>
  );
}
