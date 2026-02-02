import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  ArrowRight,
  Building2,
  Clock,
  DollarSign,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  symbol: string;
  name: string;
  allocation: number;
  rationale?: string;
  assetClass?: string;
  color?: string;
}

interface ImplementationGuideProps {
  portfolio: Asset[];
  investmentAmount: number;
  portfolioName: string;
}

const BROKERAGES = [
  { name: "Fidelity", url: "https://www.fidelity.com", commissionFree: true },
  { name: "Vanguard", url: "https://www.vanguard.com", commissionFree: true },
  { name: "Charles Schwab", url: "https://www.schwab.com", commissionFree: true },
  { name: "TD Ameritrade", url: "https://www.tdameritrade.com", commissionFree: true },
];

export const ImplementationGuide = ({ 
  portfolio, 
  investmentAmount, 
  portfolioName 
}: ImplementationGuideProps) => {
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const copyToClipboard = () => {
    const text = portfolio
      .map(a => `${a.symbol}: ${formatCurrency(investmentAmount * a.allocation / 100)} (${a.allocation}%)`)
      .join('\n');
    
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Portfolio allocations copied. Paste into your brokerage notes.",
    });
  };

  return (
    <Card className="shadow-card border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Implementation Guide
          </CardTitle>
          <Badge variant="outline" className="text-primary border-primary">
            Step-by-Step
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Follow these steps to implement your {portfolioName} in your brokerage account.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1: Choose Broker */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              1
            </div>
            <h4 className="font-semibold">Open Your Brokerage Account</h4>
          </div>
          <p className="text-sm text-muted-foreground ml-8">
            These funds are available commission-free at major brokerages:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 ml-8">
            {BROKERAGES.map((broker) => (
              <a
                key={broker.name}
                href={broker.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Building2 className="h-3 w-3" />
                {broker.name}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>

        {/* Step 2: Purchase Holdings */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              2
            </div>
            <h4 className="font-semibold">Purchase Each Holding</h4>
          </div>
          <div className="ml-8 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Search for each ticker and purchase the exact amounts:
              </p>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-1" />
                Copy All
              </Button>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              {portfolio.map((asset) => (
                <div 
                  key={asset.symbol} 
                  className="flex items-center justify-between text-sm py-1 border-b border-border/50 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <code className="font-mono font-semibold text-primary">
                      {asset.symbol}
                    </code>
                    <span className="text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                      {asset.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{asset.allocation}%</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="font-semibold">
                      {formatCurrency(investmentAmount * asset.allocation / 100)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Expected Costs */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              3
            </div>
            <h4 className="font-semibold">Expected Costs</h4>
          </div>
          <div className="ml-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2 p-3 bg-success/10 rounded-lg">
              <DollarSign className="h-4 w-4 text-success mt-0.5" />
              <div>
                <p className="text-sm font-medium">Trading Fees</p>
                <p className="text-xs text-muted-foreground">$0 at most brokerages</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
              <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Fund Expense Ratios</p>
                <p className="text-xs text-muted-foreground">~0.03% - 0.20% annually</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Ongoing Management */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              4
            </div>
            <h4 className="font-semibold">Ongoing Management</h4>
          </div>
          <div className="ml-8 space-y-2">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong>Review annually</strong> - Check your portfolio once a year to ensure it still matches your goals.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <RefreshCw className="h-4 w-4 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong>Rebalance if needed</strong> - If any allocation drifts by more than 5%, sell/buy to restore target percentages.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Pro tip:</strong> Set a calendar reminder to review your portfolio every January. 
            Most investors who stick to their plan outperform those who trade frequently.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
