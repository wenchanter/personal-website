"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function FlowingOrb() {
  const orbRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const orb = orbRef.current;

    if (!orb) {
      return;
    }

    const lights = orb.querySelectorAll<HTMLElement>("[data-orb-light]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(lights, { clearProps: "all" });
      return;
    }

    const context = gsap.context(() => {
      lights.forEach((light, index) => {
        gsap.to(light, {
          xPercent: () => gsap.utils.random(-38, 38),
          yPercent: () => gsap.utils.random(-34, 34),
          rotation: () => gsap.utils.random(-70, 70),
          scale: () => gsap.utils.random(0.72, 1.22),
          duration: () => gsap.utils.random(0.75 + index * 0.12, 1.55),
          ease: "sine.inOut",
          force3D: true,
          repeat: -1,
          repeatRefresh: true,
          yoyo: true,
        });
      });
    }, orb);

    return () => context.revert();
  }, []);

  return (
    <div ref={orbRef} className="flowing-orb" aria-hidden="true">
      <span className="orb-light orb-light-one" data-orb-light />
      <span className="orb-light orb-light-two" data-orb-light />
      <span className="orb-light orb-light-three" data-orb-light />
    </div>
  );
}
