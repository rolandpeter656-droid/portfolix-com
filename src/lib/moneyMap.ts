// Your Money Map — archetype + projection config
// Edit these freely. No engine changes required.

export type RiskLevel = "conservative" | "balanced" | "aggressive";
export type TimelineBucket = "short" | "medium" | "long";
export type GoalKey = "retirement" | "wealth" | "income" | "preserve";

// (risk, timeline) → archetype name
export const ARCHETYPE_NAMES: Record<RiskLevel, Record<TimelineBucket, string>> = {
  conservative: {
    short: "The Guardian",
    medium: "The Careful Builder",
    long: "The Patient Builder",
  },
  balanced: {
    short: "The Steady Hand",
    medium: "The Steady Compounder",
    long: "The Long Compounder",
  },
  aggressive: {
    short: "The Bold Starter",
    medium: "The Bold Grower",
    long: "The Bold Visionary",
  },
};

// goal → one-line subtitle on the card
export const GOAL_SUBTITLES: Record<GoalKey, string> = {
  retirement: "Built for the long game — steady growth you don't have to babysit.",
  wealth: "Tuned for maximum growth over time.",
  income: "Designed to pay you along the way.",
  preserve: "Protects what you have while it grows quietly.",
};

// Assumed annual returns — ILLUSTRATIVE ONLY
export const ASSUMED_ANNUAL_RETURN: Record<RiskLevel, number> = {
  conservative: 0.05,
  balanced: 0.07,
  aggressive: 0.09,
};

// Map the onboarding raw values (low/medium/high, short/medium/long/unsure) to our config keys
export const mapVolatilityToRisk = (v?: string): RiskLevel => {
  if (v === "low") return "conservative";
  if (v === "high") return "aggressive";
  return "balanced";
};

export const mapTimelineToBucket = (t?: string): TimelineBucket => {
  if (t === "short") return "short";
  if (t === "long") return "long";
  // "medium" and "unsure" → medium (per spec)
  return "medium";
};

export const mapGoalToKey = (g?: string): GoalKey => {
  if (g === "retirement") return "retirement";
  if (g === "income") return "income";
  if (g === "preserve") return "preserve";
  return "wealth";
};

export const getArchetypeName = (risk: RiskLevel, timeline: TimelineBucket) =>
  ARCHETYPE_NAMES[risk][timeline];

export const getGoalSubtitle = (goal: GoalKey) => GOAL_SUBTITLES[goal];

/**
 * Future value with optional starting lump and monthly contributions.
 * FV = L*(1+r)^n + P*((1+r)^n - 1)/r
 */
export const projectFutureValue = (params: {
  monthlyContribution: number;
  years: number;
  annualReturn: number;
  startingAmount?: number;
}): number => {
  const { monthlyContribution, years, annualReturn, startingAmount = 0 } = params;
  const r = annualReturn / 12;
  const n = years * 12;
  if (r === 0) return startingAmount + monthlyContribution * n;
  const growth = Math.pow(1 + r, n);
  return startingAmount * growth + monthlyContribution * ((growth - 1) / r);
};

export const yearsForTimeline = (t: TimelineBucket): number => {
  if (t === "short") return 3;
  if (t === "medium") return 7;
  return 20;
};

export const formatCompactCurrency = (
  value: number,
  currency: "USD" | "NGN" = "USD"
): string => {
  const symbol = currency === "NGN" ? "₦" : "$";
  if (value >= 1_000_000_000) return `${symbol}${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${symbol}${(value / 1_000).toFixed(0)}K`;
  return `${symbol}${Math.round(value).toLocaleString()}`;
};
