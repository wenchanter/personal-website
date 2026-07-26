"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type BlogComingSoonButtonProps = {
  children: ReactNode;
  className?: string;
};

export default function BlogComingSoonButton({
  children,
  className,
}: BlogComingSoonButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const trigger = triggerRef.current;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }

      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    closeRef.current?.focus();
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        className={className}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        {children}
      </button>

      {isOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/25 px-4 backdrop-blur-sm"
              role="presentation"
              onMouseDown={(event) => {
                if (event.currentTarget === event.target) {
                  setIsOpen(false);
                }
              }}
            >
              <div
                className="w-full max-w-sm rounded-2xl border border-zinc-950/10 bg-stone-50 p-6 text-center shadow-[0_24px_80px_rgba(24,24,27,0.2)] dark:border-white/10 dark:bg-zinc-900"
                role="dialog"
                aria-labelledby={titleId}
                aria-modal="true"
              >
                <p
                  className="font-mono text-xs font-semibold tracking-[0.2em] text-brand uppercase"
                  id={titleId}
                >
                  Coming Soon
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  Synthesizing, distilling, and sharing software engineering & architecture insights.
                </p>
                <button
                  ref={closeRef}
                  className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-semibold text-stone-50 transition-colors hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-brand dark:hover:text-white"
                  type="button"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
