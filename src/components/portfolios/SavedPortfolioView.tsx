import { useState } from "react";
import { ArrowLeft, Lock, Download, Settings, Zap, ExternalLink, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Portfolio3DPieChart } from "@/components/Portfolio3DPieChart";
import { SavedPortfolio } from "@/hooks/useSavedPortfolios";
import { useSavedPortfolios } from "@/hooks/useSavedPortfolios";

interface SavedPortfolioViewProps {
  portfolio: SavedPortfolio;
  onBack: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

const getRiskLabel = (riskScore: number) => {
  if (riskScore <= 25) return "Conservative";
  if (riskScore <= 50) return "Moderate";
  if (riskScore <= 75) return "Growth";
  return "Aggressive";
};

// Locked feature indicator component
const LockedFeature = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="relative cursor-not-allowed opacity-60">
        {children}
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <p className="text-sm">{label} - Available on Pro</p>
    </TooltipContent>
  </Tooltip>
);

export const SavedPortfolioView = ({ portfolio, onBack }: SavedPortfolioViewProps) => {
  const { updatePortfolioAmount } = useSavedPortfolios();
  const [investmentAmount, setInvestmentAmount] = useState(portfolio.investment_amount);
  const [isInputMode, setIsInputMode] = useState(false);
  const [isBrokerModalOpen, setIsBrokerModalOpen] = useState(false);

  const MIN_AMOUNT = 25;
  const MAX_AMOUNT = 250000;

  const handleAmountChange = async (value: number) => {
    const clampedValue = Math.max(MIN_AMOUNT, Math.min(MAX_AMOUNT, value));
    setInvestmentAmount(clampedValue);
    await updatePortfolioAmount(portfolio.id, clampedValue);
  };

  // Calculate metrics
  const calculateExpectedReturn = () => {
    const baseReturn = portfolio.risk_score * 0.12;
    return 4 + baseReturn;
  };

  const calculateVolatility = () => {
    return 5 + portfolio.risk_score * 0.15;
  };

  const expectedReturn = calculateExpectedReturn();
  const volatility = calculateVolatility();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold truncate">{portfolio.portfolio_name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{getRiskLabel(portfolio.risk_score)}</Badge>
                  <span>•</span>
                  <span>{portfolio.timeline}</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
              Free Plan
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
        {/* Investment Amount Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Investment Amount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {isInputMode ? (
                <Input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  onBlur={() => {
                    handleAmountChange(investmentAmount);
                    setIsInputMode(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAmountChange(investmentAmount);
                      setIsInputMode(false);
                    }
                  }}
                  className="text-2xl font-bold w-48"
                  min={MIN_AMOUNT}
                  max={MAX_AMOUNT}
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setIsInputMode(true)}
                  className="text-3xl sm:text-4xl font-bold text-foreground hover:text-primary transition-colors"
                >
                  {formatCurrency(investmentAmount)}
                </button>
              )}
            </div>
            <div className="space-y-2">
              <Slider
                value={[investmentAmount]}
                onValueChange={([value]) => handleAmountChange(value)}
                min={MIN_AMOUNT}
                max={MAX_AMOUNT}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatCurrency(MIN_AMOUNT)}</span>
                <span>{formatCurrency(MAX_AMOUNT)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio Metrics */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Portfolio Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
            </CardContent>
          </Card>

          {/* 3D Pie Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <Portfolio3DPieChart data={portfolio.assets} />
              </div>
            </CardContent>
          </Card>

          {/* AI Market Tracker - LOCKED */}
          <LockedFeature label="AI Market Tracker">
            <Card className="shadow-card border-2 border-dashed border-muted">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Zap className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-muted-foreground flex items-center gap-2">
                      AI Market Tracker
                      <Badge variant="secondary" className="text-xs">Pro</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Real-time AI-powered market optimization
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </LockedFeature>
        </div>

        {/* Portfolio Breakdown Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Portfolio Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Asset Class</TableHead>
                  <TableHead>Allocation</TableHead>
                  <TableHead>Investment</TableHead>
                  <TableHead className="hidden lg:table-cell">Rationale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.assets.map((asset) => (
                  <TableRow key={asset.symbol}>
                    <TableCell className="font-mono font-semibold">{asset.symbol}</TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        style={{ borderColor: asset.color, color: asset.color }}
                      >
                        {asset.assetClass}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatPercentage(asset.allocation)}</TableCell>
                    <TableCell>{formatCurrency(investmentAmount * asset.allocation / 100)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs hidden lg:table-cell">
                      {asset.rationale}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Dialog open={isBrokerModalOpen} onOpenChange={setIsBrokerModalOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Place Trades on Your Broker
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Broker Integration</DialogTitle>
                <DialogDescription>
                  Broker integration is coming soon! For now, you can view your portfolio allocation and place trades manually on your broker.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end">
                <Button onClick={() => setIsBrokerModalOpen(false)}>
                  Got it
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Customize - LOCKED */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="lg" className="flex items-center gap-2 opacity-60 cursor-not-allowed">
                <Settings className="h-4 w-4" />
                Customize Portfolio
                <Lock className="h-3 w-3 ml-1" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Available on Pro</TooltipContent>
          </Tooltip>

          {/* Export PDF - LOCKED */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="lg" className="flex items-center gap-2 opacity-60 cursor-not-allowed">
                <Download className="h-4 w-4" />
                Export as PDF
                <Lock className="h-3 w-3 ml-1" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Available on Pro</TooltipContent>
          </Tooltip>
        </div>

        {/* Legal Disclaimer */}
        <Card className="bg-muted/30 border-warning/20">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Legal Disclaimer:</strong> This portfolio was generated by AI based on your input. 
              While significant effort went into optimizing it, your investment decisions are entirely your own. 
              PortfoliX does not provide financial advice, and you are solely responsible for any trades you 
              place or outcomes from your investment choices. Past performance does not guarantee future results.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
