import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Search, 
  ChevronDown, 
  ChevronUp,
  TrendingUp,
  Shield,
  PieChart,
  RefreshCw,
  Coins,
  Building2,
  Leaf,
  Zap
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface GlossaryTerm {
  term: string;
  definition: string;
  example?: string;
  icon: React.ReactNode;
  category: "basics" | "strategy" | "advanced";
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "Index Fund",
    definition: "A type of investment fund that holds all the stocks or bonds in a specific market index, like the S&P 500. Instead of trying to pick winners, you own a piece of everything.",
    example: "VTI (Vanguard Total Stock Market) holds over 4,000 US stocks in a single fund.",
    icon: <PieChart className="h-4 w-4" />,
    category: "basics"
  },
  {
    term: "Diversification",
    definition: "Spreading your money across different types of investments to reduce risk. If one investment drops, others may hold steady or rise.",
    example: "Owning US stocks, international stocks, and bonds instead of just one company's stock.",
    icon: <Shield className="h-4 w-4" />,
    category: "basics"
  },
  {
    term: "Asset Allocation",
    definition: "How you divide your investments among different asset categories like stocks, bonds, and real estate. Your allocation should match your goals and risk tolerance.",
    example: "A 60/40 portfolio means 60% stocks and 40% bonds.",
    icon: <PieChart className="h-4 w-4" />,
    category: "basics"
  },
  {
    term: "Rebalancing",
    definition: "Periodically adjusting your portfolio back to your target allocation. As some investments grow faster than others, rebalancing keeps your risk level consistent.",
    example: "If stocks grow from 60% to 70% of your portfolio, you'd sell some stocks and buy bonds to return to 60/40.",
    icon: <RefreshCw className="h-4 w-4" />,
    category: "basics"
  },
  {
    term: "ETF (Exchange-Traded Fund)",
    definition: "A basket of investments that trades on stock exchanges like a single stock. ETFs offer diversification, low costs, and easy buying/selling.",
    example: "SPY is an ETF that tracks the S&P 500 index.",
    icon: <TrendingUp className="h-4 w-4" />,
    category: "basics"
  },
  {
    term: "Expense Ratio",
    definition: "The annual fee charged by a fund, expressed as a percentage of your investment. Lower is better—0.03% means you pay $3 per year for every $10,000 invested.",
    example: "VTI has an expense ratio of 0.03%, while some actively managed funds charge 1% or more.",
    icon: <Coins className="h-4 w-4" />,
    category: "basics"
  },
  {
    term: "Risk Tolerance",
    definition: "Your ability and willingness to lose money in exchange for potentially higher returns. Higher risk tolerance means you can handle bigger swings in your portfolio value.",
    example: "Someone with high risk tolerance might invest 90% in stocks; conservative investors might prefer 40%.",
    icon: <Zap className="h-4 w-4" />,
    category: "strategy"
  },
  {
    term: "Dollar-Cost Averaging",
    definition: "Investing a fixed amount at regular intervals regardless of market conditions. This strategy removes emotion from investing and averages out your purchase prices.",
    example: "Investing $500 every month instead of $6,000 all at once.",
    icon: <Coins className="h-4 w-4" />,
    category: "strategy"
  },
  {
    term: "REIT (Real Estate Investment Trust)",
    definition: "A company that owns income-producing real estate. REITs let you invest in real estate without buying physical property and typically pay high dividends.",
    example: "VNQ holds hundreds of properties including apartments, offices, and shopping centers.",
    icon: <Building2 className="h-4 w-4" />,
    category: "advanced"
  },
  {
    term: "ESG Investing",
    definition: "Investing in companies that meet Environmental, Social, and Governance criteria. ESG funds exclude companies with poor records on climate, labor practices, or corporate governance.",
    example: "ESGV excludes fossil fuel companies and firms with labor violations.",
    icon: <Leaf className="h-4 w-4" />,
    category: "strategy"
  },
  {
    term: "Dividend",
    definition: "A payment made by a company to its shareholders, usually from profits. Dividend-paying stocks provide income while you hold them.",
    example: "A stock paying a 3% dividend on a $10,000 investment gives you $300 per year.",
    icon: <Coins className="h-4 w-4" />,
    category: "basics"
  },
  {
    term: "Volatility",
    definition: "How much an investment's price moves up and down over time. High volatility means bigger swings; low volatility means more stable prices.",
    example: "Stocks typically have 15-20% volatility; bonds have 5-8% volatility.",
    icon: <TrendingUp className="h-4 w-4" />,
    category: "advanced"
  }
];

