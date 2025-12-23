import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, AlertTriangle, CheckCircle, Lock, RefreshCw, TrendingUp } from "lucide-react";
import { useProFeatures } from "@/hooks/useProFeatures";

interface PortfolioAllocation {
  asset: string;
  percentage: number;
}

interface RiskScoreCardProps {
  portfolio: PortfolioAllocation[];
  isPro: boolean;
  onUpgrade?: () => void;
}

export const RiskScoreCard = ({
  portfolio,
  isPro,
  onUpgrade
}: RiskScoreCardProps) => {
  const { loading, riskScore, getRiskScore } = useProFeatures();
  const [hasFetched, setHasFetched] = useState(false);

  const fetchRiskScore = async () => {
    if (isPro && portfolio.length > 0) {
      await getRiskScore(portfolio);
      setHasFetched(true);
    }
  };

  useEffect(() => {
    if (isPro && portfolio.length > 0 && !hasFetched) {
      fetchRiskScore();
    }
  }, [isPro, portfolio]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-500";
      case "medium": return "text-yellow-500";
      case "high": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "high": return "bg-red-500";
      default: return "bg-muted";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low": return <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />;
      case "medium": return <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />;
      case "high": return <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />;
      default: return <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />;
    }
  };

  if (!isPro) {
    return (
      <Card className="border-dashed border-2 border-muted">
        <CardContent className="p-4 sm:p-6 text-center">
          <Lock className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-semibold text-base sm:text-lg mb-2">Portfolio Risk Score</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4">
            Get a detailed risk analysis with Pro
          </p>
          {onUpgrade && (
            <Button onClick={onUpgrade} size="sm" className="text-sm">
              <Shield className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Risk Score
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchRiskScore}
            disabled={loading}
            className="h-8 px-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : riskScore ? (
          <div className="space-y-4">
            {/* Main Score Display */}
            <div className="flex items-center justify-center gap-4 p-4 bg-muted/50 rounded-lg">
              {getRiskIcon(riskScore.risk_level)}
              <div className="text-center">
                <div className={`text-3xl sm:text-4xl font-bold ${getRiskColor(riskScore.risk_level)}`}>
                  {riskScore.overall_score}
                </div>
                <div className={`text-xs sm:text-sm font-medium uppercase ${getRiskColor(riskScore.risk_level)}`}>
                  {riskScore.risk_level} Risk
                </div>
              </div>
            </div>

            {/* Risk Metrics */}
            <div className="space-y-3">
              {riskScore.volatility_score !== undefined && (
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span>Volatility</span>
                    <span>{Math.round(riskScore.volatility_score)}%</span>
                  </div>
                  <Progress value={riskScore.volatility_score} className="h-2" />
                </div>
              )}
              
              {riskScore.concentration_score !== undefined && (
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span>Concentration</span>
                    <span>{Math.round(riskScore.concentration_score)}%</span>
                  </div>
                  <Progress value={riskScore.concentration_score} className="h-2" />
                </div>
              )}
              
              {riskScore.diversification_score !== undefined && (
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span>Diversification</span>
                    <span>{Math.round(riskScore.diversification_score)}%</span>
                  </div>
                  <Progress value={riskScore.diversification_score} className="h-2" />
                </div>
              )}
            </div>

            {/* Risk Factors */}
            {riskScore.risk_factors && riskScore.risk_factors.length > 0 && (
              <div className="pt-2 border-t">
                <h4 className="text-xs sm:text-sm font-medium mb-2">Key Risk Factors</h4>
                <ul className="space-y-1">
                  {riskScore.risk_factors.map((factor, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Click refresh to calculate risk score</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
