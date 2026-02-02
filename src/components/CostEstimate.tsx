import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Asset {
  symbol: string;
  name: string;
  allocation: number;
}

interface CostEstimateProps {
  portfolio: Asset[];
  investmentAmount: number;
}

// Expense ratios for common ETFs
const EXPENSE_RATIOS: Record<string, number> = {
  VTI: 0.03,
  VXUS: 0.07,
  BND: 0.03,
  VNQ: 0.12,
  VIG: 0.06,
  VYM: 0.06,
  SCHD: 0.06,
  VUG: 0.04,
  VGT: 0.10,
  QQQ: 0.20,
  GLD: 0.40,
  SHY: 0.15,
  BITO: 0.95,
  ESGV: 0.09,
  VSGX: 0.12,
  VCEB: 0.12,
  ICLN: 0.40,
};

export const CostEstimate = ({ portfolio, investmentAmount }: CostEstimateProps) => {
  // Calculate weighted average expense ratio
  const calculateAverageExpenseRatio = () => {
    let weightedSum = 0;
    let totalWeight = 0;

    portfolio.forEach((asset) => {
      const expenseRatio = EXPENSE_RATIOS[asset.symbol] || 0.10; // Default 0.10% if unknown
      weightedSum += expenseRatio * (asset.allocation / 100);
      totalWeight += asset.allocation / 100;
    });

    return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(2) : "0.10";
  };

  const avgExpenseRatio = calculateAverageExpenseRatio();
  const annualFees = (investmentAmount * parseFloat(avgExpenseRatio)) / 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Expected Costs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-card rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Trading Commissions</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">Most major brokerages (Fidelity, Schwab, Vanguard, E*TRADE) offer commission-free ETF trades.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-2xl font-bold text-success">$0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Most brokerages offer free ETF trades
            </p>
          </div>

          <div className="p-4 bg-gradient-card rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Annual Management Fees</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">These fees are built into fund prices and deducted automatically. You won't receive a separate bill.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-2xl font-bold text-foreground">~{avgExpenseRatio}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              ≈ {formatCurrency(annualFees)}/year on {formatCurrency(investmentAmount)}
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> These low-cost index funds charge minimal fees compared to actively managed funds (which typically charge 0.5-1.5% annually). Over time, lower fees mean more of your returns stay in your pocket.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
