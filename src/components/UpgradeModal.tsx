import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Crown, TrendingUp, Bell, LineChart, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  context?: "portfolio_save" | "feature_gate" | "optimization" | "default";
}

const contextMessages = {
  portfolio_save: {
    title: "Keep Your Portfolio Optimized",
    description: "You've saved your portfolio! Want ongoing market insights and rebalancing guidance to maximize its performance?"
  },
  feature_gate: {
    title: "Unlock AI-Powered Analysis",
    description: "This feature helps you understand how current events affect your investments and provides personalized optimization recommendations."
  },
  optimization: {
    title: "Maximize Your Portfolio's Performance",
    description: "You've built several portfolios. Pro helps you maintain and optimize all of them with continuous AI-powered insights."
  },
  default: {
    title: "Upgrade to Pro for Ongoing Guidance",
    description: "Get continuous market insights, rebalancing alerts, and personalized optimization recommendations."
  }
};

export const UpgradeModal = ({ open, onClose, context = "default" }: UpgradeModalProps) => {
  const navigate = useNavigate();
  const { title, description } = contextMessages[context];

  const handleUpgrade = () => {
    navigate("/payment-method?plan=pro&billing=monthly");
  };

  const features = [
    { icon: TrendingUp, text: "AI-Powered Market Analysis", description: "Understand how events affect your holdings" },
    { icon: Bell, text: "Smart Rebalancing Alerts", description: "Get notified when allocations drift" },
    { icon: LineChart, text: "Portfolio Health Checks", description: "Monthly performance analysis" },
    { icon: Zap, text: "Personalized Optimization", description: "AI recommendations for your strategy" }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Crown className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>

        <Card className="border-2 border-primary/20 shadow-lg mt-6">
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="mb-2">14-DAY FREE TRIAL</Badge>
              <h3 className="text-xl font-bold text-foreground">
                PortfoliX Pro
              </h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-bold text-primary">$15</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-xs text-muted-foreground">
                or $144/year (save 20%)
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-1.5 bg-primary/10 rounded-full flex-shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium text-foreground block">{feature.text}</span>
                      <span className="text-xs text-muted-foreground">{feature.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={handleUpgrade}
                className="w-full py-6 text-base font-semibold"
                size="lg"
              >
                Try Pro Free for 14 Days
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Cancel anytime during your free trial. No credit card required to start.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground mt-4">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
