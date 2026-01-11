import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthGuard } from "@/components/AuthGuard";
import { SavedPortfoliosSection, SavedPortfolioView } from "@/components/portfolios";
import { SavedPortfolio } from "@/hooks/useSavedPortfolios";
import { usePortfolioLimit } from "@/hooks/usePortfolioLimit";

const MyPortfoliosContent = () => {
  const navigate = useNavigate();
  const { subscriptionPlan } = usePortfolioLimit();
  const [viewingPortfolio, setViewingPortfolio] = useState<SavedPortfolio | null>(null);

  const handleCreateNew = () => {
    // Navigate directly to risk assessment flow, bypassing builder choice
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">My Portfolios</h1>
                <p className="text-sm text-muted-foreground">
                  View and manage your saved portfolios
                </p>
              </div>
            </div>
            {subscriptionPlan === "pro" ? (
              <Badge className="bg-gradient-primary text-white flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Pro
              </Badge>
            ) : (
              <Badge variant="secondary">Free Plan</Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-6xl">
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
