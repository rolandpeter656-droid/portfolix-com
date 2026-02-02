import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Download, Settings, Crown, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PortfolioPieChart } from "@/components/PortfolioPieChart";
import { PortfolioSuccessAnimation } from "@/components/PortfolioSuccessAnimation";
import { UpgradeModal } from "@/components/UpgradeModal";
import { ImplementationGuide } from "@/components/ImplementationGuide";
import { useToast } from "@/hooks/use-toast";
import { usePortfolioLimit } from "@/hooks/usePortfolioLimit";
import { useSavedPortfolios } from "@/hooks/useSavedPortfolios";
import { useWelcomeEmail } from "@/hooks/useWelcomeEmail";
import { useAuth } from "@/hooks/useAuth";
import { ProSuggestionsPanel, RiskScoreCard, RebalancingAlerts } from "@/components/pro";
import { analytics } from "@/lib/analytics";
import jsPDF from 'jspdf';
import { Link } from "react-router-dom";

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
  timeline: string;
  onBack: () => void;
  onCustomize: (portfolio: Asset[], name: string) => void;
}

// 12 Core Portfolio Strategies
const PORTFOLIO_STRATEGIES = {
  conservativeRetirement: {
    name: "Conservative Retirement Portfolio",
    description: "Prioritizes capital preservation for investors approaching retirement",
    assets: [
      { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 50, rationale: "Core bond holding for stable income and capital preservation", assetClass: "Bonds", color: "#8B5CF6" },
      { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 25, rationale: "Broad US market exposure for modest growth", assetClass: "US Stocks", color: "#10B981" },
      { symbol: "VXUS", name: "Vanguard Total International", allocation: 10, rationale: "International diversification", assetClass: "International", color: "#06B6D4" },
      { symbol: "VNQ", name: "Vanguard Real Estate", allocation: 10, rationale: "Real estate for inflation protection", assetClass: "REITs", color: "#F59E0B" },
      { symbol: "SHY", name: "iShares 1-3 Year Treasury", allocation: 5, rationale: "Short-term safety and liquidity", assetClass: "Short-Term Bonds", color: "#EF4444" }
    ]
  },
  balancedRetirement: {
    name: "Balanced Retirement Portfolio",
    description: "Equal focus on growth and stability for mid-retirement planning",
    assets: [
      { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 40, rationale: "Core US equity exposure", assetClass: "US Stocks", color: "#10B981" },
      { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 35, rationale: "Bond stability for income generation", assetClass: "Bonds", color: "#8B5CF6" },
      { symbol: "VXUS", name: "Vanguard Total International", allocation: 15, rationale: "Global diversification", assetClass: "International", color: "#06B6D4" },
      { symbol: "VNQ", name: "Vanguard Real Estate", allocation: 10, rationale: "Real estate income and inflation hedge", assetClass: "REITs", color: "#F59E0B" }
    ]
  },
  aggressiveRetirement: {
    name: "Aggressive Retirement Portfolio",
    description: "Growth-focused strategy for early retirement savers with long horizons",
    assets: [
      { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 50, rationale: "Core US equity for long-term growth", assetClass: "US Stocks", color: "#10B981" },
      { symbol: "VXUS", name: "Vanguard Total International", allocation: 25, rationale: "International growth opportunities", assetClass: "International", color: "#06B6D4" },
      { symbol: "VNQ", name: "Vanguard Real Estate", allocation: 10, rationale: "Real estate diversification", assetClass: "REITs", color: "#F59E0B" },
      { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 15, rationale: "Bond allocation for stability", assetClass: "Bonds", color: "#8B5CF6" }
    ]
  },
  conservativeGrowth: {
    name: "Conservative Growth Portfolio",
    description: "Steady growth with lower volatility for cautious investors",
    assets: [
      { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 35, rationale: "Broad US market exposure", assetClass: "US Stocks", color: "#10B981" },
      { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 35, rationale: "Fixed income stability", assetClass: "Bonds", color: "#8B5CF6" },
      { symbol: "VXUS", name: "Vanguard Total International", allocation: 15, rationale: "International diversification", assetClass: "International", color: "#06B6D4" },
      { symbol: "VNQ", name: "Vanguard Real Estate", allocation: 10, rationale: "Real estate income", assetClass: "REITs", color: "#F59E0B" },
      { symbol: "GLD", name: "SPDR Gold Trust", allocation: 5, rationale: "Gold hedge against uncertainty", assetClass: "Commodities", color: "#EF4444" }
    ]
  },
  balancedGrowth: {
    name: "Balanced Growth Portfolio",
    description: "Classic 60/40 approach for balanced risk-adjusted returns",
    assets: [
      { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 40, rationale: "Core US equity position", assetClass: "US Stocks", color: "#10B981" },
      { symbol: "VXUS", name: "Vanguard Total International", allocation: 20, rationale: "Global equity exposure", assetClass: "International", color: "#06B6D4" },
      { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 25, rationale: "Bond stability and income", assetClass: "Bonds", color: "#8B5CF6" },
      { symbol: "VNQ", name: "Vanguard Real Estate", allocation: 10, rationale: "Real estate diversification", assetClass: "REITs", color: "#F59E0B" },
      { symbol: "GLD", name: "SPDR Gold Trust", allocation: 5, rationale: "Inflation hedge", assetClass: "Commodities", color: "#EF4444" }
    ]
  },
  aggressiveGrowth: {
    name: "Aggressive Growth Portfolio",
    description: "Maximum growth potential for investors with high risk tolerance",
    assets: [
      { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 45, rationale: "Core US equity allocation", assetClass: "US Stocks", color: "#10B981" },
      { symbol: "VXUS", name: "Vanguard Total International", allocation: 25, rationale: "International growth", assetClass: "International", color: "#06B6D4" },
      { symbol: "VUG", name: "Vanguard Growth ETF", allocation: 15, rationale: "Growth factor tilt", assetClass: "Growth", color: "#8B5CF6" },
      { symbol: "VNQ", name: "Vanguard Real Estate", allocation: 10, rationale: "Real estate exposure", assetClass: "REITs", color: "#F59E0B" },
      { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 5, rationale: "Minimal bonds for stability", assetClass: "Bonds", color: "#EF4444" }
    ]
  },
  conservativeIncome: {
    name: "Conservative Income Portfolio",
    description: "Focus on generating stable income with capital preservation",
    assets: [
      { symbol: "SCHD", name: "Schwab US Dividend Equity", allocation: 30, rationale: "Quality dividend stocks", assetClass: "Dividend", color: "#10B981" },
      { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 35, rationale: "Bond income", assetClass: "Bonds", color: "#8B5CF6" },
      { symbol: "VYM", name: "Vanguard High Dividend Yield", allocation: 20, rationale: "High dividend stocks", assetClass: "Dividend", color: "#06B6D4" },
      { symbol: "VNQ", name: "Vanguard Real Estate", allocation: 15, rationale: "REIT income distributions", assetClass: "REITs", color: "#F59E0B" }
    ]
  },
  balancedIncome: {
    name: "Balanced Income Portfolio",
    description: "Income generation with moderate growth potential",
    assets: [
      { symbol: "SCHD", name: "Schwab US Dividend Equity", allocation: 35, rationale: "Quality dividend stocks", assetClass: "Dividend", color: "#10B981" },
      { symbol: "VYM", name: "Vanguard High Dividend Yield", allocation: 25, rationale: "High dividend yield", assetClass: "Dividend", color: "#06B6D4" },
      { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 20, rationale: "Bond income", assetClass: "Bonds", color: "#8B5CF6" },
      { symbol: "VNQ", name: "Vanguard Real Estate", allocation: 15, rationale: "REIT distributions", assetClass: "REITs", color: "#F59E0B" },
      { symbol: "VXUS", name: "Vanguard Total International", allocation: 5, rationale: "International dividend exposure", assetClass: "International", color: "#EF4444" }
    ]
  },
  cryptoEnhancedGrowth: {
    name: "Crypto-Enhanced Growth Portfolio",
    description: "Traditional portfolio with Bitcoin allocation for asymmetric upside",
    assets: [
      { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 45, rationale: "Core US equity position", assetClass: "US Stocks", color: "#10B981" },
      { symbol: "VXUS", name: "Vanguard Total International", allocation: 20, rationale: "International diversification", assetClass: "International", color: "#06B6D4" },
      { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 20, rationale: "Bond stability", assetClass: "Bonds", color: "#8B5CF6" },
      { symbol: "BITO", name: "ProShares Bitcoin Strategy ETF", allocation: 10, rationale: "Bitcoin exposure for asymmetric returns", assetClass: "Crypto", color: "#F59E0B" },
      { symbol: "VNQ", name: "Vanguard Real Estate", allocation: 5, rationale: "Real estate diversification", assetClass: "REITs", color: "#EF4444" }
    ]
  },
  esgFocused: {
    name: "ESG Sustainable Portfolio",
    description: "Investing aligned with environmental, social, and governance values",
    assets: [
      { symbol: "ESGV", name: "Vanguard ESG US Stock", allocation: 40, rationale: "ESG-screened US stocks", assetClass: "ESG Stocks", color: "#10B981" },
      { symbol: "VSGX", name: "Vanguard ESG International", allocation: 25, rationale: "ESG-screened international stocks", assetClass: "ESG International", color: "#06B6D4" },
      { symbol: "VCEB", name: "Vanguard ESG Bond", allocation: 20, rationale: "ESG-screened bonds", assetClass: "ESG Bonds", color: "#8B5CF6" },
      { symbol: "ICLN", name: "iShares Clean Energy", allocation: 10, rationale: "Clean energy exposure", assetClass: "Clean Energy", color: "#F59E0B" },
      { symbol: "VNQ", name: "Vanguard Real Estate", allocation: 5, rationale: "Real estate allocation", assetClass: "REITs", color: "#EF4444" }
    ]
  },
  techHeavyGrowth: {
    name: "Tech-Heavy Growth Portfolio",
    description: "Concentrated technology exposure for growth-focused investors",
    assets: [
      { symbol: "QQQ", name: "Invesco QQQ Trust", allocation: 35, rationale: "Nasdaq-100 tech exposure", assetClass: "Technology", color: "#10B981" },
      { symbol: "VGT", name: "Vanguard Technology ETF", allocation: 25, rationale: "Broad technology sector", assetClass: "Technology", color: "#06B6D4" },
      { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 20, rationale: "Broad market balance", assetClass: "US Stocks", color: "#8B5CF6" },
      { symbol: "VXUS", name: "Vanguard Total International", allocation: 10, rationale: "International diversification", assetClass: "International", color: "#F59E0B" },
      { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 10, rationale: "Bond stability", assetClass: "Bonds", color: "#EF4444" }
    ]
  },
  dividendGrowth: {
    name: "Dividend Growth Portfolio",
    description: "Focus on companies with growing dividend payments",
    assets: [
      { symbol: "VIG", name: "Vanguard Dividend Appreciation", allocation: 35, rationale: "Dividend growth stocks", assetClass: "Dividend Growth", color: "#10B981" },
      { symbol: "SCHD", name: "Schwab US Dividend Equity", allocation: 30, rationale: "Quality dividend payers", assetClass: "Dividend", color: "#06B6D4" },
      { symbol: "VXUS", name: "Vanguard Total International", allocation: 15, rationale: "International exposure", assetClass: "International", color: "#8B5CF6" },
      { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 15, rationale: "Bond income", assetClass: "Bonds", color: "#F59E0B" },
      { symbol: "VNQ", name: "Vanguard Real Estate", allocation: 5, rationale: "REIT dividends", assetClass: "REITs", color: "#EF4444" }
    ]
  }
};

