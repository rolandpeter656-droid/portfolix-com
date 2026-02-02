import { CheckCircle, Clock, Shield, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { AIDashboardModal } from "@/components/AIDashboardModal";
import { useNavigate } from "react-router-dom";

// Value props focused on user outcomes, not features
const valueProps = [
  {
    icon: CheckCircle,
    title: "Stop Guessing, Start Investing",
    description: "Answer 3 simple questions and get a complete portfolio matched to your goals. No confusing financial jargon.",
    gradient: "from-success to-green-400"
  },
  {
    icon: Clock,
    title: "Portfolio in Minutes, Not Months",
    description: "Skip the research paralysis. Our portfolios are built by analyzing thousands of successful investment strategies.",
    gradient: "from-primary to-primary-glow"
  },
  {
    icon: Shield,
    title: "Use Your Own Brokerage",
    description: "Keep control of your money. We provide the portfolio, you implement it wherever you invest—Fidelity, Vanguard, Schwab, or any other.",
    gradient: "from-blue-500 to-blue-400"
  }
];

export const FeaturesSection = () => {
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const navigate = useNavigate();

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
              Investing Made
              <span className="text-gradient block mt-2">Simple</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              No finance degree. No complicated research. Just clear guidance on what to invest in and why.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto relative z-10">
            {valueProps.map((prop, index) => (
              <Card 
                key={index} 
                className="group glass-card glass-glow-hover overflow-hidden"
              >
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="relative">
                    {/* Icon with gradient background */}
                    <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r ${prop.gradient} mb-4 sm:mb-6 shadow-glow`}>
                      <prop.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                    </div>
                    
                    {/* Decorative sparkle */}
                    <Sparkles className="absolute -top-2 -right-2 h-5 w-5 sm:h-6 sm:w-6 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-sans-bold text-foreground mb-2 sm:mb-4 group-hover:text-primary transition-colors">
                    {prop.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {prop.description}
                  </p>

                  {/* Hover effect line */}
                  <div className="mt-4 sm:mt-6 h-1 bg-gradient-to-r from-primary to-success rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How It Works - Simple Steps */}
          <div id="how-it-works" className="mt-16 sm:mt-20 md:mt-24 max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-sans-bold text-foreground text-center mb-8 sm:mb-12">
              How It Works
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/20 border-2 border-primary text-primary font-bold text-xl mx-auto mb-4">
                  1
                </div>
                <h4 className="font-semibold text-foreground mb-2">Answer 3 Questions</h4>
                <p className="text-sm text-muted-foreground">
                  Tell us your goals, timeline, and how you feel about risk. Takes under a minute.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-success/20 border-2 border-success text-success font-bold text-xl mx-auto mb-4">
                  2
                </div>
                <h4 className="font-semibold text-foreground mb-2">Get Your Portfolio</h4>
                <p className="text-sm text-muted-foreground">
                  Receive a personalized portfolio with exact investments and percentages.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-warning/20 border-2 border-warning text-warning font-bold text-xl mx-auto mb-4">
                  3
                </div>
                <h4 className="font-semibold text-foreground mb-2">Invest with Confidence</h4>
                <p className="text-sm text-muted-foreground">
                  Copy the portfolio to your brokerage and start building wealth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