// Portfolio Strategy Explanations
const STRATEGY_EXPLANATIONS = [
  {
    name: "Conservative Retirement",
    description: "Prioritizes stability and predictable growth for investors approaching retirement. The 60/40 stock-to-bond ratio provides growth potential while limiting downside risk.",
    bestFor: "Investors within 5 years of retirement",
    riskLevel: "Low"
  },
  {
    name: "Balanced Retirement",
    description: "Equal focus on growth and stability for mid-retirement planning. Maintains exposure to stocks for growth while bonds provide income and stability.",
    bestFor: "Investors 10-15 years from retirement",
    riskLevel: "Low-Medium"
  },
  {
    name: "Aggressive Retirement",
    description: "Growth-focused strategy for early retirement savers with long horizons. Heavy stock allocation captures market upside for maximum long-term growth.",
    bestFor: "Investors 20+ years from retirement",
    riskLevel: "Medium-High"
  },
  {
    name: "Conservative Growth",
    description: "Steady growth with lower volatility for cautious investors. Includes gold allocation as a hedge against market uncertainty.",
    bestFor: "Risk-averse investors seeking modest growth",
    riskLevel: "Low"
  },
  {
    name: "Balanced Growth",
    description: "Classic 60/40 approach for balanced risk-adjusted returns. The most widely recommended allocation for long-term investors.",
    bestFor: "Most long-term investors",
    riskLevel: "Medium"
  },
  {
    name: "Aggressive Growth",
    description: "Maximum growth potential for investors with high risk tolerance. Expect 20-30% annual swings but historically superior long-term returns.",
    bestFor: "Young investors with 15+ year horizons",
    riskLevel: "High"
  },
  {
    name: "Crypto-Enhanced Growth",
    description: "Traditional portfolio with Bitcoin allocation for asymmetric upside. The 10% crypto allocation adds volatility but potential for outsized returns.",
    bestFor: "Tech-savvy investors comfortable with crypto volatility",
    riskLevel: "High"
  },
  {
    name: "ESG Sustainable",
    description: "Investing aligned with environmental, social, and governance values. Excludes fossil fuels and companies with poor labor practices.",
    bestFor: "Values-driven investors",
    riskLevel: "Medium"
  },
  {
    name: "Tech-Heavy Growth",
    description: "Concentrated technology exposure for growth-focused investors. Higher potential returns but concentrated sector risk.",
    bestFor: "Investors bullish on technology",
    riskLevel: "High"
  },
  {
    name: "Dividend Growth",
    description: "Focus on companies with growing dividend payments. Provides income today that increases over time.",
    bestFor: "Income-focused investors",
    riskLevel: "Medium"
  }
];

interface EducationalGlossaryProps {
  showStrategies?: boolean;
}

export const EducationalGlossary = ({ showStrategies = true }: EducationalGlossaryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTerms, setExpandedTerms] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<"all" | "basics" | "strategy" | "advanced">("all");

  const filteredTerms = GLOSSARY_TERMS.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || term.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleTerm = (term: string) => {
    setExpandedTerms(prev => 
      prev.includes(term) ? prev.filter(t => t !== term) : [...prev, term]
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basics": return "bg-success/10 text-success";
      case "strategy": return "bg-primary/10 text-primary";
      case "advanced": return "bg-warning/10 text-warning";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-success";
      case "Low-Medium": return "text-success";
      case "Medium": return "text-warning";
      case "Medium-High": return "text-warning";
      case "High": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Investment Glossary */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Investment Glossary
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Learn the key terms you'll encounter when investing
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "basics", "strategy", "advanced"] as const).map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Terms List */}
          <div className="space-y-2">
            {filteredTerms.map((item) => (
              <Collapsible
                key={item.term}
                open={expandedTerms.includes(item.term)}
                onOpenChange={() => toggleTerm(item.term)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        {item.icon}
                      </div>
                      <span className="font-semibold">{item.term}</span>
                      <Badge className={getCategoryColor(item.category)} variant="secondary">
                        {item.category}
                      </Badge>
                    </div>
                    {expandedTerms.includes(item.term) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <div className="pl-12 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {item.definition}
                    </p>
                    {item.example && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          <strong>Example:</strong> {item.example}
                        </p>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No terms found matching "{searchQuery}"
            </p>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Strategies */}
      {showStrategies && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Portfolio Strategy Guide
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Understand what each portfolio type means for your investments
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STRATEGY_EXPLANATIONS.map((strategy) => (
                <div
                  key={strategy.name}
                  className="p-4 border border-border rounded-lg space-y-2 hover:border-primary/50 transition-colors"
                >
                  <h4 className="font-semibold text-foreground">{strategy.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {strategy.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      Best for: {strategy.bestFor}
                    </span>
                    <Badge variant="outline" className={getRiskColor(strategy.riskLevel)}>
                      {strategy.riskLevel} Risk
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