// Determine which portfolio strategy to use based on risk and experience
const selectPortfolioStrategy = (riskScore: number, experienceLevel: string, timeline: string): { portfolio: Asset[], name: string } => {
  // Short timelines favor more conservative portfolios
  const isShortTerm = timeline.includes("1-2") || timeline.includes("less than") || timeline.includes("3-5");
  const isMediumTerm = timeline.includes("6-10") || timeline.includes("5-10");
  const isLongTerm = timeline.includes("10+") || timeline.includes("20+");
  
  let strategy;
  
  // Risk-based selection
  if (riskScore <= 25) {
    // Very conservative
    strategy = isShortTerm ? PORTFOLIO_STRATEGIES.conservativeIncome : PORTFOLIO_STRATEGIES.conservativeRetirement;
  } else if (riskScore <= 40) {
    // Conservative
    strategy = isShortTerm ? PORTFOLIO_STRATEGIES.conservativeGrowth : PORTFOLIO_STRATEGIES.balancedRetirement;
  } else if (riskScore <= 60) {
    // Moderate
    strategy = (experienceLevel === "advanced" && isLongTerm) 
      ? PORTFOLIO_STRATEGIES.dividendGrowth 
      : PORTFOLIO_STRATEGIES.balancedGrowth;
  } else if (riskScore <= 75) {
    // Growth-oriented
    if (experienceLevel === "advanced") {
      strategy = isLongTerm ? PORTFOLIO_STRATEGIES.techHeavyGrowth : PORTFOLIO_STRATEGIES.cryptoEnhancedGrowth;
    } else {
      strategy = PORTFOLIO_STRATEGIES.aggressiveGrowth;
    }
  } else {
    // Aggressive
    if (experienceLevel === "advanced") {
      strategy = PORTFOLIO_STRATEGIES.techHeavyGrowth;
    } else if (experienceLevel === "intermediate") {
      strategy = PORTFOLIO_STRATEGIES.aggressiveGrowth;
    } else {
      strategy = PORTFOLIO_STRATEGIES.balancedGrowth; // Beginners get moderated version
    }
  }
  
  return { portfolio: strategy.assets, name: strategy.name };
};

