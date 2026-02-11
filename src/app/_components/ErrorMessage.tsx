interface Props {
  error: string;
}
export const ErrorMessage = ({ error }: Props) => {
  return (
    <div className="mt-2 w-full max-w-3xl overflow-x-auto rounded-2xl border border-red-300/60 bg-red-50/80 px-5 py-4 text-red-800 shadow-md shadow-red-900/5">
      <p className="text-sm font-semibold uppercase tracking-[0.15em]">Error</p>
      <p className="mt-1 text-base font-medium">{error}</p>
    </div>
  );
};
