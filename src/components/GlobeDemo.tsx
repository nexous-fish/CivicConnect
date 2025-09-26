import { Globe } from "@/components/ui/globe";
export function GlobeDemo() {
  return <div className="relative flex size-full max-w-4xl items-center justify-center overflow-hidden mx-auto px-4 pb-20 pt-8 md:px-40 md:pb-40">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl md:text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        30+ Cities
      </span>
      <Globe className="top-28" />
      <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
    </div>;
}