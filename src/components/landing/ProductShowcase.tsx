import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowRight, TrendingUp, Activity, Brain } from "lucide-react";
import { MarketAnalysisTool } from "@/components/MarketAnalysisTool";

export const ProductShowcase = () => {
  const [isMarketAnalysisOpen, setIsMarketAnalysisOpen] = useState(false);

  return (
    <>
      <MarketAnalysisTool
        isOpen={isMarketAnalysisOpen}
        onClose={() => setIsMarketAnalysisOpen(false)}
      />
      <section id="product" className="py-20 sm:py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Left: Description */}
            <div>
              <Badge className="mb-5 bg-primary/10 text-primary border-primary/20 text-sm font-medium">
                AI-Powered Insights
              </Badge>
              <h2 className="text-foreground mb-5">
                Deep Market{" "}
                <span className="text-gradient">Insights</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our AI analyzes thousands of market signals to give you clear, actionable insights about current conditions and how they affect your investments.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { icon: TrendingUp, text: "Real-time market sentiment analysis" },
                  { icon: Activity, text: "Volatility monitoring & alerts" },
                  { icon: Brain, text: "AI-generated portfolio recommendations" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-[15px]">{item.text}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                onClick={() => setIsMarketAnalysisOpen(true)}
                className="gap-2 bg-primary hover:bg-primary-glow text-primary-foreground font-semibold shadow-lg shadow-primary/20"
              >
                Try Market Analysis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Right: Laptop mockup with market data */}
            <div className="relative">
              <div className="device-frame">
                <div className="device-frame-bar">
                  <div className="device-frame-dot bg-red-500/60" />
                  <div className="device-frame-dot bg-yellow-500/60" />
                  <div className="device-frame-dot bg-green-500/60" />
                  <div className="flex-1 mx-4">
                    <div className="h-5 rounded-md bg-white/5 flex items-center justify-center">
                      <span className="text-[10px] text-muted-foreground/60">Market Analysis</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4" style={{ background: 'hsl(0 0% 6%)' }}>
                  {/* Market header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">Market Sentiment</div>
                      <div className="text-lg font-bold text-success">Bullish</div>
                    </div>
                    <div className="flex items-center gap-1 text-success text-sm font-medium">
                      <TrendingUp className="h-4 w-4" />
                      S&P 500 +1.2%
                    </div>
                  </div>
                  {/* Sector performance */}
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground font-medium mb-2">Sector Performance</div>
                    {[
                      { name: "Technology", change: "+2.4%", positive: true },
                      { name: "Healthcare", change: "+1.1%", positive: true },
                      { name: "Financials", change: "+0.8%", positive: true },
                      { name: "Energy", change: "-0.3%", positive: false },
                    ].map((sector) => (
                      <div key={sector.name} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                        <span className="text-xs text-foreground">{sector.name}</span>
                        <span className={`text-xs font-semibold ${sector.positive ? 'text-success' : 'text-destructive'}`}>
                          {sector.change}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* AI insight */}
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-start gap-2">
                      <Brain className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        <span className="text-primary font-medium">AI Analysis:</span> Tech sector showing strong momentum. Consider maintaining or increasing tech allocation for growth-oriented portfolios.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-8 -z-10 rounded-3xl blur-3xl" style={{ background: 'radial-gradient(circle, hsl(168 76% 42% / 0.04), transparent 70%)' }} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
