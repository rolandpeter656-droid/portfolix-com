import { Shield, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RegulatoryDisclosureProps {
  variant?: "full" | "compact";
  className?: string;
}

export const RegulatoryDisclosure = ({ 
  variant = "compact", 
  className = "" 
}: RegulatoryDisclosureProps) => {
  
  if (variant === "compact") {
    return (
      <div className={`text-xs text-muted-foreground space-y-1 ${className}`}>
        <div className="flex items-center gap-2">
          <Shield className="h-3 w-3" />
          <span className="font-medium">Regulatory Status</span>
        </div>
        <p>
          PortfoliX is not registered as an investment adviser with any regulatory authority. 
          We do not provide fiduciary services or assess investment suitability for individual users.
        </p>
      </div>
    );
  }

  return (
    <Card className={`border-border ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Regulatory Status Disclosure
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Registration Status:</strong> PortfoliX is not registered 
            as an investment adviser, broker-dealer, or asset manager with any regulatory authority, 
            including but not limited to the U.S. Securities and Exchange Commission (SEC), the 
            Financial Conduct Authority (FCA), the Securities and Exchange Commission of Nigeria 
            (SEC NG), or any other national or international regulatory body.
          </p>
          <p>
            <strong className="text-foreground">No Fiduciary Duty:</strong> PortfoliX does not owe 
            fiduciary duties to users. We do not act as a financial fiduciary, and our platform 
            does not create an adviser-client relationship.
          </p>
          <p>
            <strong className="text-foreground">No Suitability Assessment:</strong> We do not assess 
            the suitability of any investment for individual users. Risk profile questionnaires and 
            portfolio recommendations are generalized tools and do not constitute personalized 
            investment advice.
          </p>
          <p>
            <strong className="text-foreground">User Responsibility:</strong> Users are solely 
            responsible for evaluating and executing any investment decisions. We strongly recommend 
            consulting with a qualified and licensed financial professional before making any 
            investment decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
