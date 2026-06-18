import { clsx } from "clsx";

type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-[3px]",
};

export default function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Carregando"
      className={clsx(
        "inline-block rounded-full",
        "border-ink-700 border-t-gold",
        "animate-spin",
        sizeMap[size],
        className
      )}
    />
  );
}
