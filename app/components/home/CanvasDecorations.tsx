export default function CanvasDecorations() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
      aria-hidden="true"
    >
      <div className="absolute top-[24%] left-[7%] h-36 w-9 -rotate-3 opacity-30 dark:opacity-15">
        <span className="block h-4 bg-amber-100" />
        <span className="block h-25 bg-zinc-200 dark:bg-zinc-700" />
        <span className="block h-0 w-0 border-x-[18px] border-t-[28px] border-x-transparent border-t-zinc-200 dark:border-t-zinc-700" />
      </div>

      <div className="absolute top-[29%] right-[9%] h-10 w-8 bg-zinc-300 opacity-35 [clip-path:polygon(0_0,88%_68%,55%_69%,72%_100%,58%_100%,42%_71%,12%_95%)] dark:bg-zinc-600" />

      <div className="absolute bottom-[27%] left-[5%] grid size-16 place-items-center rounded-xl border-2 border-zinc-300 text-3xl text-zinc-300 opacity-35 dark:border-zinc-700 dark:text-zinc-700">
        T
      </div>

      <div className="absolute right-[7%] bottom-[18%] h-13 w-24 rotate-3 rounded-sm bg-emerald-200/55 opacity-45 dark:bg-emerald-900/50" />
    </div>
  );
}
