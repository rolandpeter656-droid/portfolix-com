import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export const UpgradeModal = ({ open, onClose }: UpgradeModalProps) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate("/payment-method?plan=pro&currency=USD");
  };

  const features = [
    "Unlimited AI-generated portfolios",
    "Real-time portfolio improvement suggestions",
    "AI-generated rebalancing alerts",
    "Portfolio risk scoring",
    "Exclusive webinars and strategy guides",
    "Priority access to new investing models"
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-primary rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-3xl font-bold">
            You've Reached Your Free Portfolio Limit 🚀
          </DialogTitle>
          <DialogDescription className="text-base">
            You've used up your 5 free AI portfolio generations. Upgrade now to unlock lifetime access to profitable AI portfolios and exclusive investor tools.
          </DialogDescription>
        </DialogHeader>

        <Card className="border-2 border-primary/20 shadow-lg mt-6">
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-foreground">
                Upgrade to the PortfoliX Pro Plan
              </h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-bold text-primary">$25</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <Button
                onClick={handleUpgrade}
                className="w-full bg-gradient-primary text-white hover:opacity-90 py-6 text-lg font-semibold"
                size="lg"
              >
                Upgrade for $25/month
              </Button>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  🔒 Secure payment powered by Paystack
                </p>
                <p className="text-sm text-success font-medium">
                  ✓ Instant access after successful payment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground mt-4">
          Already subscribed?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-semibold text-primary"
            onClick={() => navigate("/signin")}
          >
            Log in to your Pro account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
