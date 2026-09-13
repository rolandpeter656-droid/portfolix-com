import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const REGIONS = [
  "Nigeria",
  "United States",
  "United Kingdom",
  "Canada",
  "India",
  "Asia-Pacific",
  "Other / Global",
] as const;
type Region = (typeof REGIONS)[number];

const VETTED_BROKERS: Record<string, string[]> = {
  Nigeria: ["Bamboo", "Trove"],
  "United States": ["Fidelity", "Vanguard"],
  "Asia-Pacific": ["Tiger Brokers"],
};

// Wording we never allow in generated copy.
const BANNED = [
  /\brisk-?free\b/gi,
  /\bguarantee(d|s)?\b/gi,
  /\bassured\b/gi,
  /\bno risk\b/gi,
  /\bsafe(st|r)?\b/gi,
  /\bsecure returns\b/gi,
];

function scrub(text: string): string {
  let out = String(text ?? "");
  out = out
    .replace(/\brisk-?free\b/gi, "lower-volatility")
    .replace(/\bguaranteed\b/gi, "expected")
    .replace(/\bguarantees\b/gi, "aims for")
    .replace(/\bguarantee\b/gi, "aim for")
    .replace(/\bassured\b/gi, "targeted")
    .replace(/\bno risk\b/gi, "lower risk")
    .replace(/\bsecure returns\b/gi, "potential returns")
    .replace(/\bsafest\b/gi, "least volatile")
    .replace(/\bsafer\b/gi, "less volatile")
    .replace(/\bsafe\b/gi, "lower-volatility");
  return out;
}

function scrubDeep<T>(value: T): T {
  if (typeof value === "string") return scrub(value) as unknown as T;
  if (Array.isArray(value)) return value.map(scrubDeep) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = scrubDeep(v);
    return out as unknown as T;
  }
  return value;
}

interface AllocationRow {
  assetType: string;
  name: string;
  percentage: number;
  rationale: string;
}

function normaliseAllocation(raw: unknown, riskTolerance: string, region: Region): AllocationRow[] {
  let rows: AllocationRow[] = [];

  if (Array.isArray(raw)) {
    rows = raw
      .map((r: any) => ({
        assetType: String(r?.assetType ?? r?.type ?? "Equities/ETF").slice(0, 60),
        name: String(r?.name ?? r?.assetType ?? "Diversified holding").slice(0, 120),
        percentage: Number(r?.percentage ?? r?.weight ?? 0),
        rationale: String(r?.rationale ?? "").slice(0, 300),
      }))
      .filter((r) => Number.isFinite(r.percentage) && r.percentage > 0);
  } else if (raw && typeof raw === "object") {
    // Legacy { stocks, bonds, realEstate, cash } shape.
    const legacy = raw as Record<string, unknown>;
    const map: Array<[string, string, string]> = [
      ["stocks", "Equities/ETF", "Broad equity index exposure for long-term growth."],
      ["bonds", "Bonds", "Fixed-income exposure to dampen portfolio swings."],
      ["realEstate", "Real Estate", "Property exposure for diversification and income."],
      ["cash", "High-Yield Savings", "Liquidity buffer held in interest-bearing cash."],
    ];
    rows = map
      .map(([key, assetType, rationale]) => ({
        assetType,
        name: assetType,
        percentage: Number(legacy[key] ?? 0),
        rationale,
      }))
      .filter((r) => Number.isFinite(r.percentage) && r.percentage > 0);
  }

  if (!rows.length) rows = fallbackAllocation(riskTolerance, region);

  // Normalise to 100.
  const total = rows.reduce((s, r) => s + r.percentage, 0);
  if (total > 0 && Math.abs(total - 100) > 0.5) {
    rows = rows.map((r) => ({ ...r, percentage: (r.percentage / total) * 100 }));
  }
  rows = rows.map((r) => ({ ...r, percentage: Math.round(r.percentage) }));

  // Fix rounding drift on the largest row.
  const rounded = rows.reduce((s, r) => s + r.percentage, 0);
  if (rounded !== 100 && rows.length) {
    const idx = rows.reduce((best, r, i) => (r.percentage > rows[best].percentage ? i : best), 0);
    rows[idx] = { ...rows[idx], percentage: rows[idx].percentage + (100 - rounded) };
  }

  return rows;
}

