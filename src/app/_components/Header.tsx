export default function Header() {
  return (
    <header
      id="how-it-works"
      className="section-reveal glass-card relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10 sm:py-12"
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-teal-700/15 blur-2xl" />
      <div className="absolute -bottom-14 left-8 h-40 w-40 rounded-full bg-orange-700/10 blur-2xl" />
      <div className="relative flex flex-col items-center gap-6 text-center">
        <p className="rounded-full border border-black/10 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-600">
          Photo Math Solver
        </p>
        <h1 className="font-serif text-4xl font-semibold leading-tight text-stone-900 sm:text-6xl lg:text-7xl">
          Solve Math From{" "}
          <span className="relative inline-block italic text-teal-800">
            Any Photo
          </span>
        </h1>
        <h2 className="max-w-3xl text-lg font-medium text-stone-600 sm:text-2xl">
          Upload or capture a problem and get verified, step-by-step solutions
          in seconds.
        </h2>
        <p className="text-sm font-medium text-stone-600">
          Pipeline: OCR extraction, Wolfram|Alpha-backed computation, then AI
          explanation and formatting.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold tracking-wide text-stone-700">
          <span className="rounded-full border border-stone-300/70 bg-white/80 px-3 py-1">
            OCR for problem reading
          </span>
          <span className="rounded-full border border-stone-300/70 bg-white/80 px-3 py-1">
            AI for reasoning
          </span>
          <span className="rounded-full border border-stone-300/70 bg-white/80 px-3 py-1">
            Wolfram|Alpha for compute checks
          </span>
        </div>
        <details className="mt-3 w-full max-w-3xl rounded-2xl border border-stone-300/70 bg-white/75 p-4 text-left">
          <summary className="cursor-pointer text-sm font-semibold text-stone-800">
            How accuracy and explanations are generated
          </summary>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-stone-700">
            <li>OCR extracts equations from your uploaded image.</li>
            <li>AI builds a step-by-step explanation in readable language.</li>
            <li>
              Wolfram|Alpha is used for reliable computation checks where needed.
            </li>
          </ul>
        </details>
      </div>
    </header>
  );
}
