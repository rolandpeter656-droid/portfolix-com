import { AlertTriangle, Info } from "lucide-react";
import { Link } from "react-router-dom";

interface InvestmentDisclaimerProps {
  variant?: "full" | "compact" | "inline" | "footer";
  className?: string;
  showLearnMore?: boolean;
}

export const InvestmentDisclaimer = ({ 
  variant = "full", 
  className = "",
  showLearnMore = true
}: InvestmentDisclaimerProps) => {
  
  const coreDisclaimer = 
    "PortfoliX is an investment research and portfolio-modeling platform. We do not provide personalized financial advice, and we are not a registered investment adviser, broker-dealer, or asset manager.";
  
  const riskWarning = 
    "All investments involve risk, including potential loss of principal. Past performance does not guarantee future results. Portfolio models are hypothetical and for educational purposes only.";

  const userResponsibility = 
    "Users are solely responsible for their investment decisions. Always consult a qualified financial professional before making investment decisions.";

  if (variant === "inline") {
    return (
      <div className={`flex items-start gap-2 text-xs text-muted-foreground ${className}`}>
        <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
        <span>{coreDisclaimer}</span>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`border-t border-border pt-6 mt-6 ${className}`}>
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Investment Disclaimer:</strong> {coreDisclaimer}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {riskWarning}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {userResponsibility}
            </p>
          </div>
        </div>
        {showLearnMore && (
          <div className="flex flex-wrap gap-4 text-xs">
            <Link to="/legal/disclaimers" className="text-primary hover:underline">
              Full Disclaimers
            </Link>
            <Link to="/legal/risk-disclosure" className="text-primary hover:underline">
              Risk Disclosure
            </Link>
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        )}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`bg-muted/50 border border-border rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {coreDisclaimer} {riskWarning}
            </p>
            {showLearnMore && (
              <Link to="/legal/disclaimers" className="text-xs text-primary hover:underline">
                Read Full Disclaimers →
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4 sm:p-6 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
              Important Investment Disclaimer
            </h4>
            <p className="text-sm text-amber-800/90 dark:text-amber-200/90 leading-relaxed">
              {coreDisclaimer}
            </p>
          </div>
          <p className="text-sm text-amber-800/80 dark:text-amber-200/80 leading-relaxed">
            {riskWarning}
          </p>
          <p className="text-sm text-amber-800/80 dark:text-amber-200/80 leading-relaxed">
            {userResponsibility}
          </p>
          {showLearnMore && (
            <div className="pt-2">
              <Link 
                to="/legal/disclaimers" 
                className="text-sm text-amber-700 dark:text-amber-300 hover:underline font-medium"
              >
                Read Complete Legal Disclosures →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const INVESTMENT_DISCLAIMER_SHORT = 
  "PortfoliX provides investment research and portfolio-modeling tools for educational purposes only. We are not a registered investment adviser. All investments involve risk. Past performance does not guarantee future results.";

export const INVESTMENT_DISCLAIMER_FULL = 
  "PortfoliX is an investment research and portfolio-modeling platform. We do not provide personalized financial advice, and we are not a registered investment adviser, broker-dealer, or asset manager. All investments involve risk, including potential loss of principal. Past performance does not guarantee future results. Portfolio models are hypothetical and for educational purposes only. Users are solely responsible for their investment decisions. Always consult a qualified financial professional before making investment decisions.";