const PortfolioSummary = ({ riskScore, experienceLevel, timeline, onBack, onCustomize }: PortfolioSummaryProps) => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000);
  const [isInputMode, setIsInputMode] = useState(false);
  const [portfolioName, setPortfolioName] = useState<string>("");
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { toast } = useToast();
  const { subscriptionPlan, portfolioCount } = usePortfolioLimit();
  const { sendPortfolioWelcomeEmail } = useWelcomeEmail();
  const { user } = useAuth();

  // Get suggested amounts based on experience
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
      case "beginner": return { min: 25, max: 5000 };
      case "intermediate": return { min: 100, max: 50000 };
      case "advanced": return { min: 500, max: 250000 };
      default: return { min: 25, max: 5000 };
    }
  };

  useEffect(() => {
    setInvestmentAmount(getSuggestedAmount());
  }, [experienceLevel]);

  // Generate portfolio using simplified 12-strategy system
  const { portfolio, name } = selectPortfolioStrategy(riskScore, experienceLevel, timeline);
  const { savePortfolio } = useSavedPortfolios();
  const hasAutoSaved = useRef(false);
  
  useEffect(() => {
    setPortfolioName(name);
  }, [name]);

  // Auto-save portfolio and track analytics when component mounts
  useEffect(() => {
    const autoSavePortfolio = async () => {
      if (hasAutoSaved.current || !portfolio.length || !name) return;
      hasAutoSaved.current = true;
      
      // Track portfolio generation
      analytics.portfolioGenerated(name, riskScore);
      
      await savePortfolio({
        portfolio_name: name,
        risk_score: riskScore,
        experience_level: experienceLevel,
        timeline: timeline,
        investment_amount: investmentAmount,
        assets: portfolio.map(asset => ({
          symbol: asset.symbol,
          name: asset.name,
          allocation: asset.allocation,
          rationale: asset.rationale,
          assetClass: asset.assetClass,
          color: asset.color,
        })),
      });
      
      // Track portfolio saved
      analytics.portfolioSaved(name, name);
      
      // Send welcome email if user is authenticated
      if (user?.email) {
        sendPortfolioWelcomeEmail(
          user.email,
          undefined,
          name,
          portfolio.map(a => ({ symbol: a.symbol, name: a.name, allocation: a.allocation }))
        );
      }
    };
    autoSavePortfolio();
  }, [portfolio, name, riskScore, experienceLevel, timeline, savePortfolio, user]);
  
  const expectedReturn = 6 + (riskScore / 100) * 6;
  const volatility = 5 + (riskScore / 100) * 15;
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

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const handleViewPortfolio = () => setShowSuccessAnimation(false);
  const handleGenerateAnother = () => onBack();

  const exportToPDF = () => {
    const isFreeUser = subscriptionPlan === "free";
    const canSave = isFreeUser ? portfolioCount < 1 : true;
    
    if (isFreeUser && !canSave) {
      setShowUpgradeModal(true);
      return;
    }
    
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();
    
    doc.setFillColor(17, 17, 19);
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setTextColor(139, 92, 246);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('PortfoliX - Your Portfolio', 20, 30);
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Generated on: ${today}`, 20, 45);
    doc.text(`Strategy: ${portfolioName}`, 20, 55);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`Investment Amount: ${formatCurrency(investmentAmount)}`, 20, 75);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Portfolio Metrics:', 20, 95);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Expected Return: ${formatPercentage(expectedReturn)}`, 20, 110);
    doc.text(`Volatility: ${formatPercentage(volatility)}`, 20, 125);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Holdings:', 20, 150);
    
    let yPosition = 165;
    portfolio.forEach((asset) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`${asset.symbol} - ${asset.name} (${asset.allocation}%)`, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`${formatCurrency(investmentAmount * asset.allocation / 100)} • ${asset.rationale}`, 25, yPosition + 8, { maxWidth: 160 });
      yPosition += 20;
    });
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('Disclaimer: This is not financial advice. All investments involve risk.', 20, 280, { maxWidth: 170 });
    
    doc.save(`PortfoliX_${portfolioName.replace(/\s+/g, '_')}_${today.replace(/\//g, '-')}.pdf`);
    
    toast({
      title: "Portfolio Exported",
      description: "Your portfolio PDF has been downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {showSuccessAnimation && (
        <PortfolioSuccessAnimation
          onViewPortfolio={handleViewPortfolio}
          onGenerateAnother={handleGenerateAnother}
        />
      )}
      
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="hover:bg-accent"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {portfolioName || "Your Portfolio"}
              </h1>
              <p className="text-muted-foreground">
                {experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)} • {timeline}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Investment Amount */}
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
          {/* Metrics */}
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

          {/* Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <PortfolioPieChart data={portfolio} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pro Features */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Pro Features</h2>
            {subscriptionPlan === "pro" && (
              <Badge variant="default" className="bg-primary">Active</Badge>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ProSuggestionsPanel
              portfolio={portfolio.map(p => ({ asset: p.name, percentage: p.allocation }))}
              isPro={subscriptionPlan === "pro"}
              riskTolerance={riskScore <= 30 ? "conservative" : riskScore <= 60 ? "moderate" : "aggressive"}
              investmentHorizon={timeline}
              onUpgrade={() => setShowUpgradeModal(true)}
            />
            <RiskScoreCard
              portfolio={portfolio.map(p => ({ asset: p.name, percentage: p.allocation }))}
              isPro={subscriptionPlan === "pro"}
              onUpgrade={() => setShowUpgradeModal(true)}
            />
            <RebalancingAlerts
              portfolio={portfolio.map(p => ({ asset: p.name, percentage: p.allocation }))}
              isPro={subscriptionPlan === "pro"}
              riskTolerance={riskScore <= 30 ? "conservative" : riskScore <= 60 ? "moderate" : "aggressive"}
              onUpgrade={() => setShowUpgradeModal(true)}
            />
          </div>
        </div>

        {/* Holdings Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Portfolio Holdings</CardTitle>
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

        {/* Implementation Guide */}
        <ImplementationGuide 
          portfolio={portfolio}
          investmentAmount={investmentAmount}
          portfolioName={portfolioName}
        />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" size="lg" onClick={() => onCustomize(portfolio, portfolioName)} className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Customize Portfolio
          </Button>
          <Button variant="outline" size="lg" onClick={exportToPDF} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export as PDF
          </Button>
          <Link to="/learn">
            <Button variant="outline" size="lg" className="flex items-center gap-2 w-full">
              <BookOpen className="h-4 w-4" />
              Learn More
            </Button>
          </Link>
        </div>

        {/* Disclaimer */}
        <Card className="bg-muted/30 border-warning/20">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Disclaimer:</strong> This portfolio was generated based on your responses. 
              PortfoliX provides educational research tools, not personalized financial advice. 
              You are solely responsible for your investment decisions. Past performance does not guarantee future results.
            </p>
          </CardContent>
        </Card>
      </div>

      <UpgradeModal open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </div>
  );
};

export default PortfolioSummary;
