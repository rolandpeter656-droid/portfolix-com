import { useState, useEffect } from "react";
import { ArrowLeft, Download, ExternalLink, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface Asset {
  symbol: string;
  name: string;
  allocation: number;
  rationale: string;
  assetClass: string;
  color: string;
}

interface PortfolioSummaryProps {
  riskScore: number;
  experienceLevel: "beginner" | "intermediate" | "advanced";
  onBack: () => void;
  onCustomize: () => void;
}

const PortfolioSummary = ({ riskScore, experienceLevel, onBack, onCustomize }: PortfolioSummaryProps) => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000);
  const [isInputMode, setIsInputMode] = useState(false);

  // Suggested amounts based on experience level
  const getSuggestedAmount = () => {
    switch (experienceLevel) {
      case "beginner": return 500;
      case "intermediate": return 5000;
      case "advanced": return 25000;
      default: return 1000;
    }
  };

  const getAmountLimits = () => {
    switch (experienceLevel) {
      case "beginner": return { min: 25, max: 1000 };
      case "intermediate": return { min: 1000, max: 50000 };
      case "advanced": return { min: 50000, max: 1000000 };
      default: return { min: 25, max: 1000 };
    }
  };

  useEffect(() => {
    setInvestmentAmount(getSuggestedAmount());
  }, [experienceLevel]);

  // Generate AI portfolio based on risk score
  const generatePortfolio = (): Asset[] => {
    if (riskScore <= 25) {
      return [
        { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 60, rationale: "Low-risk bond exposure for stability", assetClass: "Bonds", color: "#8B5CF6" },
        { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 30, rationale: "Broad US equity exposure", assetClass: "US Stocks", color: "#10B981" },
        { symbol: "VTEB", name: "Vanguard Tax-Exempt Bond", allocation: 10, rationale: "Tax-efficient income generation", assetClass: "Municipal Bonds", color: "#F59E0B" }
      ];
    } else if (riskScore <= 50) {
      return [
        { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 50, rationale: "Core US equity holding", assetClass: "US Stocks", color: "#10B981" },
        { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 30, rationale: "Stability and income", assetClass: "Bonds", color: "#8B5CF6" },
        { symbol: "VTIAX", name: "Vanguard Total International", allocation: 20, rationale: "International diversification", assetClass: "International", color: "#EF4444" }
      ];
    } else if (riskScore <= 75) {
      return [
        { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 60, rationale: "Primary growth engine", assetClass: "US Stocks", color: "#10B981" },
        { symbol: "VTIAX", name: "Vanguard Total International", allocation: 25, rationale: "Global diversification", assetClass: "International", color: "#EF4444" },
        { symbol: "VNQ", name: "Vanguard Real Estate", allocation: 10, rationale: "Real estate exposure", assetClass: "REITs", color: "#F59E0B" },
        { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 5, rationale: "Minimal bond allocation", assetClass: "Bonds", color: "#8B5CF6" }
      ];
    } else {
      return [
        { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 50, rationale: "Core equity position", assetClass: "US Stocks", color: "#10B981" },
        { symbol: "VGT", name: "Vanguard Technology", allocation: 20, rationale: "Growth-focused tech exposure", assetClass: "Technology", color: "#06B6D4" },
        { symbol: "VTIAX", name: "Vanguard Total International", allocation: 15, rationale: "International growth", assetClass: "International", color: "#EF4444" },
        { symbol: "VNQ", name: "Vanguard Real Estate", allocation: 10, rationale: "Alternative asset class", assetClass: "REITs", color: "#F59E0B" },
        { symbol: "ARKK", name: "ARK Innovation ETF", allocation: 5, rationale: "High-growth innovation", assetClass: "Growth", color: "#8B5CF6" }
      ];
    }
  };

  const portfolio = generatePortfolio();
  const expectedReturn = 6 + (riskScore / 100) * 6; // 6-12% based on risk
  const volatility = 5 + (riskScore / 100) * 15; // 5-20% based on risk
  const diversificationScore = Math.max(60, 100 - riskScore * 0.4);

  const limits = getAmountLimits();

  const handleAmountChange = (value: number[]) => {
    setInvestmentAmount(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    if (value >= limits.min && value <= limits.max) {
      setInvestmentAmount(value);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const chartConfig = {
    allocation: {
      label: "Allocation %",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Your AI-Generated Portfolio</h1>
              <p className="text-muted-foreground">Personalized based on your risk assessment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Investment Amount Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Investment Amount
              <Badge variant="secondary">
                {experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount">Amount to Invest</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsInputMode(!isInputMode)}
                >
                  {isInputMode ? "Use Slider" : "Type Amount"}
                </Button>
              </div>
              
              {isInputMode ? (
                <div className="space-y-2">
                  <Input
                    type="number"
                    value={investmentAmount}
                    onChange={handleInputChange}
                    min={limits.min}
                    max={limits.max}
                    className="text-lg font-semibold"
                  />
                  <p className="text-sm text-muted-foreground">
                    Range: {formatCurrency(limits.min)} - {formatCurrency(limits.max)}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {formatCurrency(investmentAmount)}
                    </div>
                  </div>
                  <Slider
                    value={[investmentAmount]}
                    onValueChange={handleAmountChange}
                    min={limits.min}
                    max={limits.max}
                    step={limits.min < 1000 ? 25 : 1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatCurrency(limits.min)}</span>
                    <span>{formatCurrency(limits.max)}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Portfolio Metrics */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Portfolio Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-card rounded-lg">
                  <div className="text-2xl font-bold text-success">
                    {formatPercentage(expectedReturn)}
                  </div>
                  <div className="text-sm text-muted-foreground">Expected Return</div>
                </div>
                <div className="text-center p-4 bg-gradient-card rounded-lg">
                  <div className="text-2xl font-bold text-warning">
                    {formatPercentage(volatility)}
                  </div>
                  <div className="text-sm text-muted-foreground">Volatility</div>
                </div>
                <div className="text-center p-4 bg-gradient-card rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {formatPercentage(diversificationScore)}
                  </div>
                  <div className="text-sm text-muted-foreground">Diversification</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Allocation Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolio}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="allocation"
                      label={({ symbol, allocation }) => `${symbol} ${allocation}%`}
                    >
                      {portfolio.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Breakdown Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Portfolio Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Asset Class</TableHead>
                  <TableHead>Allocation</TableHead>
                  <TableHead>Investment</TableHead>
                  <TableHead>Rationale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.map((asset) => (
                  <TableRow key={asset.symbol}>
                    <TableCell className="font-mono font-semibold">{asset.symbol}</TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" style={{ borderColor: asset.color, color: asset.color }}>
                        {asset.assetClass}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatPercentage(asset.allocation)}</TableCell>
                    <TableCell>{formatCurrency(investmentAmount * asset.allocation / 100)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs">
                      {asset.rationale}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Place Trades on My Broker
          </Button>
          <Button variant="outline" size="lg" onClick={onCustomize} className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Customize Portfolio Further
          </Button>
          <Button variant="outline" size="lg" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Portfolio as PDF
          </Button>
        </div>

        {/* Legal Disclaimer */}
        <Card className="bg-muted/30 border-warning/20">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Legal Disclaimer:</strong> This portfolio was generated by AI based on your input. 
              While significant effort went into optimizing it, your investment decisions are entirely your own. 
              PortfoliX does not provide financial advice, and you are solely responsible for any trades you 
              place or outcomes from your investment choices. Past performance does not guarantee future results. 
              Please consult with a qualified financial advisor before making investment decisions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioSummary;