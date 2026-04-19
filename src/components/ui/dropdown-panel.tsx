import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Standard floating panel chrome for nav mega-menus, concierge, and similar surfaces.
 * Uses semantic theme tokens so it matches storefront + admin shells.
 */
export const dropdownPanelClassName = cn(
  "rounded-[0.625rem] border border-border/70",
  "bg-surface/[0.98] backdrop-blur-xl backdrop-saturate-150 text-foreground",
  "shadow-[0_14px_48px_-12px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)]",
  "ring-1 ring-inset ring-white/[0.04]"
);

/** Compact list panel (e.g. Campaigns column) */
export const dropdownPanelCompactClassName = cn(dropdownPanelClassName, "p-1.5");

/** Section label inside a dropdown (uppercase kicker) */
export const dropdownSectionLabelClassName =
  "text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted";

/** Accent section label (e.g. Featured) */
export const dropdownSectionLabelAccentClassName =
  "text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent-soft";

/** Primary interactive row — links in mega menu columns */
export const dropdownMenuLinkClassName = cn(
  "block min-h-[2.75rem] rounded-[0.375rem] px-2.5 py-2.5 text-body-sm leading-snug",
  "text-foreground/90 transition-colors duration-150 ease-out",
  "hover:bg-surface-2 hover:text-foreground",
  "focus-visible:bg-surface-2 focus-visible:outline-none"
);

/** Stacked list item (Campaigns flyout) */
export const dropdownListLinkClassName = cn(
  "block min-h-[2.75rem] rounded-[0.375rem] px-3 py-2.5 text-body-sm",
  "transition-colors duration-150 ease-out",
  "text-foreground/90 hover:bg-surface-2 hover:text-foreground",
  "focus-visible:bg-surface-2 focus-visible:outline-none"
);

export const dropdownListLinkActiveClassName = "bg-surface-2/90 font-medium text-foreground";

/** Inset highlight block (Featured column) */
export const dropdownFeaturedInsetClassName = cn(
  "rounded-[0.5rem] border border-border/60 bg-surface-2/55 p-4",
  "ring-1 ring-inset ring-white/[0.03]"
);

/** Closed native <select> control — storefront / shared tokens */
export const nativeSelectControlClassName = cn(
  "premium-ring h-11 w-full appearance-none rounded-[0.625rem] border border-border/85 bg-surface-2/95",
  "px-3 pr-10 text-body-sm text-foreground antialiased",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
  "transition-[border-color,background-color,box-shadow,color] duration-200 ease-out",
  "hover:border-border-strong hover:bg-surface-3/85",
  "focus:border-accent/70 focus:shadow-[0_0_0_3px_rgba(202,167,116,0.18)]",
  "disabled:cursor-not-allowed disabled:opacity-50"
);

/** Admin studio native <select> — warm paper field, matches admin inputs */
export const adminNativeSelectClassName = cn(
  "premium-ring h-10 w-full cursor-pointer rounded-[0.625rem] border border-[#ddcfbc] bg-[#fffdf9]",
  "px-3 py-2 text-body-sm text-[#32271c]",
  "shadow-[inset_0_1px_2px_rgba(44,36,28,0.06)]",
  "transition-[border-color,background-color,box-shadow] duration-200 ease-out",
  "hover:border-[#cfc0ae] hover:bg-white",
  "focus:border-[#c9a66b] focus:outline-none focus:ring-2 focus:ring-[#c9a66b]/22"
);

type DropdownPanelProps = HTMLAttributes<HTMLDivElement>;

export function DropdownPanel({ className, children, ...props }: DropdownPanelProps) {
  return (
    <div className={cn(dropdownPanelClassName, className)} {...props}>
      {children}
    </div>
  );
}

export function DropdownSectionLabel({ className, accent, ...props }: HTMLAttributes<HTMLParagraphElement> & { accent?: boolean }) {
  return (
    <p
      className={cn(accent ? dropdownSectionLabelAccentClassName : dropdownSectionLabelClassName, className)}
      {...props}
    />
  );
}
