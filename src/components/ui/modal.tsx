"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils/cn";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ open, title, description, onClose, children, footer }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      panelRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[min(90dvh,880px)] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border-strong bg-surface shadow-premium-lg outline-none",
          "animate-in fade-in-0 zoom-in-95 duration-300"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
          <div className="min-w-0 flex-1">
            <h3 id={titleId} className="text-heading-xl">
              {title}
            </h3>
            {description ? (
              <p id={descriptionId} className="mt-2 text-body-sm text-muted">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="premium-ring -mr-1 -mt-1 inline-flex h-10 min-h-10 min-w-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-border-strong hover:text-foreground"
            onClick={onClose}
            aria-label="Close"
          >
            <span aria-hidden className="text-lg leading-none">
              ×
            </span>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6">{children}</div>
        {footer ? <div className="shrink-0 border-t border-border p-5 sm:p-6">{footer}</div> : null}
      </div>
    </div>
  );
}
