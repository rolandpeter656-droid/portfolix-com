import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Shield, 
  Bitcoin,
  Leaf,
  Download,
  FileText,
  RefreshCw,
  Clock,
  Building2,
  ChevronRight,
  Play
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/landing/Navigation";

interface AdvisorSubscription {
  id: string;
  firm_name: string;
  subscription_status: string;
  subscription_ends_at: string | null;
  trial_ends_at: string | null;
}

interface PortfolioModel {
  id: string;
  name: string;
  category: string;
  icon: any;
  riskLevel: string;
  expectedReturn: string;
  description: string;
  allocation: { asset: string; percentage: number }[];
  rebalanceFrequency: string;
  rationale: string;
}

const portfolioModels: PortfolioModel[] = [
  {
    id: "growth-aggressive",
    name: "Aggressive Growth Portfolio",
    category: "Growth",
    icon: TrendingUp,
    riskLevel: "High",
    expectedReturn: "12-15%",
    description: "Maximizes long-term capital appreciation through high-growth equities.",
    allocation: [
      { asset: "US Large Cap Growth", percentage: 35 },
      { asset: "US Small Cap", percentage: 20 },
      { asset: "International Developed", percentage: 20 },
      { asset: "Emerging Markets", percentage: 15 },
      { asset: "REITs", percentage: 10 },
    ],
    rebalanceFrequency: "Quarterly",
    rationale: "Designed for investors with a long time horizon (10+ years) who can tolerate significant volatility in pursuit of maximum growth."
  },
  {
    id: "growth-moderate",
    name: "Moderate Growth Portfolio",
    category: "Growth",
    icon: TrendingUp,
    riskLevel: "Medium-High",
    expectedReturn: "8-12%",
    description: "Balanced approach to growth with some downside protection.",
    allocation: [
      { asset: "US Large Cap", percentage: 40 },
      { asset: "US Mid Cap", percentage: 15 },
      { asset: "International Developed", percentage: 15 },
      { asset: "Bonds", percentage: 20 },
      { asset: "REITs", percentage: 10 },
    ],
    rebalanceFrequency: "Quarterly",
    rationale: "Suitable for investors with 7-10 year horizons seeking growth with moderate risk tolerance."
  },
  {
    id: "income-dividend",
    name: "Dividend Income Portfolio",
    category: "Income",
    icon: DollarSign,
    riskLevel: "Medium",
    expectedReturn: "5-7%",
    description: "Focuses on stable dividend-paying stocks and bonds.",
    allocation: [
      { asset: "Dividend Aristocrats", percentage: 35 },
      { asset: "High-Yield Bonds", percentage: 25 },
      { asset: "REITs", percentage: 15 },
      { asset: "Investment Grade Bonds", percentage: 15 },
      { asset: "Preferred Stock", percentage: 10 },
    ],
    rebalanceFrequency: "Semi-Annually",
    rationale: "Ideal for clients seeking regular income with moderate capital appreciation potential."
  },
  {
    id: "income-fixed",
    name: "Fixed Income Portfolio",
    category: "Income",
    icon: DollarSign,
    riskLevel: "Low",
    expectedReturn: "3-5%",
    description: "Conservative portfolio focused on capital preservation and income.",
    allocation: [
      { asset: "Treasury Bonds", percentage: 35 },
      { asset: "Investment Grade Corporate", percentage: 30 },
      { asset: "Municipal Bonds", percentage: 20 },
      { asset: "TIPS", percentage: 15 },
    ],
    rebalanceFrequency: "Annually",
    rationale: "Best for risk-averse clients or those nearing retirement who prioritize capital preservation."
  },
  {
    id: "balanced-60-40",
    name: "Classic 60/40 Portfolio",
    category: "Balanced",
    icon: PieChart,
    riskLevel: "Medium",
    expectedReturn: "6-8%",
    description: "Time-tested allocation balancing growth and stability.",
    allocation: [
      { asset: "US Equity", percentage: 40 },
      { asset: "International Equity", percentage: 20 },
      { asset: "US Bonds", percentage: 30 },
      { asset: "International Bonds", percentage: 10 },
    ],
    rebalanceFrequency: "Quarterly",
    rationale: "The classic allocation for investors seeking a balance between growth and income with moderate risk."
  },
  {
    id: "conservative-retirement",
    name: "Conservative Retirement Portfolio",
    category: "Retirement",
    icon: Shield,
    riskLevel: "Low",
    expectedReturn: "4-6%",
    description: "Designed for capital preservation in retirement.",
    allocation: [
      { asset: "Short-Term Bonds", percentage: 30 },
      { asset: "Intermediate Bonds", percentage: 25 },
      { asset: "Dividend Stocks", percentage: 20 },
      { asset: "Money Market", percentage: 15 },
      { asset: "TIPS", percentage: 10 },
    ],
    rebalanceFrequency: "Semi-Annually",
    rationale: "For retirees who need stable income and capital preservation with minimal volatility."
  },
  {
    id: "crypto-allocation",
    name: "Crypto Allocation Portfolio",
    category: "Crypto",
    icon: Bitcoin,
    riskLevel: "Very High",
    expectedReturn: "15-25%",
    description: "Modern portfolio with strategic cryptocurrency exposure.",
    allocation: [
      { asset: "Bitcoin", percentage: 50 },
      { asset: "Ethereum", percentage: 30 },
      { asset: "Altcoins (Top 10)", percentage: 15 },
      { asset: "Stablecoins", percentage: 5 },
    ],
    rebalanceFrequency: "Monthly",
    rationale: "For clients seeking digital asset exposure. Recommend limiting to 5-10% of total portfolio."
  },
  {
    id: "esg-sustainable",
    name: "ESG Sustainable Portfolio",
    category: "ESG",
    icon: Leaf,
    riskLevel: "Medium",
    expectedReturn: "7-9%",
    description: "Environmentally and socially responsible investing.",
    allocation: [
      { asset: "ESG US Equity", percentage: 35 },
      { asset: "Clean Energy", percentage: 15 },
      { asset: "ESG International", percentage: 20 },
      { asset: "Green Bonds", percentage: 20 },
      { asset: "Sustainable REITs", percentage: 10 },
    ],
    rebalanceFrequency: "Quarterly",
    rationale: "For clients who want their investments to align with environmental and social values."
  },
];

