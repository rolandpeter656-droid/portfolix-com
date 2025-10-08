import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { 
  PieChart as PieChartIcon, 
  Sliders, 
  Plus, 
  Trash2, 
  AlertTriangle,
  TrendingUp,
  RotateCcw,
  Info
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Asset {
  id: string;
  symbol: string;
  name: string;
  allocation: number;
  color: string;
  risk: "Low" | "Medium" | "High";
  rationale?: string;
}

interface AssetAllocationEditorProps {
  assets: Asset[];
  onAssetsChange: (assets: Asset[]) => void;
}

const COLORS = [
  "#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6",
  "#06b6d4", "#f97316", "#84cc16", "#ec4899", "#6366f1"
];

const RISK_COLORS = {
  Low: "#22c55e",
  Medium: "#f59e0b", 
  High: "#ef4444"
};

export const AssetAllocationEditor = ({ assets, onAssetsChange }: AssetAllocationEditorProps) => {
  const [viewMode, setViewMode] = useState<"chart" | "sliders">("chart");
  const [newAsset, setNewAsset] = useState({ symbol: "", name: "", allocation: 0 });

  const totalAllocation = assets.reduce((sum, asset) => sum + asset.allocation, 0);
  const isBalanced = Math.abs(totalAllocation - 100) < 0.01;

  const updateAllocation = (id: string, newAllocation: number) => {
    const updatedAssets = assets.map(asset =>
      asset.id === id ? { ...asset, allocation: Math.max(0, Math.min(100, newAllocation)) } : asset
    );
    onAssetsChange(updatedAssets);
  };

  const addAsset = () => {
    if (!newAsset.symbol || !newAsset.name) return;
    
    const asset: Asset = {
      id: Date.now().toString(),
      symbol: newAsset.symbol.toUpperCase(),
      name: newAsset.name,
      allocation: newAsset.allocation,
      color: COLORS[assets.length % COLORS.length],
      risk: "Medium"
    };
    
    onAssetsChange([...assets, asset]);
    setNewAsset({ symbol: "", name: "", allocation: 0 });
  };

  const removeAsset = (id: string) => {
    onAssetsChange(assets.filter(asset => asset.id !== id));
  };

  const rebalanceEqually = () => {
    const equalAllocation = 100 / assets.length;
    const rebalanced = assets.map(asset => ({
      ...asset,
      allocation: parseFloat(equalAllocation.toFixed(2))
    }));
    onAssetsChange(rebalanced);
  };

  const chartData = assets.map(asset => ({
    name: asset.symbol,
    value: asset.allocation,
    color: asset.color,
    fullName: asset.name
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.fullName}</p>
          <p className="text-primary font-medium">{data.value.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Asset Allocation Editor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isBalanced ? "default" : "destructive"} className="flex items-center gap-1">
              {!isBalanced && <AlertTriangle className="h-3 w-3" />}
              {totalAllocation.toFixed(1)}%
            </Badge>
            <Button
              size="sm"
              variant={viewMode === "chart" ? "default" : "outline"}
              onClick={() => setViewMode("chart")}
              className="flex items-center gap-1"
            >
              <PieChartIcon className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "sliders" ? "default" : "outline"}
              onClick={() => setViewMode("sliders")}
              className="flex items-center gap-1"
            >
              <Sliders className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Chart View */}
        {viewMode === "chart" && (
          <div className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {assets.map((asset) => (
                <div key={asset.id} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: asset.color }}
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{asset.symbol}</span>
                    {asset.symbol === "BTC" && asset.rationale && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p className="text-sm font-medium">Why Bitcoin?</p>
                            <p className="text-xs text-muted-foreground mt-1">{asset.rationale}</p>
                            <p className="text-xs text-destructive mt-2 font-medium">
                              ⚠️ Bitcoin is highly volatile. Only invest what you're prepared to hold long-term.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {asset.allocation.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sliders View */}
        {viewMode === "sliders" && (
          <div className="space-y-4">
            {assets.map((asset) => (
              <div key={asset.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: asset.color }}
                    />
                    <div className="flex items-center gap-1">
                      <Label className="font-medium">{asset.symbol}</Label>
                      {asset.symbol === "BTC" && asset.rationale && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm">
                              <p className="text-sm font-medium">Why Bitcoin?</p>
                              <p className="text-xs text-muted-foreground mt-1">{asset.rationale}</p>
                              <p className="text-xs text-destructive mt-2 font-medium">
                                ⚠️ Bitcoin is highly volatile. Only invest what you're prepared to hold long-term.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      style={{ 
                        borderColor: RISK_COLORS[asset.risk],
                        color: RISK_COLORS[asset.risk]
                      }}
                      className="text-xs"
                    >
                      {asset.risk}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={asset.allocation}
                      onChange={(e) => updateAllocation(asset.id, Number(e.target.value))}
                      className="w-16 h-7"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      onClick={() => removeAsset(asset.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Slider
                  value={[asset.allocation]}
                  onValueChange={([value]) => updateAllocation(asset.id, value)}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">{asset.name}</p>
              </div>
            ))}
          </div>
        )}

        <Separator />

        {/* Add New Asset */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Add New Asset</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="Symbol (e.g., AAPL)"
              value={newAsset.symbol}
              onChange={(e) => setNewAsset({...newAsset, symbol: e.target.value})}
              className="text-sm"
            />
            <Input
              placeholder="Company Name"
              value={newAsset.name}
              onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
              className="text-sm"
            />
            <div className="flex gap-1">
              <Input
                type="number"
                placeholder="0"
                value={newAsset.allocation || ""}
                onChange={(e) => setNewAsset({...newAsset, allocation: Number(e.target.value)})}
                className="text-sm w-16"
                min="0"
                max="100"
              />
              <Button size="sm" onClick={addAsset} className="flex items-center gap-1">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={rebalanceEqually}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-3 w-3" />
            Rebalance Equally
          </Button>
          {!isBalanced && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Total: {totalAllocation.toFixed(1)}% (Target: 100%)
            </Badge>
          )}
        </div>

        {/* Portfolio Metrics */}
        <div className="grid grid-cols-3 gap-4 p-3 bg-accent rounded-lg">
          <div className="text-center">
            <div className="text-sm font-bold text-black">Assets</div>
            <div className="font-medium text-black">{assets.length}</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-black">Diversification</div>
            <div className="font-medium flex items-center justify-center gap-1 text-black">
              <TrendingUp className="h-3 w-3 text-black" />
              Good
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-black">Risk Level</div>
            <div className="font-medium text-black">Moderate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};