function fallbackAllocation(riskTolerance: string, region: Region): AllocationRow[] {
  const equity = riskTolerance === "High" ? 70 : riskTolerance === "Moderate" ? 55 : 35;
  const bonds = riskTolerance === "High" ? 10 : riskTolerance === "Moderate" ? 25 : 40;
  const cash = riskTolerance === "High" ? 10 : riskTolerance === "Moderate" ? 10 : 20;
  const commodities = 100 - equity - bonds - cash;

  const equityName =
    region === "Nigeria"
      ? "Global index ETFs plus your vetted Nigerian sleeve"
      : region === "United States"
      ? "Broad US market and S&P 500 index ETFs"
      : "Broad global index ETFs";

  return [
    {
      assetType: "Equities/ETF",
      name: equityName,
      percentage: equity,
      rationale: "Core growth engine, spread across many companies rather than single bets.",
    },
    {
      assetType: "Bonds",
      name: "Short to intermediate government and quality corporate bonds",
      percentage: bonds,
      rationale: "Fixed-income exposure to reduce how sharply the portfolio moves.",
    },
    {
      assetType: "High-Yield Savings",
      name: region === "Nigeria" ? "Naira money-market or high-yield savings" : "High-yield savings or money market",
      percentage: cash,
      rationale: "Liquidity for near-term needs and for buying during market dips.",
    },
    {
      assetType: "Commodities",
      name: "Gold or broad commodity exposure",
      percentage: commodities > 0 ? commodities : 5,
      rationale: "Small hedge against inflation and currency weakness.",
    },
  ].filter((r) => r.percentage > 0);
}

