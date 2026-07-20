---
name: "gsap-scroll-animations"
description: "Implements GSAP scroll animations for this project. Invoke when building, editing, or reviewing scroll-based motion, reveals, parallax, or pinned sections."
---

# GSAP Scroll Animations

Use this skill whenever scroll-based animation is needed in this workspace.

## Purpose

This skill standardizes how scroll animation is implemented across the project.

## Core Rule

- Use `gsap` for all scroll-based animation.
- Use `ScrollTrigger` for reveal effects, parallax, scrubbed timelines, and pinned sections.
- Do not introduce other scroll-animation libraries unless the user explicitly requests them.

## Project Expectations

- Follow the project's Next.js conventions.
- Use Client Components for GSAP-based animation code.
- Keep layout and content structure clean, and isolate animation logic where possible.
- Preserve accessibility and readability over visual complexity.

## Implementation Rules

- Add `'use client'` at the top of animated components.
- Import from `gsap` and `gsap/ScrollTrigger`.
- Register `ScrollTrigger` before creating animations.
- Prefer `useRef` for DOM targets.
- Prefer `useLayoutEffect` for animation setup when measuring layout or avoiding flicker.
- Scope animations to the component instead of querying the whole document when possible.
- Clean up all animations and triggers on unmount.
- Keep animation setup declarative and localized.

## ScrollTrigger Patterns

- Use `fromTo` or timeline-based reveals for sections entering the viewport.
- Use `scrub` only when the animation should track scroll progress.
- Use `pin` only when the section design clearly requires it.
- Keep start and end positions explicit and easy to tune.
- Avoid stacking many heavy scroll triggers on the same page without need.

## Accessibility

- Respect reduced motion preferences for non-essential animation.
- Ensure content remains visible and usable if animation fails or is disabled.
- Avoid motion that makes reading difficult or blocks interaction.

## Performance

- Animate transforms and opacity where possible.
- Avoid expensive layout-thrashing properties.
- Reuse timelines and triggers thoughtfully.
- Keep selector scope tight and avoid unnecessary global listeners.

## Example Pattern

```tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function RevealSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".reveal-item",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 80%",
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef}>
      <div className="reveal-item">Lorem ipsum dolor sit amet.</div>
    </section>
  );
}
```

## When To Invoke

Invoke this skill when:

- creating a hero reveal or section entrance animation
- adding scroll-triggered transitions to marketing pages
- implementing parallax or scrubbed effects
- reviewing frontend animation code
- replacing non-GSAP scroll animation with the project standard

## Preferred Outcome

- clean Next.js component structure
- GSAP plus ScrollTrigger for scroll behavior
- safe cleanup
- accessible motion
- maintainable animation code