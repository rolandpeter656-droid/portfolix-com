import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface Asset {
  symbol: string;
  name: string;
  allocation: number;
  color: string;
}

interface PortfolioPieChartProps {
  data: Asset[];
  className?: string;
}

export const PortfolioPieChart = ({ data, className = "" }: PortfolioPieChartProps) => {
  const chartData = data.map((asset) => ({
    name: asset.symbol,
    fullName: asset.name,
    value: asset.allocation,
    color: asset.color,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{data.fullName}</p>
          <p className="text-sm text-muted-foreground">{data.name}</p>
          <p className="text-primary font-bold">{data.value.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full h-full min-h-[250px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value, entry: any) => (
              <span className="text-sm text-foreground">{value} ({entry.payload.value}%)</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
