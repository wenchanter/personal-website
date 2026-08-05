import type { Metadata } from "next";

import PreviewClient from "@/app/preview/PreviewClient";

/**
 * Live preview target for the CMS editor.
 *
 * The page ships no content of its own — the editor pushes blocks in over
 * postMessage and this route renders them with the *real* article components
 * and the real stylesheet. That is the whole point: the CMS no longer keeps a
 * lookalike renderer that can drift, because there is only one renderer.
 *
 * It exports statically like any other route; the content arrives at runtime.
 */

export const metadata: Metadata = {
  title: "Preview — Harrison Wang",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BlogPreviewPage() {
  return <PreviewClient />;
}
