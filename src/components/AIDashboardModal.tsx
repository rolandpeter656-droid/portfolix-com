import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, Shield } from "lucide-react";
import { useState } from "react";

interface AIDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpClick: () => void;
}

export const AIDashboardModal = ({ isOpen, onClose, onSignUpClick }: AIDashboardModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-sans-bold">
              AI Dashboard Demo
            </DialogTitle>
            <Badge variant="secondary" className="text-xs">
              Demo Data
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Dashboard Screenshot Placeholder */}
          <div className="relative aspect-video w-full rounded-lg bg-gradient-card border border-border overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground">
                  Interactive dashboard preview
                </p>
              </div>
            </div>
          </div>

          {/* Metric Chips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-card border-border hover-lift">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Portfolio Value</p>
                  <p className="text-xl font-sans-bold text-foreground">$248,593</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-card border-border hover-lift">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Return</p>
                  <p className="text-xl font-sans-bold text-success">+12.4%</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-card border-border hover-lift">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-warning/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <p className="text-xl font-sans-bold text-foreground">6.2/10</p>
                </div>
              </div>
            </Card>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={onSignUpClick}
              size="lg"
              className="btn-glow"
            >
              Try Full Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
