export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "font-display font-semibold rounded-full px-6 py-2.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-zyqora-gradient text-white shadow-soft hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98]",
    secondary:
      "bg-white text-primary-600 border border-primary-100 hover:border-primary-300 hover:bg-primary-50",
    ghost:
      "text-ink hover:bg-primary-50",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}