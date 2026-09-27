import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { usePortfolioLimit } from "./usePortfolioLimit";

export const FREE_MARKET_ANALYSIS_LIMIT = 1;

/**
 * Free users get one full AI Market Analysis; Pro/Elite are unlimited.
 * Usage is counted from the existing analytics_events table
 * (event_name = 'market_analysis_used'), no parallel tracking system.
 */
export const useMarketAnalysisQuota = () => {
  const { user } = useAuth();
  const { hasProFeatures, loading: planLoading } = usePortfolioLimit();
  const [usedCount, setUsedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setUsedCount(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { count, error } = await supabase
        .from("analytics_events")
        .select("id", { count: "exact", head: true })
        .eq("event_name", "market_analysis_used")
        .eq("user_id", user.id);

      if (error) throw error;
      setUsedCount(count ?? 0);
    } catch (e) {
      console.error("[MarketAnalysisQuota] failed to read usage:", e);
      setUsedCount(0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isLocked =
    !hasProFeatures && usedCount >= FREE_MARKET_ANALYSIS_LIMIT;

  return {
    usedCount,
    isPro: hasProFeatures,
    isLocked,
    loading: loading || planLoading,
    refresh,
    markUsed: () => setUsedCount((c) => c + 1),
  };
};
