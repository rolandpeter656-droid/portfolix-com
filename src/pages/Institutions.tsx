import { useState } from "react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { InstitutionalStrategyCard } from "@/components/institutional/InstitutionalStrategyCard";
import { CustomPortfolioBuilder } from "@/components/institutional/CustomPortfolioBuilder";
import { InstitutionalPricingPlans } from "@/components/institutional/InstitutionalPricingPlans";
import { InstitutionalDisclaimer } from "@/components/institutional/InstitutionalDisclaimer";
import { Building2, TrendingUp } from "lucide-react";

export interface InstitutionalStrategy {
  id: string;
  name: string;
  allocation: {
    etfs?: number;
    bonds?: number;
    equities?: number;
    crypto?: number;
    cash?: number;
    commodities?: number;
  };
  riskProfile: string;
  returnProfile: string;
  aiReasoning: string;
  inspiredBy: string;
}

const institutionalStrategies: InstitutionalStrategy[] = [
  // 1. Corporate Treasury Yield Portfolio
  {
    id: "corporate-treasury-conservative",
    name: "Corporate Treasury Yield — Conservative Cash+",
    allocation: { cash: 30, bonds: 60, commodities: 10 },
    riskProfile: "Very Low",
    returnProfile: "3-5% annually",
    aiReasoning:
      "Maximize yield on operating cash while preserving principal and meeting liquidity needs. Optimal for short-term govt bonds, investment-grade corp bonds, and T-Bills.",
    inspiredBy: "Treasury cash optimization frameworks from corporate finance literature",
  },
  {
    id: "corporate-treasury-income",
    name: "Corporate Treasury Yield — Income Optimizer",
    allocation: { bonds: 60, cash: 10, etfs: 20, commodities: 10 },
    riskProfile: "Low-Medium",
    returnProfile: "4-6% annually",
    aiReasoning:
      "Boost yield while keeping interest rate sensitivity low via floating rate notes and commercial paper alongside investment-grade bonds.",
    inspiredBy: "Corporate treasury best practices from Ray Dalio's Principles",
  },
  
  // 2. Inflation-Adjusted Pension Fund Mix
  {
    id: "pension-cpi-protector",
    name: "Pension Mix — Core CPI Protector",
    allocation: { bonds: 50, equities: 25, commodities: 15, cash: 10 },
    riskProfile: "Low-Medium",
    returnProfile: "5-7% annually",
    aiReasoning:
      "Preserve purchasing power of liabilities while capturing modest growth through inflation-linked bonds, domestic equities, and real assets (REITs).",
    inspiredBy: "Endowment model principles from The Intelligent Investor",
  },
  {
    id: "pension-growth-cpi",
    name: "Pension Mix — Growth with CPI Floor",
    allocation: { equities: 35, bonds: 35, commodities: 20, etfs: 10 },
    riskProfile: "Medium",
    returnProfile: "6-9% annually",
    aiReasoning:
      "Higher long-term growth while maintaining CPI hedge through global equities, real assets, and inflation-linked bonds. Suitable for pension funds with longer horizons.",
    inspiredBy: "Modern portfolio theory and liability-driven investment frameworks",
  },

  // 3. Short-Term Cash Management Fund
  {
    id: "cash-ultra-liquidity",
    name: "Short-Term Cash Management — Ultra-Liquidity",
    allocation: { cash: 45, bonds: 45, etfs: 10 },
    riskProfile: "Minimal",
    returnProfile: "2-4% annually",
    aiReasoning:
      "Ensure immediate liquidity for operational needs while earning yield through T-Bills, commercial paper, and money market funds. Ideal for daily cash sweep operations.",
    inspiredBy: "Liquidity management strategies from corporate finance textbooks",
  },
  {
    id: "cash-yield-sweep",
    name: "Short-Term Cash Management — Yield Sweep",
    allocation: { cash: 30, bonds: 50, etfs: 20 },
    riskProfile: "Very Low",
    returnProfile: "3-5% annually",
    aiReasoning:
      "Slightly higher yield by extending duration with short-term floating notes while maintaining high liquidity. Weekly rebalancing to capture best short-term yields.",
    inspiredBy: "Working capital optimization from financial management best practices",
  },

  // 4. Strategic Equity Rotation Portfolio
  {
    id: "equity-rotation-momentum",
    name: "Strategic Equity Rotation — Momentum Core",
    allocation: { equities: 80, cash: 20 },
    riskProfile: "Medium-High",
    returnProfile: "8-14% annually",
    aiReasoning:
      "Momentum-driven alpha through weekly rotation of top 5 sector ETFs based on relative strength. Buy strength, sell weakness strategy with cash buffer for volatility.",
    inspiredBy: "Tactical asset allocation from Benjamin Graham's Security Analysis",
  },
  {
    id: "equity-rotation-factor",
    name: "Strategic Equity Rotation — Factor Blend",
    allocation: { equities: 70, etfs: 20, cash: 10 },
    riskProfile: "Medium",
    returnProfile: "7-12% annually",
    aiReasoning:
      "Diversified factor exposure combining momentum, value, and quality factors with monthly rebalancing. Risk parity approach to factor allocation.",
    inspiredBy: "Factor investing research and quantitative equity strategies",
  },

  // 5. Institutional Bitcoin Allocation Strategy
  {
    id: "bitcoin-conservative",
    name: "Bitcoin Treasury — Conservative Allocation",
    allocation: { crypto: 5, cash: 70, bonds: 25 },
    riskProfile: "Low-Medium",
    returnProfile: "4-8% annually",
    aiReasoning:
      "Small strategic allocation to BTC for long-term store of value without impacting liquidity. Monthly rebalancing with volatility caps for risk management.",
    inspiredBy: "Alternative asset allocation frameworks from Modern Portfolio Theory",
  },
  {
    id: "bitcoin-strategic",
    name: "Bitcoin Treasury — Strategic Reserve",
    allocation: { crypto: 10, cash: 50, bonds: 30, commodities: 10 },
    riskProfile: "Medium",
    returnProfile: "6-12% annually",
    aiReasoning:
      "Larger BTC reserve for long-term upside with dollar-cost averaging automation and buy-the-dip logic. Quarterly rebalancing to capture crypto market opportunities.",
    inspiredBy: "Digital asset treasury management and corporate crypto adoption strategies",
  },

  // 6. ESG Sustainable Treasury Blend
  {
    id: "esg-capital-preservation",
    name: "ESG Blend — Capital Preservation",
    allocation: { bonds: 60, cash: 20, etfs: 20 },
    riskProfile: "Low",
    returnProfile: "3-6% annually",
    aiReasoning:
      "ESG-eligible instruments with high liquidity including green T-Bills, ESG short-term bonds, and ESG money market funds. Quarterly ESG screening updates.",
    inspiredBy: "Sustainable investing principles from ESG integration research",
  },
  {
    id: "esg-impact-income",
    name: "ESG Blend — Social Impact Income",
    allocation: { bonds: 60, commodities: 20, cash: 20 },
    riskProfile: "Low-Medium",
    returnProfile: "5-8% annually",
    aiReasoning:
      "Yield with sustainability impact through green bonds, ESG corporate bonds, and ESG-screened REITs. Impact metrics tracked for carbon reduction and social KPIs.",
    inspiredBy: "Impact investing frameworks and sustainable finance literature",
  },
];

