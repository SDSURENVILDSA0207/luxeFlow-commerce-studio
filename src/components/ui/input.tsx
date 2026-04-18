import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "premium-ring h-11 w-full rounded-lg border border-border bg-surface-2 px-3 text-body-sm text-foreground shadow-premium-inset placeholder:text-muted/75 transition-[color,background-color,border-color,box-shadow,opacity] duration-200 ease-premium hover:border-border-strong hover:bg-surface-3/70 focus:border-accent disabled:cursor-not-allowed disabled:opacity-55",
        className
      )}
      {...props}
    />
  );
}
