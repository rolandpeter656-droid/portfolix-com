import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PieChart, Clock, TrendingUp, ChevronRight, Trash2 } from "lucide-react";
import { SavedPortfolio } from "@/hooks/useSavedPortfolios";
import { format } from "date-fns";

interface SavedPortfolioCardProps {
  portfolio: SavedPortfolio;
  onView: (portfolio: SavedPortfolio) => void;
  onDelete: (portfolioId: string) => void;
}

const getRiskLabel = (riskScore: number) => {
  if (riskScore <= 25) return { label: "Conservative", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" };
  if (riskScore <= 50) return { label: "Moderate", color: "bg-green-500/10 text-green-600 border-green-500/20" };
  if (riskScore <= 75) return { label: "Growth", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" };
  return { label: "Aggressive", color: "bg-red-500/10 text-red-600 border-red-500/20" };
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const SavedPortfolioCard = ({ portfolio, onView, onDelete }: SavedPortfolioCardProps) => {
  const riskInfo = getRiskLabel(portfolio.risk_score);
  const topAssets = portfolio.assets.slice(0, 3);

  return (
    <Card className="group glass-card glass-glow-hover cursor-pointer">
      <CardContent className="p-4 sm:p-6" onClick={() => onView(portfolio)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="h-5 w-5 text-primary flex-shrink-0" />
              <h3 className="font-semibold text-foreground truncate">
                {portfolio.portfolio_name}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline" className={riskInfo.color}>
                {riskInfo.label}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {portfolio.timeline}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-foreground">
                {formatCurrency(portfolio.investment_amount)}
              </span>
              <span className="text-xs text-muted-foreground">invested</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {topAssets.map((asset) => (
                <Badge
                  key={asset.symbol}
                  variant="secondary"
                  className="text-xs font-mono"
                  style={{ 
                    backgroundColor: `${asset.color}15`,
                    borderColor: `${asset.color}40`,
                    color: asset.color
                  }}
                >
                  {asset.symbol} ({asset.allocation}%)
                </Badge>
              ))}
              {portfolio.assets.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{portfolio.assets.length - 3} more
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              Created {format(new Date(portfolio.created_at), "MMM d, yyyy")}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(portfolio.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
