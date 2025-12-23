import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

interface PortfolioAllocation {
  asset: string;
  percentage: number;
}

interface Suggestion {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  action?: string;
}

interface RiskScore {
  overall_score: number;
  risk_level: "low" | "medium" | "high";
  volatility_score?: number;
  concentration_score?: number;
  diversification_score?: number;
  risk_factors: string[];
}

interface RebalancingAction {
  asset: string;
  current_weight: number;
  target_weight: number;
  action: "buy" | "sell" | "hold";
  amount_change: string;
}

export const useProFeatures = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [rebalancingActions, setRebalancingActions] = useState<RebalancingAction[]>([]);

  const getImprovementSuggestions = useCallback(async (
    portfolio: PortfolioAllocation[],
    riskTolerance?: string,
    investmentHorizon?: string
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("pro-ai-suggestions", {
        body: {
          type: "improvement",
          portfolio,
          riskTolerance,
          investmentHorizon
        }
      });

      if (error) throw error;

      if (data?.success && data?.data?.suggestions) {
        setSuggestions(data.data.suggestions);
        return data.data.suggestions;
      }
      
      return [];
    } catch (error: any) {
      console.error("Error getting suggestions:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get AI suggestions",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getRiskScore = useCallback(async (portfolio: PortfolioAllocation[]) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("pro-ai-suggestions", {
        body: {
          type: "risk_score",
          portfolio
        }
      });

      if (error) throw error;

      if (data?.success && data?.data?.risk_score) {
        setRiskScore(data.data.risk_score);
        return data.data.risk_score;
      }
      
      // Fallback risk calculation if AI fails
      const fallbackScore = calculateFallbackRiskScore(portfolio);
      setRiskScore(fallbackScore);
      return fallbackScore;
    } catch (error: any) {
      console.error("Error getting risk score:", error);
      // Use fallback calculation
      const fallbackScore = calculateFallbackRiskScore(portfolio);
      setRiskScore(fallbackScore);
      return fallbackScore;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRebalancingAlerts = useCallback(async (
    portfolio: PortfolioAllocation[],
    riskTolerance?: string
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("pro-ai-suggestions", {
        body: {
          type: "rebalancing",
          portfolio,
          riskTolerance
        }
      });

      if (error) throw error;

      if (data?.success && data?.data?.rebalancing) {
        setRebalancingActions(data.data.rebalancing);
        return data.data.rebalancing;
      }
      
      return [];
    } catch (error: any) {
      console.error("Error getting rebalancing alerts:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get rebalancing alerts",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    suggestions,
    riskScore,
    rebalancingActions,
    getImprovementSuggestions,
    getRiskScore,
    getRebalancingAlerts
  };
};

// Fallback risk calculation when AI is unavailable
function calculateFallbackRiskScore(portfolio: PortfolioAllocation[]): RiskScore {
  const highRiskAssets = ["Bitcoin", "Ethereum", "Crypto", "Altcoins", "Options", "Futures"];
  const lowRiskAssets = ["Bonds", "Treasury", "Cash", "Money Market", "Fixed Income"];
  
  let riskWeightedSum = 0;
  let totalWeight = 0;
  const riskFactors: string[] = [];
  
  // Check concentration risk
  const maxAllocation = Math.max(...portfolio.map(p => p.percentage));
  if (maxAllocation > 40) {
    riskFactors.push(`High concentration: ${maxAllocation}% in single asset`);
  }
  
  // Check diversification
  if (portfolio.length < 4) {
    riskFactors.push("Low diversification: fewer than 4 asset classes");
  }
  
  portfolio.forEach(item => {
    let assetRisk = 50; // default medium risk
    
    if (highRiskAssets.some(a => item.asset.toLowerCase().includes(a.toLowerCase()))) {
      assetRisk = 85;
      if (item.percentage > 20) {
        riskFactors.push(`High-risk asset ${item.asset} at ${item.percentage}%`);
      }
    } else if (lowRiskAssets.some(a => item.asset.toLowerCase().includes(a.toLowerCase()))) {
      assetRisk = 20;
    } else if (item.asset.toLowerCase().includes("stock") || item.asset.toLowerCase().includes("equity")) {
      assetRisk = 60;
    } else if (item.asset.toLowerCase().includes("real estate") || item.asset.toLowerCase().includes("reit")) {
      assetRisk = 45;
    }
    
    riskWeightedSum += assetRisk * item.percentage;
    totalWeight += item.percentage;
  });
  
  const overallScore = Math.round(riskWeightedSum / totalWeight);
  const riskLevel = overallScore < 35 ? "low" : overallScore < 65 ? "medium" : "high";
  
  return {
    overall_score: overallScore,
    risk_level: riskLevel,
    volatility_score: Math.min(100, overallScore + Math.random() * 10),
    concentration_score: maxAllocation,
    diversification_score: Math.min(100, portfolio.length * 15),
    risk_factors: riskFactors.length > 0 ? riskFactors : ["Portfolio risk appears balanced"]
  };
}
