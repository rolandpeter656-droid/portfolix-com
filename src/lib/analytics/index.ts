import { supabase } from "@/integrations/supabase/client";
import { getOrCreateSessionId } from "./session";

export type AnalyticsEvent =
  | "signup_started"
  | "country_selected"
  | "onboarding_step1_completed"
  | "onboarding_step2_completed"
  | "onboarding_step3_completed"
  | "portfolio_generated"
  | "portfolio_saved"
  | "user_returned"
  | "upgrade_initiated"
  | "upgrade_completed"
  | "money_map_viewed"
  | "money_map_card_generated"
  | "money_map_shared"
  | "referral_link_clicked"
  | "referral_signup"
  | "ng_brokerage_link_clicked"
  | "ng_local_sleeve_generated";

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

export async function trackEvent(
  eventName: AnalyticsEvent,
  properties?: EventProperties
): Promise<void> {
  try {
    const sessionId = getOrCreateSessionId();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("analytics_events")
      .insert({
        event_name: eventName,
        user_id: user?.id || null,
        session_id: sessionId,
        properties: properties || {},
      });

    if (error) {
      console.error("[Analytics] tracking error:", error);
    }

    // Dev-mode debug: broadcast to in-browser panel
    if (typeof window !== "undefined") {
      const country =
        (properties as any)?.country ??
        (typeof localStorage !== "undefined"
          ? localStorage.getItem("px_user_country") || undefined
          : undefined);
      const detail = {
        eventName,
        properties: properties || {},
        country,
        userId: user?.id || null,
        sessionId,
        timestamp: new Date().toISOString(),
        insertError: error?.message,
      };
      window.dispatchEvent(new CustomEvent("px:analytics", { detail }));
      if (localStorage.getItem("px_analytics_debug") === "1") {
        // eslint-disable-next-line no-console
        console.log("[Analytics]", eventName, detail);
      }
    }
  } catch (error) {
    console.error("[Analytics] failed to track:", error);
    // Analytics failures should never break the app
  }
}

export const analytics = {
  signupStarted: () =>
    trackEvent("signup_started"),

  countrySelected: (country: string) =>
    trackEvent("country_selected", { country }),

  onboardingStep1Completed: (goal: string) =>
    trackEvent("onboarding_step1_completed", { goal }),

  onboardingStep2Completed: (timeline: string) =>
    trackEvent("onboarding_step2_completed", { timeline }),

  onboardingStep3Completed: (riskLevel: string) =>
    trackEvent("onboarding_step3_completed", { risk_level: riskLevel }),

  portfolioGenerated: (portfolioType: string) =>
    trackEvent("portfolio_generated", { portfolio_type: portfolioType }),

  portfolioSaved: (portfolioId: string, portfolioType: string, country?: string) =>
    trackEvent("portfolio_saved", {
      portfolio_id: portfolioId,
      portfolio_type: portfolioType,
      ...(country ? { country } : {}),
    }),

  userReturned: (daysSinceLastVisit: number, country?: string) =>
    trackEvent("user_returned", {
      days_since_last_visit: daysSinceLastVisit,
      ...(country ? { country } : {}),
    }),

  upgradeInitiated: (plan: string) =>
    trackEvent("upgrade_initiated", { plan }),

  upgradeCompleted: (plan: string, amount: number) =>
    trackEvent("upgrade_completed", { plan, amount, currency: "USD" }),

  moneyMapViewed: (archetype: string) =>
    trackEvent("money_map_viewed", { archetype }),

  moneyMapCardGenerated: (archetype: string) =>
    trackEvent("money_map_card_generated", { archetype }),

  moneyMapShared: (
    source: "whatsapp" | "x" | "copy" | "download",
    archetype: string
  ) => trackEvent("money_map_shared", { source, archetype }),

  referralLinkClicked: (referrerId: string) =>
    trackEvent("referral_link_clicked", { referrer_id: referrerId }),

  referralSignup: (referrerId: string) =>
    trackEvent("referral_signup", { referrer_id: referrerId }),

  ngBrokerageLinkClicked: (broker: string, ticker: string) =>
    trackEvent("ng_brokerage_link_clicked", { broker, ticker }),

  ngLocalSleeveGenerated: (
    riskProfile: string,
    holdingsCount: number,
    localSleevePct: number
  ) =>
    trackEvent("ng_local_sleeve_generated", {
      country: "Nigeria",
      risk_profile: riskProfile,
      holdings_count: holdingsCount,
      local_sleeve_pct: localSleevePct,
    }),
};

export default analytics;
