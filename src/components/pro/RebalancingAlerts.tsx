import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Scale, ArrowUpCircle, ArrowDownCircle, CheckCircle2, Lock, RefreshCw, Bell, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PortfolioAllocation {
  asset: string;
  percentage: number;
}

interface DriftItem {
  asset: string;
  target: number;
  actual: number;
  drift: number;
  action: "REDUCE" | "INCREASE";
}

interface RebalanceAlert {
  id: string;
  drift_details: DriftItem[];
  created_at: string;
  email_sent: boolean;
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
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<RebalanceAlert[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchAlerts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from("rebalance_alerts")
        .select("id, drift_details, created_at, email_sent")
        .eq("user_id", user.id)
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      const parsed: RebalanceAlert[] = (data || []).map((row) => ({
        id: row.id,
        drift_details: (Array.isArray(row.drift_details)
          ? row.drift_details
          : []) as unknown as DriftItem[],
        created_at: row.created_at ?? "",
        email_sent: row.email_sent ?? false,
      }));

      setAlerts(parsed);
      setHasFetched(true);
    } catch (err) {
      console.error("Error fetching rebalance alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPro && user && !hasFetched) {
      fetchAlerts();
    }
  }, [isPro, user]);

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

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

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
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="border border-border rounded-lg p-3 sm:p-4 space-y-3"
              >
                <div className="text-xs text-muted-foreground">
                  {formatDate(alert.created_at)}
                </div>
                <div className="space-y-2">
                  {alert.drift_details.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {item.action === "REDUCE" ? (
                          <ArrowDownCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                        ) : (
                          <ArrowUpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                        )}
                        <div>
                          <div className="font-medium text-sm">{item.asset}</div>
                          <div className="text-xs text-muted-foreground">
                            Target {item.target}% → You have {item.actual}% → {item.action} by {Math.abs(item.drift)}%
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={`uppercase text-xs ${
                          item.action === "REDUCE"
                            ? "bg-red-900/30 text-red-400 hover:bg-red-900/40"
                            : "bg-green-900/30 text-green-400 hover:bg-green-900/40"
                        }`}
                      >
                        {item.action}
                      </Badge>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Update your holdings in Portfolio Settings to refresh this analysis.
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-sm text-green-400 font-medium">
              Your portfolio is on track. No rebalancing needed right now.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
