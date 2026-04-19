import type { SelectHTMLAttributes } from "react";
import { nativeSelectControlClassName } from "@/components/ui/dropdown-panel";
import { cn } from "@/lib/utils/cn";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select className={cn(nativeSelectControlClassName, className)} {...props}>
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[0.65rem] text-muted/90" aria-hidden>
        ⌄
      </span>
    </div>
  );
}
