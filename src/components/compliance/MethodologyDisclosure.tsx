import { Settings, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MethodologyDisclosureProps {
  variant?: "full" | "compact";
  className?: string;
}

export const MethodologyDisclosure = ({ 
  variant = "compact", 
  className = "" 
}: MethodologyDisclosureProps) => {
  
  if (variant === "compact") {
    return (
      <div className={`bg-muted/50 border border-border rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <Settings className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-medium text-foreground">Portfolio Methodology</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Portfolios are generated using rules-based models. User inputs influence structure 
              but do not create personalized investment advice.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={`border-border ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Portfolio Methodology Disclosure
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Rules-Based Models:</strong> PortfoliX generates 
            portfolio recommendations using systematic, rules-based algorithmic models. These 
            models apply predetermined allocation strategies based on asset class diversification 
            principles.
          </p>
          <p>
            <strong className="text-foreground">User Input Processing:</strong> User-provided 
            information (such as risk tolerance selections and investment timeline) influences 
            the portfolio output parameters. However, this process produces generalized model 
            portfolios, not personalized investment recommendations.
          </p>
          <p>
            <strong className="text-foreground">Generalized Output:</strong> Portfolio models 
            are designed for educational and illustrative purposes. They represent theoretical 
            allocations and do not account for individual financial circumstances, tax situations, 
            or investment objectives.
          </p>
          <p>
            <strong className="text-foreground">No Human Override:</strong> Unless explicitly 
            stated, portfolio outputs are generated algorithmically without individual human 
            review or customization for specific users.
          </p>
          <p>
            <strong className="text-foreground">Model Limitations:</strong> Models are based on 
            historical data and theoretical assumptions. Actual market conditions may differ 
            significantly, and past performance does not predict future results.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
