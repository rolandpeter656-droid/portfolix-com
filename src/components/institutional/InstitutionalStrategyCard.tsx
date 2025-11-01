import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Lightbulb, FileText, Loader2 } from "lucide-react";
import { InstitutionalStrategy } from "@/pages/Institutions";
import { GeneratedPortfolioModal } from "./GeneratedPortfolioModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InstitutionalStrategyCardProps {
  strategy: InstitutionalStrategy;
}

export const InstitutionalStrategyCard = ({
  strategy,
}: InstitutionalStrategyCardProps) => {
  const [generating, setGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [generatedPortfolio, setGeneratedPortfolio] = useState<any>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to generate institutional portfolios");
        setGenerating(false);
        return;
      }

      // Get user's subscription (for demo, we'll use a placeholder)
      const { data: subscription } = await supabase
        .from('institutional_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!subscription) {
        toast.error("Active institutional subscription required");
        setGenerating(false);
        return;
      }

      // Call institutional API edge function
      const { data, error } = await supabase.functions.invoke('institutional-api', {
        body: {
          action: 'generate',
          portfolioName: strategy.name,
          portfolioType: strategy.id,
          riskTolerance: strategy.riskProfile.toLowerCase().replace('-', '_'),
          capitalSize: 10000000, // Default $10M
          investmentHorizon: '5 years',
          liquidityNeeds: 'moderate',
          inspiredBy: strategy.inspiredBy,
        }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        setGenerating(false);
        return;
      }

      setGeneratedPortfolio({
        name: data.portfolio.portfolio_name,
        allocation: data.portfolio.allocation,
        rationale: data.portfolio.rationale,
        expectedReturn: data.portfolio.expected_return,
        volatility: data.portfolio.volatility,
        riskTolerance: data.portfolio.risk_tolerance,
        aiConfidenceScore: data.portfolio.ai_confidence_score,
      });
      
      setShowModal(true);
      toast.success("Portfolio generated successfully!");
    } catch (error) {
      console.error('Error generating portfolio:', error);
      toast.error("Failed to generate portfolio. Please try again.");
    } finally {
      setGenerating(false);
    }
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
          disabled={generating}
          className="w-full bg-primary hover:bg-primary-glow text-primary-foreground"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Custom Institutional Portfolio"
          )}
        </Button>
      </div>
      
      <GeneratedPortfolioModal
        open={showModal}
        onOpenChange={setShowModal}
        portfolio={generatedPortfolio}
      />
    </Card>
  );
};
