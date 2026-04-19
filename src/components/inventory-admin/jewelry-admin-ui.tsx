"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils/cn";

export function AdminSection({ title, description, actions, children }: { title: string; description?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-[#cfd8dc] bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#eceff1] px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
        <div className="min-w-0">
          <h2 className="font-display text-lg text-[#263238]">{title}</h2>
          {description ? <p className="mt-1 text-sm text-[#546e7a]">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function AdminModal({
  open,
  title,
  onClose,
  children,
  footer
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const reactId = useId();
  const titleId = `admin-modal-h-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => {
      panelRef.current?.focus();
    }, 0);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close dialog" onClick={onClose} />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative z-10 flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-[#cfd8dc] bg-white shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#546e7a] focus-visible:ring-offset-2 sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#eceff1] px-5 py-4">
          <h3 id={titleId} className="min-w-0 flex-1 font-display text-lg text-[#263238]">
            {title}
          </h3>
          <button
            type="button"
            className="shrink-0 rounded-lg px-3 py-2 text-sm text-[#546e7a] hover:bg-[#eceff1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#546e7a]"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
        {footer ? <div className="shrink-0 border-t border-[#eceff1] px-5 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}

export const adminInputClass = cn(
  "w-full rounded-lg border border-[#b0bec5] bg-white px-3 py-2 text-sm text-[#263238] shadow-sm",
  "placeholder:text-[#90a4ae] focus:border-[#546e7a] focus:outline-none focus:ring-2 focus:ring-[#b0bec5]/80"
);

const selectChevron =
  "[background-image:url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20stroke%3D%22%23607d8b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem] bg-[position:right_0.65rem_center] bg-no-repeat";

export const adminSelectClass = cn(
  "min-h-[2.75rem] w-full appearance-none rounded-lg border border-[#b0bec5] bg-white px-3 py-2.5 pr-10 text-sm text-[#263238] shadow-sm",
  selectChevron,
  "focus:border-[#546e7a] focus:outline-none focus:ring-2 focus:ring-[#b0bec5]/80",
  "disabled:cursor-not-allowed disabled:opacity-60"
);

export const adminTableWrapClass = "overflow-x-auto rounded-lg border border-[#eceff1] [-webkit-overflow-scrolling:touch]";

export function AdminEmptyRow({ colSpan, title, hint }: { colSpan: number; title: string; hint?: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="border-b border-[#eceff1] bg-[#fafbfc] px-4 py-12 text-center">
        <p className="text-sm font-medium text-[#546e7a]">{title}</p>
        {hint ? <p className="mt-1 text-sm text-[#90a4ae]">{hint}</p> : null}
      </td>
    </tr>
  );
}

export const adminThClass = "border-b border-[#eceff1] bg-[#f4f6f8] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#607d8b]";

export const adminTdClass = "border-b border-[#eceff1] px-3 py-2.5 align-middle text-sm text-[#37474f]";

export function AdminPrimaryButton({
  children,
  onClick,
  disabled,
  type = "button"
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#263238] px-4 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function AdminGhostButton({ children, onClick, disabled }: { children: ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#b0bec5] bg-white px-3 text-sm font-medium text-[#455a64] hover:bg-[#eceff1] disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function StatusPill({ tone, children }: { tone: "ok" | "warn" | "bad" | "neutral"; children: ReactNode }) {
  const cls =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-900 border-emerald-200"
      : tone === "warn"
        ? "bg-amber-50 text-amber-950 border-amber-200"
        : tone === "bad"
          ? "bg-rose-50 text-rose-950 border-rose-200"
          : "bg-[#eceff1] text-[#455a64] border-[#cfd8dc]";
  return <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide", cls)}>{children}</span>;
}
