import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  RefreshCw, 
  Lightbulb, 
  AlertTriangle, 
  Plus, 
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Globe,
  Shield,
  Zap,
  CheckCircle,
  X,
  Settings
} from "lucide-react";

interface AISuggestion {
  id: string;
  type: "rebalance" | "addition" | "risk" | "opportunity" | "optimization";
  title: string;
  description: string;
  impact: string;
  confidence: number;
  priority: "low" | "medium" | "high";
  data?: any;
}

interface AISuggestionPanelProps {
  suggestions?: AISuggestion[];
  onApplySuggestion?: (suggestion: AISuggestion) => void;
  onDismissSuggestion?: (suggestionId: string) => void;
  onRefreshSuggestions?: () => void;
  isLoading?: boolean;
}

const defaultSuggestions: AISuggestion[] = [
  {
    id: "1",
    type: "rebalance",
    title: "Reduce Tech Concentration",
    description: "Your technology allocation is 37%, which is above optimal. Consider reducing AAPL to 12% and MSFT to 10% to improve diversification.",
    impact: "+0.3% expected return, -2.1% volatility",
    confidence: 85,
    priority: "high",
    data: { currentTech: 37, recommendedTech: 25, affectedAssets: ["AAPL", "MSFT", "GOOGL"] }
  },
  {
    id: "2",
    type: "addition",
    title: "Add Emerging Markets Exposure",
    description: "Consider adding VWO (Vanguard Emerging Markets ETF) at 5% allocation for geographic diversification and growth potential.",
    impact: "+0.8% expected return, +1.2% volatility",
    confidence: 78,
    priority: "medium",
    data: { recommendedSymbol: "VWO", allocation: 5, region: "Emerging Markets" }
  },
  {
    id: "3",
    type: "risk",
    title: "Portfolio Risk Assessment",
    description: "Current portfolio volatility is 14.2%, which aligns well with your moderate risk profile. No immediate action needed.",
    impact: "Risk tolerance: Well matched",
    confidence: 92,
    priority: "low",
    data: { currentVolatility: 14.2, targetRange: [12, 18] }
  },
  {
    id: "4",
    type: "opportunity",
    title: "Nigeria Banking Sector Opportunity",
    description: "Nigeria's banking sector showing strong Q3 fundamentals. Consider 3-5% allocation to FBNH or GTCO for local market exposure.",
    impact: "Currency diversification, local growth exposure",
    confidence: 71,
    priority: "medium",
    data: { sector: "Banking", region: "Nigeria", recommendedAllocation: "3-5%" }
  },
  {
    id: "5",
    type: "optimization",
    title: "Bond Duration Optimization",
    description: "With current interest rate environment, consider shifting from long-term to intermediate-term bonds (5-7 year duration).",
    impact: "-0.2% interest rate risk, maintained yield",
    confidence: 83,
    priority: "medium",
    data: { currentDuration: "10+ years", recommendedDuration: "5-7 years" }
  }
];

const getSuggestionIcon = (type: AISuggestion["type"]) => {
  switch (type) {
    case "rebalance": return <BarChart3 className="h-4 w-4" />;
    case "addition": return <Plus className="h-4 w-4" />;
    case "risk": return <Shield className="h-4 w-4" />;
    case "opportunity": return <Lightbulb className="h-4 w-4" />;
    case "optimization": return <Target className="h-4 w-4" />;
    default: return <Brain className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: AISuggestion["priority"]) => {
  switch (priority) {
    case "high": return "destructive";
    case "medium": return "default";
    case "low": return "secondary";
    default: return "secondary";
  }
};

export const AISuggestionPanel = ({ 
  suggestions = defaultSuggestions,
  onApplySuggestion,
  onDismissSuggestion,
  onRefreshSuggestions,
  isLoading = false
}: AISuggestionPanelProps) => {
  const [filter, setFilter] = useState<"all" | AISuggestion["type"]>("all");
  const [sortBy, setSortBy] = useState<"priority" | "confidence">("priority");

  const filteredSuggestions = suggestions
    .filter(suggestion => filter === "all" || suggestion.type === filter)
    .sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.confidence - a.confidence;
    });

  const averageConfidence = suggestions.reduce((sum, s) => sum + s.confidence, 0) / suggestions.length;
  const highPrioritySuggestions = suggestions.filter(s => s.priority === "high").length;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Suggestions
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {averageConfidence.toFixed(0)}% avg confidence
            </Badge>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onRefreshSuggestions}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 bg-accent rounded-lg">
            <div className="text-lg font-bold text-foreground">{suggestions.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="p-2 bg-accent rounded-lg">
            <div className="text-lg font-bold text-destructive">{highPrioritySuggestions}</div>
            <div className="text-xs text-muted-foreground">High Priority</div>
          </div>
          <div className="p-2 bg-accent rounded-lg">
            <div className="text-lg font-bold text-success">{averageConfidence.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">Confidence</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="text-xs"
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter === "rebalance" ? "default" : "outline"}
            onClick={() => setFilter("rebalance")}
            className="text-xs"
          >
            Rebalance
          </Button>
          <Button
            size="sm"
            variant={filter === "addition" ? "default" : "outline"}
            onClick={() => setFilter("addition")}
            className="text-xs"
          >
            Additions
          </Button>
          <Button
            size="sm"
            variant={filter === "opportunity" ? "default" : "outline"}
            onClick={() => setFilter("opportunity")}
            className="text-xs"
          >
            Opportunities
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-3">
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Analyzing portfolio...</p>
            </div>
          </div>
        ) : (
          filteredSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  {getSuggestionIcon(suggestion.type)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{suggestion.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(suggestion.priority)} className="text-xs">
                        {suggestion.priority}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.confidence}%
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {suggestion.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-primary font-medium">
                      {suggestion.impact}
                    </div>
                    <div className="flex gap-1">
                      {onApplySuggestion && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs h-7 px-2"
                          onClick={() => onApplySuggestion(suggestion)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Apply
                        </Button>
                      )}
                      {onDismissSuggestion && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-xs h-7 px-2"
                          onClick={() => onDismissSuggestion(suggestion.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Confidence Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Confidence</span>
                      <span>{suggestion.confidence}%</span>
                    </div>
                    <Progress value={suggestion.confidence} className="h-1" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        <Separator />

        {/* AI Analysis Summary */}
        <div className="p-4 bg-gradient-primary rounded-lg text-white">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Portfolio Analysis
          </h4>
          <p className="text-sm text-white/90 mb-3">
            Your portfolio shows good diversification with room for optimization. 
            Focus on reducing tech concentration and adding international exposure.
          </p>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span>Overall Score:</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <strong>8.2/10</strong>
              </div>
            </div>
            <Button size="sm" variant="secondary" className="h-7 text-xs">
              <Settings className="h-3 w-3 mr-1" />
              Customize AI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};