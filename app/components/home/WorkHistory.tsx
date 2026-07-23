"use client";

import Image from "next/image";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { profile, type WorkHistoryItem } from "@/app/data/profile";

const workCardThemes = {
  blue: {
    accent: "#315fbc",
    secondary: "#16c5c7",
  },
  orange: {
    accent: "#ff5a00",
    secondary: "#ff9f68",
  },
  rose: {
    accent: "#c83243",
    secondary: "#e76070",
  },
  red: {
    accent: "#c63b30",
    secondary: "#ed766c",
  },
  sky: {
    accent: "#0072bc",
    secondary: "#55a9e3",
  },
} as const satisfies Record<
  WorkHistoryItem["tone"],
  { accent: string; secondary: string }
>;

export default function WorkHistory() {
  const rootRef = useRef<HTMLElement>(null);
  const companyNavRef = useRef<HTMLElement>(null);
  const cardStackRef = useRef<HTMLDivElement>(null);
  const cardAnchorRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);
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

    const stopAutoScroll = () => {
      scrollTweenRef.current?.kill();
      scrollTweenRef.current = null;
    };

    window.addEventListener("wheel", stopAutoScroll, { passive: true });
    window.addEventListener("touchstart", stopAutoScroll, { passive: true });

    return () => {
      stopAutoScroll();
      window.removeEventListener("wheel", stopAutoScroll);
      window.removeEventListener("touchstart", stopAutoScroll);
      context.revert();
    };
  }, []);

  const scrollToPosition = (index: number) => {
    const card = cardRefs.current[index];
    const cardAnchor = cardAnchorRefs.current[index];
    const cardStack = cardStackRef.current;
    const companyNav = companyNavRef.current;

    if (!card || !cardAnchor || !cardStack || !companyNav) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const stackTop = window.scrollY + cardStack.getBoundingClientRect().top;
    const stickyTop = Number.parseFloat(window.getComputedStyle(card).top) || 0;
    const navStickyTop =
      Number.parseFloat(window.getComputedStyle(companyNav).top) || stickyTop;
    const alignmentTop = window.matchMedia("(min-width: 64rem)").matches
      ? navStickyTop
      : stickyTop;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const targetTop = gsap.utils.clamp(
      0,
      maxScroll,
      stackTop + cardAnchor.offsetTop - alignmentTop,
    );

    window.history.replaceState(
      null,
      "",
      `#work-position-${profile.workHistory[index].id}`,
    );

    scrollTweenRef.current?.kill();

    if (reducedMotion) {
      window.scrollTo({ top: targetTop, behavior: "auto" });
      setActiveIndex(index);
      ScrollTrigger.update();
      return;
    }

    const scrollDistance = Math.abs(targetTop - window.scrollY);
    const viewportDistance = scrollDistance / window.innerHeight;
    const duration = gsap.utils.clamp(0.5, 1.8, viewportDistance * 0.3);
    const scrollPosition = { value: window.scrollY };

    scrollTweenRef.current = gsap.to(scrollPosition, {
      value: targetTop,
      duration,
      ease: "power2.inOut",
      overwrite: "auto",
      onUpdate: () => {
        window.scrollTo(0, scrollPosition.value);
        ScrollTrigger.update();
      },
      onComplete: () => {
        scrollTweenRef.current = null;
        ScrollTrigger.update();
      },
      onInterrupt: () => {
        scrollTweenRef.current = null;
      },
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

      <div className="relative mx-auto max-w-6xl">
        <p className="font-mono text-sm font-semibold tracking-[0.24em] text-brand uppercase sm:text-base">
          Work history
        </p>
        <h2
          className="mt-4 text-[clamp(2.5rem,5.5vw,4.75rem)] leading-[0.96] font-extrabold tracking-[-0.06em] text-zinc-950 dark:text-zinc-100"
          id="work-history-heading"
        >
          Where I&apos;ve worked.
        </h2>

        <div className="mt-12 items-start lg:mt-16 lg:grid lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-0">
          <nav
            ref={companyNavRef}
            className="sticky top-20 z-30 flex overflow-x-auto rounded-xl border border-zinc-950/10 bg-white/94 shadow-[0_18px_50px_rgba(24,24,27,0.08)] backdrop-blur-md lg:top-24 lg:h-[42rem] lg:flex-col lg:overflow-hidden lg:rounded-r-none xl:h-[38rem] dark:border-white/12 dark:bg-zinc-900/94 dark:shadow-[0_18px_50px_rgba(0,0,0,0.24)]"
            aria-label="Work history companies"
          >
            {profile.workHistory.map((position, index) => {
              const isActive = index === activeIndex;
              const theme = workCardThemes[position.tone];

              return (
                <a
                  className={`group relative flex min-w-[13rem] flex-1 cursor-pointer items-center gap-4 border-r border-zinc-950/8 px-5 py-5 text-left transition-colors last:border-r-0 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand lg:min-h-0 lg:w-full lg:border-r-0 lg:border-b lg:px-7 lg:py-6 lg:last:border-b-0 dark:border-white/10 ${
                    isActive
                      ? ""
                      : "bg-transparent hover:bg-zinc-950/[0.025] dark:hover:bg-white/[0.035]"
                  }`}
                  href={`#work-position-${position.id}`}
                  aria-current={isActive ? "step" : undefined}
                  aria-controls={`work-position-${position.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToPosition(index);
                  }}
                  key={position.id}
                  style={
                    isActive
                      ? { backgroundColor: `${theme.accent}0d` }
                      : undefined
                  }
                >
                  {isActive ? (
                    <span
                      className="absolute inset-y-0 left-0 w-1"
                      style={{
                        background: `linear-gradient(180deg, ${theme.accent}, ${theme.secondary})`,
                      }}
                      aria-hidden="true"
                    />
                  ) : null}
                  <span
                    className={`size-2.5 shrink-0 rounded-full transition-colors ${isActive ? "" : "bg-zinc-300 dark:bg-zinc-600"}`}
                    style={
                      isActive
                        ? { backgroundColor: theme.accent }
                        : undefined
                    }
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span
                      className={`block text-base font-bold transition-colors sm:text-lg ${isActive ? "text-zinc-950 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"}`}
                    >
                      {position.company}
                    </span>
                  </span>
                  <span
                    className={`ml-auto text-xl transition-all ${isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"}`}
                    style={{ color: theme.accent }}
                    aria-hidden="true"
                  >
                    ›
                  </span>
                </a>
              );
            })}
          </nav>

          <div
            ref={cardStackRef}
            className="relative mt-6 lg:mt-0"
          >
            {profile.workHistory.map((position, index) => {
              const isLastPosition = index === profile.workHistory.length - 1;
              const theme = workCardThemes[position.tone];
              const logoScaleClass =
                position.id === "yonyou"
                  ? "scale-[3]"
                  : position.id === "netease"
                    ? "scale-[2.5]"
                    : "";

              return (
                <Fragment key={position.id}>
                  <div
                    ref={(element) => {
                      cardAnchorRefs.current[index] = element;
                    }}
                    className="h-0"
                    aria-hidden="true"
                  />
                  <article
                    ref={(element) => {
                      cardRefs.current[index] = element;
                    }}
                    className="sticky top-36 flex min-h-[36rem] scroll-mt-[33vh] flex-col overflow-hidden rounded-2xl border bg-white/98 shadow-[0_24px_70px_rgba(24,24,27,0.12)] lg:top-24 lg:h-[42rem] lg:min-h-0 lg:rounded-l-none xl:h-[38rem] dark:bg-zinc-900/98 dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)]"
                    id={`work-position-${position.id}`}
                    style={{
                      borderColor: `${theme.accent}33`,
                      zIndex: index + 1,
                    }}
                  >
                  <div
                    className="h-1 w-full shrink-0"
                    style={{
                      background: `linear-gradient(90deg, ${theme.accent}, ${theme.secondary}, transparent)`,
                    }}
                    aria-hidden="true"
                  />

                  <header className="relative overflow-hidden border-b border-zinc-950/[0.055] px-6 py-8 sm:px-10 sm:py-10 lg:px-12 xl:px-16 dark:border-white/10">
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${theme.accent}12, transparent 62%, ${theme.secondary}0d)`,
                      }}
                      aria-hidden="true"
                    />
                    <span
                      className="pointer-events-none absolute right-4 bottom-[-0.15em] text-[clamp(6rem,14vw,10.5rem)] leading-none font-black tracking-[-0.08em] select-none sm:right-8"
                      style={{ color: `${theme.accent}0c` }}
                      aria-hidden="true"
                    >
                      {position.endYear}
                    </span>

                    <div
                      className="relative z-20 ml-auto mb-6 flex h-16 w-36 items-center justify-center overflow-hidden rounded-2xl border bg-white/94 p-4 shadow-[0_10px_28px_rgba(24,24,27,0.07)] sm:absolute sm:top-7 sm:right-8 sm:mb-0 sm:h-20 sm:w-44 dark:bg-white/92"
                      style={{ borderColor: `${theme.accent}2b` }}
                    >
                      <div className="relative h-full w-full">
                        <Image
                          className={`object-contain ${logoScaleClass}`}
                          src={position.logo}
                          alt={`${position.company} logo`}
                          sizes="176px"
                          fill
                        />
                      </div>
                    </div>

                    <div className="relative z-10 sm:max-w-[calc(100%_-_11rem)]">
                      <p
                        className="font-mono text-sm font-semibold tracking-[0.16em] sm:text-base"
                        style={{ color: theme.accent }}
                      >
                        {position.period}
                      </p>
                      <h3 className="mt-4 max-w-3xl text-3xl leading-tight font-extrabold tracking-[-0.04em] text-zinc-950 sm:text-4xl lg:text-5xl dark:text-zinc-100">
                        {position.role}
                      </h3>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span
                          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-bold sm:text-base"
                          style={{
                            borderColor: `${theme.accent}33`,
                            backgroundColor: `${theme.accent}0c`,
                            color: theme.accent,
                          }}
                        >
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: theme.accent }}
                            aria-hidden="true"
                          />
                          {position.company}
                        </span>
                      </div>
                    </div>
                  </header>

                  <div className="relative flex flex-1 flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-12 xl:px-16">
                    <p className="max-w-[72ch] text-base leading-8 text-pretty text-zinc-600 sm:text-lg sm:leading-9 dark:text-zinc-300">
                      {position.summary}
                    </p>

                    <ul
                      className="mt-8 flex flex-wrap gap-2.5 sm:mt-10 sm:gap-3"
                      aria-label={`${position.company} technologies`}
                    >
                      {position.technologies.map((technology) => (
                        <li
                          className="rounded-lg border px-3 py-2 font-mono text-sm font-semibold tracking-[0.04em] sm:px-4 sm:text-base"
                          style={{
                            borderColor: `${theme.accent}2b`,
                            backgroundColor: `${theme.accent}08`,
                            color: theme.accent,
                          }}
                          key={technology}
                        >
                          {technology}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <footer className="relative mt-auto flex items-center justify-between gap-4 border-t border-zinc-950/8 px-6 py-5 font-mono text-sm font-medium tracking-[0.1em] text-zinc-400 sm:px-10 lg:px-12 xl:px-16 dark:border-white/10 dark:text-zinc-500">
                    <div className="flex items-center gap-3">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: theme.accent }}
                        aria-hidden="true"
                      />
                      {index + 1} / {profile.workHistory.length} · work history
                    </div>

                    <div
                      className="flex items-center gap-2"
                      aria-hidden="true"
                    >
                      {profile.workHistory.map((item, dotIndex) => (
                        <span
                          className={`h-2 rounded-full transition-[width,background-color] ${
                            dotIndex === index
                              ? "w-10"
                              : "w-2 bg-zinc-200 dark:bg-zinc-700"
                          }`}
                          style={
                            dotIndex === index
                              ? { backgroundColor: theme.accent }
                              : undefined
                          }
                          key={item.id}
                        />
                      ))}
                    </div>
                  </footer>
                  </article>
                  {!isLastPosition ? (
                    <div className="h-[38vh]" aria-hidden="true" />
                  ) : null}
                </Fragment>
              );
            })}
            <div className="h-[120vh]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
