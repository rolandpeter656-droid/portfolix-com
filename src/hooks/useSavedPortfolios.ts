import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface SavedPortfolioAsset {
  symbol: string;
  name: string;
  allocation: number;
  rationale: string;
  assetClass: string;
  color: string;
}

export interface SavedPortfolio {
  id: string;
  portfolio_name: string;
  risk_score: number;
  experience_level: string;
  timeline: string;
  investment_amount: number;
  assets: SavedPortfolioAsset[];
  rationale: string | null;
  created_at: string;
  updated_at: string;
}

const FREE_PORTFOLIO_LIMIT = 5;

export const useSavedPortfolios = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolios, setPortfolios] = useState<SavedPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPortfolios = useCallback(async () => {
    if (!user) {
      setPortfolios([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_portfolios")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(FREE_PORTFOLIO_LIMIT);

      if (error) throw error;

      const formattedPortfolios: SavedPortfolio[] = (data || []).map((p) => ({
        id: p.id,
        portfolio_name: p.portfolio_name,
        risk_score: p.risk_score,
        experience_level: p.experience_level,
        timeline: p.timeline,
        investment_amount: Number(p.investment_amount),
        assets: p.assets as unknown as SavedPortfolioAsset[],
        rationale: p.rationale,
        created_at: p.created_at,
        updated_at: p.updated_at,
      }));

      setPortfolios(formattedPortfolios);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      toast({
        title: "Error",
        description: "Failed to load your saved portfolios.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const getPortfolioCount = useCallback(() => portfolios.length, [portfolios]);

  const canCreatePortfolio = useCallback(
    (subscriptionPlan: string) => {
      if (subscriptionPlan === "pro") return true;
      return portfolios.length < FREE_PORTFOLIO_LIMIT;
    },
    [portfolios]
  );

  const getRemainingPortfolios = useCallback(
    (subscriptionPlan: string) => {
      if (subscriptionPlan === "pro") return Infinity;
      return Math.max(0, FREE_PORTFOLIO_LIMIT - portfolios.length);
    },
    [portfolios]
  );

  const savePortfolio = useCallback(
    async (portfolio: {
      portfolio_name: string;
      risk_score: number;
      experience_level: string;
      timeline: string;
      investment_amount: number;
      assets: SavedPortfolioAsset[];
      rationale?: string;
    }) => {
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to save your portfolio.",
          variant: "destructive",
        });
        return null;
      }

      try {
        setSaving(true);
        const { data, error } = await supabase
          .from("user_portfolios")
          .insert({
            user_id: user.id,
            portfolio_name: portfolio.portfolio_name,
            risk_score: portfolio.risk_score,
            experience_level: portfolio.experience_level,
            timeline: portfolio.timeline,
            investment_amount: portfolio.investment_amount,
            assets: JSON.parse(JSON.stringify(portfolio.assets)),
            rationale: portfolio.rationale || null,
          })
          .select()
          .single();

        if (error) throw error;

        const savedPortfolio: SavedPortfolio = {
          id: data.id,
          portfolio_name: data.portfolio_name,
          risk_score: data.risk_score,
          experience_level: data.experience_level,
          timeline: data.timeline,
          investment_amount: Number(data.investment_amount),
          assets: data.assets as unknown as SavedPortfolioAsset[],
          rationale: data.rationale,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };

        setPortfolios((prev) => [savedPortfolio, ...prev].slice(0, FREE_PORTFOLIO_LIMIT));

        toast({
          title: "Portfolio saved!",
          description: "Your portfolio has been saved to your account.",
        });

        return savedPortfolio;
      } catch (error) {
        console.error("Error saving portfolio:", error);
        toast({
          title: "Error",
          description: "Failed to save portfolio. Please try again.",
          variant: "destructive",
        });
        return null;
      } finally {
        setSaving(false);
      }
    },
    [user, toast]
  );

  const updatePortfolioAmount = useCallback(
    async (portfolioId: string, newAmount: number) => {
      if (!user) return false;

      try {
        const { error } = await supabase
          .from("user_portfolios")
          .update({ investment_amount: newAmount })
          .eq("id", portfolioId)
          .eq("user_id", user.id);

        if (error) throw error;

        setPortfolios((prev) =>
          prev.map((p) =>
            p.id === portfolioId ? { ...p, investment_amount: newAmount } : p
          )
        );

        return true;
      } catch (error) {
        console.error("Error updating portfolio amount:", error);
        toast({
          title: "Error",
          description: "Failed to update investment amount.",
          variant: "destructive",
        });
        return false;
      }
    },
    [user, toast]
  );

  const deletePortfolio = useCallback(
    async (portfolioId: string) => {
      if (!user) return false;

      try {
        const { error } = await supabase
          .from("user_portfolios")
          .delete()
          .eq("id", portfolioId)
          .eq("user_id", user.id);

        if (error) throw error;

        setPortfolios((prev) => prev.filter((p) => p.id !== portfolioId));

        toast({
          title: "Portfolio deleted",
          description: "Your portfolio has been removed.",
        });

        return true;
      } catch (error) {
        console.error("Error deleting portfolio:", error);
        toast({
          title: "Error",
          description: "Failed to delete portfolio.",
          variant: "destructive",
        });
        return false;
      }
    },
    [user, toast]
  );

  return {
    portfolios,
    loading,
    saving,
    getPortfolioCount,
    canCreatePortfolio,
    getRemainingPortfolios,
    savePortfolio,
    updatePortfolioAmount,
    deletePortfolio,
    refreshPortfolios: fetchPortfolios,
    FREE_PORTFOLIO_LIMIT,
  };
};
