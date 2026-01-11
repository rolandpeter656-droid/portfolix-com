import { Globe, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EligibilityDisclosureProps {
  variant?: "full" | "compact";
  className?: string;
}

export const EligibilityDisclosure = ({ 
  variant = "compact", 
  className = "" 
}: EligibilityDisclosureProps) => {
  
  if (variant === "compact") {
    return (
      <div className={`text-xs text-muted-foreground space-y-1 ${className}`}>
        <div className="flex items-center gap-2">
          <UserCheck className="h-3 w-3" />
          <span className="font-medium">User Eligibility</span>
        </div>
        <p>
          Users must be 18 years or older. Service availability may vary by jurisdiction.
        </p>
      </div>
    );
  }

  return (
    <Card className={`border-border ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          User Eligibility & Jurisdiction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Age Requirement:</strong> Users must be at least 
            18 years of age (or the age of majority in their jurisdiction) to use PortfoliX services.
          </p>
          <p>
            <strong className="text-foreground">Jurisdiction Notice:</strong> The availability 
            of PortfoliX services may vary depending on your country or region. Some features 
            may not be available in all jurisdictions due to local regulations.
          </p>
          <p>
            <strong className="text-foreground">Access Restrictions:</strong> PortfoliX reserves 
            the right to restrict access to services in certain jurisdictions without prior 
            notice, in compliance with applicable laws and regulations.
          </p>
          <p>
            <strong className="text-foreground">Local Compliance:</strong> Users are responsible 
            for ensuring that their use of PortfoliX complies with applicable laws in their 
            jurisdiction. Access to the platform does not constitute an offer or solicitation 
            in any jurisdiction where such offer would be unlawful.
          </p>
          <p>
            <strong className="text-foreground">Professional Advice:</strong> Users in regulated 
            jurisdictions should consult with local financial and legal professionals to 
            understand how investment activities are regulated in their area.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
