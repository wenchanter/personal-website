"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { profile } from "@/app/data/profile";

export default function WorkHistory() {
  const rootRef = useRef<HTMLElement>(null);
  const cardStackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;

    if (!root) {
      return;
    }

    const context = gsap.context(() => {
      cardRefs.current.forEach((card, index) => {
        if (!card) {
          return;
        }

        ScrollTrigger.create({
          trigger: card,
          start: "top 33.333%",
          end: "+=1",
          invalidateOnRefresh: true,
          onEnter: () => setActiveIndex(index),
          onLeaveBack: () => setActiveIndex(Math.max(0, index - 1)),
        });
      });
    }, root);

    return () => context.revert();
  }, []);

  const scrollToPosition = (index: number) => {
    const card = cardRefs.current[index];
    const cardStack = cardStackRef.current;

    if (!card || !cardStack) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const stackTop = window.scrollY + cardStack.getBoundingClientRect().top;
    const targetTop = stackTop + card.offsetTop - window.innerHeight / 3;

    window.scrollTo({
      top: targetTop,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      ref={rootRef}
      className="relative z-10 bg-stone-50 px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32 dark:bg-zinc-950"
      id="work-history"
      data-native-sticky-page
      aria-labelledby="work-history-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(24,24,27,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(24,24,27,0.045)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] dark:bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        <p className="font-mono text-sm font-semibold tracking-[0.24em] text-brand uppercase sm:text-base">
          Work history · 工作经历
        </p>
        <h2
          className="mt-4 text-[clamp(2.5rem,5.5vw,4.75rem)] leading-[0.96] font-extrabold tracking-[-0.06em] text-zinc-950 dark:text-zinc-100"
          id="work-history-heading"
        >
          Where I&apos;ve worked.
        </h2>

        <div className="mt-12 items-start lg:mt-16 lg:grid lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-0">
          <nav
            className="sticky top-20 z-30 flex overflow-x-auto rounded-xl border border-zinc-950/10 bg-white/94 shadow-[0_18px_50px_rgba(24,24,27,0.08)] backdrop-blur-md lg:top-24 lg:block lg:rounded-r-none dark:border-white/12 dark:bg-zinc-900/94 dark:shadow-[0_18px_50px_rgba(0,0,0,0.24)]"
            aria-label="Work history companies"
          >
            {profile.workHistory.map((position, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  className={`group flex min-w-[13rem] flex-1 items-center gap-4 border-r border-zinc-950/8 px-5 py-5 text-left transition-colors last:border-r-0 lg:min-h-[6.8rem] lg:w-full lg:border-r-0 lg:border-b lg:px-7 lg:py-6 lg:last:border-b-0 dark:border-white/10 ${
                    isActive
                      ? "bg-emerald-50/95 dark:bg-emerald-950/45"
                      : "bg-transparent hover:bg-zinc-950/[0.025] dark:hover:bg-white/[0.035]"
                  }`}
                  type="button"
                  aria-current={isActive ? "step" : undefined}
                  onClick={() => scrollToPosition(index)}
                  key={position.id}
                >
                  <span
                    className={`size-2.5 shrink-0 rounded-full transition-colors ${isActive ? "bg-brand" : "bg-zinc-300 dark:bg-zinc-600"}`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span
                      className={`block text-base font-bold transition-colors sm:text-lg ${isActive ? "text-zinc-950 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"}`}
                    >
                      {position.company}
                    </span>
                    {position.companyLocal ? (
                      <span className="mt-0.5 block text-sm font-medium text-zinc-400 dark:text-zinc-500">
                        {position.companyLocal}
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={`ml-auto text-xl text-brand transition-all ${isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"}`}
                    aria-hidden="true"
                  >
                    ›
                  </span>
                </button>
              );
            })}
          </nav>

          <div
            ref={cardStackRef}
            className="relative mt-6 lg:mt-0"
          >
            {profile.workHistory.map((position, index) => {
              const isLastPosition = index === profile.workHistory.length - 1;

              return (
                <article
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  className={`sticky top-36 flex min-h-[32rem] flex-col overflow-hidden rounded-2xl border border-zinc-950/10 bg-white/96 px-6 py-9 shadow-[0_24px_70px_rgba(24,24,27,0.12)] sm:px-10 sm:py-11 lg:top-24 lg:min-h-[34rem] lg:rounded-l-none lg:px-12 lg:py-14 xl:px-16 dark:border-white/12 dark:bg-zinc-900/96 dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] ${isLastPosition ? "" : "mb-[38vh]"}`}
                  id={`work-position-${position.id}`}
                  key={position.id}
                  style={{ zIndex: index + 1 }}
                >
                <span
                  className="pointer-events-none absolute top-7 right-5 text-[clamp(5rem,12vw,9rem)] leading-none font-black tracking-[-0.08em] text-rose-500/[0.075] select-none dark:text-rose-300/[0.07]"
                  aria-hidden="true"
                >
                  {position.endYear}
                </span>

                <div className="relative max-w-4xl">
                  <p className="font-mono text-sm font-semibold tracking-[0.16em] text-zinc-400 sm:text-base dark:text-zinc-500">
                    {position.period}
                  </p>
                  <h3 className="mt-5 max-w-3xl text-3xl leading-tight font-extrabold tracking-[-0.04em] text-zinc-950 sm:text-4xl lg:text-5xl dark:text-zinc-100">
                    {position.role}
                  </h3>
                  <p className="mt-3 text-lg font-bold text-brand sm:text-xl">
                    {position.company}
                    {position.companyLocal ? (
                      <span className="font-semibold text-zinc-400 dark:text-zinc-500">
                        {" "}· {position.companyLocal}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-10 max-w-[68ch] text-base leading-8 text-pretty text-zinc-600 sm:text-lg sm:leading-9 dark:text-zinc-300">
                    {position.summary}
                  </p>
                </div>

                <div className="relative mt-auto flex items-center gap-3 border-t border-zinc-950/8 pt-6 font-mono text-sm font-medium tracking-[0.1em] text-zinc-400 dark:border-white/10 dark:text-zinc-500">
                  <span
                    className="size-2 rounded-full bg-brand"
                    aria-hidden="true"
                  />
                  {index + 1} / {profile.workHistory.length} positions
                </div>
                </article>
              );
            })}
            <div className="h-[120vh]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
