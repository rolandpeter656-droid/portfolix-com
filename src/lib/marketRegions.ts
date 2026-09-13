export const MARKET_REGIONS = [
  "Nigeria",
  "United States",
  "United Kingdom",
  "Canada",
  "India",
  "Asia-Pacific",
  "Other / Global",
] as const;

export type MarketRegion = (typeof MARKET_REGIONS)[number];

export interface RegionBroker {
  name: string;
  url: string;
}

/** Brokerages we have actually vetted. Regions absent here get no named broker. */
export const REGION_BROKERS: Partial<Record<MarketRegion, RegionBroker[]>> = {
  Nigeria: [
    { name: "Bamboo", url: "https://app.investbamboo.com/" },
    { name: "Trove", url: "https://www.trovefinance.com/" },
  ],
  "United States": [
    { name: "Fidelity", url: "https://www.fidelity.com/" },
    { name: "Vanguard", url: "https://investor.vanguard.com/" },
  ],
  "Asia-Pacific": [{ name: "Tiger Brokers", url: "https://www.tigerbrokers.com/" }],
};

export function regionCurrency(region: MarketRegion): { symbol: string; code: string } {
  return region === "Nigeria" ? { symbol: "₦", code: "NGN" } : { symbol: "$", code: "USD" };
}

export function comingSoonNote(region: MarketRegion): string | null {
  if (REGION_BROKERS[region]?.length) return null;
  return `Region-specific brokerage guidance for ${region} is coming soon.`;
}

export interface AllocationRow {
  assetType: string;
  name: string;
  percentage: number;
  rationale: string;
}

export interface MarketAnalysisResult {
  allocation: AllocationRow[];
  actionPlan: string[];
  marketInsights: string;
}
