import { Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConflictDisclosureProps {
  variant?: "full" | "compact";
  className?: string;
}

export const ConflictDisclosure = ({ 
  variant = "compact", 
  className = "" 
}: ConflictDisclosureProps) => {
  
  if (variant === "compact") {
    return (
      <div className={`text-xs text-muted-foreground space-y-1 ${className}`}>
        <div className="flex items-center gap-2">
          <Scale className="h-3 w-3" />
          <span className="font-medium">Conflicts of Interest</span>
        </div>
        <p>
          PortfoliX does not currently receive compensation from asset providers or favor 
          any specific securities in portfolio recommendations.
        </p>
      </div>
    );
  }

  return (
    <Card className={`border-border ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          Conflicts of Interest Disclosure
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Compensation Disclosure:</strong> PortfoliX 
            does not currently receive compensation, referral fees, or revenue sharing 
            arrangements from any asset providers, brokerages, or financial institutions 
            for including specific securities or funds in portfolio recommendations.
          </p>
          <p>
            <strong className="text-foreground">Neutral Data Sources:</strong> Portfolio models 
            are based on publicly available asset classes and allocation principles. We do not 
            favor specific securities or providers.
          </p>
          <p>
            <strong className="text-foreground">Subscription Revenue:</strong> PortfoliX generates 
            revenue through user subscription fees for premium features. Subscription status does 
            not influence the composition of portfolio recommendations.
          </p>
          <p>
            <strong className="text-foreground">Future Disclosures:</strong> Should PortfoliX 
            enter into any commercial arrangements that could create conflicts of interest, 
            such arrangements will be disclosed in this section.
          </p>
          <p>
            <strong className="text-foreground">User Best Interest:</strong> While PortfoliX 
            is not a fiduciary and does not provide personalized advice, we strive to present 
            objective, educational information to help users make informed decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
