import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AIDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpClick: () => void;
}

export const AIDashboardModal = ({ isOpen, onClose, onSignUpClick }: AIDashboardModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleTryDashboard = () => {
    onClose();
    if (user) {
      navigate("/dashboard");
    } else {
      sessionStorage.setItem("redirectAfterAuth", "/dashboard");
      onSignUpClick();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-sans-bold">
              AI Dashboard Demo
            </DialogTitle>
            <Badge variant="secondary" className="text-[10px] sm:text-xs flex-shrink-0">
              Demo Data
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          <div className="relative aspect-video w-full rounded-lg bg-gradient-card border border-border overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-3 sm:space-y-4 p-4 sm:p-8">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Interactive dashboard preview
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Card className="p-3 sm:p-4 bg-gradient-card border-border hover-lift">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Portfolio Value</p>
                  <p className="text-base sm:text-lg md:text-xl font-sans-bold text-foreground truncate">$248,593</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 bg-gradient-card border-border hover-lift">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Monthly Return</p>
                  <p className="text-base sm:text-lg md:text-xl font-sans-bold text-success">+12.4%</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 bg-gradient-card border-border hover-lift">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-warning" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Risk Score</p>
                  <p className="text-base sm:text-lg md:text-xl font-sans-bold text-foreground">6.2/10</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex justify-center pt-2 sm:pt-4">
            <Button 
              onClick={handleTryDashboard}
              size="lg"
              className="btn-glow w-full sm:w-auto text-sm sm:text-base"
            >
              {user ? "Open Dashboard" : "Try Full Dashboard"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
