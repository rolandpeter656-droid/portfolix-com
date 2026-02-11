// Re-export everything from the new analytics module
export { analytics, trackEvent, type AnalyticsEvent } from "./analytics/index";
export { analytics as default } from "./analytics/index";
export { getOrCreateSessionId } from "./analytics/session";

// Legacy exports kept for backward compatibility
export const getStoredEvents = () => [];
export const getFunnelMetrics = () => ({
  totalEvents: 0,
  uniqueSessions: 0,
  uniqueUsers: 0,
  funnel: {
    pageViews: 0,
    onboardingStarted: 0,
    onboardingCompleted: 0,
    portfolioGenerated: 0,
    portfolioSaved: 0,
    proUpgradeInitiated: 0,
    proUpgradeCompleted: 0,
  },
  conversionRates: {
    startToComplete: "0%",
    completeToSave: "0%",
    saveToUpgrade: "0%",
  },
});
