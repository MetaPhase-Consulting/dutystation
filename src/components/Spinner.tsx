/**
 * Classy circular spinner in brand green. Muted gray ring with a colored
 * top arc that rotates. Accessible: role="status" + sr-only label so it
 * announces to screen readers.
 */

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  /** Accessible label. Rendered in sr-only text. */
  label?: string;
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

export function Spinner({ size = "md", label = "Loading", className = "" }: SpinnerProps) {
  return (
    <span role="status" aria-live="polite" className={`inline-block ${className}`}>
      <span
        className={`block ${SIZE_CLASSES[size]} animate-spin rounded-full border-muted border-t-[#0A4A0A]`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
