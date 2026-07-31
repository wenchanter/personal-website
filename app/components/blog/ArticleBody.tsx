import type { ArticleBlock } from "@/app/data/blog";

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

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "lead":
      return (
        <p className="text-lg leading-9 text-pretty text-zinc-700 sm:text-xl sm:leading-10 dark:text-zinc-300">
          {block.text}
        </p>
      );

    case "heading": {
      if (block.level === 3) {
        return (
          <h3
            className="mt-12 scroll-mt-28 text-xl leading-tight font-bold tracking-[-0.03em] text-zinc-950 sm:text-2xl dark:text-zinc-50"
            id={block.id}
          >
            {block.text}
          </h3>
        );
      }

      return (
        <h2
          className="mt-16 scroll-mt-28 text-2xl leading-tight font-extrabold tracking-[-0.04em] text-zinc-950 first:mt-0 sm:text-3xl dark:text-zinc-50"
          id={block.id}
        >
          {block.text}
        </h2>
      );
    }

    case "paragraph":
      return (
        <p className="mt-6 text-base leading-9 text-pretty text-zinc-600 sm:text-[1.0625rem] sm:leading-9 dark:text-zinc-400">
          {block.text}
        </p>
      );

    case "list": {
      const items = block.items.map((item, index) => (
        <li className="flex gap-3" key={item}>
          {block.ordered ? (
            <span className="mt-0.5 shrink-0 font-mono text-sm font-semibold text-brand">
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : (
            <span
              className="mt-3 size-1.5 shrink-0 rounded-full bg-brand"
              aria-hidden="true"
            />
          )}
          <span>{item}</span>
        </li>
      ));

      return block.ordered ? (
        <ol className="mt-6 space-y-4 text-base leading-8 text-zinc-600 sm:text-[1.0625rem] dark:text-zinc-400">
          {items}
        </ol>
      ) : (
        <ul className="mt-6 space-y-4 text-base leading-8 text-zinc-600 sm:text-[1.0625rem] dark:text-zinc-400">
          {items}
        </ul>
      );
    }

    case "quote":
      return (
        <figure className="mt-10 border-l-[3px] border-brand py-1 pl-6">
          <blockquote className="text-lg leading-9 text-pretty text-zinc-600 italic sm:text-xl sm:leading-10 dark:text-zinc-300">
            {block.text}
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
          <pre className="overflow-x-auto px-5 py-5 text-[0.8125rem] leading-7 text-zinc-700 dark:text-zinc-300">
            <code className="font-mono">{block.code}</code>
          </pre>
        </div>
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
