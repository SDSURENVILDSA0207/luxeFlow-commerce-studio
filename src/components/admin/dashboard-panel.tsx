import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

type DashboardPanelProps = {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function DashboardPanel({ id, title, subtitle, children }: DashboardPanelProps) {
  return (
    <Card id={id} className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
      <CardHeader className="border-b border-[#efe5d8]">
        <CardTitle className="text-heading-lg text-[#2f251b]">{title}</CardTitle>
        {subtitle ? <p className="mt-1 text-body-sm text-[#857765]">{subtitle}</p> : null}
      </CardHeader>
      <CardContent className="p-5">{children}</CardContent>
    </Card>
  );
}
