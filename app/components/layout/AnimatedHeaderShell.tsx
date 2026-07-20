"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import NavLiquidGlassFilter from "@/app/components/layout/NavLiquidGlassFilter";

type AnimatedHeaderShellProps = {
  children: ReactNode;
};

export default function AnimatedHeaderShell({
  children,
}: AnimatedHeaderShellProps) {
  const rootRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    const nav = navRef.current;

    if (!root || !nav) {
      return;
    }

    const setCondensed = (condensed: boolean) => {
      root.classList.toggle("is-condensed", condensed);
    };
    const syncCondensedState = (scrollY: number) => {
      setCondensed(scrollY >= nav.offsetHeight);
    };

    syncCondensedState(window.scrollY);

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "max",
        onUpdate: (self) => syncCondensedState(self.scroll()),
        onRefresh: (self) => syncCondensedState(self.scroll()),
      });
    }, root);

    return () => {
      context.revert();
      root.classList.remove("is-condensed");
    };
  }, []);

  return (
    <header
      ref={rootRef}
      className="site-chrome pointer-events-none fixed inset-x-0 top-0 z-50"
    >
      <NavLiquidGlassFilter />
      <div
        ref={navRef}
        className="nav-scroll-glass pointer-events-auto overflow-hidden"
      >
        {children}
      </div>
    </header>
  );
}
