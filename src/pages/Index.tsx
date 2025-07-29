import { useState } from "react";
import { Navigation } from "@/components/landing/Navigation";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { TeamSection } from "@/components/landing/TeamSection";
import { Footer } from "@/components/landing/Footer";
import { PricingPlans } from "@/components/PricingPlans";
import { RiskAssessment } from "@/components/RiskAssessment";
import { PortfolioRecommendation } from "@/components/PortfolioRecommendation";
import { PortfolioWorkspace } from "@/components/PortfolioWorkspace";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";

type Step = "landing" | "assessment" | "recommendation" | "workspace";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>("landing");
  const [riskScore, setRiskScore] = useState<number>(0);
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (!user) {
      window.location.href = '/signup';
      return;
    }
    setCurrentStep("assessment");
  };

  const handleAssessmentComplete = (score: number) => {
    setRiskScore(score);
    setCurrentStep("recommendation");
  };

  const handleStartWorkspace = () => {
    setCurrentStep("workspace");
  };

  // Show the portfolio builder flow when user clicks get started
  if (currentStep === "assessment") {
    return (
      <AuthGuard>
        <RiskAssessment onComplete={handleAssessmentComplete} />
      </AuthGuard>
    );
  }

  if (currentStep === "recommendation") {
    return (
      <AuthGuard>
        <PortfolioRecommendation riskScore={riskScore} onStartWorkspace={handleStartWorkspace} />
      </AuthGuard>
    );
  }

  if (currentStep === "workspace") {
    return (
      <AuthGuard>
        <PortfolioWorkspace riskScore={riskScore} />
      </AuthGuard>
    );
  }

  // Main landing page
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection onGetStarted={handleGetStarted} />
      <FeaturesSection />
      <ProductShowcase />
      <div id="pricing">
        <PricingPlans />
      </div>
      <TestimonialsSection />
      <TeamSection />
      <Footer />
    </div>
  );
};

export default Index;
