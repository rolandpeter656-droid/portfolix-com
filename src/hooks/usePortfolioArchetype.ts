import { supabase } from "@/integrations/supabase/client";

interface ArchetypeAllocation {
  ticker: string;
  name: string;
  percentage: number;
  rationale: string;
}

interface PortfolioArchetype {
  id: string;
  archetype_code: string;
  goal: string;
  timeline: string;
  risk_tolerance: string;
  allocations: ArchetypeAllocation[];
  target_return_min: number;
  target_return_max: number;
  max_drawdown: number;
  expense_ratio_weighted: number;
  sharpe_ratio_target: number;
  risk_flag: boolean;
  risk_flag_message: string | null;
  version: number;
}

// Map onboarding answer values to archetype DB values
const GOAL_MAP: Record<string, string> = {
  retirement: "retirement",
  wealth: "wealth_building",
  income: "passive_income",
  preserve: "capital_preservation",
};

const TIMELINE_MAP: Record<string, string> = {
  short: "short",
  medium: "medium",
  long: "long",
  unsure: "medium",
};

const RISK_MAP: Record<string, string> = {
  low: "conservative",
  medium: "balanced",
  high: "aggressive",
};

export const mapAnswersToArchetype = (
  goalValue: string,
  timelineValue: string,
  riskValue: string
) => ({
  goal: GOAL_MAP[goalValue] || "wealth_building",
  timeline: TIMELINE_MAP[timelineValue] || "medium",
  risk_tolerance: RISK_MAP[riskValue] || "balanced",
});

export const fetchArchetype = async (
  goal: string,
  timeline: string,
  riskTolerance: string
): Promise<PortfolioArchetype | null> => {
  const { data, error } = await supabase
    .from("portfolio_archetypes" as any)
    .select("*")
    .eq("goal", goal)
    .eq("timeline", timeline)
    .eq("risk_tolerance", riskTolerance)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching archetype:", error);
    return null;
  }

  return data as unknown as PortfolioArchetype | null;
};

export const fetchArchetypeByCode = async (
  code: string
): Promise<PortfolioArchetype | null> => {
  const { data, error } = await supabase
    .from("portfolio_archetypes" as any)
    .select("*")
    .eq("archetype_code", code)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching archetype by code:", error);
    return null;
  }

  return data as unknown as PortfolioArchetype | null;
};
