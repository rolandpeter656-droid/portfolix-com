import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, TrendingUp, AlertCircle, Sparkles, RefreshCw, Lock } from "lucide-react";
import { useProFeatures } from "@/hooks/useProFeatures";

interface PortfolioAllocation {
  asset: string;
  percentage: number;
}

interface ProSuggestionsPanelProps {
  portfolio: PortfolioAllocation[];
  isPro: boolean;
  riskTolerance?: string;
  investmentHorizon?: string;
  onUpgrade?: () => void;
}

export const ProSuggestionsPanel = ({
  portfolio,
  isPro,
  riskTolerance,
  investmentHorizon,
  onUpgrade
}: ProSuggestionsPanelProps) => {
  const { loading, suggestions, getImprovementSuggestions } = useProFeatures();
  const [hasFetched, setHasFetched] = useState(false);

  const fetchSuggestions = async () => {
    if (isPro && portfolio.length > 0) {
      await getImprovementSuggestions(portfolio, riskTolerance, investmentHorizon);
      setHasFetched(true);
    }
  };

  useEffect(() => {
    if (isPro && portfolio.length > 0 && !hasFetched) {
      fetchSuggestions();
    }
  }, [isPro, portfolio]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertCircle className="h-4 w-4" />;
      case "medium": return <TrendingUp className="h-4 w-4" />;
      case "low": return <Lightbulb className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  if (!isPro) {
    return (
      <Card className="border-dashed border-2 border-muted">
        <CardContent className="p-4 sm:p-6 text-center">
          <Lock className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-semibold text-base sm:text-lg mb-2">Pro Feature</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4">
            Get AI-powered portfolio improvement suggestions with Pro
          </p>
          {onUpgrade && (
            <Button onClick={onUpgrade} size="sm" className="text-sm">
              <Sparkles className="h-4 w-4 mr-2" />
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
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            AI Suggestions
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchSuggestions}
            disabled={loading}
            className="h-8 px-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </>
        ) : suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 sm:p-4 bg-muted/50 rounded-lg space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getPriorityIcon(suggestion.priority)}
                  <h4 className="font-medium text-sm sm:text-base">{suggestion.title}</h4>
                </div>
                <Badge className={`${getPriorityColor(suggestion.priority)} text-xs`}>
                  {suggestion.priority}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {suggestion.description}
              </p>
              {suggestion.action && (
                <p className="text-xs font-medium text-primary">
                  Action: {suggestion.action}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Click refresh to get AI suggestions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
