import { supabase } from "@/integrations/supabase/client";

// Analytics event types for investor metrics
export type AnalyticsEvent = 
  | "page_view"
  | "onboarding_started"
  | "onboarding_step_completed"
  | "onboarding_completed"
  | "portfolio_generated"
  | "portfolio_saved"
  | "portfolio_viewed"
  | "portfolio_customized"
  | "portfolio_exported"
  | "pro_upgrade_initiated"
  | "pro_upgrade_completed"
  | "user_returned"
  | "glossary_viewed"
  | "implementation_guide_viewed"
  | "broker_link_clicked";

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

// Store events in localStorage for demo/development
// In production, this would send to a proper analytics service
const LOCAL_STORAGE_KEY = "portfolix_analytics";

interface StoredEvent {
  event: AnalyticsEvent;
  properties: EventProperties;
  timestamp: string;
  userId?: string;
  sessionId: string;
}

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("portfolix_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("portfolix_session_id", sessionId);
  }
  return sessionId;
};

// Get stored events
export const getStoredEvents = (): StoredEvent[] => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Store event
const storeEvent = (event: StoredEvent) => {
  const events = getStoredEvents();
  events.push(event);
  // Keep last 1000 events
  const trimmed = events.slice(-1000);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trimmed));
};

// Main tracking function
export const trackEvent = async (
  event: AnalyticsEvent,
  properties: EventProperties = {}
): Promise<void> => {
  try {
    // Get current user if authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    const eventData: StoredEvent = {
      event,
      properties: {
        ...properties,
        url: window.location.pathname,
        referrer: document.referrer || undefined,
      },
      timestamp: new Date().toISOString(),
      userId: user?.id,
      sessionId: getSessionId(),
    };

    // Store locally
    storeEvent(eventData);

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics]", event, properties);
    }

    // In production, you would also send to your analytics backend
    // Example: await supabase.from('analytics_events').insert(eventData);
    
  } catch (error) {
    console.error("[Analytics] Error tracking event:", error);
  }
};

// Convenience functions for common events
export const analytics = {
  // Page views
  pageView: (pageName: string) => 
    trackEvent("page_view", { page: pageName }),

  // Onboarding funnel
  onboardingStarted: () => 
    trackEvent("onboarding_started"),
  
  onboardingStepCompleted: (step: number, stepName: string) => 
    trackEvent("onboarding_step_completed", { step, stepName }),
  
  onboardingCompleted: (riskScore: number, timeline: string, experience: string) => 
    trackEvent("onboarding_completed", { riskScore, timeline, experience }),

  // Portfolio actions
  portfolioGenerated: (strategyName: string, riskScore: number) => 
    trackEvent("portfolio_generated", { strategyName, riskScore }),
  
  portfolioSaved: (portfolioId: string, strategyName: string) => 
    trackEvent("portfolio_saved", { portfolioId, strategyName }),
  
  portfolioViewed: (portfolioId: string) => 
    trackEvent("portfolio_viewed", { portfolioId }),
  
  portfolioCustomized: (portfolioId: string) => 
    trackEvent("portfolio_customized", { portfolioId }),
  
  portfolioExported: (format: string) => 
    trackEvent("portfolio_exported", { format }),

  // Conversion events
  proUpgradeInitiated: (source: string) => 
    trackEvent("pro_upgrade_initiated", { source }),
  
  proUpgradeCompleted: (plan: string) => 
    trackEvent("pro_upgrade_completed", { plan }),

  // Engagement
  userReturned: (daysSinceLastVisit: number) => 
    trackEvent("user_returned", { daysSinceLastVisit }),
  
  glossaryViewed: (term?: string) => 
    trackEvent("glossary_viewed", { term }),
  
  implementationGuideViewed: (portfolioName: string) => 
    trackEvent("implementation_guide_viewed", { portfolioName }),
  
  brokerLinkClicked: (broker: string) => 
    trackEvent("broker_link_clicked", { broker }),
};

// Funnel analysis helpers
export const getFunnelMetrics = () => {
  const events = getStoredEvents();
  const now = new Date();
  const last7Days = events.filter(e => {
    const eventDate = new Date(e.timestamp);
    const diffDays = (now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  });

  const uniqueSessions = new Set(last7Days.map(e => e.sessionId)).size;
  const uniqueUsers = new Set(last7Days.filter(e => e.userId).map(e => e.userId)).size;

  const countEvent = (eventName: AnalyticsEvent) => 
    last7Days.filter(e => e.event === eventName).length;

  return {
    totalEvents: last7Days.length,
    uniqueSessions,
    uniqueUsers,
    funnel: {
      pageViews: countEvent("page_view"),
      onboardingStarted: countEvent("onboarding_started"),
      onboardingCompleted: countEvent("onboarding_completed"),
      portfolioGenerated: countEvent("portfolio_generated"),
      portfolioSaved: countEvent("portfolio_saved"),
      proUpgradeInitiated: countEvent("pro_upgrade_initiated"),
      proUpgradeCompleted: countEvent("pro_upgrade_completed"),
    },
    conversionRates: {
      startToComplete: countEvent("onboarding_started") > 0 
        ? (countEvent("onboarding_completed") / countEvent("onboarding_started") * 100).toFixed(1) + "%"
        : "0%",
      completeToSave: countEvent("portfolio_generated") > 0
        ? (countEvent("portfolio_saved") / countEvent("portfolio_generated") * 100).toFixed(1) + "%"
        : "0%",
      saveToUpgrade: countEvent("portfolio_saved") > 0
        ? (countEvent("pro_upgrade_completed") / countEvent("portfolio_saved") * 100).toFixed(1) + "%"
        : "0%",
    }
  };
};

export default analytics;
