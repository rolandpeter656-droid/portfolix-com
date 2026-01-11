import { Bot, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AIDisclosureProps {
  variant?: "full" | "compact" | "inline";
  className?: string;
}

export const AIDisclosure = ({ 
  variant = "compact", 
  className = "" 
}: AIDisclosureProps) => {
  
  if (variant === "inline") {
    return (
      <div className={`flex items-start gap-2 text-xs text-muted-foreground ${className}`}>
        <Bot className="h-3 w-3 mt-0.5 flex-shrink-0" />
        <span>
          Portfolio models are generated using AI algorithms. Outputs are hypothetical and may contain errors.
        </span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`bg-muted/50 border border-border rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <Bot className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-medium text-foreground">AI-Generated Content</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Portfolio recommendations are generated using AI and algorithmic models. 
              Outputs are hypothetical, may contain errors, and should be independently verified.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <Card className={`border-border ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI & Automation Disclosure
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-foreground">AI-Powered Generation:</strong> PortfoliX uses 
              artificial intelligence and algorithmic models to generate portfolio recommendations, 
              risk assessments, and educational content. These outputs are based on rules-based 
              logic and historical patterns.
            </p>
          </div>
          <p>
            <strong className="text-foreground">Hypothetical Nature:</strong> All portfolio models, 
            expected returns, and projections are hypothetical simulations. They do not represent 
            actual trading results or guaranteed future performance.
          </p>
          <p>
            <strong className="text-foreground">Potential for Errors:</strong> AI-generated content 
            may contain errors, inaccuracies, or outdated information. Users should independently 
            verify all information before making investment decisions.
          </p>
          <p>
            <strong className="text-foreground">No Guarantee of Accuracy:</strong> While we strive 
            for accuracy, we make no representations or warranties regarding the completeness, 
            accuracy, or reliability of AI-generated outputs.
          </p>
          <p>
            <strong className="text-foreground">User Verification Required:</strong> Users are 
            responsible for verifying all information, conducting their own research, and 
            consulting qualified professionals before acting on any AI-generated recommendations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
