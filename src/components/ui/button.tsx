import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "luxury";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-foreground border border-transparent hover:bg-accent-soft active:translate-y-px shadow-premium-soft",
  secondary:
    "bg-surface-2 text-foreground border border-border-strong hover:bg-surface-3 hover:border-accent/40 active:translate-y-px shadow-premium-inset",
  ghost: "bg-transparent text-muted border border-transparent hover:text-foreground hover:bg-surface/70",
  luxury:
    "border border-white/[0.14] bg-[color-mix(in_srgb,var(--color-surface-2)_92%,transparent)] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_4px_18px_rgba(0,0,0,0.28)] hover:border-accent/50 hover:bg-[color-mix(in_srgb,var(--color-accent)_11%,var(--color-surface-2))] hover:text-foreground hover:shadow-[0_0_28px_rgba(196,165,116,0.2),inset_0_1px_0_rgba(255,255,255,0.12)] active:translate-y-px"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-body-sm",
  md: "h-10 px-5 text-body-sm",
  lg: "h-12 px-6 text-body"
};

const luxurySmSize =
  "h-10 min-h-10 rounded-full px-6 text-[0.8125rem] font-medium tracking-[0.06em]";

const interactionBase =
  "premium-ring inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-[0.01em] select-none touch-manipulation transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-200 ease-premium motion-reduce:transition-none";

export function buttonVisualClasses(options?: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const { variant = "primary", size = "md", className } = options ?? {};
  return cn(
    interactionBase,
    variantClasses[variant],
    variant === "luxury" && size === "sm" ? luxurySmSize : sizeClasses[size],
    className
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ className, variant = "primary", size = "md", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        buttonVisualClasses({ variant, size }),
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
