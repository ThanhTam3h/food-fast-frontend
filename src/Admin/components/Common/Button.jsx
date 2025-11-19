export const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
}) => {
  const base = "px-6 py-3 rounded-lg font-medium transition-colors shadow-md";
  const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-red-500 text-red-500 hover:bg-red-50",
    secondary: "bg-blue-500 text-white hover:bg-blue-600",
  };
  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
