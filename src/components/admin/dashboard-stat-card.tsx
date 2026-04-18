import { Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils/cn";

type DashboardStatCardProps = {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
  className?: string;
};

export function DashboardStatCard({ label, value, delta, positive = true, className }: DashboardStatCardProps) {
  return (
    <Card
      className={cn(
        "h-full border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)] transition-[border-color,box-shadow] duration-200 group-hover:border-[#d5b98f] group-hover:shadow-[0_12px_32px_rgba(20,18,23,0.1)]",
        className
      )}
    >
      <CardContent className="space-y-2 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9b7b4b]">{label}</p>
        <p className="font-display text-display-lg text-[#2f251b]">{value}</p>
        <p className={`text-body-sm ${positive ? "text-[#52765a]" : "text-[#9c5f5f]"}`}>{delta}</p>
      </CardContent>
    </Card>
  );
}
