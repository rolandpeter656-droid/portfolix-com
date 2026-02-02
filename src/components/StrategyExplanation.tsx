import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, BarChart3, Lightbulb } from "lucide-react";

interface StrategyExplanationProps {
  portfolioName: string;
  riskScore: number;
  experienceLevel: string;
  timeline: string;
  stockAllocation: number;
  bondAllocation: number;
}

export const StrategyExplanation = ({
  portfolioName,
  riskScore,
  experienceLevel,
  timeline,
  stockAllocation,
  bondAllocation
}: StrategyExplanationProps) => {
  // Determine goal context based on portfolio name
  const getGoalContext = () => {
    const name = portfolioName.toLowerCase();
    if (name.includes("retirement")) return "building long-term retirement savings";
    if (name.includes("income") || name.includes("dividend")) return "generating passive income";
    if (name.includes("growth")) return "growing wealth over time";
    if (name.includes("conservative")) return "preserving capital with modest growth";
    return "achieving balanced investment returns";
  };

  // Determine risk profile description
  const getRiskProfile = () => {
    if (riskScore <= 30) return { level: "Conservative", description: "prioritizes stability and capital preservation with modest growth expectations" };
    if (riskScore <= 60) return { level: "Moderate", description: "balances growth potential with downside protection" };
    return { level: "Aggressive", description: "maximizes long-term growth potential and accepts higher short-term volatility" };
  };

  // Determine timeline context
  const getTimelineContext = () => {
    if (timeline.includes("1-2") || timeline.includes("less")) return "less than 3 years";
    if (timeline.includes("3-5")) return "3-5 years";
    if (timeline.includes("6-10")) return "6-10 years";
    return "10+ years or more";
  };

  const riskProfile = getRiskProfile();
  const goalContext = getGoalContext();
  const timelineContext = getTimelineContext();

  // Generate the strategy explanation
  const explanation = `Because you're ${goalContext} with a ${timelineContext} time horizon, this ${riskProfile.level.toLowerCase()} portfolio ${riskProfile.description}. The ${stockAllocation}/${bondAllocation} stock-to-bond ratio reflects this strategy, positioning you to ${portfolioName.toLowerCase().includes("income") ? "generate regular income" : portfolioName.toLowerCase().includes("conservative") ? "protect your capital while maintaining modest growth" : "achieve meaningful growth"} while managing risk appropriately for your timeline.`;

  return (
    <Card className="shadow-card bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Why This Portfolio Works for You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          {explanation}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
            <div className="p-2 rounded-full bg-primary/10">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Goal Alignment</span>
              <span className="font-medium text-sm capitalize">
                {portfolioName.replace("Portfolio", "").trim()}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
            <div className="p-2 rounded-full bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Time Horizon</span>
              <span className="font-medium text-sm">{timeline}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
            <div className="p-2 rounded-full bg-primary/10">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Risk Level</span>
              <Badge variant={riskProfile.level === "Conservative" ? "secondary" : riskProfile.level === "Moderate" ? "outline" : "default"}>
                {riskProfile.level}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
