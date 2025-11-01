import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface InstitutionalDisclaimerProps {
  variant?: "full" | "compact";
  className?: string;
}

export const InstitutionalDisclaimer = ({ 
  variant = "full", 
  className = "" 
}: InstitutionalDisclaimerProps) => {
  const disclaimerText = 
    "PortfoliX Institutional Models are AI-generated frameworks inspired by historical corporate investment literature. They are provided for educational use by licensed financial institutions and do not constitute investment advice or portfolio management.";

  if (variant === "compact") {
    return (
      <div className={`text-center text-xs text-muted-foreground ${className}`}>
        <p className="mb-1">{disclaimerText}</p>
        <Link 
          to="/legal/institutional-disclaimer"
          className="text-primary hover:underline inline-flex items-center gap-1"
        >
          Read Full Compliance Documentation
        </Link>
      </div>
    );
  }

  return (
    <Card className={`border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 ${className}`}>
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm leading-relaxed text-amber-900/90 dark:text-amber-100/90">
              {disclaimerText}
            </p>
            <Link 
              to="/legal/institutional-disclaimer"
              className="text-sm text-amber-700 dark:text-amber-300 hover:underline inline-flex items-center gap-1"
            >
              Read More: Compliance & Transparency
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const INSTITUTIONAL_DISCLAIMER_TEXT = 
  "PortfoliX Institutional Models are AI-generated frameworks inspired by historical corporate investment literature. They are provided for educational use by licensed financial institutions and do not constitute investment advice or portfolio management.";
