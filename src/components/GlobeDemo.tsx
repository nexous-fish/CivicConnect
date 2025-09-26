import { Globe } from "@/components/ui/globe";
export function GlobeDemo() {
  return <div className="relative flex size-full max-w-4xl items-center justify-center overflow-hidden mx-auto px-4 pb-32 pt-8 md:px-40 md:pb-40 min-h-[500px] md:min-h-[600px]">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl md:text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        30+ Cities
      </span>
      <Globe className="top-16 md:top-28 max-w-[300px] md:max-w-[600px]" />
      <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
    </div>;
}