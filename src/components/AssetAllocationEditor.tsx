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
  Info,
  Save,
  Crown,
  Lock
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { PortfolioPieChart } from "@/components/PortfolioPieChart";
import { usePortfolioTargets } from "@/hooks/usePortfolioTargets";
import { usePortfolioLimit } from "@/hooks/usePortfolioLimit";

interface Asset {
  id?: string;
  symbol: string;
  name: string;
  allocation: number;
  color: string;
  risk?: "Low" | "Medium" | "High";
  rationale?: string;
}

interface AssetAllocationEditorProps {
  assets: Asset[];
  onAssetsChange: (assets: Asset[]) => void;
  portfolioName?: string;
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

export const AssetAllocationEditor = ({ assets, onAssetsChange, portfolioName = "My Portfolio" }: AssetAllocationEditorProps) => {
  const [viewMode, setViewMode] = useState<"chart" | "sliders">("chart");
  const [newAsset, setNewAsset] = useState({ symbol: "", name: "", allocation: 0 });
  const [currentHoldings, setCurrentHoldings] = useState<Record<string, number>>({});
  const { saving, saveAllocations } = usePortfolioTargets();
  const { hasProFeatures } = usePortfolioLimit();
  const totalAllocation = assets.reduce((sum, asset) => sum + asset.allocation, 0);
  const isBalanced = Math.abs(totalAllocation - 100) < 0.01;

  const updateAllocation = (id: string | undefined, newAllocation: number) => {
    if (!id) return;
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

  const removeAsset = (id: string | undefined) => {
    if (!id) return;
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
          <CardTitle className="text-title flex items-center gap-2">
            <PieChartIcon className="icon-md" />
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
              <PortfolioPieChart data={assets} className="h-full" />
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
            <div className="metric-label text-black">Assets</div>
            <div className="metric-secondary text-black">{assets.length}</div>
          </div>
          <div className="text-center">
            <div className="metric-label text-black">Diversification</div>
            <div className="metric-secondary flex items-center justify-center gap-1 text-black">
              <TrendingUp className="icon-sm text-black" />
              Good
            </div>
          </div>
          <div className="text-center">
            <div className="metric-label text-black">Risk Level</div>
            <div className="metric-secondary text-black">Moderate</div>
          </div>
        </div>

        <Separator />

        {/* Pro: Save & Current Holdings */}
        {hasProFeatures ? (
          <div className="space-y-6">
            {/* Current Holdings Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <Label className="text-sm font-semibold">Your Current Holdings</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter what percentage you currently hold in each asset class to enable drift detection.
              </p>
              <div className="space-y-2">
                {assets.map((asset) => (
                  <div key={`holding-${asset.id}`} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: asset.color }} />
                    <span className="text-sm font-medium w-16 truncate">{asset.symbol}</span>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      placeholder="0"
                      value={currentHoldings[asset.name] ?? ""}
                      onChange={(e) =>
                        setCurrentHoldings((prev) => ({
                          ...prev,
                          [asset.name]: Math.max(0, Math.min(100, Number(e.target.value))),
                        }))
                      }
                      className="w-20 h-8 text-sm"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={async () => {
                const allocations: Record<string, number> = {};
                assets.forEach((a) => {
                  allocations[a.name] = a.allocation;
                });
                await saveAllocations(portfolioName, allocations, currentHoldings);
              }}
              disabled={saving || !isBalanced}
              className="w-full flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Allocations & Holdings"}
            </Button>
            {!isBalanced && (
              <p className="text-xs text-muted-foreground text-center">
                Allocations must total 100% before saving.
              </p>
            )}
          </div>
        ) : (
          <div className="border border-dashed border-muted rounded-xl p-6 text-center space-y-3">
            <div className="flex justify-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm flex items-center justify-center gap-1">
                <Crown className="h-4 w-4 text-primary" /> Pro Feature
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Upgrade to Pro to save target allocations, track current holdings, and get drift alerts.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};