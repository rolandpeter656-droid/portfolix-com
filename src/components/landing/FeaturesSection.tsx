import { Brain, Target, Zap, Shield, BarChart3, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { AIDashboardModal } from "@/components/AIDashboardModal";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning algorithms analyze thousands of market variables to identify optimal investment opportunities tailored to your risk profile.",
    gradient: "from-primary to-primary-glow"
  },
  {
    icon: Target,
    title: "Personalized Portfolios",
    description: "Get custom portfolio recommendations based on your financial goals, timeline, and risk tolerance with real-time adjustments.",
    gradient: "from-success to-green-400"
  },
  {
    icon: Zap,
    title: "Lightning Fast Execution",
    description: "Execute trades and rebalance portfolios in seconds with our high-speed infrastructure and automated optimization engine.",
    gradient: "from-warning to-yellow-400"
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Built-in risk monitoring with automated alerts and protective measures to safeguard your investments during market volatility.",
    gradient: "from-blue-500 to-blue-400"
  },
  {
    icon: TrendingUp,
    title: "AI Dashboard",
    description: "Real-time portfolio analytics with AI-powered insights",
    gradient: "from-primary to-primary-glow",
    isClickable: true
  }
];

export const FeaturesSection = () => {
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleFeatureClick = (feature: typeof features[0]) => {
    if (feature.isClickable) {
      setIsDashboardModalOpen(true);
    }
  };

  const handleSignUpClick = () => {
    setIsDashboardModalOpen(false);
    navigate('/signup');
  };

  return (
    <>
      <AIDashboardModal 
        isOpen={isDashboardModalOpen}
        onClose={() => setIsDashboardModalOpen(false)}
        onSignUpClick={handleSignUpClick}
      />
    <section id="features" className="relative py-12 sm:py-16 md:py-24 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="glass-blob glass-blob-cyan w-[400px] h-[400px] -top-20 -left-20 animate-blob-float opacity-10" />
          <div className="glass-blob glass-blob-purple w-[350px] h-[350px] -bottom-20 -right-20 animate-blob-float-delayed opacity-10" />
        </div>
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sans-bold text-foreground mb-4 sm:mb-6">
            Powerful Features for
            <span className="text-gradient block mt-2">Smart Investing</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Everything you need to build, manage, and optimize your investment portfolio with cutting-edge AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto relative z-10">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`group glass-card glass-glow-hover overflow-hidden ${
                feature.isClickable ? 'cursor-pointer' : ''
              }`}
              onClick={() => handleFeatureClick(feature)}
            >
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="relative">
                  {/* Icon with gradient background */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r ${feature.gradient} mb-4 sm:mb-6 shadow-glow`}>
                    <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                  </div>
                  
                  {/* Decorative sparkle */}
                  <Sparkles className="absolute -top-2 -right-2 h-5 w-5 sm:h-6 sm:w-6 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-sans-bold text-foreground mb-2 sm:mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect line */}
                <div className="mt-4 sm:mt-6 h-1 bg-gradient-to-r from-primary to-success rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Feature Stats */}
        <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center relative z-10">
          <div className="group glass-stat p-3 sm:p-4">
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-xl sm:text-2xl font-sans-bold text-foreground">500+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Asset Classes</div>
          </div>
          <div className="group glass-stat p-3 sm:p-4">
            <Target className="h-6 w-6 sm:h-8 sm:w-8 text-success mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-xl sm:text-2xl font-sans-bold text-foreground">24/7</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Monitoring</div>
          </div>
          <div className="group glass-stat p-3 sm:p-4">
            <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-warning mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-xl sm:text-2xl font-sans-bold text-foreground">0.1s</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Response Time</div>
          </div>
          <div className="group glass-stat p-3 sm:p-4">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-xl sm:text-2xl font-sans-bold text-foreground">99.9%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Uptime</div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};