"use client";

import { useLayoutEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ScrollTriggerBootProps = {
  children: ReactNode;
};

/*
 * The whole site scrolls natively — sticky card stacks and hash anchors both
 * depend on it. This shell owns the two lifecycle points where layout is stable
 * enough to measure ScrollTrigger start/end positions, and it releases the
 * first-paint hold that `initialScrollGuard` places on the page when the entry
 * URL carries a hash.
 */
export default function ScrollTriggerBoot({
  children,
}: ScrollTriggerBootProps) {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let refreshFrame: number | null = null;
    let isDisposed = false;
    const documentElement = document.documentElement;
    let initialAnchorLayoutReady = !documentElement.hasAttribute(
      "data-anchor-boot",
    );

    const finishInitialAnchorEntry = () => {
      if (
        !initialAnchorLayoutReady ||
        !documentElement.hasAttribute("data-anchor-boot")
      ) {
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
        target.scrollIntoView({ block: "start", behavior: "auto" });
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
      void document.fonts.ready.then(() => {
        if (isDisposed) {
          return;
        }

        initialAnchorLayoutReady = true;
        queueRefresh();
      });
    };

    // Refresh only at layout-stable lifecycle points. A subtree MutationObserver
    // must not be used here: absolute-positioned canvases and Strict Mode DOM
    // remounts do not affect document flow, but refreshing for them can briefly
    // tear down pinned ScrollTriggers and expose entrance-animation elements.
    window.addEventListener("load", queueRefresh, { once: true });
    refreshAfterFonts();
    queueRefresh();

    return () => {
      isDisposed = true;

      if (refreshFrame !== null) {
        window.cancelAnimationFrame(refreshFrame);
      }

      window.removeEventListener("load", queueRefresh);
    };
  }, []);

  return (
    <div className="page-shell" data-page-shell>
      {children}
    </div>
  );
}
