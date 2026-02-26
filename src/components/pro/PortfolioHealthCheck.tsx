import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Info,
  Lock,
  Crown,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DriftItem {
  asset: string;
  target: number;
  actual: number;
  drift: number;
  action: "REDUCE" | "INCREASE";
}

interface PortfolioHealthCheckProps {
  isPro: boolean;
  onUpgrade?: () => void;
  onScrollToEditor?: () => void;
  onScrollToProSection?: () => void;
}

export const PortfolioHealthCheck = ({
  isPro,
  onUpgrade,
  onScrollToEditor,
  onScrollToProSection,
}: PortfolioHealthCheckProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<{ drift_details: DriftItem[] }[]>([]);
  const [hasHoldings, setHasHoldings] = useState<boolean | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (isPro && user && !hasFetched) {
      fetchData();
    }
  }, [isPro, user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [alertsRes, holdingsRes] = await Promise.all([
        supabase
          .from("rebalance_alerts")
          .select("drift_details")
          .eq("user_id", user.id)
          .gte("created_at", sevenDaysAgo.toISOString())
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("portfolio_holdings")
          .select("id")
          .eq("user_id", user.id)
          .limit(1),
      ]);

      const parsedAlerts = (alertsRes.data || []).map((row) => ({
        drift_details: (Array.isArray(row.drift_details)
          ? row.drift_details
          : []) as unknown as DriftItem[],
      }));

      setAlerts(parsedAlerts);
      setHasHoldings((holdingsRes.data?.length ?? 0) > 0);
      setHasFetched(true);
    } catch (err) {
      console.error("Error fetching health check:", err);
    } finally {
      setLoading(false);
    }
  };

  // Not Pro — locked state
  if (!isPro) {
    return (
      <Card className="border border-border">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">Portfolio Health Check</span>
            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
              <Crown className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          </div>
          {onUpgrade && (
            <Button variant="ghost" size="sm" onClick={onUpgrade} className="text-xs text-primary">
              Upgrade
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border border-border">
        <CardContent className="p-4">
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Pro but no holdings saved yet
  if (hasHoldings === false) {
    return (
      <Card className="border border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium">Set up drift detection</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onScrollToEditor}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Enter holdings <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Has alerts — amber warning
  const allDrifts = alerts.flatMap((a) => a.drift_details);

  if (allDrifts.length > 0) {
    return (
      <Card className="border border-amber-500/20 bg-amber-500/5">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-semibold text-amber-300">Rebalancing recommended</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onScrollToProSection}
              className="text-xs text-primary"
            >
              View Full Analysis <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allDrifts.slice(0, 4).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 text-xs bg-muted/50 rounded-md px-2 py-1"
              >
                {item.action === "REDUCE" ? (
                  <ArrowDownCircle className="h-3 w-3 text-red-400" />
                ) : (
                  <ArrowUpCircle className="h-3 w-3 text-green-400" />
                )}
                <span className="font-medium">{item.asset}</span>
                <span className="text-muted-foreground">
                  {item.actual}% → {item.target}%
                </span>
              </div>
            ))}
            {allDrifts.length > 4 && (
              <span className="text-xs text-muted-foreground self-center">
                +{allDrifts.length - 4} more
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // No alerts — all good
  return (
    <Card className="border border-green-500/20 bg-green-500/5">
      <CardContent className="p-4 flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-green-400" />
        <span className="text-sm font-medium text-green-300">
          Portfolio on track — no rebalancing needed
        </span>
      </CardContent>
    </Card>
  );
};
