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
import PortfolioSummary from "@/pages/PortfolioSummary";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { UpgradeModal } from "@/components/UpgradeModal";
import { usePortfolioLimit } from "@/hooks/usePortfolioLimit";

type Step = "landing" | "assessment" | "recommendation" | "summary" | "workspace";

interface PortfolioAsset {
  id?: string;
  symbol: string;
  name: string;
  allocation: number;
  color: string;
  risk?: "Low" | "Medium" | "High";
  rationale?: string;
  assetClass?: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>("landing");
  const [riskScore, setRiskScore] = useState<number>(0);
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [timeline, setTimeline] = useState<string>("");
  const [generatedPortfolio, setGeneratedPortfolio] = useState<PortfolioAsset[]>([]);
  const [portfolioName, setPortfolioName] = useState<string>("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { user } = useAuth();
  const { canGenerate, checkAndIncrementLimit } = usePortfolioLimit();

  const handleGetStarted = () => {
    if (!user) {
      window.location.href = '/signup';
      return;
    }
    setCurrentStep("assessment");
  };

  const handleAssessmentComplete = (score: number, experience: "beginner" | "intermediate" | "advanced", timelineValue: string) => {
    setRiskScore(score);
    setExperienceLevel(experience);
    setTimeline(timelineValue);
    setCurrentStep("recommendation");
  };

  const handleStartInvesting = async () => {
    if (!canGenerate) {
      setShowUpgradeModal(true);
      return;
    }
    
    const success = await checkAndIncrementLimit();
    if (success) {
      setCurrentStep("summary");
    } else {
      setShowUpgradeModal(true);
    }
  };

  const handleStartWorkspace = (portfolio: PortfolioAsset[], name: string) => {
    setGeneratedPortfolio(portfolio);
    setPortfolioName(name);
    setCurrentStep("workspace");
  };

  const handleBackToRecommendation = () => {
    setCurrentStep("recommendation");
  };

  const handleBackToLanding = () => {
    setCurrentStep("landing");
  };

  const handleBackToAssessment = () => {
    setCurrentStep("assessment");
  };

  const handleBackToSummary = () => {
    setCurrentStep("summary");
  };

  // Show the portfolio builder flow when user clicks get started
  if (currentStep === "assessment") {
    return (
      <AuthGuard>
        <RiskAssessment onComplete={handleAssessmentComplete} onBack={handleBackToLanding} />
      </AuthGuard>
    );
  }

  if (currentStep === "recommendation") {
    return (
      <AuthGuard>
        <PortfolioRecommendation 
          riskScore={riskScore} 
          onStartInvesting={handleStartInvesting}
          onBack={handleBackToAssessment}
        />
      </AuthGuard>
    );
  }

  if (currentStep === "summary") {
    return (
      <AuthGuard>
        <PortfolioSummary 
          riskScore={riskScore}
          experienceLevel={experienceLevel}
          timeline={timeline}
          onBack={handleBackToRecommendation}
          onCustomize={handleStartWorkspace}
        />
      </AuthGuard>
    );
  }

  if (currentStep === "workspace") {
    return (
      <AuthGuard>
        <PortfolioWorkspace 
          riskScore={riskScore} 
          portfolio={generatedPortfolio}
          portfolioName={portfolioName}
          experienceLevel={experienceLevel}
          timeline={timeline}
          onBack={handleBackToSummary} 
        />
      </AuthGuard>
    );
  }

  // Main landing page
  return (
    <>
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
      <UpgradeModal open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </>
  );
};

export default Index;
