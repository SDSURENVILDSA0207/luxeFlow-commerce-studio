import type { ReactNode } from "react";
import { StudioShell } from "@/components/layouts/studio-shell";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <StudioShell>{children}</StudioShell>;
}
