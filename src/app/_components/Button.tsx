interface Props {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "success";
  className?: string;
}

const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
}: Props) => {
  const baseStyles =
    "rounded-xl px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed";
  let variantStyles = "";

  switch (variant) {
    case "primary":
      variantStyles = disabled
        ? "border border-teal-600/20 bg-teal-700/30 text-white/80"
        : "border border-teal-700/90 bg-teal-700 text-white shadow-lg shadow-teal-900/20 hover:-translate-y-0.5 hover:bg-teal-800 focus-visible:ring-teal-700/70";
      break;
    case "secondary":
      variantStyles = disabled
        ? "border border-stone-600/15 bg-stone-400/20 text-stone-600"
        : "border border-stone-400/50 bg-white/75 text-stone-700 shadow-lg shadow-stone-900/10 hover:-translate-y-0.5 hover:bg-white focus-visible:ring-stone-500/60";
      break;
    case "danger":
      variantStyles = disabled
        ? "border border-red-700/20 bg-red-700/25 text-white/70"
        : "border border-red-800/90 bg-red-700 text-white shadow-lg shadow-red-950/20 hover:-translate-y-0.5 hover:bg-red-800 focus-visible:ring-red-700/60";
      break;
    case "success":
      variantStyles = disabled
        ? "border border-green-700/20 bg-green-800/30 text-white/70"
        : "border border-green-800/90 bg-green-700 text-white shadow-lg shadow-green-950/25 hover:-translate-y-0.5 hover:bg-green-800 focus-visible:ring-green-700/60";
      break;
    default:
      variantStyles = disabled
        ? "border border-teal-600/20 bg-teal-700/30 text-white/80"
        : "border border-teal-700/90 bg-teal-700 text-white shadow-lg shadow-teal-900/20 hover:-translate-y-0.5 hover:bg-teal-800 focus-visible:ring-teal-700/70";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
