import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Brain, 
  Users, 
  Save, 
  Download, 
  GitCompare,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Edit3,
  Plus,
  Trash2,
  Eye,
  Lightbulb,
  RefreshCw
} from "lucide-react";

interface Asset {
  id: string;
  symbol: string;
  name: string;
  allocation: number;
  currentPrice: number;
  change: number;
  risk: "Low" | "Medium" | "High";
}

interface PortfolioWorkspaceProps {
  riskScore: number;
}

export const PortfolioWorkspace = ({ riskScore }: PortfolioWorkspaceProps) => {
  const [portfolioName, setPortfolioName] = useState("Global Growth Portfolio");
  const [assets, setAssets] = useState<Asset[]>([
    { id: "1", symbol: "AAPL", name: "Apple Inc.", allocation: 15, currentPrice: 182.52, change: 2.3, risk: "Medium" },
    { id: "2", symbol: "MSFT", name: "Microsoft Corp.", allocation: 12, currentPrice: 378.85, change: -0.8, risk: "Medium" },
    { id: "3", symbol: "GOOGL", name: "Alphabet Inc.", allocation: 10, currentPrice: 140.45, change: 1.2, risk: "Medium" },
    { id: "4", symbol: "VTI", name: "Vanguard Total Stock Market ETF", allocation: 20, currentPrice: 245.67, change: 0.5, risk: "Low" },
    { id: "5", symbol: "BND", name: "Vanguard Total Bond Market ETF", allocation: 25, currentPrice: 78.23, change: -0.2, risk: "Low" },
    { id: "6", symbol: "VEA", name: "Vanguard FTSE Europe ETF", allocation: 18, currentPrice: 52.14, change: 1.8, risk: "Medium" },
  ]);

  const [collaborators] = useState([
    { id: "1", name: "You", status: "online", role: "Portfolio Manager" },
    { id: "2", name: "AI Assistant", status: "active", role: "AI Analyst" },
    { id: "3", name: "John Smith", status: "online", role: "Risk Analyst" },
  ]);

  const totalAllocation = assets.reduce((sum, asset) => sum + asset.allocation, 0);

  const updateAllocation = (id: string, newAllocation: number) => {
    setAssets(assets.map(asset => 
      asset.id === id ? { ...asset, allocation: newAllocation } : asset
    ));
  };

  const removeAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };

  const aiSuggestions = [
    {
      id: "1",
      type: "rebalance",
      title: "Rebalance Recommendation",
      description: "Your tech allocation is high (37%). Consider reducing AAPL to 12% and increasing bond allocation.",
      impact: "+0.3% expected return, -2% volatility",
      confidence: 85
    },
    {
      id: "2",
      type: "addition",
      title: "Add Emerging Markets",
      description: "Consider adding VWO (Vanguard Emerging Markets ETF) at 5% allocation for diversification.",
      impact: "+0.8% expected return, +1% volatility",
      confidence: 78
    },
    {
      id: "3",
      type: "risk",
      title: "Risk Assessment",
      description: "Current portfolio volatility is 14.2%, which matches your risk profile well.",
      impact: "Portfolio aligned with risk tolerance",
      confidence: 92
    },
    {
      id: "4",
      type: "opportunity",
      title: "Market Opportunity",
      description: "Nigeria's banking sector showing strong fundamentals. Consider FBNH or GTCO exposure.",
      impact: "Local market exposure, currency diversification",
      confidence: 71
    }
  ];

  return (
    <section className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">Portfolio Workspace</h1>
              <Separator orientation="vertical" className="h-6" />
              <Input 
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                className="w-64 font-medium"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Load
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <GitCompare className="h-4 w-4" />
                Compare
              </Button>
            </div>
          </div>

          {/* Real-time Collaboration Stub */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Collaborators:</span>
            </div>
            <div className="flex items-center gap-2">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    collaborator.status === "online" ? "bg-success" : 
                    collaborator.status === "active" ? "bg-primary" : "bg-muted-foreground"
                  }`} />
                  <span className="text-sm">{collaborator.name}</span>
                  <Badge variant="secondary" className="text-xs">{collaborator.role}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel: Current Portfolio */}
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Current Portfolio
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={totalAllocation === 100 ? "default" : "destructive"}>
                    {totalAllocation}% Allocated
                  </Badge>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Plus className="h-3 w-3" />
                    Add Asset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Allocation</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{asset.symbol}</div>
                          <div className="text-sm text-muted-foreground">{asset.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={asset.allocation}
                          onChange={(e) => updateAllocation(asset.id, Number(e.target.value))}
                          className="w-20"
                          min="0"
                          max="100"
                        />
                      </TableCell>
                      <TableCell>${asset.currentPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 ${
                          asset.change >= 0 ? "text-success" : "text-destructive"
                        }`}>
                          {asset.change >= 0 ? 
                            <TrendingUp className="h-3 w-3" /> : 
                            <TrendingDown className="h-3 w-3" />
                          }
                          {asset.change >= 0 ? "+" : ""}{asset.change}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            asset.risk === "Low" ? "default" :
                            asset.risk === "Medium" ? "secondary" : "destructive"
                          }
                          className="text-xs"
                        >
                          {asset.risk}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => removeAsset(asset.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Portfolio Summary */}
              <div className="mt-6 p-4 bg-accent rounded-lg">
                <h4 className="font-medium mb-3">Portfolio Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Total Value</Label>
                    <p className="font-medium">$125,430</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Expected Return</Label>
                    <p className="font-medium text-success">10.2%</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Risk Level</Label>
                    <p className="font-medium">Moderate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Panel: AI Suggestions */}
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Suggestions
                </CardTitle>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto space-y-4">
              {aiSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      {suggestion.type === "rebalance" && <RefreshCw className="h-4 w-4 text-primary" />}
                      {suggestion.type === "addition" && <Plus className="h-4 w-4 text-primary" />}
                      {suggestion.type === "risk" && <AlertTriangle className="h-4 w-4 text-primary" />}
                      {suggestion.type === "opportunity" && <Lightbulb className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{suggestion.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.confidence}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {suggestion.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-primary font-medium">
                          {suggestion.impact}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            Apply
                          </Button>
                          <Button size="sm" variant="ghost" className="text-xs h-7">
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="p-4 bg-gradient-primary rounded-lg text-white">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Analysis Summary
                </h4>
                <p className="text-sm text-white/90 mb-3">
                  Your portfolio is well-diversified but could benefit from reduced tech concentration 
                  and increased international exposure.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span>Overall Score: <strong>8.2/10</strong></span>
                  <Button size="sm" variant="secondary" className="h-7">
                    View Full Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};