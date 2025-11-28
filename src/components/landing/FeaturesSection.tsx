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
    <section id="features" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-sans-bold text-foreground mb-6">
            Powerful Features for
            <span className="text-gradient block mt-2">Smart Investing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to build, manage, and optimize your investment portfolio with cutting-edge AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`group bg-gradient-card border-border hover:shadow-card transition-all duration-500 hover-scale overflow-hidden ${
                feature.isClickable ? 'cursor-pointer' : ''
              }`}
              onClick={() => handleFeatureClick(feature)}
            >
              <CardContent className="p-8">
                <div className="relative">
                  {/* Icon with gradient background */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 shadow-glow`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Decorative sparkle */}
                  <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-2xl font-sans-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect line */}
                <div className="mt-6 h-1 bg-gradient-to-r from-primary to-success rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Feature Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="group">
            <BarChart3 className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-sans-bold text-foreground">500+</div>
            <div className="text-sm text-muted-foreground">Asset Classes</div>
          </div>
          <div className="group">
            <Target className="h-8 w-8 text-success mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-sans-bold text-foreground">24/7</div>
            <div className="text-sm text-muted-foreground">Monitoring</div>
          </div>
          <div className="group">
            <Zap className="h-8 w-8 text-warning mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-sans-bold text-foreground">0.1s</div>
            <div className="text-sm text-muted-foreground">Response Time</div>
          </div>
          <div className="group">
            <Shield className="h-8 w-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-sans-bold text-foreground">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};