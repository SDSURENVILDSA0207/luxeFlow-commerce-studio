import type { HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function TableWrapper({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("premium-panel min-w-0 overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch]", className)}
      {...props}
    />
  );
}

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn("w-full border-collapse text-left", className)} {...props} />;
}

export function TableHead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-surface-2/80 backdrop-blur", className)} {...props} />;
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn(className)} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b border-border/80 transition-colors duration-200 hover:bg-surface-2/45 last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

export function TableHeaderCell({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn("px-5 py-3 text-label-sm font-semibold uppercase tracking-[0.14em] text-muted/95", className)}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-5 py-3.5 text-body-sm text-foreground", className)} {...props} />;
}
