import { InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-sans text-xs uppercase tracking-widest text-ink-400"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full bg-ink-900 border border-ink-700",
            "text-ink-100 placeholder:text-ink-500",
            "px-3 py-2.5 text-sm font-sans",
            "outline-none ring-0",
            "focus:border-gold",
            "transition-colors duration-150",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            error && "border-red-500 focus:border-red-400",
            className
          )}
          style={{ borderRadius: "2px" }}
          {...props}
        />
        {error && (
          <span className="font-sans text-xs text-red-400">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
