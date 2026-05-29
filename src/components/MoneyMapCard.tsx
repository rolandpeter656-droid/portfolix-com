import { forwardRef, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Asset {
  symbol: string;
  name: string;
  allocation: number;
  assetClass: string;
  color: string;
}

export interface MoneyMapCardProps {
  archetypeName: string;
  subtitle: string;
  portfolio: Asset[];
  monthlyContribution: number | null;
  years: number;
  assumedAnnualReturnPct: number; // e.g. 7 for 7%
  projectedFutureValue: number | null;
  currencySymbol?: string; // "$" or "₦"
  futureValueFormatted?: string; // pre-formatted compact string
}

// Compress a long allocations list into top 3 + "Other"
const summarizeAllocations = (portfolio: Asset[]) => {
  const sorted = [...portfolio].sort((a, b) => b.allocation - a.allocation);
  const top = sorted.slice(0, 3);
  const otherPct = sorted.slice(3).reduce((s, a) => s + a.allocation, 0);
  const result = top.map((a) => ({
    name: a.assetClass || a.name,
    value: a.allocation,
    color: a.color,
  }));
  if (otherPct > 0.5) {
    result.push({ name: "Other", value: Math.round(otherPct), color: "#6B7280" });
  }
  return result;
};

/**
 * Vertical share card sized ~1080x1350 for WhatsApp/IG/X.
 * Uses inline styles (not Tailwind utility classes) so html-to-image
 * captures faithfully even when stylesheets lag behind.
 */
export const MoneyMapCard = forwardRef<HTMLDivElement, MoneyMapCardProps>(
  (
    {
      archetypeName,
      subtitle,
      portfolio,
      monthlyContribution,
      years,
      assumedAnnualReturnPct,
      projectedFutureValue,
      currencySymbol = "$",
      futureValueFormatted,
    },
    ref
  ) => {
    const data = useMemo(() => summarizeAllocations(portfolio), [portfolio]);

    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          minHeight: 1350,
          background: "#0A0A0A",
          color: "#FFFFFF",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          padding: 64,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "linear-gradient(135deg, #14B8A6, #0D9488)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0A0A0A",
                fontWeight: 900,
                fontSize: 24,
              }}
            >
              P
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.3 }}>
              PortfoliX
            </div>
          </div>
          <div
            style={{
              fontSize: 14,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#9CA3AF",
              fontWeight: 600,
            }}
          >
            My Money Map
          </div>
        </div>

        {/* Hero */}
        <div>
          <div style={{ fontSize: 22, color: "#9CA3AF", marginBottom: 12, fontWeight: 500 }}>
            I'm
          </div>
          <div
            style={{
              fontSize: 88,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: -2,
              color: "#FFFFFF",
            }}
          >
            {archetypeName.split(" ").slice(0, -1).join(" ")}{" "}
            <span style={{ color: "#10B981" }}>
              {archetypeName.split(" ").slice(-1)[0]}
            </span>
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 26,
              color: "#D1D5DB",
              lineHeight: 1.4,
              maxWidth: 880,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Allocation block */}
        <div
          style={{
            background: "#1A1A1A",
            borderRadius: 24,
            padding: 36,
            display: "flex",
            gap: 36,
            alignItems: "center",
          }}
        >
          <div style={{ width: 260, height: 260, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={2}
                  stroke="#1A1A1A"
                  strokeWidth={3}
                  isAnimationActive={false}
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 18, color: "#9CA3AF", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
              My Mix
            </div>
            {data.map((d) => (
              <div
                key={d.name}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      background: d.color,
                    }}
                  />
                  <div style={{ fontSize: 22, fontWeight: 600, color: "#FFFFFF" }}>
                    {d.name}
                  </div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#14B8A6" }}>
                  {Math.round(d.value)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projection */}
        {monthlyContribution && projectedFutureValue ? (
          <div
            style={{
              background: "linear-gradient(135deg, rgba(20,184,166,0.12), rgba(16,185,129,0.06))",
              border: "1px solid rgba(20,184,166,0.3)",
              borderRadius: 24,
              padding: 36,
            }}
          >
            <div
              style={{
                fontSize: 18,
                color: "#9CA3AF",
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              The Map
            </div>
            <div style={{ fontSize: 30, color: "#D1D5DB", lineHeight: 1.4 }}>
              {currencySymbol}
              {monthlyContribution.toLocaleString()}/month could grow to
            </div>
            <div
              style={{
                fontSize: 96,
                fontWeight: 800,
                color: "#10B981",
                letterSpacing: -3,
                lineHeight: 1.05,
                marginTop: 8,
              }}
            >
              ~{futureValueFormatted || `${currencySymbol}${Math.round(projectedFutureValue).toLocaleString()}`}
            </div>
            <div style={{ fontSize: 22, color: "#D1D5DB", marginTop: 8 }}>
              in {years} years
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: 14,
                color: "#9CA3AF",
                lineHeight: 1.5,
                fontStyle: "italic",
              }}
            >
              Illustration based on an assumed {assumedAnnualReturnPct}% annual return.
              Not a prediction. Returns are not guaranteed and your actual results will differ.
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "#1A1A1A",
              borderRadius: 24,
              padding: 36,
              fontSize: 24,
              color: "#D1D5DB",
              lineHeight: 1.5,
            }}
          >
            My plan, my mix, my pace.
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: 20,
            borderTop: "1px solid #1F2937",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#9CA3AF",
            fontSize: 18,
          }}
        >
          <span>Built in 3 minutes on PortfoliX</span>
          <span style={{ color: "#14B8A6", fontWeight: 600 }}>portfolixapps.com</span>
        </div>
      </div>
    );
  }
);

MoneyMapCard.displayName = "MoneyMapCard";
