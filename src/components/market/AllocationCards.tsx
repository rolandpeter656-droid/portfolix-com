import { LineChart, ShieldCheck, Landmark, Coins, PieChart } from "lucide-react";
import type { AllocationRow } from "@/lib/marketRegions";

type Visual = {
  Icon: typeof LineChart;
  tint: string;
  bar: string;
  ring: string;
};

const EQUITY: Visual = {
  Icon: LineChart,
  tint: "text-[#14B8A6]",
  bar: "bg-[#14B8A6]",
  ring: "bg-[#14B8A6]/10 border-[#14B8A6]/25",
};
const BONDS: Visual = {
  Icon: ShieldCheck,
  tint: "text-[#10B981]",
  bar: "bg-[#10B981]",
  ring: "bg-[#10B981]/10 border-[#10B981]/25",
};
const CASH: Visual = {
  Icon: Landmark,
  tint: "text-sky-400",
  bar: "bg-sky-400",
  ring: "bg-sky-400/10 border-sky-400/25",
};
const COMMODITY: Visual = {
  Icon: Coins,
  tint: "text-amber-400",
  bar: "bg-amber-400",
  ring: "bg-amber-400/10 border-amber-400/25",
};
const OTHER: Visual = {
  Icon: PieChart,
  tint: "text-muted-foreground",
  bar: "bg-muted-foreground",
  ring: "bg-muted/40 border-border",
};

function visualFor(assetType: string): Visual {
  const t = (assetType || "").toLowerCase();
  if (t.includes("bond") || t.includes("fixed income") || t.includes("treasury")) return BONDS;
  if (t.includes("cash") || t.includes("saving") || t.includes("money market")) return CASH;
  if (t.includes("commodit") || t.includes("gold")) return COMMODITY;
  if (t.includes("equit") || t.includes("etf") || t.includes("stock") || t.includes("share")) return EQUITY;
  return OTHER;
}

export const AllocationCards = ({ rows }: { rows: AllocationRow[] }) => {
  if (!rows?.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {rows.map((row, i) => {
        const { Icon, tint, bar, ring } = visualFor(row.assetType);
        const pct = Math.max(0, Math.min(100, Number(row.percentage) || 0));
        return (
          <div
            key={`${row.assetType}-${i}`}
            className="rounded-xl border border-border bg-card/60 p-4 flex flex-col gap-3"
          >
            <div className="flex items-start gap-3">
              <div className={`h-9 w-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${ring}`}>
                <Icon className={`h-4 w-4 ${tint}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {row.assetType}
                </div>
                <div className="text-sm font-semibold text-foreground leading-snug">{row.name}</div>
              </div>
              <div className={`text-lg font-bold ${tint}`}>{pct}%</div>
            </div>

            <div className="h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
              <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
            </div>

            {row.rationale && (
              <p className="text-xs text-muted-foreground leading-relaxed">{row.rationale}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};
