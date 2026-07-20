import { supabase } from "@/integrations/supabase/client";

export type NgRiskProfile = "conservative" | "balanced" | "aggressive";

export interface NgHolding {
  ticker: string;
  name: string;
  security_type: "stock" | "etf";
  sector: string;
  bucket: "core" | "satellite";
  is_dividend_payer: boolean;
  /** Percentage of the OVERALL portfolio (0-100). */
  percentage: number;
  rationale: string;
}

export interface NgSleeveResult {
  risk_profile: NgRiskProfile;
  local_sleeve_pct: number;
  etf_core_pct_of_sleeve: number;
  max_single_names: number;
  holdings: NgHolding[];
}

/** Map onboarding risk answer to Nigeria allocation-config profile. */
export function mapRiskToNgProfile(onboardingRisk?: string): NgRiskProfile {
  const v = (onboardingRisk || "").toLowerCase();
  if (v === "low") return "conservative";
  if (v === "high") return "aggressive";
  return "balanced";
}

const RATIONALES: Record<string, string> = {
  Banking: "Nigerian tier-1 bank — reliable dividend yield and strong capital base.",
  Telecom: "Dominant NGX telecom operator with recurring subscriber revenue.",
  Industrials: "Cement leader positioned to benefit from infrastructure spending.",
  Consumer: "Defensive consumer-staples exposure with pricing power.",
  Energy: "Dollar-linked energy revenues help hedge naira weakness.",
  Agriculture: "Palm-oil producer with export earnings and inelastic demand.",
  Construction: "Infrastructure play tied to Nigeria's public-works pipeline.",
  Broad: "Broad NGX index exposure — low-cost diversification across local equities.",
  Commodity: "Gold ETF — hedge against naira volatility and inflation.",
};

function rationaleFor(sector: string, security_type: "stock" | "etf"): string {
  if (RATIONALES[sector]) return RATIONALES[sector];
  return security_type === "etf"
    ? "Sector ETF providing diversified NGX exposure."
    : "Large-cap NGX single-name exposure.";
}

/**
 * Deterministically build the Nigeria local sleeve for a given risk profile.
 * Reads ng_allocation_config + ng_whitelist. No AI involvement.
 */
export async function buildNgSleeve(
  onboardingRisk?: string
): Promise<NgSleeveResult | null> {
  const profile = mapRiskToNgProfile(onboardingRisk);

  const { data: cfg, error: cfgErr } = await supabase
    .from("ng_allocation_config")
    .select("*")
    .eq("risk_profile", profile)
    .maybeSingle();

  if (cfgErr || !cfg) {
    console.error("[NG sleeve] config fetch failed", cfgErr);
    return null;
  }

  const eligibleCol =
    profile === "conservative"
      ? "eligible_conservative"
      : profile === "balanced"
      ? "eligible_balanced"
      : "eligible_aggressive";

  const { data: rows, error: wlErr } = await supabase
    .from("ng_whitelist")
    .select("ticker, name, security_type, sector, bucket, is_dividend_payer")
    .eq("status", "active")
    .eq(eligibleCol as any, true)
    .order("ticker", { ascending: true });

  if (wlErr || !rows) {
    console.error("[NG sleeve] whitelist fetch failed", wlErr);
    return null;
  }

  const etfs = rows.filter((r) => r.security_type === "etf");
  const stocks = rows.filter((r) => r.security_type === "stock");

  // Select ETFs: prefer broad first, then non-broad. Take up to 3 for balanced/aggressive,
  // all broad for conservative.
  const broadEtfs = etfs.filter((e) => e.sector === "Broad");
  const nonBroadEtfs = etfs.filter((e) => e.sector !== "Broad");
  const etfPick =
    profile === "conservative"
      ? broadEtfs.slice(0, 3)
      : [...broadEtfs.slice(0, 2), ...nonBroadEtfs.slice(0, 1)];

  // Select stocks: round-robin across sectors up to max_single_names.
  const maxNames = cfg.max_single_names as number;
  const stockPick: typeof stocks = [];
  if (maxNames > 0 && stocks.length > 0) {
    const bySector = new Map<string, typeof stocks>();
    stocks.forEach((s) => {
      const list = bySector.get(s.sector) ?? [];
      list.push(s);
      bySector.set(s.sector, list);
    });
    const sectorQueues = Array.from(bySector.values());
    let i = 0;
    while (stockPick.length < maxNames) {
      const q = sectorQueues[i % sectorQueues.length];
      const next = q.shift();
      if (next) stockPick.push(next);
      i++;
      if (sectorQueues.every((s) => s.length === 0)) break;
    }
  }

  const localSleeve = Number(cfg.local_sleeve_pct);
  const etfSharePct = Number(cfg.etf_core_pct_of_sleeve); // % of local sleeve going to ETF core
  const satelliteSharePct = 100 - etfSharePct;

  const etfPortfolioTotal = (localSleeve / 100) * (etfSharePct / 100) * 100;
  const stockPortfolioTotal = (localSleeve / 100) * (satelliteSharePct / 100) * 100;

  const etfEach = etfPick.length ? etfPortfolioTotal / etfPick.length : 0;
  const stockEach = stockPick.length ? stockPortfolioTotal / stockPick.length : 0;

  const holdings: NgHolding[] = [
    ...etfPick.map((e) => ({
      ticker: e.ticker,
      name: e.name,
      security_type: e.security_type as "etf",
      sector: e.sector,
      bucket: "core" as const,
      is_dividend_payer: !!e.is_dividend_payer,
      percentage: Number(etfEach.toFixed(2)),
      rationale: rationaleFor(e.sector, "etf"),
    })),
    ...stockPick.map((s) => ({
      ticker: s.ticker,
      name: s.name,
      security_type: s.security_type as "stock",
      sector: s.sector,
      bucket: "satellite" as const,
      is_dividend_payer: !!s.is_dividend_payer,
      percentage: Number(stockEach.toFixed(2)),
      rationale: rationaleFor(s.sector, "stock"),
    })),
  ];

  return {
    risk_profile: profile,
    local_sleeve_pct: localSleeve,
    etf_core_pct_of_sleeve: etfSharePct,
    max_single_names: maxNames,
    holdings,
  };
}
