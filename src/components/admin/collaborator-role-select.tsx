"use client";

import { createPortal } from "react-dom";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { adminNativeSelectClassName } from "@/components/ui/dropdown-panel";
import { cn } from "@/lib/utils/cn";

const ROLE_OPTIONS = [
  { value: "viewer", label: "Viewer" },
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Admin" }
] as const;

type CollaboratorRoleSelectProps = {
  id?: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

/**
 * Custom listbox: options render in a portal below the trigger so parent `overflow-hidden` (e.g. Card) cannot clip the panel.
 */
export function CollaboratorRoleSelect({ id, value, disabled, onChange }: CollaboratorRoleSelectProps) {
  const autoId = useId();
  const triggerId = id ?? autoId;
  const listboxId = `${triggerId}-listbox`;
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0, width: 0 });

  const updatePanelPos = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 8;
    let left = r.left;
    const width = r.width;
    if (left + width > window.innerWidth - pad) left = Math.max(pad, window.innerWidth - width - pad);
    setPanelPos({ top: r.bottom + 6, left, width });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePanelPos();
    const onScroll = () => updatePanelPos();
    const onResize = () => updatePanelPos();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    const idTimer = window.setTimeout(() => document.addEventListener("click", onDoc, true), 0);
    return () => {
      clearTimeout(idTimer);
      document.removeEventListener("click", onDoc, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const selected = ROLE_OPTIONS.find((o) => o.value === value) ?? ROLE_OPTIONS[1];

  const listEl = (
    <ul
      ref={panelRef}
      id={listboxId}
      role="listbox"
      tabIndex={-1}
      style={{
        position: "fixed",
        top: panelPos.top,
        left: panelPos.left,
        width: panelPos.width,
        zIndex: 100
      }}
      className={cn(
        "max-h-[min(40vh,16rem)] overflow-auto rounded-[0.625rem]",
        "border border-[#e0d3c3] bg-white py-1 shadow-[0_12px_40px_-8px_rgba(20,18,12,0.2)] ring-1 ring-black/[0.04]"
      )}
    >
      {ROLE_OPTIONS.map((opt) => (
        <li key={opt.value} role="presentation" className="px-1">
          <button
            type="button"
            role="option"
            aria-selected={value === opt.value}
            className={cn(
              "premium-ring flex w-full items-center gap-2 rounded-md px-2.5 py-2.5 text-left text-body-sm text-[#32271c]",
              value === opt.value ? "bg-[#fff9f0] font-medium" : "hover:bg-[#fbf7f1]"
            )}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
          >
            <span className="inline-flex w-4 shrink-0 justify-center text-[#9b7b4b]" aria-hidden>
              {value === opt.value ? "✓" : ""}
            </span>
            {opt.label}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          id={triggerId}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => {
            if (!disabled) setOpen((o) => !o);
          }}
          className={cn(
            adminNativeSelectClassName,
            "flex w-full items-center justify-between gap-2 text-left",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <span className="min-w-0 truncate">{selected.label}</span>
          <span className="shrink-0 text-[0.65rem] text-[#857765]" aria-hidden>
            ⌄
          </span>
        </button>
      </div>
      {open && typeof document !== "undefined" ? createPortal(listEl, document.body) : null}
    </>
  );
}
