import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AssetAllocationEditor } from "@/components/AssetAllocationEditor";
import { AISuggestionPanel } from "@/components/AISuggestionPanel";
import { 
  Brain, 
  Users, 
  Save, 
  Download, 
  GitCompare,
  TrendingUp,
  Edit3,
  Plus,
  ArrowLeft,
  Menu
} from "lucide-react";

interface Asset {
  id?: string;
  symbol: string;
  name: string;
  allocation: number;
  color: string;
  risk?: "Low" | "Medium" | "High";
  rationale?: string;
  assetClass?: string;
}

interface PortfolioWorkspaceProps {
  riskScore: number;
  portfolio: Asset[];
  portfolioName: string;
  experienceLevel: "beginner" | "intermediate" | "advanced";
  timeline: string;
  onBack?: () => void;
}

export const PortfolioWorkspace = ({ 
  riskScore, 
  portfolio: initialPortfolio, 
  portfolioName: initialName,
  experienceLevel,
  timeline,
  onBack 
}: PortfolioWorkspaceProps) => {
  const [portfolioName, setPortfolioName] = useState(initialName);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const convertToWorkspaceAssets = (portfolio: Asset[]): Asset[] => {
    return portfolio.map((asset, index) => ({
      id: asset.id || `asset-${index}`,
      symbol: asset.symbol,
      name: asset.name,
      allocation: asset.allocation,
      color: asset.color,
      risk: (asset.risk || "Medium") as "Low" | "Medium" | "High",
      rationale: asset.rationale || `${asset.name} provides diversification to the portfolio.`
    }));
  };
  
  const [assets, setAssets] = useState<Asset[]>(convertToWorkspaceAssets(initialPortfolio));

  const [collaborators] = useState([
    { id: "1", name: "You", status: "online", role: "Portfolio Manager" },
    { id: "2", name: "AI Assistant", status: "active", role: "AI Analyst" },
    { id: "3", name: "John Smith", status: "online", role: "Risk Analyst" },
  ]);

  const totalAllocation = assets.reduce((sum, asset) => sum + asset.allocation, 0);

  const handleApplySuggestion = (suggestion: any) => {
    console.log("Applying suggestion:", suggestion);
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    console.log("Dismissing suggestion:", suggestionId);
  };

  const handleRefreshSuggestions = () => {
    console.log("Refreshing AI suggestions...");
  };

  const generateContextualSuggestions = () => {
    const suggestions = [];
    const totalAllocation = assets.reduce((sum, asset) => sum + asset.allocation, 0);
    
    const techAssets = assets.filter(a => 
      ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA'].includes(a.symbol)
    );
    const techAllocation = techAssets.reduce((sum, a) => sum + a.allocation, 0);
    
    if (techAllocation > 30) {
      suggestions.push({
        id: 'tech-concentration',
        type: 'rebalance' as const,
        title: 'Reduce Tech Concentration',
        description: `Your technology allocation is ${techAllocation.toFixed(1)}%, which may be above optimal.`,
        impact: '+0.3% expected return, -2.1% volatility',
        confidence: 85,
        priority: 'high' as const,
        data: { currentTech: techAllocation, recommendedTech: 25 }
      });
    }
    
    const hasBitcoin = assets.some(a => a.symbol === 'BTC' || a.symbol === 'BTCUSD');
    if (!hasBitcoin && riskScore > 40) {
      suggestions.push({
        id: 'bitcoin-allocation',
        type: 'bitcoin' as const,
        title: 'Consider Bitcoin Allocation',
        description: 'Adding 3-7% Bitcoin allocation could provide diversification benefits.',
        impact: 'Enhanced diversification, potential long-term growth',
        confidence: 72,
        priority: 'medium' as const,
        data: { recommendedAllocation: '3-7%', assetClass: 'Digital Asset' },
        note: '⚠️ Bitcoin is highly volatile. Only invest what you can hold long-term.'
      });
    }
    
    if (Math.abs(totalAllocation - 100) > 1) {
      suggestions.push({
        id: 'balance-portfolio',
        type: 'optimization' as const,
        title: 'Rebalance Portfolio Allocation',
        description: `Your portfolio allocation totals ${totalAllocation.toFixed(1)}%. Adjust to reach 100%.`,
        impact: 'Improved diversification',
        confidence: 95,
        priority: 'high' as const,
        data: { currentTotal: totalAllocation, target: 100 }
      });
    }
    
    return suggestions;
  };

  const contextualSuggestions = generateContextualSuggestions();

  return (
    <section className="min-h-[100svh] bg-background">
      {/* Top Navigation */}
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              )}
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-foreground truncate hidden sm:block">Portfolio Workspace</h1>
              <Separator orientation="vertical" className="h-5 sm:h-6 hidden md:block" />
              <Input 
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                className="w-32 sm:w-48 md:w-64 font-medium text-sm h-9"
              />
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs sm:text-sm">
                <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden lg:inline">Save</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs sm:text-sm">
                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden lg:inline">Load</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs sm:text-sm">
                <GitCompare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden lg:inline">Compare</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Actions Menu */}
          {showMobileMenu && (
            <div className="md:hidden flex items-center gap-2 mt-3 pb-1">
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <Save className="h-3.5 w-3.5 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <Download className="h-3.5 w-3.5 mr-1" />
                Load
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <GitCompare className="h-3.5 w-3.5 mr-1" />
                Compare
              </Button>
            </div>
          )}

          {/* Collaborators - Hidden on mobile */}
          <div className="mt-3 sm:mt-4 hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Collaborators:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    collaborator.status === "online" ? "bg-success" : 
                    collaborator.status === "active" ? "bg-primary" : "bg-muted-foreground"
                  }`} />
                  <span className="text-sm">{collaborator.name}</span>
                  <Badge variant="secondary" className="text-xs">{collaborator.role}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 min-h-[calc(100vh-180px)] lg:min-h-[calc(100vh-200px)]">
          {/* Asset Allocation Editor */}
          <div className="order-1">
            <AssetAllocationEditor 
              assets={assets}
              onAssetsChange={setAssets}
              portfolioName={portfolioName}
            />
          </div>

          {/* AI Suggestions */}
          <div className="order-2">
            <AISuggestionPanel 
              suggestions={contextualSuggestions}
              onApplySuggestion={handleApplySuggestion}
              onDismissSuggestion={handleDismissSuggestion}
              onRefreshSuggestions={handleRefreshSuggestions}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
