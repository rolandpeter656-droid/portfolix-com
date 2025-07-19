import { useState } from "react";
import { Hero } from "@/components/Hero";
import { RiskAssessment } from "@/components/RiskAssessment";
import { PortfolioRecommendation } from "@/components/PortfolioRecommendation";
import { PortfolioWorkspace } from "@/components/PortfolioWorkspace";

type Step = "hero" | "assessment" | "recommendation" | "workspace";

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

  const handleStartWorkspace = () => {
    setCurrentStep("workspace");
  };

  return (
    <div className="min-h-screen">
      {currentStep === "hero" && <Hero onGetStarted={handleGetStarted} />}
      {currentStep === "assessment" && <RiskAssessment onComplete={handleAssessmentComplete} />}
      {currentStep === "recommendation" && <PortfolioRecommendation riskScore={riskScore} onStartWorkspace={handleStartWorkspace} />}
      {currentStep === "workspace" && <PortfolioWorkspace riskScore={riskScore} />}
    </div>
  );
};

export default Index;
