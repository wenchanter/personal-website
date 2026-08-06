import type { ArticleBlock, InlineNode, RichText } from "@/app/blog/types";

function CodeGlyph() {
  return (
    <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="m7.5 6.5-3.5 3.5 3.5 3.5m5-7 3.5 3.5-3.5 3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

/**
 * Renders a text run with its marks. The CMS sends plain strings for
 * unformatted text and node arrays once a block contains bold, italics,
 * inline code, or a link.
 */
function Inline({ value }: { value: RichText }) {
  if (typeof value === "string") {
    return <>{value}</>;
  }

  return (
    <>
      {value.map((node, index) => (
        <InlineRun key={index} node={node} />
      ))}
    </>
  );
}

function InlineRun({ node }: { node: InlineNode }) {
  let content: React.ReactNode = node.text;
  const marks = node.marks ?? [];

  if (marks.includes("code")) {
    content = (
      <code className="rounded bg-zinc-950/5 px-1 py-0.5 font-mono text-[0.9em] dark:bg-white/10">
        {content}
      </code>
    );
  }

  if (marks.includes("em")) {
    content = <em>{content}</em>;
  }

  if (marks.includes("strike")) {
    content = <s>{content}</s>;
  }

  if (marks.includes("underline")) {
    content = <u className="underline underline-offset-2">{content}</u>;
  }

  if (marks.includes("strong")) {
    content = (
      <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
        {content}
      </strong>
    );
  }

  if (node.href) {
    const external = /^https?:\/\//.test(node.href);
    content = (
      <a
        className="text-brand underline underline-offset-2 hover:no-underline"
        href={node.href}
        {...(external
          ? { target: "_blank", rel: "noreferrer noopener" }
          : {})}
      >
        {content}
      </a>
    );
  }

  return <>{content}</>;
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "lead":
      return (
        <p className="text-[1.25rem] leading-[1.55] text-pretty text-zinc-800 sm:text-[1.375rem] dark:text-zinc-200">
          <Inline value={block.text} />
        </p>
      );

    case "heading": {
      if (block.level === 3) {
        return (
          <h3
            className="mt-12 scroll-mt-28 text-[1.25rem] leading-[1.3] font-semibold tracking-[-0.015em] text-zinc-950 sm:text-[1.5rem] dark:text-zinc-50"
            id={block.id}
          >
            <Inline value={block.text} />
          </h3>
        );
      }

      return (
        <h2
          className="mt-16 scroll-mt-28 text-[1.5rem] leading-[1.2] font-semibold tracking-[-0.015em] text-zinc-950 first:mt-0 sm:text-[1.875rem] dark:text-zinc-50"
          id={block.id}
        >
          <Inline value={block.text} />
        </h2>
      );
    }

    case "paragraph":
      return (
        <p className="mt-7 text-[1.125rem] leading-[1.6] text-pretty text-zinc-800 sm:text-[1.25rem] dark:text-zinc-200">
          <Inline value={block.text} />
        </p>
      );

    case "list": {
      const items = block.items.map((item, index) => (
        <li className="flex gap-3" key={index}>
          {block.ordered ? (
            <span className="mt-0.5 shrink-0 font-mono text-sm font-semibold text-brand">
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : (
            <span
              className="mt-3.5 size-1.5 shrink-0 rounded-full bg-brand"
              aria-hidden="true"
            />
          )}
          <span>
            <Inline value={item} />
          </span>
        </li>
      ));

      return block.ordered ? (
        <ol className="mt-7 space-y-4 text-[1.125rem] leading-[1.7] text-zinc-800 sm:text-[1.25rem] dark:text-zinc-200">
          {items}
        </ol>
      ) : (
        <ul className="mt-7 space-y-4 text-[1.125rem] leading-[1.7] text-zinc-800 sm:text-[1.25rem] dark:text-zinc-200">
          {items}
        </ul>
      );
    }

    case "quote":
      return (
        <figure className="mt-10 border-l-[3px] border-brand py-1 pl-6">
          <blockquote className="text-[1.125rem] leading-[1.7] text-pretty text-zinc-800 italic sm:text-[1.25rem] dark:text-zinc-200">
            <Inline value={block.text} />
          </blockquote>
          {block.cite ? (
            <figcaption className="mt-3 font-mono text-xs text-zinc-400 not-italic dark:text-zinc-500">
              {block.cite}
            </figcaption>
          ) : null}
        </figure>
      );

    case "code":
      return (
        <div className="mt-10 overflow-hidden rounded-xl border border-zinc-950/10 bg-white/70 shadow-[0_10px_30px_rgba(24,24,27,0.05)] backdrop-blur-[2px] dark:border-white/10 dark:bg-zinc-900/70">
          <div className="flex items-center gap-3 border-b border-zinc-950/8 px-4 py-3 dark:border-white/10">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
            </span>
            <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
              {block.language}
            </span>
            <span
              className="ml-auto text-zinc-300 dark:text-zinc-600"
              aria-hidden="true"
            >
              <CodeGlyph />
            </span>
          </div>
          <pre className="overflow-x-auto px-5 py-5 text-[0.9375rem] leading-7 text-zinc-700 dark:text-zinc-300">
            <code className="font-mono">{block.code}</code>
          </pre>
        </div>
      );

    case "image":
      /*
       * A plain <img> rather than next/image: the site is a static export, the
       * CMS serves these bytes with an immutable cache header, and the
       * intrinsic size travels with the block so the browser can reserve space
       * before the image loads.
       */
      return (
        <figure className="mt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.src}
            alt={block.alt}
            width={block.width}
            height={block.height}
            loading="lazy"
            decoding="async"
            className="h-auto w-full rounded-xl border border-zinc-950/10 dark:border-white/10"
          />
          {block.alt ? (
            <figcaption className="mt-3 text-center text-sm text-zinc-500 dark:text-zinc-400">
              {block.alt}
            </figcaption>
          ) : null}
        </figure>
      );

    default:
      return null;
  }
}

export default function ArticleBody({
  content,
}: {
  content: readonly ArticleBlock[];
}) {
  return (
    <div>
      {content.map((block, index) => (
        <Block block={block} key={index} />
      ))}
    </div>
  );
}
