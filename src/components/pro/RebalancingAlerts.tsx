import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Scale, ArrowUpCircle, ArrowDownCircle, MinusCircle, Lock, RefreshCw, Bell } from "lucide-react";
import { useProFeatures } from "@/hooks/useProFeatures";

interface PortfolioAllocation {
  asset: string;
  percentage: number;
}

interface RebalancingAlertsProps {
  portfolio: PortfolioAllocation[];
  isPro: boolean;
  riskTolerance?: string;
  onUpgrade?: () => void;
}

export const RebalancingAlerts = ({
  portfolio,
  isPro,
  riskTolerance,
  onUpgrade
}: RebalancingAlertsProps) => {
  const { loading, rebalancingActions, getRebalancingAlerts } = useProFeatures();
  const [hasFetched, setHasFetched] = useState(false);

  const fetchAlerts = async () => {
    if (isPro && portfolio.length > 0) {
      await getRebalancingAlerts(portfolio, riskTolerance);
      setHasFetched(true);
    }
  };

  useEffect(() => {
    if (isPro && portfolio.length > 0 && !hasFetched) {
      fetchAlerts();
    }
  }, [isPro, portfolio]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "buy": return <ArrowUpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />;
      case "sell": return <ArrowDownCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />;
      case "hold": return <MinusCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />;
      default: return <Scale className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "buy": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "sell": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "hold": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (!isPro) {
    return (
      <Card className="border-dashed border-2 border-muted">
        <CardContent className="p-4 sm:p-6 text-center">
          <Lock className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-semibold text-base sm:text-lg mb-2">Rebalancing Alerts</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4">
            Get AI-generated rebalancing recommendations with Pro
          </p>
          {onUpgrade && (
            <Button onClick={onUpgrade} size="sm" className="text-sm">
              <Bell className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Scale className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Rebalancing Alerts
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchAlerts}
            disabled={loading}
            className="h-8 px-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : rebalancingActions.length > 0 ? (
          <div className="space-y-3">
            {rebalancingActions.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getActionIcon(item.action)}
                  <div>
                    <div className="font-medium text-sm sm:text-base">{item.asset}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.current_weight}% → {item.target_weight}%
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${getActionColor(item.action)} uppercase text-xs`}>
                    {item.action}
                  </Badge>
                  {item.amount_change && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.amount_change}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Scale className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Click refresh to check for rebalancing needs</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
