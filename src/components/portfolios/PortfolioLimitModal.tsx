import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Infinity, Sparkles, BarChart3, Download, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PortfolioLimitModalProps {
  open: boolean;
  onClose: () => void;
}

export const PortfolioLimitModal = ({ open, onClose }: PortfolioLimitModalProps) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate("/pricing");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card sm:max-w-lg border-white/20">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-full">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-xl">Portfolio Limit Reached</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            You've created 5 portfolios on the Free plan. Upgrade to Pro for unlimited portfolio creation and premium features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <h4 className="font-semibold text-foreground">Unlock with Pro:</h4>
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 glass-stat rounded-lg border border-primary/20">
              <Infinity className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Unlimited Portfolios</p>
                <p className="text-sm text-muted-foreground">Create as many portfolios as you need</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 glass-stat rounded-lg border border-primary/20">
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">AI Market Tracker</p>
                <p className="text-sm text-muted-foreground">Real-time AI-powered market insights</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 glass-stat rounded-lg border border-primary/20">
              <Palette className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Full Customization</p>
                <p className="text-sm text-muted-foreground">Edit assets, weights, and strategies</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 glass-stat rounded-lg border border-primary/20">
              <Download className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">PDF Export</p>
                <p className="text-sm text-muted-foreground">Download professional portfolio reports</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 glass-stat rounded-lg border border-primary/20">
              <BarChart3 className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">AI Rebalancing Alerts</p>
                <p className="text-sm text-muted-foreground">Smart notifications to optimize returns</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1 glass-button">
            Maybe Later
          </Button>
          <Button onClick={handleUpgrade} className="flex-1 bg-gradient-primary hover:opacity-90">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Pro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
