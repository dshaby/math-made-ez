import { HydrateClient } from "~/trpc/server";
import MathSolver from "./_components/MathSolver";
import Header from "./_components/Header";
import "katex/dist/katex.min.css";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="grain relative min-h-screen w-full overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 lg:gap-10">
          <Header />
          <MathSolver />
          <section
            id="tech-stack"
            className="glass-card rounded-3xl px-6 py-6 sm:px-8 sm:py-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-600">
              Tech Stack
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Next.js",
                "TypeScript",
                "tRPC",
                "OCR",
                "AI Reasoning",
                "Wolfram|Alpha API",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-stone-300/80 bg-white/80 px-3 py-1 text-sm font-semibold text-stone-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>
          <footer className="glass-card rounded-3xl px-6 py-5 text-sm text-stone-700 sm:px-8">
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#how-it-works"
                className="font-semibold text-teal-800 underline decoration-2 underline-offset-4"
              >
                How it works
              </a>
              <a
                href="https://github.com/dshaby/math-made-ez"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-teal-800 underline decoration-2 underline-offset-4"
              >
                Source code
              </a>
            </div>
          </footer>
        </div>
      </div>
    </HydrateClient>
  );
}
