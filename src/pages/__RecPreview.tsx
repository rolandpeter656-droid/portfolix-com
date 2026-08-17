import PortfolioSummary from "./PortfolioSummary";
const RecPreview = () => (
  <PortfolioSummary
    riskScore={55}
    experienceLevel="beginner"
    timeline="10+ years"
    onboardingGoal="growth"
    onboardingTimeline="10+"
    onboardingRisk="medium"
    onBack={() => {}}
    onCustomize={() => {}}
  />
);
export default RecPreview;