export default function Institutions() {
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-10 sm:pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20">
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">
                Institutional AI Portfolios
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sans-bold tracking-tight leading-tight">
              AI-Powered Portfolios for
              <span className="text-gradient block mt-2">
                Modern Institutions
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              Institutional-grade portfolio frameworks derived from proven
              investment literature and enhanced through AI intelligence. Built
              for mid-sized firms, asset managers, and corporations.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground px-4">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
              <span className="text-center">
                12 Core Strategies • AI-Enhanced Allocations • Multi-Currency Support
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Strategies Grid */}
      {!showBuilder && (
        <section className="py-10 sm:py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8 sm:mb-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">AI Portfolio Library</h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
                12 institutional-grade strategies spanning treasury management, pension funds, 
                cash operations, equity rotation, digital assets, and ESG compliance.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {institutionalStrategies.map((strategy) => (
                <InstitutionalStrategyCard
                  key={strategy.id}
                  strategy={strategy}
                />
              ))}
            </div>

            {/* Custom Builder CTA */}
            <div className="mt-10 sm:mt-16 text-center px-4">
              <div className="inline-block p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-card to-secondary border border-border hover-glow w-full sm:w-auto max-w-md">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  Need a Custom Institutional Portfolio?
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  Generate a tailored portfolio based on your specific
                  investment parameters, liquidity needs, and risk tolerance.
                </p>
                <button
                  onClick={() => setShowBuilder(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-glow text-primary-foreground rounded-lg font-medium transition-all hover-scale text-sm sm:text-base"
                >
                  Build Custom Portfolio
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Custom Portfolio Builder */}
      {showBuilder && (
        <CustomPortfolioBuilder onClose={() => setShowBuilder(false)} />
      )}

      {/* Institutional Pricing Plans */}
      {!showBuilder && <InstitutionalPricingPlans />}

      {/* Compliance Notice */}
      <section className="py-12 px-4 bg-muted/30 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <InstitutionalDisclaimer variant="full" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
