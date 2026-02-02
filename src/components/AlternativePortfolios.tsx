import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Rocket, TrendingUp, TrendingDown } from "lucide-react";

interface AlternativePortfoliosProps {
  currentRiskScore: number;
  currentPortfolioName: string;
  onSelectAlternative: (direction: "conservative" | "aggressive") => void;
}

export const AlternativePortfolios = ({
  currentRiskScore,
  currentPortfolioName,
  onSelectAlternative
}: AlternativePortfoliosProps) => {
  // Generate alternatives based on current portfolio
  const currentStockAllocation = Math.min(90, Math.max(20, 30 + currentRiskScore * 0.6));
  const currentBondAllocation = 100 - currentStockAllocation;

  const alternatives = [];

  // More conservative alternative (if not already very conservative)
  if (currentRiskScore > 25) {
    const conservativeStocks = Math.max(currentStockAllocation - 20, 30);
    const conservativeBonds = 100 - conservativeStocks;
    alternatives.push({
      id: "conservative",
      name: "More Conservative Approach",
      description: "Emphasizes stability and capital preservation with lower growth expectations",
      advantage: "Smaller losses during market downturns",
      tradeoff: "Lower long-term growth potential",
      stockAllocation: conservativeStocks,
      bondAllocation: conservativeBonds,
      icon: Shield,
      direction: "conservative" as const
    });
  }

  // More aggressive alternative (if not already very aggressive)
  if (currentRiskScore < 75) {
    const aggressiveStocks = Math.min(currentStockAllocation + 20, 90);
    const aggressiveBonds = 100 - aggressiveStocks;
    alternatives.push({
      id: "aggressive",
      name: "More Aggressive Approach",
      description: "Maximizes growth potential through higher stock allocation",
      advantage: "Higher long-term growth expectations",
      tradeoff: "Larger fluctuations in portfolio value",
      stockAllocation: aggressiveStocks,
      bondAllocation: aggressiveBonds,
      icon: Rocket,
      direction: "aggressive" as const
    });
  }

  if (alternatives.length === 0) return null;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Consider These Alternatives
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          We recommend your current portfolio, but you might prefer a different approach depending on your priorities:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alternatives.map((alt) => {
            const Icon = alt.icon;
            return (
              <div 
                key={alt.id} 
                className="p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${alt.id === "conservative" ? "bg-blue-500/10" : "bg-orange-500/10"}`}>
                    <Icon className={`h-5 w-5 ${alt.id === "conservative" ? "text-blue-500" : "text-orange-500"}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{alt.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{alt.description}</p>
                  </div>
                </div>

                {/* Allocation preview */}
                <div className="h-3 rounded-full overflow-hidden flex bg-muted">
                  <div 
                    className={`${alt.id === "conservative" ? "bg-blue-500" : "bg-orange-500"}`}
                    style={{ width: `${alt.stockAllocation}%` }}
                  />
                  <div 
                    className="bg-muted-foreground/30"
                    style={{ width: `${alt.bondAllocation}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Stocks {alt.stockAllocation}%</span>
                  <span>Bonds {alt.bondAllocation}%</span>
                </div>

                {/* Tradeoffs */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-xs"><strong>Advantage:</strong> {alt.advantage}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <TrendingDown className="h-3 w-3 text-warning mt-0.5 flex-shrink-0" />
                    <span className="text-xs"><strong>Tradeoff:</strong> {alt.tradeoff}</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => onSelectAlternative(alt.direction)}
                >
                  View This Portfolio
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