function regionGuidance(region: Region, ngHoldings: any[]): string {
  switch (region) {
    case "Nigeria":
      return `The investor is in Nigeria. Frame amounts and examples in Naira (₦) where relevant, and acknowledge naira depreciation and local inflation as planning considerations.
Recommend ONLY these implementation brokerages: Bamboo and Trove.
The Nigerian local holdings are FIXED and already chosen by PortfoliX's vetted whitelist. Do NOT invent, add, substitute or suggest any other NGX ticker. You may only write explanatory copy about the fixed list below.
Fixed Nigerian holdings: ${
        ngHoldings.length
          ? ngHoldings
              .map((h) => `${h.ticker} (${h.name}, ${h.sector}, ${h.percentage}% of portfolio)`)
              .join("; ")
          : "none supplied"
      }
In the allocation array, describe the Nigerian portion at the asset-class level (e.g. "Nigerian equities sleeve") — never as individual ticker rows.`;
    case "United States":
      return `The investor is in the United States. Recommend Fidelity or Vanguard as implementation brokerages and use broad-market / S&P 500 index fund framing.`;
    case "Asia-Pacific":
      return `The investor is in Asia-Pacific. Recommend Tiger Brokers as the implementation brokerage. Use broad global or regional index ETF framing.`;
    default:
      return `The investor is in ${region}. Do NOT name any specific brokerage, platform or app — PortfoliX has not vetted one for this region. Give generic global diversification guidance built around the concept of a broad global index fund, a bond allocation and a cash buffer, and tell the user to use a regulated local brokerage of their choosing.`;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;

    const body = await req.json();
    const { investmentAmount, goal, timeHorizon, riskTolerance, region, ngHoldings } = body ?? {};

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const amount = Number(investmentAmount);
    if (!Number.isFinite(amount) || amount <= 0 || amount > 100000000000) {
      return new Response(
        JSON.stringify({ error: "Invalid investment amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validGoals = ["Retirement", "Wealth accumulation", "Income", "Speculation"];
    const validHorizons = ["1-3yrs", "3-7yrs", "7+yrs"];
    const validRisks = ["Low", "Moderate", "High"];

    if (
      !validGoals.includes(goal) ||
      !validHorizons.includes(timeHorizon) ||
      !validRisks.includes(riskTolerance) ||
      !REGIONS.includes(region)
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid input parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const typedRegion = region as Region;
    const holdings = Array.isArray(ngHoldings) && typedRegion === "Nigeria"
      ? ngHoldings.slice(0, 20).map((h: any) => ({
          ticker: String(h?.ticker ?? "").slice(0, 12),
          name: String(h?.name ?? "").slice(0, 80),
          sector: String(h?.sector ?? "").slice(0, 40),
          percentage: Number(h?.percentage ?? 0),
        }))
      : [];

    const currency = typedRegion === "Nigeria" ? "₦" : "$";

    const systemPrompt = `You are a portfolio research assistant for PortfoliX, an educational portfolio-modeling platform.
You are NOT giving personalized financial advice; you produce educational model allocations.
Hard copy rules: NEVER use the words "safe", "guaranteed", "risk-free", "assured", or any wording implying assured or protected returns. Always speak in terms of ranges, probabilities and risk.
Only mention brokerages explicitly permitted in the user prompt. If none are permitted, name none.
Respond with raw JSON only — no markdown fences, no commentary.`;

    const userPrompt = `Investor profile:
- Region: ${typedRegion}
- Investment amount: ${currency}${amount.toLocaleString("en-US")}
- Primary goal: ${goal}
- Time horizon: ${timeHorizon}
- Risk tolerance: ${riskTolerance}

Region rules:
${regionGuidance(typedRegion, holdings)}

Produce JSON with exactly this structure:
{
  "allocation": [
    { "assetType": "Equities/ETF" | "Bonds" | "High-Yield Savings" | "Commodities" | "Real Estate",
      "name": "short specific description of what to hold",
      "percentage": number,
      "rationale": "one short sentence" }
  ],
  "actionPlan": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
  "marketInsights": "2-3 sentences of current-conditions context relevant to this region and profile"
}

Rules for the allocation array: 3 to 5 entries, percentages are whole numbers summing to exactly 100, each rationale is one sentence.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Lovable-API-Key": LOVABLE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests right now. Please try again in a minute." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits are exhausted. Please top up to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("AI gateway request failed");
    }

    const data = await response.json();
    const aiResponse = data?.choices?.[0]?.message?.content ?? "";

    let parsed: any = null;
    try {
      const jsonMatch =
        aiResponse.match(/```json\n([\s\S]*?)\n```/) || aiResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : aiResponse;
      parsed = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
    }

    const allocation = normaliseAllocation(parsed?.allocation, riskTolerance, typedRegion);

    let actionPlan: string[] = Array.isArray(parsed?.actionPlan)
      ? parsed.actionPlan.map((s: unknown) => String(s)).filter(Boolean).slice(0, 5)
      : [];
    if (!actionPlan.length) {
      const brokers = VETTED_BROKERS[typedRegion];
      actionPlan = [
        brokers?.length
          ? `Open an account with ${brokers.join(" or ")} and complete verification.`
          : "Open an account with a regulated brokerage available in your country.",
        "Fund the account and buy each allocation slice in the percentages shown above.",
        "Review the mix every quarter and top it back up toward the target weights.",
      ];
    }

    const marketInsights =
      typeof parsed?.marketInsights === "string" && parsed.marketInsights.trim()
        ? parsed.marketInsights
        : "This mix balances long-term growth exposure with holdings that tend to move differently, so the portfolio's value fluctuates less than an all-equity position. Market conditions change, and all outcomes remain uncertain.";

    const result = scrubDeep({
      region: typedRegion,
      allocation,
      actionPlan,
      marketInsights,
      brokerages: VETTED_BROKERS[typedRegion] ?? [],
      comingSoonNote: VETTED_BROKERS[typedRegion]
        ? null
        : `Region-specific brokerage guidance for ${typedRegion} is coming soon.`,
    });

    console.log("Market analysis complete", { userId, region: typedRegion, rows: allocation.length });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in market-analysis function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again later." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
