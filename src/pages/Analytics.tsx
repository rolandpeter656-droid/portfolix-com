import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminGuard } from "@/components/AdminGuard";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, BarChart3, TrendingUp, Users, Activity, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AnalyticsEvent {
  id: string;
  event_name: string;
  user_id: string | null;
  session_id: string | null;
  properties: Record<string, unknown>;
  created_at: string;
}

interface Metrics {
  overview: { totalEvents: number; uniqueUsers: number; uniqueSessions: number; eventsLast7Days: number };
  funnel: {
    signupStarted: number;
    step1Completed: number;
    step2Completed: number;
    step3Completed: number;
    portfolioGenerated: number;
    portfolioSaved: number;
    conversionRates: Record<string, string>;
  };
  retention: { userReturned: number; returnRate: string };
  monetization: { upgradeInitiated: number; upgradeCompleted: number; conversionRate: string };
}

function FunnelStep({ label, count, percentage }: { label: string; count: number; percentage: string | number }) {
  const pct = typeof percentage === "string" ? parseFloat(percentage) : percentage;
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="w-36 sm:w-48 text-xs sm:text-sm text-foreground">{label}</div>
      <div className="flex-1 bg-muted rounded-full h-7 sm:h-8 relative overflow-hidden">
        <div
          className="bg-primary h-full rounded-full flex items-center justify-end pr-2 sm:pr-3 transition-all duration-500"
          style={{ width: `${Math.max(pct, 5)}%` }}
        >
          <span className="text-primary-foreground text-xs font-bold">{pct}%</span>
        </div>
      </div>
      <div className="w-12 sm:w-16 text-right font-bold text-sm text-foreground">{count}</div>
    </div>
  );
}

function calculateMetrics(events: AnalyticsEvent[]): Metrics {
  const now = new Date();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentEvents = events.filter((e) => new Date(e.created_at) > last7Days);

  const eventCounts: Record<string, number> = {};
  events.forEach((e) => {
    eventCounts[e.event_name] = (eventCounts[e.event_name] || 0) + 1;
  });

  const uniqueUsers = new Set(events.filter((e) => e.user_id).map((e) => e.user_id)).size;
  const uniqueSessions = new Set(events.filter((e) => e.session_id).map((e) => e.session_id)).size;

  const signups = eventCounts["signup_started"] || 0;
  const step1 = eventCounts["onboarding_step1_completed"] || 0;
  const step2 = eventCounts["onboarding_step2_completed"] || 0;
  const step3 = eventCounts["onboarding_step3_completed"] || 0;
  const generated = eventCounts["portfolio_generated"] || 0;
  const saved = eventCounts["portfolio_saved"] || 0;
  const upgradeInitiated = eventCounts["upgrade_initiated"] || 0;
  const upgradeCompleted = eventCounts["upgrade_completed"] || 0;
  const returned = eventCounts["user_returned"] || 0;

  const rate = (num: number, denom: number) => (denom > 0 ? ((num / denom) * 100).toFixed(1) : "0");

  return {
    overview: { totalEvents: events.length, uniqueUsers, uniqueSessions, eventsLast7Days: recentEvents.length },
    funnel: {
      signupStarted: signups,
      step1Completed: step1,
      step2Completed: step2,
      step3Completed: step3,
      portfolioGenerated: generated,
      portfolioSaved: saved,
      conversionRates: {
        signupToStep1: rate(step1, signups),
        step1ToStep2: rate(step2, step1),
        step2ToStep3: rate(step3, step2),
        step3ToGenerated: rate(generated, step3),
        generatedToSaved: rate(saved, generated),
      },
    },
    retention: {
      userReturned: returned,
      returnRate: rate(returned, uniqueUsers),
    },
    monetization: {
      upgradeInitiated,
      upgradeCompleted,
      conversionRate: rate(upgradeCompleted, upgradeInitiated),
    },
  };
}

// Cohort = unique users who selected a given country (from country_selected).
// Save rate = share of that cohort that fired portfolio_saved.
// 7-day return rate = share of cohort that fired user_returned in the last 7 days.
interface CohortStats {
  label: string;
  cohortSize: number;
  savedUsers: number;
  saveRate: string;
  returned7dUsers: number;
  return7dRate: string;
  localSleevesGenerated: number;
}

function buildCohortStats(
  events: AnalyticsEvent[],
  matcher: (country: string | undefined) => boolean,
  label: string
): CohortStats {
  const cohort = new Set<string>();
  for (const e of events) {
    if (e.event_name !== "country_selected" || !e.user_id) continue;
    const c = (e.properties as any)?.country as string | undefined;
    if (matcher(c)) cohort.add(e.user_id);
  }

  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  const saved = new Set<string>();
  const returned7d = new Set<string>();
  let localSleeves = 0;
  for (const e of events) {
    if (e.event_name === "portfolio_saved" && e.user_id && cohort.has(e.user_id)) {
      saved.add(e.user_id);
    } else if (
      e.event_name === "user_returned" &&
      e.user_id &&
      cohort.has(e.user_id) &&
      now - new Date(e.created_at).getTime() <= sevenDaysMs
    ) {
      returned7d.add(e.user_id);
    } else if (e.event_name === "ng_local_sleeve_generated") {
      const c = (e.properties as any)?.country as string | undefined;
      if (matcher(c)) localSleeves += 1;
    }
  }

  const rate = (n: number, d: number) => (d > 0 ? ((n / d) * 100).toFixed(1) : "0");
  return {
    label,
    cohortSize: cohort.size,
    savedUsers: saved.size,
    saveRate: rate(saved.size, cohort.size),
    returned7dUsers: returned7d.size,
    return7dRate: rate(returned7d.size, cohort.size),
    localSleevesGenerated: localSleeves,
  };
}

