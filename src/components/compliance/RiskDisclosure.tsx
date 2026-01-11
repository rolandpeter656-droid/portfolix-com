import { TrendingDown, AlertTriangle, Coins, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RiskDisclosureProps {
  variant?: "full" | "compact" | "asset-specific";
  assetClass?: "stocks" | "crypto" | "bonds" | "commodities" | "all";
  className?: string;
}

export const RiskDisclosure = ({ 
  variant = "compact", 
  assetClass = "all",
  className = "" 
}: RiskDisclosureProps) => {
  
  const risksByAsset = {
    stocks: {
      title: "Stock Investment Risks",
      icon: <TrendingDown className="h-4 w-4" />,
      risks: [
        "Market risk: Stock values can decline due to overall market conditions",
        "Volatility risk: Stock prices can fluctuate significantly in short periods",
        "Company-specific risk: Individual companies may underperform or fail",
        "Liquidity risk: Some stocks may be difficult to sell quickly at fair value",
        "Currency risk: International stocks carry foreign exchange exposure"
      ]
    },
    crypto: {
      title: "Cryptocurrency Risks",
      icon: <Coins className="h-4 w-4" />,
      risks: [
        "Extreme volatility: Crypto assets can experience dramatic price swings",
        "Regulatory risk: Laws governing crypto may change unpredictably",
        "Technology risk: Blockchain networks may have vulnerabilities",
        "Custody risk: Digital assets may be lost due to hacking or key loss",
        "Market manipulation: Crypto markets may be subject to manipulation",
        "Total loss potential: You may lose your entire investment"
      ]
    },
    bonds: {
      title: "Fixed Income Risks",
      icon: <Building2 className="h-4 w-4" />,
      risks: [
        "Interest rate risk: Bond values fall when interest rates rise",
        "Credit/default risk: Issuers may fail to pay interest or principal",
        "Inflation risk: Returns may not keep pace with inflation",
        "Reinvestment risk: Future proceeds may earn lower rates",
        "Call risk: Bonds may be redeemed early at unfavorable times"
      ]
    },
    commodities: {
      title: "Commodity Risks",
      icon: <AlertTriangle className="h-4 w-4" />,
      risks: [
        "Price volatility: Commodity prices can be highly volatile",
        "Supply/demand risk: Unpredictable supply disruptions affect prices",
        "Geopolitical risk: Political events can impact commodity markets",
        "Storage and delivery costs: Physical commodities incur additional expenses",
        "Currency risk: Commodities are typically priced in USD"
      ]
    }
  };

  const generalRisks = [
    "All investments carry the risk of loss, including total loss of principal",
    "Past performance is not indicative of future results",
    "Portfolio models shown are hypothetical and may not reflect actual returns",
    "Diversification does not guarantee profit or protect against loss",
    "Tax implications vary by jurisdiction and individual circumstances"
  ];

  if (variant === "compact") {
    return (
      <div className={`bg-muted/50 border border-border rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">Important Risk Warning</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All investments involve risk, including potential loss of principal. 
              Cryptocurrency investments carry additional risks including extreme volatility 
              and regulatory uncertainty. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "asset-specific" && assetClass !== "all") {
    const asset = risksByAsset[assetClass];
    return (
      <Card className={`border-border ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            {asset.icon}
            {asset.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {asset.risks.map((risk, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }

  // Full variant
  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            General Investment Risks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-foreground">
            {generalRisks.map((risk, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-destructive font-bold">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {Object.entries(risksByAsset).map(([key, asset]) => (
        <Card key={key} className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {asset.icon}
              {asset.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {asset.risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
