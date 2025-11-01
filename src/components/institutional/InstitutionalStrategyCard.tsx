import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Lightbulb, FileText } from "lucide-react";
import { InstitutionalStrategy } from "@/pages/Institutions";

interface InstitutionalStrategyCardProps {
  strategy: InstitutionalStrategy;
}

export const InstitutionalStrategyCard = ({
  strategy,
}: InstitutionalStrategyCardProps) => {
  const handleGenerate = () => {
    // TODO: Implement portfolio generation logic
    console.log("Generate portfolio for:", strategy.name);
  };

  return (
    <Card className="p-6 hover-glow transition-all duration-300 bg-gradient-to-br from-card to-secondary border border-border group">
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
            {strategy.name}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              {strategy.riskProfile}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              {strategy.returnProfile}
            </Badge>
          </div>
        </div>

        {/* Allocation Overview */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Allocation Breakdown:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(strategy.allocation).map(([asset, percentage]) => (
              <div
                key={asset}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-muted-foreground capitalize">
                  {asset}:
                </span>
                <span className="font-medium">{percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="space-y-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-primary">
                AI Strategy Reasoning
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {strategy.aiReasoning}
              </p>
            </div>
          </div>
        </div>

        {/* Inspired By */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <FileText className="h-3 w-3 flex-shrink-0 mt-0.5" />
          <p>
            <span className="font-medium">Inspired by:</span>{" "}
            {strategy.inspiredBy}
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={handleGenerate}
          className="w-full bg-primary hover:bg-primary-glow text-primary-foreground"
        >
          Generate Custom Institutional Portfolio
        </Button>
      </div>
    </Card>
  );
};
