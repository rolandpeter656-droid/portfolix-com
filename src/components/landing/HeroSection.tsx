import { Button } from "@/components/ui/button";
import { ArrowRight, Play, TrendingUp, Users, Zap } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-success/10 rounded-full blur-3xl animate-pulse delay-2000" />
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Main Headline */}
          <h1 className="font-serif-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-tight">
            {/* Mobile: Stack each word */}
            <span className="block md:hidden">
              <span className="block">Build</span>
              <span className="block">Smarter</span>
              <span className="block">Investment</span>
              <span className="text-gradient block">Portfolios</span>
            </span>
            {/* Desktop: Two lines */}
            <span className="hidden md:block">
              Build Smarter
              <span className="text-gradient block mt-2">Investment Portfolios</span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-6 leading-relaxed max-w-4xl mx-auto">
            Our AI analyzes market trends, risk profiles, and investment goals to create 
            personalized portfolio bundles for optimal returns.
          </p>

          {/* Tagline */}
          <p className="text-lg text-primary mb-12 font-medium">
            Think of ChatGPT + Notion + Wealthfront, for investing
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="bg-primary hover:bg-primary-glow text-primary-foreground px-8 py-4 text-lg hover-scale shadow-glow"
            >
              Start Building Portfolio
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-success/20 rounded-full mb-3">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div className="text-3xl font-sans-bold text-success">15.2%</div>
              <div className="text-sm text-muted-foreground">Avg. Return</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-sans-bold text-primary">1M+</div>
              <div className="text-sm text-muted-foreground">Portfolios Built</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-warning/20 rounded-full mb-3">
                <Zap className="h-6 w-6 text-warning" />
              </div>
              <div className="text-3xl font-sans-bold text-warning">3.2s</div>
              <div className="text-sm text-muted-foreground">Analysis Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full">
          <div className="w-1 h-3 bg-muted-foreground rounded-full mx-auto mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};