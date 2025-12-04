import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, FileText, BarChart3, RefreshCw, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AdvisorHomepageBlock = () => {
  const navigate = useNavigate();

  const benefits = [
    { icon: Clock, text: "Save 8–12 hours monthly" },
    { icon: FileText, text: "Research-backed portfolios" },
    { icon: BarChart3, text: "Client-ready allocations" },
    { icon: RefreshCw, text: "Simplified rebalancing" },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Building2 className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">For Financial Advisors</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Model Portfolios Built for
              <span className="text-gradient block">Financial Advisors</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              Save time, scale your client offering, and deploy institutional-grade portfolios 
              without building an investment research team.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <benefit.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-glow"
                onClick={() => navigate('/advisors/onboarding')}
              >
                Become a Partner
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/advisors')}
              >
                View Partnership Details
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <div className="space-y-4">
                {/* Mock portfolio cards */}
                <div className="bg-background rounded-lg p-4 shadow-sm border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Growth Portfolio</span>
                    <span className="text-sm text-primary">12-15% return</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary rounded-full h-2 w-4/5" />
                  </div>
                </div>
                
                <div className="bg-background rounded-lg p-4 shadow-sm border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Income Portfolio</span>
                    <span className="text-sm text-primary">5-7% return</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary rounded-full h-2 w-3/5" />
                  </div>
                </div>
                
                <div className="bg-background rounded-lg p-4 shadow-sm border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Balanced 60/40</span>
                    <span className="text-sm text-primary">6-8% return</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary rounded-full h-2 w-2/3" />
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  8 ready-to-deploy model portfolios
                </p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};
