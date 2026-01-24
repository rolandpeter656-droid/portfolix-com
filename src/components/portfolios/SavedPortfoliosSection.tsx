import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  PieChart, 
  Plus, 
  FolderOpen,
  AlertCircle,
  Crown,
  Sparkles
} from "lucide-react";
import { useSavedPortfolios, SavedPortfolio } from "@/hooks/useSavedPortfolios";
import { usePortfolioLimit } from "@/hooks/usePortfolioLimit";
import { SavedPortfolioCard } from "./SavedPortfolioCard";
import { PortfolioLimitModal } from "./PortfolioLimitModal";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SavedPortfoliosSectionProps {
  onViewPortfolio: (portfolio: SavedPortfolio) => void;
  onCreateNew: () => void;
}

export const SavedPortfoliosSection = ({ 
  onViewPortfolio, 
  onCreateNew 
}: SavedPortfoliosSectionProps) => {
  const { portfolios, loading, deletePortfolio, getRemainingPortfolios, FREE_PORTFOLIO_LIMIT } = useSavedPortfolios();
  const { subscriptionPlan } = usePortfolioLimit();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<string | null>(null);

  const remainingPortfolios = getRemainingPortfolios(subscriptionPlan);
  const isAtLimit = remainingPortfolios === 0 && subscriptionPlan !== "pro";

  const handleCreateNew = () => {
    if (isAtLimit) {
      setShowLimitModal(true);
    } else {
      onCreateNew();
    }
  };

  const handleDeleteConfirm = async () => {
    if (portfolioToDelete) {
      await deletePortfolio(portfolioToDelete);
      setPortfolioToDelete(null);
    }
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Your Built Portfolios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg bg-white/5" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <PieChart className="h-5 w-5 text-primary" />
              Your Built Portfolios
            </CardTitle>
            {subscriptionPlan !== "pro" && (
              <Badge variant="outline" className="text-xs border-white/20">
                {portfolios.length}/{FREE_PORTFOLIO_LIMIT} used
              </Badge>
            )}
            {subscriptionPlan === "pro" && (
              <Badge className="bg-gradient-primary text-white text-xs">
                <Crown className="h-3 w-3 mr-1" />
                Unlimited
              </Badge>
            )}
          </div>
          <Button 
            onClick={handleCreateNew}
            size="sm"
            className={isAtLimit ? "bg-muted text-muted-foreground hover:bg-muted" : "bg-gradient-primary hover:opacity-90"}
          >
            <Plus className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Create New</span>
            <span className="sm:hidden">New</span>
          </Button>
        </CardHeader>
        <CardContent>
          {portfolios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-full mb-4">
                <FolderOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No portfolios yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-4">
                Create your first AI-powered portfolio and it will appear here for easy access.
              </p>
              <Button onClick={handleCreateNew} className="bg-gradient-primary hover:opacity-90">
                <Sparkles className="h-4 w-4 mr-2" />
                Create Your First Portfolio
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {portfolios.map((portfolio) => (
                  <SavedPortfolioCard
                    key={portfolio.id}
                    portfolio={portfolio}
                    onView={onViewPortfolio}
                    onDelete={setPortfolioToDelete}
                  />
                ))}
              </div>

              {isAtLimit && (
                <div className="mt-6 p-4 glass-stat border border-warning/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Portfolio limit reached
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      You've used all 5 free portfolios. Upgrade to Pro for unlimited portfolio creation.
                    </p>
                    <Button 
                      variant="link" 
                      className="h-auto p-0 text-primary mt-1"
                      onClick={() => setShowLimitModal(true)}
                    >
                      View upgrade options →
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <PortfolioLimitModal 
        open={showLimitModal} 
        onClose={() => setShowLimitModal(false)} 
      />

      <AlertDialog open={!!portfolioToDelete} onOpenChange={() => setPortfolioToDelete(null)}>
        <AlertDialogContent className="glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Portfolio?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this portfolio from your saved portfolios.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="glass-button">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
