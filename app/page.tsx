import CanvasDecorations from "@/app/components/home/CanvasDecorations";
import ExperienceStrip from "@/app/components/home/ExperienceStrip";
import Hero from "@/app/components/home/Hero";
import WritingPreview from "@/app/components/home/WritingPreview";

export default function Home() {
  return (
    <main
      className="relative isolate min-h-[100dvh] overflow-hidden bg-stone-50 bg-[linear-gradient(rgba(24,24,27,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(24,24,27,0.055)_1px,transparent_1px)] bg-[size:3rem_3rem] text-zinc-950 sm:bg-[size:4.5rem_4.5rem] dark:bg-zinc-950 dark:bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] dark:text-zinc-100"
      id="main-content"
    >
      <CanvasDecorations />
      <Hero />
      <ExperienceStrip />
      <WritingPreview />
    </main>
  );
}
