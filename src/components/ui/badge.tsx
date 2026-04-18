import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "luxury";

const variantMap: Record<BadgeVariant, string> = {
  default: "bg-surface-2 text-muted border-border",
  accent: "bg-accent/20 text-accent-soft border-accent/45",
  success: "bg-success/15 text-success border-success/40",
  warning: "bg-warning/15 text-warning border-warning/40",
  luxury:
    "border border-accent/35 bg-[color-mix(in_srgb,var(--color-accent)_12%,rgba(12,10,14,0.75))] text-accent-soft shadow-[0_0_24px_rgba(196,165,116,0.12),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm"
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-label-sm font-semibold uppercase tracking-[0.14em]",
        variantMap[variant],
        className
      )}
      {...props}
    />
  );
}
