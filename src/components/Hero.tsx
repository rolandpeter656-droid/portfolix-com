import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, TrendingUp, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 bg-background/5"></div>
      
      {/* Navigation */}
      <div className="absolute top-6 right-6 z-20">
        <Link to="/pricing">
          <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
            <CreditCard className="h-4 w-4 mr-2" />
            View Pricing
          </Button>
        </Link>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <Brain className="h-4 w-4 text-white" />
            <span className="text-white text-sm font-medium">AI-Powered Portfolio Builder</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Build Smarter
            <br />
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Investment Portfolios
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Our AI analyzes market trends, risk profiles, and investment goals to create 
            personalized portfolio bundles for optimal returns.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg group"
            >
              Start Building Portfolio
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">15.2% Avg. Return</span>
              </div>
              <div className="w-1 h-1 bg-white/50 rounded-full"></div>
              <span className="font-medium">1M+ Portfolios Built</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-success/20 rounded-full blur-2xl"></div>
    </section>
  );
};