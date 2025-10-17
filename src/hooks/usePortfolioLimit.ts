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
        
        // Pro users can always generate
        if (plan === "pro") {
          setCanGenerate(true);
        } else {
          // Free users limited to 5
          setCanGenerate(count < 5);
        }
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
      
      if (subscriptionPlan !== "pro") {
        setCanGenerate(newCount < 5);
      }

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
    if (!canGenerate && subscriptionPlan !== "pro") {
      return false;
    }

    return await incrementPortfolioCount();
  };

  return {
    portfolioCount,
    subscriptionPlan,
    canGenerate,
    loading,
    checkAndIncrementLimit,
    refreshUserData: fetchUserData,
  };
};
