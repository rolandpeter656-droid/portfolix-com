import { supabase } from "@/integrations/supabase/client";
import { getOrCreateSessionId } from "./session";

export type AnalyticsEvent =
  | "signup_started"
  | "onboarding_step1_completed"
  | "onboarding_step2_completed"
  | "onboarding_step3_completed"
  | "portfolio_generated"
  | "portfolio_saved"
  | "user_returned"
  | "upgrade_initiated"
  | "upgrade_completed";

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
};

export default analytics;
