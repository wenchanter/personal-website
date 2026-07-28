"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type SmoothScrollProps = {
  children: ReactNode;
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const wrapper = wrapperRef.current;
    const content = contentRef.current;

    if (!wrapper || !content) {
      return;
    }

    const usesNativeSticky = content.querySelector("[data-native-sticky-page]");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let refreshFrame: number | null = null;
    let isDisposed = false;
    let smoother: ReturnType<typeof ScrollSmoother.create> | null = null;

    const finishInitialAnchorEntry = () => {
      const documentElement = document.documentElement;

      if (!documentElement.hasAttribute("data-anchor-boot")) {
        return;
      }

      const encodedTargetId = window.location.hash.slice(1);
      let targetId = encodedTargetId;

      try {
        targetId = decodeURIComponent(encodedTargetId);
      } catch {
        // Keep the literal hash when it is not valid URI-encoded text.
      }

      const target = targetId ? document.getElementById(targetId) : null;

      if (target) {
        if (smoother) {
          smoother.scrollTo(target, false, "top top");
        } else {
          target.scrollIntoView({ block: "start", behavior: "auto" });
        }
      }

      ScrollTrigger.update();
      documentElement.removeAttribute("data-anchor-boot");
    };

    const queueRefresh = () => {
      if (isDisposed) {
        return;
      }

      if (refreshFrame !== null) {
        window.cancelAnimationFrame(refreshFrame);
      }

      refreshFrame = window.requestAnimationFrame(() => {
        refreshFrame = null;
        ScrollTrigger.refresh();
        finishInitialAnchorEntry();
      });
    };
    const refreshAfterFonts = () => {
      void document.fonts.ready.then(queueRefresh);
    };

    // Refresh only at layout-stable lifecycle points. A subtree MutationObserver
    // must not be used here: absolute-positioned canvases and Strict Mode DOM
    // remounts do not affect document flow, but refreshing for them can briefly
    // tear down pinned ScrollTriggers and expose entrance-animation elements.
    window.addEventListener("load", queueRefresh, { once: true });
    refreshAfterFonts();

    if (reducedMotion || usesNativeSticky) {
      ScrollSmoother.get()?.kill();
      wrapper.classList.add("smooth-scroll-wrapper--native");
      content.classList.add("smooth-scroll-content--native");
      queueRefresh();

      return () => {
        isDisposed = true;

        if (refreshFrame !== null) {
          window.cancelAnimationFrame(refreshFrame);
        }

        document.documentElement.removeAttribute("data-anchor-boot");
        window.removeEventListener("load", queueRefresh);
        wrapper.classList.remove("smooth-scroll-wrapper--native");
        content.classList.remove("smooth-scroll-content--native");
      };
    }

    ScrollSmoother.get()?.kill();

    smoother = ScrollSmoother.create({
      wrapper,
      content,
      smooth: 1,
      smoothTouch: 0.1,
      effects: false,
      ignoreMobileResize: true,
      normalizeScroll: true,
    });

    queueRefresh();

    return () => {
      isDisposed = true;

      if (refreshFrame !== null) {
        window.cancelAnimationFrame(refreshFrame);
      }

      document.documentElement.removeAttribute("data-anchor-boot");
      window.removeEventListener("load", queueRefresh);
      smoother?.kill();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      data-smooth-scroll-wrapper
      className="smooth-scroll-wrapper"
    >
      <div
        ref={contentRef}
        data-smooth-scroll-content
        className="smooth-scroll-content"
      >
        {children}
      </div>
    </div>
  );
}
