import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Sector } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface Asset {
  symbol: string;
  name: string;
  allocation: number;
  color: string;
}

interface Portfolio3DPieChartProps {
  data: Asset[];
  className?: string;
}

/**
 * Darken a hex color by `amount` (0..1).
 * Returns hex string like "#334455".
 */
function darkenHex(hex = "#8884d8", amount = 0.1) {
  const h = hex.replace("#", "");
  const num = parseInt(h.length === 3 ? h.split("").map(ch => ch+ch).join("") : h, 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;
  r = Math.max(0, Math.min(255, Math.round(r * (1 - amount))));
  g = Math.max(0, Math.min(255, Math.round(g * (1 - amount))));
  b = Math.max(0, Math.min(255, Math.round(b * (1 - amount))));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export const Portfolio3DPieChart = ({ data, className = "" }: Portfolio3DPieChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-sm text-muted-foreground">No portfolio data</div>;
  }

  // How many layered slices to render as the "depth" (adjust for stronger/deeper 3D)
  const DEPTH_LAYERS = 6;

  // Custom active shape renderer for hover effect
  const renderActiveShape = (props: any) => {
    const {
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{
            filter: 'drop-shadow(0 4px 12px rgba(0, 255, 255, 0.4))',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        />
        <text
          x={cx}
          y={cy - 40}
          textAnchor="middle"
          className="fill-foreground text-sm font-semibold animate-fade-in"
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy - 20}
          textAnchor="middle"
          className="fill-primary text-xl font-bold animate-scale-in"
        >
          {payload.allocation}%
        </text>
      </g>
    );
  };

  return (
    <ChartContainer config={{}} className={`h-[300px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Depth layers (rendered first, slightly offset and darker) */}
          {Array.from({ length: DEPTH_LAYERS }).map((_, layerIndex) => {
            // increase radius with layerIndex to create the stacked look
            const inner = 80 + layerIndex;
            const outer = 100 + layerIndex;
            // small vertical offset relative to the overall container
            const cyOffset = 50 + (DEPTH_LAYERS - layerIndex) * 1.6; // percent
            return (
              <Pie
                key={`depth-${layerIndex}`}
                data={data}
                dataKey="allocation"
                cx="50%"
                cy={`${cyOffset}%`}
                innerRadius={inner}
                outerRadius={outer}
                startAngle={90}
                endAngle={-270}
                paddingAngle={0}
                isAnimationActive={false} // keep preview stable
                stroke="none"
              >
                {data.map((entry, idx) => (
                  <Cell
                    key={`cell-depth-${layerIndex}-${idx}`}
                    fill={darkenHex(entry.color || "#8884d8", (layerIndex + 1) * 0.06)}
                  />
                ))}
              </Pie>
            );
          })}

          {/* Top (visible) pie with labels and interactive hover */}
          <Pie
            data={data}
            dataKey="allocation"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            startAngle={90}
            endAngle={-270}
            label={activeIndex === null ? ({ payload }) => `${payload.symbol} ${payload.allocation}%` : false}
            labelLine={false}
            activeIndex={activeIndex ?? undefined}
            activeShape={renderActiveShape}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            style={{ cursor: 'pointer' }}
          >
            {data.map((entry, idx) => (
              <Cell 
                key={`cell-top-${idx}`} 
                fill={entry.color || "#8884d8"}
                className="transition-all duration-250"
                style={{
                  filter: activeIndex === idx ? 'brightness(1.2)' : 'brightness(1)',
                }}
              />
            ))}
          </Pie>

          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};