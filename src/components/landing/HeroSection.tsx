import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Clock, Users, PieChart } from "lucide-react";
import { DemoModal } from "@/components/DemoModal";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-gradient-hero pt-20 sm:pt-24 pb-16 sm:pb-20">
      {/* Animated Glassmorphism Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="glass-blob glass-blob-cyan w-[500px] h-[500px] top-1/4 left-1/4 animate-blob-float" />
        <div className="glass-blob glass-blob-purple w-[400px] h-[400px] bottom-1/4 right-1/4 animate-blob-float-delayed" />
        <div className="glass-blob glass-blob-blue w-[300px] h-[300px] top-1/2 right-1/3 animate-blob-float" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Background Glow Effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-40" />
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Main Headline - Pain point focused */}
          <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground mb-4 sm:mb-6 md:mb-8 leading-[1.1]">
            Finally Know <span className="text-success">What to Invest In</span>
          </h1>

          {/* Subheading - Specific outcome promise */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-4 sm:mb-6 leading-relaxed max-w-4xl mx-auto px-2">
            Get a personalized investment portfolio in 3 minutes. No finance degree required.
          </p>

          {/* Supporting Text with Social Proof */}
          <p className="text-sm sm:text-base md:text-lg text-primary/80 mb-8 sm:mb-10 md:mb-12 font-medium px-2 max-w-3xl mx-auto">
            Join 20+ investors who stopped overthinking and started building wealth with portfolios designed for their goals, timeline, and risk tolerance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10 sm:mb-12 md:mb-16 px-4">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="w-full sm:w-auto bg-primary hover:bg-primary-glow text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg hover-scale shadow-glow"
            >
              Build Your Portfolio (Free)
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setIsDemoOpen(true)}
              className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
            >
              <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              See How It Works
            </Button>
          </div>

          {/* Trust Indicators - Real numbers */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-12 max-w-lg sm:max-w-xl mx-auto">
            <div className="glass-stat flex flex-col items-center p-3 sm:p-4">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 backdrop-blur-xl bg-primary/20 border border-primary/30 rounded-full mb-2">
                <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="text-xl sm:text-2xl font-sans-bold text-primary">500+</div>
              <div className="text-xs sm:text-sm text-muted-foreground text-center">Portfolios Created</div>
            </div>
            <div className="glass-stat flex flex-col items-center p-3 sm:p-4">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 backdrop-blur-xl bg-success/20 border border-success/30 rounded-full mb-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
              </div>
              <div className="text-xl sm:text-2xl font-sans-bold text-success">20+</div>
              <div className="text-xs sm:text-sm text-muted-foreground text-center">Active Investors</div>
            </div>
            <div className="glass-stat flex flex-col items-center p-3 sm:p-4">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 backdrop-blur-xl bg-warning/20 border border-warning/30 rounded-full mb-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-warning" />
              </div>
              <div className="text-xl sm:text-2xl font-sans-bold text-warning">3 min</div>
              <div className="text-xs sm:text-sm text-muted-foreground text-center">To Portfolio</div>
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
