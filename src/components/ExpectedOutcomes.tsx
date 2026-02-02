import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";

interface ExpectedOutcomesProps {
  riskScore: number;
  expectedReturn: number;
  volatility: number;
  portfolioName: string;
  experienceLevel: string;
  timeline: string;
}

export const ExpectedOutcomes = ({
  riskScore,
  expectedReturn,
  volatility,
  portfolioName,
  experienceLevel,
  timeline
}: ExpectedOutcomesProps) => {
  // Calculate scenario returns based on risk profile
  const bullMarketReturn = `+${(expectedReturn + volatility * 1.5).toFixed(0)}%`;
  const normalYearReturn = `+${expectedReturn.toFixed(0)}%`;
  const bearMarketReturn = `-${(volatility * 1.2).toFixed(0)}%`;
  
  // Volatility range for the year
  const volatilityRange = `±${volatility.toFixed(0)}%`;

  // Generate suitability statement
  const getSuitabilityStatement = () => {
    if (riskScore > 60) {
      return "can stay invested through significant market downturns, have a long time horizon, and prioritize maximum growth over short-term stability";
    } else if (riskScore <= 30) {
      return "prioritize capital preservation, may need access to funds within 3-5 years, or prefer predictable, modest returns over volatile growth";
    }
    return "want meaningful growth potential while maintaining reasonable stability, have a medium-term timeline, and can tolerate moderate market fluctuations";
  };

  const getRiskLevel = () => {
    if (riskScore <= 30) return "conservative";
    if (riskScore <= 60) return "moderate";
    return "aggressive";
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          What to Expect
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key outcomes grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-card rounded-lg border">
            <h4 className="font-semibold text-sm mb-2">Historical Performance</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Similar portfolios have returned{" "}
              <strong className="text-success">{expectedReturn.toFixed(1)}%</strong> annually over 10+ years.
              Past performance doesn't guarantee future results, but this provides a reasonable baseline expectation.
            </p>
          </div>

          <div className="p-4 bg-gradient-card rounded-lg border">
            <h4 className="font-semibold text-sm mb-2">Expected Volatility</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You should expect to see your portfolio value fluctuate by{" "}
              <strong className="text-warning">{volatilityRange}</strong> in any given year.
              This is normal and expected for a {getRiskLevel()} portfolio.
            </p>
          </div>

          <div className="p-4 bg-gradient-card rounded-lg border">
            <h4 className="font-semibold text-sm mb-2">Best Suited For</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This portfolio is ideal for investors who {getSuitabilityStatement()}.
            </p>
          </div>
        </div>

        {/* Risk Scenarios */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            Understanding Potential Outcomes
            <Info className="h-4 w-4 text-muted-foreground" />
          </h4>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
              <TrendingUp className="h-5 w-5 text-success mx-auto mb-2" />
              <span className="text-xs text-muted-foreground block mb-1">Bull Market</span>
              <span className="text-xl font-bold text-success">{bullMarketReturn}</span>
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg border">
              <Minus className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
              <span className="text-xs text-muted-foreground block mb-1">Normal Year</span>
              <span className="text-xl font-bold text-foreground">{normalYearReturn}</span>
            </div>

            <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <TrendingDown className="h-5 w-5 text-destructive mx-auto mb-2" />
              <span className="text-xs text-muted-foreground block mb-1">Bear Market</span>
              <span className="text-xl font-bold text-destructive">{bearMarketReturn}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            These are illustrative scenarios based on historical patterns. Actual results will vary based on market conditions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
