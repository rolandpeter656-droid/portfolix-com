# Region-aware Market Analysis

Rebuild the Market Analysis tool so it adapts to where the user invests from, and fix the empty "Recommended Allocation" box by rendering real allocation cards.

## 1. New question in the form

Add a required first question: **"Where are you investing from?"**
Options: Nigeria, United States, United Kingdom, Canada, India, Asia-Pacific, Other / Global.

The "Investment Amount" label switches to Naira (₦) when Nigeria is selected, dollars otherwise.

## 2. Region behaviour

| Region | Holdings | Brokerages |
| --- | --- | --- |
| Nigeria | Fixed, vetted Nigerian list (the same source that powers the main portfolio builder) plus a global core sleeve | Bamboo, Trove |
| United States | As today (broad-market and S&P 500 style funds) | Fidelity, Vanguard |
| Asia-Pacific | Broad global / regional index framing | Tiger Brokers |
| UK, Canada, India, Other / Global | Generic global diversification guidance only | None named, plus note: "Region-specific brokerage guidance for [region] is coming soon." |

For Nigeria the AI never picks tickers: the app fetches the vetted holdings first and the AI only writes the explanation copy around them — identical rule to the main builder.

## 3. Allocation cards (fixes the empty box)

The analysis now returns structured allocation rows instead of prose. Each row renders as its own card with a distinct icon:

- Equities / ETF — chart-line icon
- Bonds — shield icon
- High-Yield Savings / Cash — bank icon
- Commodities — coin icon

Each card shows icon, name, percentage as a small teal progress bar, and a one-line rationale. Teal (#14B8A6) / green (#10B981) palette, same corner radius and spacing as the rest of the app.

The cards can never be empty: if the AI response is unusable, a region-appropriate fallback allocation is shown.

For Nigeria, an extra "Nigeria (Local)" list shows the vetted holdings with Bamboo and Trove links below.

## 4. Copy rules

Generated text is forbidden from using "safe", "guaranteed", "risk-free" or any wording implying assured returns — enforced both in the AI instructions and by a post-generation filter. The existing investment disclaimer component is shown under the results.

## Technical notes

- `src/components/MarketAnalysisTool.tsx`: add `region` state + select; call `buildNgSleeve(riskTolerance)` from `src/lib/ngSleeve.ts` client-side when region is Nigeria and pass the resulting holdings to the edge function as read-only context; render new `AllocationCards` grid.
- New `src/components/market/AllocationCards.tsx` with the per-asset-type icon map (lucide `LineChart`, `ShieldCheck`, `Landmark`, `Coins`).
- `supabase/functions/market-analysis/index.ts`: accept and validate `region`; region-specific system/user prompts and brokerage allowlist; return `allocation: AllocationRow[]` (assetType, name, percentage, rationale) alongside `actionPlan`, `marketInsights`, `brokerages`, `comingSoonNote`; keep a legacy-shaped fallback normalised into the new array; banned-word scrub on output; percentages normalised to 100.
- Pie chart continues to render, fed from the new array.
- Untouched: `/build-portfolio` flow and its generation logic, `buildNgSleeve` itself, pricing/Paystack, auth, `PortfolioHealthCheck.tsx`.

## One correction to your spec

The whitelist function you named is correct — `buildNgSleeve(onboardingRisk)` in `src/lib/ngSleeve.ts`. One detail: it runs in the browser, not in the edge function, so the flow is fetch-holdings-first, then send them to the AI as fixed context.

## Note on access

The Market Analysis edge function currently requires a signed-in user, but the tool is opened from the public homepage, so signed-out visitors get an error. I'll surface a clear "Sign in to run analysis" prompt rather than a failure toast. Tell me if you'd rather open it to everyone.
