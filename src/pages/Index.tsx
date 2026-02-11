import { useState, useEffect } from "react";
import { Navigation } from "@/components/landing/Navigation";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { TeamSection } from "@/components/landing/TeamSection";
import { Footer } from "@/components/landing/Footer";
import { PricingPlans } from "@/components/PricingPlans";
import { SimplifiedOnboarding, generatePortfolioFromAnswers } from "@/components/SimplifiedOnboarding";
import { PortfolioWorkspace } from "@/components/PortfolioWorkspace";
import PortfolioSummary from "@/pages/PortfolioSummary";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { UpgradeModal } from "@/components/UpgradeModal";
import { usePortfolioLimit } from "@/hooks/usePortfolioLimit";
import { analytics } from "@/lib/analytics/index";

type Step = "landing" | "onboarding" | "summary" | "workspace";

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

  // Track returning users on mount
  useEffect(() => {
    const checkReturningUser = async () => {
      const { data: { user: authUser } } = await (await import("@/integrations/supabase/client")).supabase.auth.getUser();
      if (authUser) {
        const lastVisitKey = `last_visit_${authUser.id}`;
        const lastVisit = localStorage.getItem(lastVisitKey);
        if (lastVisit) {
          const daysSince = Math.floor((Date.now() - parseInt(lastVisit)) / (1000 * 60 * 60 * 24));
          if (daysSince >= 1) {
            analytics.userReturned(daysSince);
          }
        }
        localStorage.setItem(lastVisitKey, Date.now().toString());
      }
    };
    checkReturningUser();
  }, []);

  // Check if coming from builder choice
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('start') === 'builder' && user) {
      setCurrentStep("onboarding");
    }
  }, [user]);

  const handleGetStarted = async () => {
    // Track signup started before any navigation
    await analytics.signupStarted();
    
    if (!user) {
      window.location.href = '/signup';
      return;
    }
    setCurrentStep("onboarding");
  };

  const handleOnboardingComplete = async (answers: any) => {
    try {
      const portfolioData = generatePortfolioFromAnswers(answers);
      setRiskScore(portfolioData.riskScore);
      setExperienceLevel(portfolioData.experienceLevel);
      setTimeline(portfolioData.timeline);
      
      // Check portfolio limit
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
    } catch (error) {
      console.error("Error generating portfolio:", error);
    }
  };

  const handleStartWorkspace = (portfolio: PortfolioAsset[], name: string) => {
    setGeneratedPortfolio(portfolio);
    setPortfolioName(name);
    setCurrentStep("workspace");
  };

  const handleBackToLanding = () => {
    setCurrentStep("landing");
  };

  const handleBackToOnboarding = () => {
    setCurrentStep("onboarding");
  };

  const handleBackToSummary = () => {
    setCurrentStep("summary");
  };

  // Show simplified onboarding flow
  if (currentStep === "onboarding") {
    return (
      <AuthGuard>
        <SimplifiedOnboarding 
          onComplete={handleOnboardingComplete} 
          onBack={handleBackToLanding} 
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
          onBack={handleBackToOnboarding}
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
