import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "premium-ring h-11 w-full appearance-none rounded-lg border border-border bg-surface-2 px-3 pr-10 text-body-sm text-foreground shadow-premium-inset transition-[color,background-color,border-color,box-shadow,opacity] duration-200 ease-premium hover:border-border-strong hover:bg-surface-3/70 focus:border-accent disabled:cursor-not-allowed disabled:opacity-55",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">⌄</span>
    </div>
  );
}
