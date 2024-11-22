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
    "px-4 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-offset-2";
  let variantStyles = "";

  switch (variant) {
    case "primary":
      variantStyles = disabled
        ? "bg-blue-300"
        : "bg-blue-500 hover:bg-blue-600";
      break;
    case "secondary":
      variantStyles = disabled
        ? "bg-purple-300"
        : "bg-purple-500 hover:bg-purple-600";
      break;
    case "danger":
      variantStyles = disabled ? "bg-red-300" : "bg-red-500 hover:bg-red-600";
      break;
    case "success":
      variantStyles = disabled
        ? "bg-green-300"
        : "bg-green-500 hover:bg-green-600";
      break;
    default:
      variantStyles = disabled
        ? "bg-blue-300"
        : "bg-blue-500 hover:bg-blue-600";
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
