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
  | "referral_signup";

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

  portfolioSaved: (portfolioId: string, portfolioType: string) =>
    trackEvent("portfolio_saved", { portfolio_id: portfolioId, portfolio_type: portfolioType }),

  userReturned: (daysSinceLastVisit: number) =>
    trackEvent("user_returned", { days_since_last_visit: daysSinceLastVisit }),

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
};

export default analytics;