const AnalyticsDashboard = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data, error } = await supabase
          .from("analytics_events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1000);

        if (error) throw error;
        if (data) setEvents(data as unknown as AnalyticsEvent[]);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const countries = useMemo(() => {
    const s = new Set<string>();
    for (const e of events) {
      if (e.event_name === "country_selected") {
        const c = (e.properties as any)?.country;
        if (typeof c === "string" && c) s.add(c);
      }
    }
    return Array.from(s).sort();
  }, [events]);

  const cohortUserIds = useMemo(() => {
    if (countryFilter === "all") return null;
    const set = new Set<string>();
    for (const e of events) {
      if (e.event_name !== "country_selected" || !e.user_id) continue;
      if ((e.properties as any)?.country === countryFilter) set.add(e.user_id);
    }
    return set;
  }, [events, countryFilter]);

  const filteredEvents = useMemo(() => {
    if (countryFilter === "all") return events;
    return events.filter((e) => {
      const propCountry = (e.properties as any)?.country;
      if (typeof propCountry === "string" && propCountry) {
        return propCountry === countryFilter;
      }
      return e.user_id ? cohortUserIds?.has(e.user_id) ?? false : false;
    });
  }, [events, countryFilter, cohortUserIds]);

  const metrics = useMemo(
    () => (filteredEvents.length ? calculateMetrics(filteredEvents) : null),
    [filteredEvents]
  );

  const nigeriaStats = useMemo(
    () => buildCohortStats(events, (c) => c === "Nigeria", "Nigeria"),
    [events]
  );
  const otherStats = useMemo(
    () => buildCohortStats(events, (c) => !!c && c !== "Nigeria", "Other countries"),
    [events]
  );

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminGuard>
    );
  }

  if (!events.length) {
    return (
      <AdminGuard>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-muted-foreground">No analytics data available yet.</p>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">PortfoliX Analytics</h1>
              <p className="text-sm text-muted-foreground">Product metrics & conversion funnel</p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All countries</SelectItem>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Nigeria vs Other cohort comparison */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Cohort comparison — Nigeria vs Other
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Cohorts from <code>country_selected</code>. Save rate = users who
                fired <code>portfolio_saved</code> ÷ cohort. 7-day return rate =
                users with <code>user_returned</code> in the last 7 days ÷ cohort.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[nigeriaStats, otherStats].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg border border-border p-4 bg-muted/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">{s.label}</h3>
                      <span className="text-xs text-muted-foreground">
                        Cohort: {s.cohortSize}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Save rate</div>
                        <div className="text-2xl font-bold text-foreground">{s.saveRate}%</div>
                        <div className="text-xs text-muted-foreground">
                          {s.savedUsers}/{s.cohortSize} users
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">
                          7-day return rate
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          {s.return7dRate}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {s.returned7dUsers}/{s.cohortSize} users
                        </div>
                      </div>
                    </div>
                    {s.label === "Nigeria" && (
                      <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                        Local sleeves generated: {s.localSleevesGenerated}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {!metrics && (
            <p className="text-sm text-muted-foreground mb-8">
              No events for {countryFilter}.
            </p>
          )}

          {metrics && (
          <>
          {/* Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Total Events</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{metrics.overview.totalEvents}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-success" />
                  <span className="text-xs text-muted-foreground">Unique Users</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{metrics.overview.uniqueUsers}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-warning" />
                  <span className="text-xs text-muted-foreground">Sessions</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{metrics.overview.uniqueSessions}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Last 7 Days</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{metrics.overview.eventsLast7Days}</p>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Funnel */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <FunnelStep label="Signup Started" count={metrics.funnel.signupStarted} percentage={100} />
              <FunnelStep label="Goal Selected (Step 1)" count={metrics.funnel.step1Completed} percentage={metrics.funnel.conversionRates.signupToStep1} />
              <FunnelStep label="Timeline Selected (Step 2)" count={metrics.funnel.step2Completed} percentage={metrics.funnel.conversionRates.step1ToStep2} />
              <FunnelStep label="Risk Selected (Step 3)" count={metrics.funnel.step3Completed} percentage={metrics.funnel.conversionRates.step2ToStep3} />
              <FunnelStep label="Portfolio Generated" count={metrics.funnel.portfolioGenerated} percentage={metrics.funnel.conversionRates.step3ToGenerated} />
              <FunnelStep label="Portfolio Saved" count={metrics.funnel.portfolioSaved} percentage={metrics.funnel.conversionRates.generatedToSaved} />
            </CardContent>
          </Card>

          {/* Retention & Monetization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Retention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Users Returned</span>
                  <span className="font-bold text-foreground">{metrics.retention.userReturned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Return Rate</span>
                  <span className="font-bold text-foreground">{metrics.retention.returnRate}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monetization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Upgrade Initiated</span>
                  <span className="font-bold text-foreground">{metrics.monetization.upgradeInitiated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Upgrade Completed</span>
                  <span className="font-bold text-foreground">{metrics.monetization.upgradeCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Conversion Rate</span>
                  <span className="font-bold text-foreground">{metrics.monetization.conversionRate}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AnalyticsDashboard;
