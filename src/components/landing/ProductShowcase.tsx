import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowRight } from "lucide-react";
import { MarketAnalysisTool } from "@/components/MarketAnalysisTool";

export const ProductShowcase = () => {
  const [isMarketAnalysisOpen, setIsMarketAnalysisOpen] = useState(false);

  return (
    <>
      <MarketAnalysisTool 
        isOpen={isMarketAnalysisOpen} 
        onClose={() => setIsMarketAnalysisOpen(false)} 
      />
      <section id="product" className="py-12 sm:py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <Badge className="mb-3 sm:mb-4 bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm">
              AI-Powered Insights
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sans-bold text-foreground mb-4 sm:mb-6">
              See How AI Analyzes
              <span className="text-gradient block mt-2">Markets for You</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              Our AI analyzes thousands of market signals to give you clear, actionable insights about current conditions and how they affect your investments.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-card border border-border rounded-2xl p-6 sm:p-8 md:p-10 text-center shadow-card">
              <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-xl bg-primary/10 mb-4 sm:mb-6">
                <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-sans-bold text-foreground mb-2 sm:mb-3">
                Market Analysis Tool
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-lg mx-auto">
                Get instant AI-driven insights on market sentiment, volatility, and sector performance to inform your investment decisions.
              </p>
              <Button 
                size="lg"
                onClick={() => setIsMarketAnalysisOpen(true)}
                className="gap-2"
              >
                Try Market Analysis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