const categories = [
  { id: "all", label: "All Portfolios", icon: PieChart },
  { id: "Growth", label: "Growth", icon: TrendingUp },
  { id: "Income", label: "Income", icon: DollarSign },
  { id: "Balanced", label: "Balanced", icon: PieChart },
  { id: "Retirement", label: "Retirement", icon: Shield },
  { id: "Crypto", label: "Crypto", icon: Bitcoin },
  { id: "ESG", label: "ESG", icon: Leaf },
];

const AdvisorDashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<AdvisorSubscription | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      sessionStorage.setItem('postAuthDestination', '/advisors/dashboard');
      navigate('/signin');
      return;
    }

    if (user) {
      fetchSubscription();
    }
  }, [user, loading, navigate]);

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('advisor_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No subscription found
          toast({
            title: "No Subscription Found",
            description: "Please complete the onboarding process first.",
            variant: "destructive"
          });
          navigate('/advisors/onboarding');
          return;
        }
        throw error;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPortfolios = selectedCategory === "all" 
    ? portfolioModels 
    : portfolioModels.filter(p => p.category === selectedCategory);

  const handleDownloadPDF = (portfolio: PortfolioModel) => {
    toast({
      title: "Generating PDF",
      description: `Downloading ${portfolio.name} client presentation...`,
    });
    // In a real implementation, this would generate and download a PDF
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "Low": return "secondary";
      case "Medium": return "default";
      case "Medium-High": return "default";
      case "High": return "destructive";
      case "Very High": return "destructive";
      default: return "secondary";
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-3 sm:px-4 pt-20 sm:pt-24 pb-12 sm:pb-20">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Advisor Dashboard</h1>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Welcome back, {subscription?.firm_name || "Advisor"}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {subscription?.subscription_status === 'pending' && subscription?.trial_ends_at && (
                <Badge variant="secondary" className="py-1 px-2 sm:px-3 text-xs sm:text-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  Trial ends: {new Date(subscription.trial_ends_at).toLocaleDateString()}
                </Badge>
              )}
              {subscription?.subscription_status === 'active' && (
                <Badge variant="default" className="py-1 px-2 sm:px-3 text-xs sm:text-sm">Active Subscription</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar Categories */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Portfolio Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      <category.icon className="h-5 w-5" />
                      <span className="font-medium">{category.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Pitch Deck Template
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Rebalancing Guide
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Video Tutorials
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedPortfolio ? (
              /* Portfolio Detail View */
              <Card>
                <CardHeader>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedPortfolio(null)}
                    className="w-fit mb-4"
                  >
                    ← Back to Portfolios
                  </Button>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <selectedPortfolio.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle>{selectedPortfolio.name}</CardTitle>
                          <CardDescription>{selectedPortfolio.category}</CardDescription>
                        </div>
                      </div>
                    </div>
                    <Badge variant={getRiskBadgeVariant(selectedPortfolio.riskLevel)}>
                      {selectedPortfolio.riskLevel} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">{selectedPortfolio.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Expected Return</p>
                      <p className="text-2xl font-bold text-primary">{selectedPortfolio.expectedReturn}</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Rebalance Frequency</p>
                      <p className="text-2xl font-bold">{selectedPortfolio.rebalanceFrequency}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Asset Allocation</h3>
                    <div className="space-y-3">
                      {selectedPortfolio.allocation.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span>{item.asset}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary rounded-full h-2" 
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                            <span className="font-medium w-12 text-right">{item.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Rationale</h3>
                    <p className="text-muted-foreground">{selectedPortfolio.rationale}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      className="flex-1"
                      onClick={() => handleDownloadPDF(selectedPortfolio)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Client PDF
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Download Spreadsheet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Portfolio Grid */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {selectedCategory === "all" ? "All Model Portfolios" : `${selectedCategory} Portfolios`}
                  </h2>
                  <Badge variant="secondary">{filteredPortfolios.length} portfolios</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPortfolios.map((portfolio) => (
                    <Card 
                      key={portfolio.id}
                      className="cursor-pointer hover:border-primary/30 transition-colors"
                      onClick={() => setSelectedPortfolio(portfolio)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <portfolio.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{portfolio.name}</h3>
                              <p className="text-sm text-muted-foreground">{portfolio.category}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {portfolio.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <Badge variant={getRiskBadgeVariant(portfolio.riskLevel)}>
                            {portfolio.riskLevel}
                          </Badge>
                          <span className="text-sm font-medium text-primary">
                            {portfolio.expectedReturn} return
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorDashboard;
