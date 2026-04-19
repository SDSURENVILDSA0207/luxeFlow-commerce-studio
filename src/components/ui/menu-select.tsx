"use client";

import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import {
  dropdownListLinkActiveClassName,
  dropdownListLinkClassName,
  dropdownPanelClassName,
  nativeSelectControlClassName
} from "@/components/ui/dropdown-panel";
import { cn } from "@/lib/utils/cn";

export type MenuSelectOption = { value: string; label: string };

type MenuSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: MenuSelectOption[];
  "aria-label": string;
  className?: string;
};

/** Closed, or open with coordinates computed synchronously before paint (avoids 0,0 first frame). */
type MenuPanelState =
  | { status: "closed" }
  | { status: "open"; top: number; left: number; width: number };

const PORTAL_Z = 9999;

function computePanelRect(trigger: HTMLElement): Omit<Extract<MenuPanelState, { status: "open" }>, "status"> {
  const r = trigger.getBoundingClientRect();
  const minW = 240;
  const width = Math.max(r.width, minW);
  let left = r.left;
  const pad = 8;
  if (left + width > window.innerWidth - pad) {
    left = Math.max(pad, window.innerWidth - width - pad);
  }
  const top = r.bottom + 6;
  return { top, left, width };
}

/**
 * Custom sort/filter control — avoids native &lt;select&gt; popup.
 * List is portaled to document.body with position:fixed (escapes overflow-x-hidden on main).
 */
export function MenuSelect({ value, onChange, options, "aria-label": ariaLabel, className }: MenuSelectProps) {
  const [panel, setPanel] = useState<MenuPanelState>({ status: "closed" });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const baseId = useId();
  const listId = `${baseId}-listbox`;
  const triggerId = `${baseId}-trigger`;

  const open = panel.status === "open";

  const selected = options.find((o) => o.value === value) ?? options[0];

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    setPanel((p) => {
      if (p.status !== "open") return p;
      return { status: "open", ...computePanelRect(el) };
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, updatePosition]);

  /** Use "click" + defer — avoids same-gesture pointerdown races with opening tap. */
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setPanel({ status: "closed" });
    };
    const id = window.setTimeout(() => {
      document.addEventListener("click", onDocClick, true);
    }, 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("click", onDocClick, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel({ status: "closed" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = () => {
    setPanel((p) => {
      if (p.status === "open") return { status: "closed" };
      const el = triggerRef.current;
      if (!el) return { status: "closed" };
      return { status: "open", ...computePanelRect(el) };
    });
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      if (!open) {
        e.preventDefault();
        const el = triggerRef.current;
        if (!el) return;
        setPanel({ status: "open", ...computePanelRect(el) });
      }
    }
  };

  const menuNode =
    open && typeof document !== "undefined" ? (
      <ul
        ref={menuRef}
        id={listId}
        role="listbox"
        aria-labelledby={triggerId}
        style={{
          position: "fixed",
          top: panel.status === "open" ? panel.top : 0,
          left: panel.status === "open" ? panel.left : 0,
          width: panel.status === "open" ? panel.width : 280,
          zIndex: PORTAL_Z,
          isolation: "isolate" as const
        }}
        className={cn(
          "pointer-events-auto max-h-[min(70vh,22rem)] min-h-[2.5rem] overflow-y-auto overscroll-contain p-1.5",
          "text-foreground opacity-100",
          "motion-safe:animate-menu-pop",
          dropdownPanelClassName
        )}
      >
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <li key={opt.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                className={cn(
                  "flex w-full min-w-0 items-center gap-2.5 text-left text-foreground",
                  dropdownListLinkClassName,
                  isSelected && dropdownListLinkActiveClassName
                )}
                onClick={() => {
                  onChange(opt.value);
                  setPanel({ status: "closed" });
                }}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center text-[0.65rem]",
                    isSelected ? "text-accent-soft" : "text-transparent"
                  )}
                  aria-hidden
                >
                  ✓
                </span>
                <span className="min-w-0 flex-1">{opt.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    ) : null;

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        data-state={open ? "open" : "closed"}
        onClick={toggle}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          nativeSelectControlClassName,
          "inline-flex h-11 w-full min-w-0 items-center justify-between gap-2 text-left",
          "border-accent/30 hover:border-accent/45",
          open && "border-accent/70 bg-surface-3/90 shadow-[0_0_0_2px_rgba(196,165,116,0.22)]"
        )}
      >
        <span className="min-w-0 flex-1 truncate">{selected?.label}</span>
        <span
          className={cn("shrink-0 text-[0.65rem] text-muted/90 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        >
          ⌄
        </span>
      </button>

      {menuNode ? createPortal(menuNode, document.body) : null}
    </div>
  );
}
