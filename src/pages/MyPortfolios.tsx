import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Crown, Plus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthGuard } from "@/components/AuthGuard";
import { SavedPortfoliosSection, SavedPortfolioView } from "@/components/portfolios";
import { SavedPortfolio } from "@/hooks/useSavedPortfolios";
import { usePortfolioLimit } from "@/hooks/usePortfolioLimit";
import { useSavedPortfolios } from "@/hooks/useSavedPortfolios";
import portfolioLogo from "@/assets/portfolio-logo.png";

const MyPortfoliosContent = () => {
  const navigate = useNavigate();
  const { subscriptionPlan } = usePortfolioLimit();
  const { portfolios, FREE_PORTFOLIO_LIMIT } = useSavedPortfolios();
  const [viewingPortfolio, setViewingPortfolio] = useState<SavedPortfolio | null>(null);

  const handleCreateNew = () => {
    navigate("/?start=builder");
  };

  if (viewingPortfolio) {
    return (
      <SavedPortfolioView
        portfolio={viewingPortfolio}
        onBack={() => setViewingPortfolio(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-nav border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img src={portfolioLogo} alt="PortfoliX" className="h-6 sm:h-8 w-auto" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  Your Built Portfolios
                </h1>
                <p className="text-sm text-muted-foreground">
                  {subscriptionPlan === "pro" ? (
                    "Unlimited portfolios with Pro"
                  ) : (
                    `${portfolios.length}/${FREE_PORTFOLIO_LIMIT} portfolios used on Free plan`
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {subscriptionPlan === "pro" ? (
                <Badge className="bg-gradient-primary text-white flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Pro
                </Badge>
              ) : (
                <Badge variant="secondary">Free Plan</Badge>
              )}
              <Button 
                onClick={handleCreateNew}
                className="hidden sm:flex bg-gradient-primary hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create New
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-6xl relative z-10">
        <SavedPortfoliosSection
          onViewPortfolio={setViewingPortfolio}
          onCreateNew={handleCreateNew}
        />
      </main>
    </div>
  );
};

const MyPortfolios = () => {
  return (
    <AuthGuard>
      <MyPortfoliosContent />
    </AuthGuard>
  );
};

export default MyPortfolios;
