import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const usePortfolioLimit = () => {
  const { user } = useAuth();
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("users")
        .select("subscription_plan")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSubscriptionPlan(data.subscription_plan || "free");
      }
    } catch (error) {
      console.error("Error fetching subscription plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasProFeatures = subscriptionPlan === "pro" || subscriptionPlan === "elite";
  const hasEliteFeatures = subscriptionPlan === "elite";

  return {
    subscriptionPlan,
    hasProFeatures,
    hasEliteFeatures,
    loading,
    refreshUserData: fetchUserData,
  };
};
