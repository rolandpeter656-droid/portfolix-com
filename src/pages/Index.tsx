import { useState } from "react";
import { Hero } from "@/components/Hero";
import { RiskAssessment } from "@/components/RiskAssessment";
import { PortfolioRecommendation } from "@/components/PortfolioRecommendation";

type Step = "hero" | "assessment" | "recommendation";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>("hero");
  const [riskScore, setRiskScore] = useState<number>(0);

  const handleGetStarted = () => {
    setCurrentStep("assessment");
  };

  const handleAssessmentComplete = (score: number) => {
    setRiskScore(score);
    setCurrentStep("recommendation");
  };

  return (
    <div className="min-h-screen">
      {currentStep === "hero" && <Hero onGetStarted={handleGetStarted} />}
      {currentStep === "assessment" && <RiskAssessment onComplete={handleAssessmentComplete} />}
      {currentStep === "recommendation" && <PortfolioRecommendation riskScore={riskScore} />}
    </div>
  );
};

export default Index;
