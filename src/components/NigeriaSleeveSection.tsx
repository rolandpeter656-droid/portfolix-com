import { useEffect, useState } from "react";
import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, ExternalLink, Globe2, MapPin } from "lucide-react";
import { buildNgSleeve, NgSleeveResult } from "@/lib/ngSleeve";
import { analytics } from "@/lib/analytics/index";

interface Props {
  onboardingRisk?: string;
  /** Existing global holdings so we can render them under a "Global Core" label. */
  globalHoldings: Array<{
    symbol: string;
    name: string;
    allocation: number;
    assetClass: string;
    rationale: string;
    color: string;
  }>;
}

// NGX-capable brokers only. Do NOT list US-only brokers here.
const NGX_BROKERS: Array<{ name: string; urlFor: (ticker: string) => string }> = [
  { name: "Bamboo", urlFor: () => "https://bamboo.link/portfolix" },
  { name: "Trove", urlFor: () => "https://www.troveapp.co/" },
];

const BRAND_TEAL = "#17A589";
const BRAND_GREEN = "#22C55E";

export const NigeriaSleeveSection = ({ onboardingRisk, globalHoldings }: Props) => {
  const [sleeve, setSleeve] = useState<NgSleeveResult | null>(null);
  const [loading, setLoading] = useState(true);
  // Dedupe rapid duplicate fires (double-click, click + auxclick on same activation).
  const lastFiredRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const result = await buildNgSleeve(onboardingRisk);
      if (!cancelled) {
        setSleeve(result);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [onboardingRisk]);

  const handleBrokerClick = (
    broker: string,
    ticker: string,
    e?: React.MouseEvent<HTMLAnchorElement>
  ) => {
    // Only count primary-button or middle-click activations (ignore right-click context menu).
    if (e && e.type === "auxclick" && e.button !== 1) return;
    const key = `${broker}::${ticker}`;
    const now = Date.now();
    const last = lastFiredRef.current.get(key) ?? 0;
    if (now - last < 800) return; // dedupe within 800ms
    lastFiredRef.current.set(key, now);
    analytics.ngBrokerageLinkClicked(broker, ticker);
  };

  return (
    <div className="space-y-6">
      {/* ============== GLOBAL CORE ============== */}
      <Card className="shadow-card border-l-4" style={{ borderLeftColor: BRAND_TEAL }}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${BRAND_TEAL}20`, color: BRAND_TEAL }}
            >
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle style={{ color: BRAND_TEAL }}>Global Core</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Global &amp; US ETFs held through international brokerages (Fidelity, Vanguard,
                Schwab, Interactive Brokers).
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticker</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Asset Class</TableHead>
                <TableHead className="text-right">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {globalHoldings.map((h) => (
                <TableRow key={h.symbol}>
                  <TableCell className="font-mono font-semibold">{h.symbol}</TableCell>
                  <TableCell>{h.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" style={{ borderColor: h.color, color: h.color }}>
                      {h.assetClass}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {h.allocation.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ============== NIGERIA (LOCAL) ============== */}
      <Card className="shadow-card border-l-4" style={{ borderLeftColor: BRAND_GREEN }}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${BRAND_GREEN}20`, color: BRAND_GREEN }}
            >
              <MapPin className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <CardTitle style={{ color: BRAND_GREEN }}>Nigeria (Local)</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                NGX-listed exposure via Nigerian brokerages. Local sleeve is capped and
                diversified to manage concentration risk.
              </p>
            </div>
            {sleeve && (
              <Badge variant="secondary" className="whitespace-nowrap">
                {sleeve.local_sleeve_pct}% of portfolio
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Risk disclosure panel */}
          <div
            className="rounded-lg border p-4 flex gap-3"
            style={{
              backgroundColor: "rgba(234, 179, 8, 0.08)",
              borderColor: "rgba(234, 179, 8, 0.35)",
            }}
          >
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 text-yellow-500" />
            <div className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Nigeria-specific risk.</strong> Nigerian
              equities can be <strong>volatile and thinly traded</strong>. Both returns and the
              naira can move sharply against you. This sleeve is deliberately{" "}
              <strong>capped and diversified</strong> across sectors for that reason — it is a
              satellite to your global core, not a replacement.
            </div>
          </div>

          {loading && (
            <div className="text-sm text-muted-foreground">Loading local sleeve…</div>
          )}

          {!loading && sleeve && sleeve.holdings.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No local holdings configured for a <strong>{sleeve.risk_profile}</strong> profile.
            </div>
          )}

          {!loading && sleeve && sleeve.holdings.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticker</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Bucket</TableHead>
                    <TableHead className="text-right">%</TableHead>
                    <TableHead>Why we picked it</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sleeve.holdings.map((h) => (
                    <TableRow key={h.ticker}>
                      <TableCell className="font-mono font-semibold">{h.ticker}</TableCell>
                      <TableCell>{h.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: h.bucket === "core" ? BRAND_TEAL : BRAND_GREEN,
                            color: h.bucket === "core" ? BRAND_TEAL : BRAND_GREEN,
                          }}
                        >
                          {h.bucket === "core" ? "ETF · core" : `${h.sector} · satellite`}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {h.percentage.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs">
                        {h.rationale}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* NGX-capable brokers */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  Buy NGX holdings via:
                </p>
                <div className="flex flex-wrap gap-2">
                  {sleeve.holdings.map((h) =>
                    NGX_BROKERS.map((b) => (
                      <a
                        key={`${b.name}-${h.ticker}`}
                        href={b.urlFor(h.ticker)}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-analytics="ng_brokerage_link"
                        data-broker={b.name}
                        data-ticker={h.ticker}
                        onClick={(e) => handleBrokerClick(b.name, h.ticker, e)}
                        onAuxClick={(e) => handleBrokerClick(b.name, h.ticker, e)}
                        className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-accent"
                        style={{ borderColor: `${BRAND_GREEN}55`, color: BRAND_GREEN }}
                      >
                        {b.name} · {h.ticker}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ))
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Links open Bamboo and Trove — Nigerian brokerages licensed for NGX
                  securities. US-only brokers (Fidelity, Vanguard, Schwab, IBKR) cannot trade
                  these tickers.
                </p>
              </div>
            </>
          )}

          <p className="text-xs italic text-muted-foreground border-t border-border pt-3">
            Illustrative and educational, not financial advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NigeriaSleeveSection;
