import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BarChart3, Loader2, ExternalLink, Info, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PortfolioPieChart } from "@/components/PortfolioPieChart";
import { AllocationCards } from "@/components/market/AllocationCards";
import { InvestmentDisclaimer } from "@/components/compliance";
import { buildNgSleeve, type NgHolding } from "@/lib/ngSleeve";
import {
  MARKET_REGIONS,
  REGION_BROKERS,
  comingSoonNote,
  regionCurrency,
  type MarketRegion,
  type AllocationRow,
} from "@/lib/marketRegions";

interface AnalysisResult {
  region: MarketRegion;
  allocation: AllocationRow[];
  actionPlan: string[];
  marketInsights: string;
  brokerages: string[];
  comingSoonNote: string | null;
}

interface MarketAnalysisToolProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHART_COLORS = ["#14B8A6", "#10B981", "#38BDF8", "#F59E0B", "#8B5CF6"];

export const MarketAnalysisTool = ({ isOpen, onClose }: MarketAnalysisToolProps) => {
  const [region, setRegion] = useState<MarketRegion | "">("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [goal, setGoal] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");
  const [riskTolerance, setRiskTolerance] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [ngHoldings, setNgHoldings] = useState<NgHolding[]>([]);

  const { user } = useAuth();
  const { toast } = useToast();

  const currency = region ? regionCurrency(region as MarketRegion) : { symbol: "$", code: "USD" };

  const handleAnalyze = async () => {
    if (!region || !investmentAmount || !goal || !timeHorizon || !riskTolerance) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields, including where you're investing from.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Sign in to run analysis",
        description: "Market Analysis is available once you're signed in to your PortfoliX account.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setNgHoldings([]);

    try {
      // Nigeria: holdings come from the vetted whitelist, never from the AI.
      let holdings: NgHolding[] = [];
      if (region === "Nigeria") {
        const riskMap: Record<string, string> = { Low: "low", Moderate: "medium", High: "high" };
        const sleeve = await buildNgSleeve(riskMap[riskTolerance]);
        holdings = sleeve?.holdings ?? [];
        setNgHoldings(holdings);
      }

      const { data, error } = await supabase.functions.invoke("market-analysis", {
        body: {
          region,
          investmentAmount: parseFloat(investmentAmount),
          goal,
          timeHorizon,
          riskTolerance,
          ngHoldings: holdings.map((h) => ({
            ticker: h.ticker,
            name: h.name,
            sector: h.sector,
            percentage: h.percentage,
          })),
        },
      });

      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);

      setResult(data as AnalysisResult);
      toast({
        title: "Analysis Complete",
        description: `Your ${region} market analysis is ready.`,
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error?.message || "Unable to generate analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const allocation = result?.allocation ?? [];
  const chartData = allocation.map((row, i) => ({
    symbol: row.assetType.slice(0, 3).toUpperCase(),
    name: row.assetType,
    allocation: row.percentage,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const brokerLinks = result ? REGION_BROKERS[result.region] ?? [] : [];
  const note = result ? result.comingSoonNote ?? comingSoonNote(result.region) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl sm:text-2xl md:text-3xl">Market Analysis</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Region-aware market insights powered by AI
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          {/* Input Form */}
          <Card className="bg-gradient-card border-border h-fit">
            <CardHeader>
              <CardTitle>Your Investment Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="region">Where are you investing from?</Label>
                <Select
                  value={region}
                  onValueChange={(v) => setRegion(v as MarketRegion)}
                  disabled={isAnalyzing}
                >
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARKET_REGIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Investment Amount ({currency.symbol})</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder={region === "Nigeria" ? "5000000" : "50000"}
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  disabled={isAnalyzing}
                />
              </div>

              <div>
                <Label htmlFor="goal">Primary Goal</Label>
                <Select value={goal} onValueChange={setGoal} disabled={isAnalyzing}>
                  <SelectTrigger id="goal">
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Retirement">Retirement</SelectItem>
                    <SelectItem value="Wealth accumulation">Wealth Accumulation</SelectItem>
                    <SelectItem value="Income">Income Generation</SelectItem>
                    <SelectItem value="Speculation">Speculation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="horizon">Time Horizon</Label>
                <Select value={timeHorizon} onValueChange={setTimeHorizon} disabled={isAnalyzing}>
                  <SelectTrigger id="horizon">
                    <SelectValue placeholder="Select time horizon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3yrs">1-3 years</SelectItem>
                    <SelectItem value="3-7yrs">3-7 years</SelectItem>
                    <SelectItem value="7+yrs">7+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="risk">Risk Tolerance</Label>
                <Select value={riskTolerance} onValueChange={setRiskTolerance} disabled={isAnalyzing}>
                  <SelectTrigger id="risk">
                    <SelectValue placeholder="Select risk tolerance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-primary hover:bg-primary-glow"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Portfolio"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                <Card className="bg-gradient-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      Recommended Allocation
                      <span className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {result.region}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AllocationCards rows={allocation} />
                    {chartData.length > 0 && (
                      <PortfolioPieChart data={chartData} className="h-[260px]" />
                    )}
                  </CardContent>
                </Card>

                {result.region === "Nigeria" && ngHoldings.length > 0 && (
                  <Card className="bg-gradient-card border-border">
                    <CardHeader className="pb-3">
                      <CardTitle>Nigeria (Local) Holdings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs text-muted-foreground">
                        Sourced from PortfoliX's vetted NGX list — not generated by AI.
                      </p>
                      <div className="space-y-2">
                        {ngHoldings.map((h) => (
                          <div
                            key={h.ticker}
                            className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card/60 p-3"
                          >
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-foreground">
                                {h.ticker}{" "}
                                <span className="text-xs font-normal text-muted-foreground">{h.name}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">{h.rationale}</p>
                            </div>
                            <span className="text-sm font-bold text-primary flex-shrink-0">
                              {h.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-gradient-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle>3-Step Action Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ol className="space-y-3">
                      {result.actionPlan.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                            {index + 1}
                          </span>
                          <span className="text-sm text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>

                    {brokerLinks.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {brokerLinks.map((b) => (
                          <a
                            key={b.name}
                            href={b.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                          >
                            {b.name}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    )}

                    {note && (
                      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3">
                        <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">{note}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle>Market Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{result.marketInsights}</p>
                  </CardContent>
                </Card>

                <InvestmentDisclaimer variant="compact" />
              </>
            ) : (
              <Card className="bg-gradient-card border-border h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    Tell us where you're investing from and fill in your profile, then click "Analyze
                    Portfolio" to see region-specific recommendations.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
