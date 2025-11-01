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
  {
    id: "corporate-treasury",
    name: "Corporate Treasury Yield Portfolio",
    allocation: {
      bonds: 60,
      cash: 25,
      equities: 10,
      commodities: 5,
    },
    riskProfile: "Low-Moderate",
    returnProfile: "4-6% annually",
    aiReasoning:
      "Optimized for capital preservation and liquidity while generating steady returns through investment-grade bonds and short-term treasuries. Ideal for corporations managing excess cash reserves.",
    inspiredBy: "Treasury optimization frameworks from Ray Dalio's Principles",
  },
  {
    id: "pension-fund",
    name: "Inflation-Adjusted Pension Fund Mix",
    allocation: {
      equities: 45,
      bonds: 30,
      commodities: 15,
      etfs: 10,
    },
    riskProfile: "Moderate",
    returnProfile: "6-8% annually",
    aiReasoning:
      "Designed to protect against inflation while meeting long-term liability obligations. Balances growth equities with inflation-protected securities and real assets for pension fund stability.",
    inspiredBy: "Endowment model principles from The Intelligent Investor",
  },
  {
    id: "cash-management",
    name: "Short-Term Cash Management Fund",
    allocation: {
      cash: 50,
      bonds: 40,
      etfs: 10,
    },
    riskProfile: "Very Low",
    returnProfile: "3-4% annually",
    aiReasoning:
      "Maximum liquidity focus with minimal risk exposure. Perfect for operational cash management, near-term obligations, and treasury departments requiring immediate access to capital.",
    inspiredBy: "Liquidity management strategies from Corporate Finance textbooks",
  },
  {
    id: "equity-rotation",
    name: "Strategic Equity Rotation Portfolio",
    allocation: {
      equities: 70,
      etfs: 20,
      cash: 10,
    },
    riskProfile: "Moderate-High",
    returnProfile: "8-12% annually",
    aiReasoning:
      "Active allocation strategy rotating between growth and value equities based on market cycles. Leverages momentum and fundamental analysis to capture institutional alpha.",
    inspiredBy: "Tactical asset allocation from Benjamin Graham's Security Analysis",
  },
  {
    id: "bitcoin-institutional",
    name: "Institutional Bitcoin Allocation Strategy",
    allocation: {
      crypto: 5,
      equities: 50,
      bonds: 30,
      cash: 15,
    },
    riskProfile: "Moderate",
    returnProfile: "7-15% annually",
    aiReasoning:
      "Conservative exposure to digital assets within a diversified framework. Provides upside participation in crypto markets while maintaining institutional risk controls and capital preservation.",
    inspiredBy: "Alternative asset allocation frameworks from Modern Portfolio Theory",
  },
  {
    id: "esg-treasury",
    name: "ESG Sustainable Treasury Blend",
    allocation: {
      bonds: 50,
      equities: 30,
      etfs: 15,
      cash: 5,
    },
    riskProfile: "Low-Moderate",
    returnProfile: "5-7% annually",
    aiReasoning:
      "Integrates environmental, social, and governance criteria into fixed-income and equity allocations. Meets stakeholder expectations while delivering competitive risk-adjusted returns.",
    inspiredBy: "Sustainable investing principles from ESG integration research",
  },
];

export default function Institutions() {
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Institutional AI Portfolios
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-sans-bold tracking-tight">
              AI-Powered Portfolios for
              <span className="text-gradient block mt-2">
                Modern Institutions
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Institutional-grade portfolio frameworks derived from proven
              investment literature and enhanced through AI intelligence. Built
              for mid-sized firms, asset managers, and corporations.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-success" />
              <span>
                6 Core Strategies • AI-Enhanced Allocations • Educational
                Framework
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Strategies Grid */}
      {!showBuilder && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {institutionalStrategies.map((strategy) => (
                <InstitutionalStrategyCard
                  key={strategy.id}
                  strategy={strategy}
                />
              ))}
            </div>

            {/* Custom Builder CTA */}
            <div className="mt-16 text-center">
              <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-card to-secondary border border-border hover-glow">
                <h3 className="text-2xl font-bold mb-4">
                  Need a Custom Institutional Portfolio?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Generate a tailored portfolio based on your specific
                  investment parameters, liquidity needs, and risk tolerance.
                </p>
                <button
                  onClick={() => setShowBuilder(true)}
                  className="px-6 py-3 bg-primary hover:bg-primary-glow text-primary-foreground rounded-lg font-medium transition-all hover-scale"
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
