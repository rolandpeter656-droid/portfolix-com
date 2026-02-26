import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

interface SaveTargetsResult {
  targetId: string;
}

export const usePortfolioTargets = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const saveAllocations = async (
    portfolioName: string,
    allocations: Record<string, number>,
    currentHoldings: Record<string, number>
  ): Promise<SaveTargetsResult | null> => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please sign in to save allocations.",
        variant: "destructive",
      });
      return null;
    }

    setSaving(true);
    try {
      // Upsert portfolio_targets
      const { data: target, error: targetError } = await supabase
        .from("portfolio_targets")
        .upsert(
          {
            user_id: user.id,
            portfolio_name: portfolioName || "My Portfolio",
            allocations: allocations as any,
            is_active: true,
          },
          { onConflict: "user_id,portfolio_name" }
        )
        .select("id")
        .single();

      // If unique conflict fails, try insert then select
      let targetId: string;
      if (targetError) {
        // Fallback: check if exists, then update
        const { data: existing } = await supabase
          .from("portfolio_targets")
          .select("id")
          .eq("user_id", user.id)
          .eq("portfolio_name", portfolioName || "My Portfolio")
          .maybeSingle();

        if (existing) {
          const { error: updateErr } = await supabase
            .from("portfolio_targets")
            .update({ allocations: allocations as any, is_active: true })
            .eq("id", existing.id);
          if (updateErr) throw updateErr;
          targetId = existing.id;
        } else {
          const { data: inserted, error: insertErr } = await supabase
            .from("portfolio_targets")
            .insert({
              user_id: user.id,
              portfolio_name: portfolioName || "My Portfolio",
              allocations: allocations as any,
              is_active: true,
            })
            .select("id")
            .single();
          if (insertErr) throw insertErr;
          targetId = inserted.id;
        }
      } else {
        targetId = target.id;
      }

      // Save current holdings - delete old ones for this target, then insert
      const holdingEntries = Object.entries(currentHoldings).filter(
        ([, pct]) => pct > 0
      );

      if (holdingEntries.length > 0) {
        // Remove existing holdings for this target
        await supabase
          .from("portfolio_holdings")
          .delete()
          .eq("user_id", user.id)
          .eq("target_id", targetId);

        const holdingsRows = holdingEntries.map(([assetClass, currentPct]) => ({
          user_id: user.id,
          target_id: targetId,
          asset_class: assetClass,
          current_pct: currentPct,
        }));

        const { error: holdingsError } = await supabase
          .from("portfolio_holdings")
          .insert(holdingsRows);

        if (holdingsError) throw holdingsError;
      }

      toast({
        title: "Allocations saved",
        description:
          "Allocations saved. We'll alert you when rebalancing is needed.",
      });

      return { targetId };
    } catch (error: any) {
      console.error("Error saving allocations:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save allocations.",
        variant: "destructive",
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  return { saving, saveAllocations };
};
