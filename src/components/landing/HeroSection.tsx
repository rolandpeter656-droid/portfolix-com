import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, TrendingUp, Shield, Zap } from "lucide-react";
import { DemoModal } from "@/components/DemoModal";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-20 sm:pt-24 pb-16 sm:pb-20" style={{ background: 'linear-gradient(180deg, hsl(0 0% 4%), hsl(0 0% 6%))' }}>
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, hsl(168 76% 42% / 0.06), transparent 70%)' }} />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Left: Text content */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6 animate-fade-in-up">
              <Zap className="h-3.5 w-3.5" />
              AI-Powered Portfolio Builder
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-[1.08] animate-fade-in-up-delay-1">
              Build Portfolios{" "}
              <span className="text-gradient">in Minutes</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground mb-4 leading-relaxed animate-fade-in-up-delay-2">
              Get a personalized investment portfolio in 3 minutes.{" "}
              <br className="hidden sm:block" />
              No finance degree required.
            </p>

            {/* Social proof */}
            <p className="text-sm sm:text-base text-primary/70 mb-8 font-medium animate-fade-in-up-delay-3">
              Join 2,000+ investors who stopped overthinking and started building wealth.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-fade-in-up-delay-3">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-primary hover:bg-primary-glow text-primary-foreground px-8 py-4 text-base sm:text-lg font-semibold hover-scale shadow-lg shadow-primary/20"
              >
                Build Your Portfolio (Free)
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsDemoOpen(true)}
                className="border-border hover:border-primary/40 text-foreground px-8 py-4 text-base sm:text-lg"
              >
                <Play className="mr-2 h-4 w-4" />
                See How It Works
              </Button>
            </div>
          </div>

          {/* Right: Device mockup */}
          <div className="relative animate-fade-in-up-delay-2 hidden lg:block">
            <div className="device-frame">
              {/* Browser bar */}
              <div className="device-frame-bar">
                <div className="device-frame-dot bg-red-500/60" />
                <div className="device-frame-dot bg-yellow-500/60" />
                <div className="device-frame-dot bg-green-500/60" />
                <div className="flex-1 mx-4">
                  <div className="h-5 rounded-md bg-white/5 flex items-center justify-center">
                    <span className="text-[10px] text-muted-foreground/60">portfolix.com</span>
                  </div>
                </div>
              </div>
              {/* Screen content - Portfolio mockup */}
              <div className="p-6 space-y-4" style={{ background: 'hsl(0 0% 6%)' }}>
                {/* Top bar */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Your Portfolio</div>
                    <div className="text-2xl font-bold text-foreground">$25,400</div>
                    <div className="text-xs text-success font-medium flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> +12.4% this year
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Allocation bars */}
                <div className="space-y-3 pt-2">
                  {[
                    { name: "US Stocks", pct: 40, color: "hsl(168 76% 42%)" },
                    { name: "Int'l Stocks", pct: 25, color: "hsl(160 84% 39%)" },
                    { name: "Bonds", pct: 20, color: "hsl(220 70% 55%)" },
                    { name: "Real Estate", pct: 10, color: "hsl(270 60% 55%)" },
                    { name: "Commodities", pct: 5, color: "hsl(43 96% 56%)" },
                  ].map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground">{item.name}</span>
                        <span className="text-xs font-semibold text-foreground">{item.pct}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${item.pct}%`, background: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom insight */}
                <div className="pt-2 border-t border-white/5">
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <Zap className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      <span className="text-primary font-medium">AI Insight:</span> Your portfolio is well-diversified. Consider increasing international exposure for better risk-adjusted returns.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating accent glow behind mockup */}
            <div className="absolute -inset-8 -z-10 rounded-3xl blur-3xl" style={{ background: 'radial-gradient(circle, hsl(168 76% 42% / 0.06), transparent 70%)' }} />
          </div>
        </div>

        {/* Trust indicators - below on mobile */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto lg:max-w-xl mt-16 lg:mt-20 animate-fade-in-up-delay-3">
          {[
            { value: "500+", label: "Portfolios Created", color: "text-primary" },
            { value: "2,000+", label: "Active Investors", color: "text-success" },
            { value: "3 min", label: "To Portfolio", color: "text-warning" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </section>
  );
};
