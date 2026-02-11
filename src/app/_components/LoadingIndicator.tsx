interface LoadingIndicatorProps {
  isReadingImage: boolean;
  isSolving: boolean;
  isFormatting: boolean;
  isReadComplete: boolean;
  isSolveComplete: boolean;
  isFormatComplete: boolean;
}

const stepClasses = {
  idle: "border-stone-300/70 bg-white/70 text-stone-500",
  active: "border-teal-700/70 bg-teal-100/80 text-teal-900",
  done: "border-green-700/70 bg-green-100/80 text-green-900",
};

export const LoadingIndicator = ({
  isReadingImage,
  isSolving,
  isFormatting,
  isReadComplete,
  isSolveComplete,
  isFormatComplete,
}: LoadingIndicatorProps) => {
  const steps = [
    {
      label: "Reading image",
      state: isReadComplete ? "done" : isReadingImage ? "active" : "idle",
    },
    {
      label: "Computing with Wolfram",
      state: isSolveComplete ? "done" : isSolving ? "active" : "idle",
    },
    {
      label: "AI explanation and formatting",
      state: isFormatComplete ? "done" : isFormatting ? "active" : "idle",
    },
  ] as const;

  return (
    <div className="glass-card mt-2 w-full max-w-3xl rounded-2xl px-5 py-4">
      <p className="text-base font-semibold text-stone-700">
        Solving your problem...
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.label}
            className={`rounded-xl border px-3 py-2 text-sm font-semibold ${stepClasses[step.state]}`}
          >
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
};
