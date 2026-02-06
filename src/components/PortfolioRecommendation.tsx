import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  PieChart, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

interface PortfolioRecommendationProps {
  riskScore: number;
  onStartInvesting?: () => void;
  onBack?: () => void;
}

const getPortfolioType = (riskScore: number) => {
  if (riskScore <= 25) return "Conservative";
  if (riskScore <= 50) return "Moderate";
  if (riskScore <= 75) return "Growth";
  return "Aggressive";
};

const getPortfolioData = (riskScore: number) => {
  const type = getPortfolioType(riskScore);
  
  const portfolios = {
    Conservative: {
      expectedReturn: "6-8%",
      volatility: "Low",
      icon: <Shield className="h-6 w-6" />,
      color: "bg-blue-500",
      allocations: [
        { name: "Government Bonds", percentage: 40, color: "bg-blue-400" },
        { name: "Corporate Bonds", percentage: 30, color: "bg-blue-500" },
        { name: "Large Cap Stocks", percentage: 20, color: "bg-green-400" },
        { name: "Cash & Equivalents", percentage: 10, color: "bg-gray-400" },
      ],
      features: [
        "Low volatility & stable returns",
        "Capital preservation focus",
        "Regular income generation",
        "High liquidity"
      ]
    },
    Moderate: {
      expectedReturn: "8-10%",
      volatility: "Medium",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-green-500",
      allocations: [
        { name: "Large Cap Stocks", percentage: 35, color: "bg-green-400" },
        { name: "Corporate Bonds", percentage: 25, color: "bg-blue-500" },
        { name: "International Stocks", percentage: 20, color: "bg-purple-400" },
        { name: "Mid Cap Stocks", percentage: 15, color: "bg-green-600" },
        { name: "REITs", percentage: 5, color: "bg-orange-400" },
      ],
      features: [
        "Balanced growth & stability",
        "Diversified across asset classes",
        "Moderate risk tolerance",
        "Long-term growth potential"
      ]
    },
    Growth: {
      expectedReturn: "10-12%",
      volatility: "Medium-High",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-purple-500",
      allocations: [
        { name: "Large Cap Stocks", percentage: 40, color: "bg-green-400" },
        { name: "Mid Cap Stocks", percentage: 25, color: "bg-green-600" },
        { name: "International Stocks", percentage: 20, color: "bg-purple-400" },
        { name: "Small Cap Stocks", percentage: 10, color: "bg-green-700" },
        { name: "Bonds", percentage: 5, color: "bg-blue-500" },
      ],
      features: [
        "High growth potential",
        "Equity-focused allocation",
        "Long-term wealth building",
        "Higher volatility tolerance"
      ]
    },
    Aggressive: {
      expectedReturn: "12-15%",
      volatility: "High",
      icon: <Zap className="h-6 w-6" />,
      color: "bg-red-500",
      allocations: [
        { name: "Growth Stocks", percentage: 35, color: "bg-green-600" },
        { name: "Tech Stocks", percentage: 25, color: "bg-blue-600" },
        { name: "Emerging Markets", percentage: 20, color: "bg-purple-600" },
        { name: "Small Cap Stocks", percentage: 15, color: "bg-green-700" },
        { name: "Crypto ETFs", percentage: 5, color: "bg-orange-600" },
      ],
      features: [
        "Maximum growth potential",
        "High-risk, high-reward",
        "Innovation-focused",
        "Long-term horizon required"
      ]
    }
  };

  return portfolios[type as keyof typeof portfolios];
};

export const PortfolioRecommendation = ({ riskScore, onStartInvesting, onBack }: PortfolioRecommendationProps) => {
  const portfolioType = getPortfolioType(riskScore);
  const portfolio = getPortfolioData(riskScore);

  const handleStartBuilding = () => {
    onStartInvesting?.();
  };

  return (
    <section className="min-h-screen bg-background py-8 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto animate-fade-in">
          {/* Back Arrow */}
          {onBack && (
            <button
              onClick={onBack}
              className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
          )}
          
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <PieChart className="icon-sm mr-2" />
              AI Recommendation Ready
            </Badge>
            <h2 className="text-headline mb-4">
              Your Personalized Portfolio
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Based on your risk assessment, our AI recommends a {portfolioType.toLowerCase()} investment strategy
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Portfolio Overview */}
            <Card className="shadow-soft border-0">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full text-white ${portfolio.color}`}>
                    {portfolio.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{portfolioType} Portfolio</CardTitle>
                    <p className="text-muted-foreground">Risk Score: {Math.round(riskScore)}%</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div className="text-center p-4 bg-accent rounded-lg">
                    <TrendingUp className="icon-lg text-success mx-auto mb-2" />
                    <p className="metric-label text-black">Expected Return</p>
                    <p className="metric-primary">{portfolio.expectedReturn}</p>
                  </div>
                  <div className="text-center p-4 bg-accent rounded-lg">
                    <BarChart3 className="icon-lg text-primary mx-auto mb-2" />
                    <p className="metric-label text-black">Volatility</p>
                    <p className="metric-primary">{portfolio.volatility}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-subtitle text-foreground mb-3">Key Features:</h4>
                  {portfolio.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="icon-md text-success flex-shrink-0" />
                      <span className="text-body text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Asset Allocation */}
            <Card className="shadow-soft border-0">
              <CardHeader>
                <CardTitle className="text-title flex items-center gap-2">
                  <PieChart className="icon-md" />
                  Asset Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolio.allocations.map((allocation) => (
                    <div key={allocation.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-body font-semibold text-foreground">{allocation.name}</span>
                        <span className="metric-secondary">{allocation.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${allocation.color} transition-all duration-500`}
                          style={{ width: `${allocation.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-gradient-primary rounded-lg text-black">
                  <div className="mb-2">
                    <span className="text-subtitle text-black">Minimum Investment</span>
                  </div>
                  <p className="metric-primary text-black">$25</p>
                  <div className="text-black/80 text-caption space-y-1">
                    <p>Start building wealth today</p>
                    <p>Minimum investments are set to investors' experience.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12 space-y-4">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                onClick={handleStartBuilding}
                disabled={false}
                className="bg-gradient-primary text-white hover:opacity-90 px-8 py-4 text-lg group w-full sm:w-auto"
              >
                Start Building Portfolio
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered portfolio generation • Risk-adjusted allocation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};