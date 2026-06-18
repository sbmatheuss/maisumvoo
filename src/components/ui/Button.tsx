import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gold text-ink-950 border border-gold hover:bg-gold-dark hover:border-gold-dark font-semibold",
  secondary:
    "bg-transparent text-ink-100 border border-ink-400 hover:border-ink-100 hover:text-white",
  ghost:
    "bg-transparent text-ink-300 border border-transparent hover:text-ink-100",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5 tracking-widest",
  md: "text-xs px-5 py-2.5 tracking-widest",
  lg: "text-sm px-7 py-3.5 tracking-widest",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={clsx(
          "inline-flex items-center justify-center gap-2",
          "font-sans uppercase transition-colors duration-150",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        style={{ borderRadius: "2px" }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
