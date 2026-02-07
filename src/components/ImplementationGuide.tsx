import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  ArrowRight,
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
  { name: "Bamboo", url: "https://app.investbamboo.com/", description: "Access US stocks from Nigeria & Africa", region: "🌍" },
  { name: "Trove Finance", url: "https://www.trovefinance.com/", description: "Commission-free US investing for Africans", region: "🌍" },
  { name: "Fidelity", url: "https://www.fidelity.com/", description: "Commission-free ETF trading in the US", region: "🇺🇸" },
  { name: "Vanguard", url: "https://www.vanguard.com/", description: "Low-cost index funds and ETFs", region: "🇺🇸" },
  { name: "Tiger Brokers", url: "https://www.itiger.com/sg/", description: "Global investing for Asian markets", region: "🌏" },
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
            Implement this portfolio at any of these brokerages. We've included platforms for investors in Nigeria, Asia, and the United States:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ml-8">
            {BROKERAGES.map((broker) => (
              <a
                key={broker.name}
                href={broker.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <span className="text-lg leading-none mt-0.5">{broker.region}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {broker.name}
                    </span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{broker.description}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="ml-8 mt-3 space-y-1">
            <p className="text-xs text-muted-foreground">📍 Nigerian investors: Use Bamboo or Trove Finance</p>
            <p className="text-xs text-muted-foreground">📍 Asian investors: Use Tiger Brokers</p>
            <p className="text-xs text-muted-foreground">📍 US investors: Use Fidelity or Vanguard</p>
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

        {/* Pro tip */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Pro tip:</strong> Set a calendar reminder to review your portfolio every January. 
            Most investors who stick to their plan outperform those who trade frequently.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">
            ⚠️ PortfoliX is not affiliated with any of these brokerages. We do not receive compensation for recommending these platforms. Always verify that your chosen brokerage is properly licensed in your jurisdiction before opening an account.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
