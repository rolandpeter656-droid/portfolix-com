import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export const usePortfolioLimit = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolioCount, setPortfolioCount] = useState<number>(0);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>("free");
  const [loading, setLoading] = useState(true);
  // With the new pricing model, all users can generate unlimited portfolios
  const [canGenerate, setCanGenerate] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("users")
        .select("portfolio_count, subscription_plan")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const count = data.portfolio_count || 0;
        const plan = data.subscription_plan || "free";
        setPortfolioCount(count);
        setSubscriptionPlan(plan);
        
        // New pricing model: ALL users can generate unlimited portfolios
        // The free tier includes unlimited portfolio generation
        setCanGenerate(true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to check portfolio limit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const incrementPortfolioCount = async () => {
    if (!user) return false;

    try {
      const { error } = await supabase.rpc("increment_portfolio_count", {
        user_uuid: user.id,
      });

      if (error) throw error;

      // Update local state
      const newCount = portfolioCount + 1;
      setPortfolioCount(newCount);

      return true;
    } catch (error) {
      console.error("Error incrementing portfolio count:", error);
      toast({
        title: "Error",
        description: "Failed to save portfolio count. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const checkAndIncrementLimit = async (): Promise<boolean> => {
    // With unlimited free tier, always allow generation
    // Just track the count for analytics
    return await incrementPortfolioCount();
  };

  // Check if user has Pro features (for gating AI analysis, rebalancing, etc.)
  const hasProFeatures = subscriptionPlan === "pro" || subscriptionPlan === "elite";
  
  // Check if user has Elite features
  const hasEliteFeatures = subscriptionPlan === "elite";

  return {
    portfolioCount,
    subscriptionPlan,
    canGenerate, // Always true with new pricing model
    hasProFeatures,
    hasEliteFeatures,
    loading,
    checkAndIncrementLimit,
    refreshUserData: fetchUserData,
  };
};
