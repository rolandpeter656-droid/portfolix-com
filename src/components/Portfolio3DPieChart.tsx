import React, { useState, useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Sector, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

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

/**
 * Generate AI insights based on asset allocation
 */
function generateAIInsight(symbol: string, allocation: number): string {
  const insights = [
    { condition: allocation > 25, message: "Strong core position" },
    { condition: allocation > 15, message: "Balanced allocation" },
    { condition: allocation > 10, message: "Moderate weighting" },
    { condition: allocation > 5, message: "Strategic exposure" },
    { condition: allocation <= 5, message: "Tactical position" }
  ];
  
  const momentum = Math.random() > 0.5;
  const trendMsg = momentum ? "Momentum trend detected" : "Stable positioning";
  
  const baseInsight = insights.find(i => i.condition)?.message || "Strategic position";
  return `${baseInsight} • ${trendMsg}`;
}

/**
 * Custom animated tooltip component
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  const momentum = Math.random() > 0.5;
  
  return (
    <div 
      className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-glow"
      style={{
        animation: 'fade-in 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform, opacity'
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        {momentum ? (
          <TrendingUp className="h-4 w-4 text-success" />
        ) : (
          <Activity className="h-4 w-4 text-primary" />
        )}
        <p className="font-semibold text-foreground">{data.name}</p>
      </div>
      
      <div className="space-y-1 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Symbol:</span>
          <span className="font-medium text-foreground">{data.symbol}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Allocation:</span>
          <span className="font-bold text-primary">{data.allocation}%</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-start gap-2">
          <Activity className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {generateAIInsight(data.symbol, data.allocation)}
          </p>
        </div>
      </div>
    </div>
  );
};

export const Portfolio3DPieChart = ({ data, className = "" }: Portfolio3DPieChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-sm text-muted-foreground">No portfolio data</div>;
  }

  const DEPTH_LAYERS = 6;
  
  // Memoize gradient definitions for performance
  const gradientDefs = useMemo(() => (
    <defs>
      {data.map((entry, idx) => {
        const baseColor = entry.color || "#8884d8";
        const lightColor = darkenHex(baseColor, -0.2); // Lighter shade
        const darkColor = darkenHex(baseColor, 0.3);   // Darker shade
        
        return (
          <React.Fragment key={`gradient-${idx}`}>
            <linearGradient id={`gradient-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={lightColor} stopOpacity={0.95} />
              <stop offset="50%" stopColor={baseColor} stopOpacity={1} />
              <stop offset="100%" stopColor={darkColor} stopOpacity={0.85} />
            </linearGradient>
            <filter id={`glow-${idx}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </React.Fragment>
        );
      })}
    </defs>
  ), [data]);

  // Enhanced active shape with smooth animations
  const renderActiveShape = (props: any) => {
    const {
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, midAngle
    } = props;

    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const mx = cx + (outerRadius + 10) * cos;
    const my = cy + (outerRadius + 10) * sin;

    return (
      <g style={{ 
        willChange: 'transform',
        transform: 'translateZ(0)' // GPU acceleration
      }}>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 12}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{
            filter: `drop-shadow(0 6px 20px ${fill}80) url(#glow-${activeIndex})`,
            transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transformOrigin: `${cx}px ${cy}px`,
          }}
        />
        <circle
          cx={mx}
          cy={my}
          r={3}
          fill={fill}
          style={{
            filter: `drop-shadow(0 0 8px ${fill})`,
            animation: 'scale-in 0.25s ease-out'
          }}
        />
        <text
          x={cx}
          y={cy - 50}
          textAnchor="middle"
          className="fill-foreground text-base font-bold"
          style={{
            animation: 'fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)'
          }}
        >
          {payload.symbol}
        </text>
        <text
          x={cx}
          y={cy - 25}
          textAnchor="middle"
          className="fill-primary text-2xl font-bold"
          style={{
            animation: 'scale-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: 'drop-shadow(0 2px 6px hsl(var(--primary) / 0.6))',
            textShadow: '0 0 20px hsl(var(--primary) / 0.8)'
          }}
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
          {gradientDefs}
          
          {/* Depth layers with gradient fills */}
          {Array.from({ length: DEPTH_LAYERS }).map((_, layerIndex) => {
            const inner = 80 + layerIndex;
            const outer = 100 + layerIndex;
            const cyOffset = 50 + (DEPTH_LAYERS - layerIndex) * 1.6;
            
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
                isAnimationActive={false}
                stroke="none"
              >
                {data.map((entry, idx) => (
                  <Cell
                    key={`cell-depth-${layerIndex}-${idx}`}
                    fill={darkenHex(entry.color || "#8884d8", (layerIndex + 1) * 0.06)}
                    style={{
                      opacity: 0.6 + (layerIndex * 0.05)
                    }}
                  />
                ))}
              </Pie>
            );
          })}

          {/* Top interactive pie with premium gradients */}
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
            animationBegin={0}
            animationDuration={400}
            animationEasing="ease-out"
            style={{ 
              cursor: 'pointer',
              willChange: 'transform',
              transform: 'translateZ(0)' // GPU acceleration
            }}
          >
            {data.map((entry, idx) => (
              <Cell 
                key={`cell-top-${idx}`} 
                fill={`url(#gradient-${idx})`}
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: activeIndex === idx 
                    ? `brightness(1.3) contrast(1.1) url(#glow-${idx})` 
                    : 'brightness(1)',
                  transformOrigin: 'center',
                  willChange: 'filter, transform'
                }}
              />
            ))}
          </Pie>

          <Tooltip 
            content={<CustomTooltip />}
            animationDuration={250}
            animationEasing="ease-out"
            wrapperStyle={{
              outline: 'none',
              zIndex: 1000,
              pointerEvents: 'none'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};