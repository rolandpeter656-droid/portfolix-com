import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, TrendingUp, Users } from "lucide-react";
import { DemoModal } from "@/components/DemoModal";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-gradient-hero pt-20 sm:pt-24 pb-16 sm:pb-20">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-success/10 rounded-full blur-3xl animate-pulse delay-2000" />
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Main Headline - Fluid typography */}
          <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground mb-4 sm:mb-6 md:mb-8 leading-[1.1]">
            Invest Like a <span className="text-success">Pro</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-4 sm:mb-6 leading-relaxed max-w-4xl mx-auto px-2">
            Build professionally crafted investment portfolios tailored to your goals—ready to deploy with confidence.
          </p>

          {/* Tagline */}
          <p className="text-sm sm:text-base md:text-lg text-primary mb-8 sm:mb-10 md:mb-12 font-medium px-2">
            Start with PortfoliX—your path to smarter investing.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10 sm:mb-12 md:mb-16 px-4">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="w-full sm:w-auto bg-primary hover:bg-primary-glow text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg hover-scale shadow-glow"
            >
              Start Building Portfolio
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setIsDemoOpen(true)}
              className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
            >
              <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:gap-12 max-w-xs sm:max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-success/20 rounded-full mb-2 sm:mb-3">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
              </div>
              <div className="text-2xl sm:text-3xl font-sans-bold text-success">35%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Avg. Return</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-full mb-2 sm:mb-3">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl font-sans-bold text-primary">1M+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Portfolios Built</div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

      {/* Scroll Indicator - Hidden on very small screens */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-muted-foreground rounded-full">
          <div className="w-1 h-2 sm:h-3 bg-muted-foreground rounded-full mx-auto mt-1.5 sm:mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};
