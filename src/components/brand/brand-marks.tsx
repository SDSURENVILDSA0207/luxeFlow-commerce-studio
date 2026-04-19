"use client";

import { useId } from "react";
import { cn } from "@/lib/utils/cn";

/** LuxeFlow Studio — warm atelier mark (palette / horizon lines). */
export function StudioBrandMark({ className, title = "LuxeFlow Studio" }: { className?: string; title?: string }) {
  const gid = useId();
  const gradId = `studio-mark-${gid.replace(/:/g, "")}`;

  return (
    <svg
      className={cn("shrink-0", className)}
      width={28}
      height={28}
      viewBox="0 0 32 32"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={gradId} x1="6" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c9a66b" />
          <stop offset="1" stopColor="#7d5a3a" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="26" height="26" rx="8" fill={`url(#${gradId})`} opacity="0.92" />
      <path
        d="M10 12h12M10 16h12M10 20h8"
        stroke="#fdfbf7"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.95"
      />
      <circle cx="23" cy="21" r="2.25" fill="#fdfbf7" opacity="0.9" />
    </svg>
  );
}

/** Jewelry Admin — faceted gem / inventory mark (slate). */
export function JewelryAdminBrandMark({ className, title = "Jewelry Admin" }: { className?: string; title?: string }) {
  const gid = useId();
  const gradId = `ja-mark-${gid.replace(/:/g, "")}`;

  return (
    <svg
      className={cn("shrink-0", className)}
      width={28}
      height={28}
      viewBox="0 0 32 32"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={gradId} x1="8" y1="6" x2="24" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#546e7a" />
          <stop offset="1" stopColor="#263238" />
        </linearGradient>
      </defs>
      <path
        d="M16 4l10 8-10 20L6 12l10-8z"
        fill={`url(#${gradId})`}
        stroke="#eceff1"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M16 4v24M10 12h12" stroke="#cfd8dc" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
      <path d="M8 12l8 4 8-4" stroke="#eceff1" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
