import CanvasDecorations from "@/app/components/home/CanvasDecorations";
import Hero from "@/app/components/home/Hero";
import SkillShow from "@/app/components/home/SkillShow";
import SkillsStrip from "@/app/components/home/SkillsStrip";
import WorkHistory from "@/app/components/home/WorkHistory";
import WritingPreview from "@/app/components/home/WritingPreview";

export default function Home() {
  return (
    <main
      className="relative min-h-[100dvh] bg-stone-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100"
      id="main-content"
    >
      <div className="relative isolate overflow-hidden bg-[linear-gradient(rgba(24,24,27,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(24,24,27,0.055)_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4.5rem_4.5rem] dark:bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)]">
        <CanvasDecorations />
        <Hero />
      </div>
      <SkillsStrip />
      <SkillShow />
      <WorkHistory />
      <WritingPreview />
    </main>
  );
}
