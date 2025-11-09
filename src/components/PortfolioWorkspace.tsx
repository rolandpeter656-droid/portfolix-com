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
  ArrowLeft
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
  
  // Convert portfolio to workspace asset format
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
    // Apply the suggestion to the portfolio
    // This is a simplified implementation
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    console.log("Dismissing suggestion:", suggestionId);
  };

  const handleRefreshSuggestions = () => {
    console.log("Refreshing AI suggestions...");
  };

  // Generate contextual AI suggestions based on actual portfolio
  const generateContextualSuggestions = () => {
    const suggestions = [];
    const totalAllocation = assets.reduce((sum, asset) => sum + asset.allocation, 0);
    
    // Check for tech concentration
    const techAssets = assets.filter(a => 
      ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA'].includes(a.symbol)
    );
    const techAllocation = techAssets.reduce((sum, a) => sum + a.allocation, 0);
    
    if (techAllocation > 30) {
      suggestions.push({
        id: 'tech-concentration',
        type: 'rebalance' as const,
        title: 'Reduce Tech Concentration',
        description: `Your technology allocation is ${techAllocation.toFixed(1)}%, which may be above optimal. Consider diversifying into other sectors.`,
        impact: '+0.3% expected return, -2.1% volatility',
        confidence: 85,
        priority: 'high' as const,
        data: { currentTech: techAllocation, recommendedTech: 25 }
      });
    }
    
    // Check for Bitcoin allocation
    const hasBitcoin = assets.some(a => a.symbol === 'BTC' || a.symbol === 'BTCUSD');
    if (!hasBitcoin && riskScore > 40) {
      suggestions.push({
        id: 'bitcoin-allocation',
        type: 'bitcoin' as const,
        title: 'Consider Bitcoin Allocation',
        description: 'Based on your risk profile, adding 3-7% Bitcoin allocation could provide diversification benefits and potential inflation hedge.',
        impact: 'Enhanced diversification, potential long-term growth',
        confidence: 72,
        priority: 'medium' as const,
        data: { recommendedAllocation: '3-7%', assetClass: 'Digital Asset' },
        note: '⚠️ Bitcoin is highly volatile. Only invest what you\'re prepared to hold long-term. PortfoliX provides AI-generated insights, not financial advice.'
      });
    }
    
    // Check for international exposure
    const internationalAssets = assets.filter(a => 
      ['VEA', 'VWO', 'VXUS', 'EFA', 'IEMG'].includes(a.symbol)
    );
    const internationalAllocation = internationalAssets.reduce((sum, a) => sum + a.allocation, 0);
    
    if (internationalAllocation < 15) {
      suggestions.push({
        id: 'international-exposure',
        type: 'addition' as const,
        title: 'Add International Exposure',
        description: 'Consider adding more international stocks for geographic diversification and growth potential.',
        impact: '+0.8% expected return, +1.2% volatility',
        confidence: 78,
        priority: 'medium' as const,
        data: { currentInternational: internationalAllocation, recommended: 20 }
      });
    }
    
    // Portfolio balance check
    if (Math.abs(totalAllocation - 100) > 1) {
      suggestions.push({
        id: 'balance-portfolio',
        type: 'optimization' as const,
        title: 'Rebalance Portfolio Allocation',
        description: `Your portfolio allocation totals ${totalAllocation.toFixed(1)}%. Adjust allocations to reach 100% for optimal diversification.`,
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
    <section className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="icon-md" />
                </button>
              )}
              <h1 className="text-title text-foreground">Portfolio Workspace</h1>
              <Separator orientation="vertical" className="h-6" />
              <Input 
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                className="w-64 font-medium"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Load
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <GitCompare className="h-4 w-4" />
                Compare
              </Button>
            </div>
          </div>

          {/* Real-time Collaboration Stub */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Collaborators:</span>
            </div>
            <div className="flex items-center gap-2">
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

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel: Asset Allocation Editor */}
          <AssetAllocationEditor 
            assets={assets}
            onAssetsChange={setAssets}
          />

          {/* Right Panel: AI Suggestions */}
          <AISuggestionPanel 
            suggestions={contextualSuggestions}
            onApplySuggestion={handleApplySuggestion}
            onDismissSuggestion={handleDismissSuggestion}
            onRefreshSuggestions={handleRefreshSuggestions}
          />
        </div>
      </div>
    </section>
  );
};