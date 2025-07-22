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
  Plus
} from "lucide-react";

interface Asset {
  id: string;
  symbol: string;
  name: string;
  allocation: number;
  color: string;
  risk: "Low" | "Medium" | "High";
  rationale?: string;
}

interface PortfolioWorkspaceProps {
  riskScore: number;
}

export const PortfolioWorkspace = ({ riskScore }: PortfolioWorkspaceProps) => {
  const [portfolioName, setPortfolioName] = useState("Global Growth Portfolio");
  
  // Calculate Bitcoin allocation based on risk score
  const getBitcoinAllocation = (riskScore: number) => {
    if (riskScore <= 3) return 2; // Beginner (Low Risk): 1–3%
    if (riskScore <= 6) return 5; // Intermediate (Medium Risk): 3–7%
    return 10; // Advanced (High Risk): 7–15%
  };

  const bitcoinAllocation = getBitcoinAllocation(riskScore);
  
  const [assets, setAssets] = useState<Asset[]>([
    { id: "1", symbol: "AAPL", name: "Apple Inc.", allocation: 13, color: "#3b82f6", risk: "Medium" },
    { id: "2", symbol: "MSFT", name: "Microsoft Corp.", allocation: 10, color: "#ef4444", risk: "Medium" },
    { id: "3", symbol: "GOOGL", name: "Alphabet Inc.", allocation: 8, color: "#22c55e", risk: "Medium" },
    { id: "4", symbol: "VTI", name: "Vanguard Total Stock Market ETF", allocation: 18, color: "#f59e0b", risk: "Low" },
    { id: "5", symbol: "BND", name: "Vanguard Total Bond Market ETF", allocation: 23, color: "#8b5cf6", risk: "Low" },
    { id: "6", symbol: "VEA", name: "Vanguard FTSE Europe ETF", allocation: 16, color: "#06b6d4", risk: "Medium" },
    { 
      id: "7", 
      symbol: "BTC", 
      name: "Bitcoin", 
      allocation: bitcoinAllocation, 
      color: "#f97316", 
      risk: "High",
      rationale: "Bitcoin is a decentralized digital asset with high long-term growth potential. Its inclusion improves diversification and provides hedge against fiat currency depreciation."
    },
  ]);

  const [collaborators] = useState([
    { id: "1", name: "You", status: "online", role: "Portfolio Manager" },
    { id: "2", name: "AI Assistant", status: "active", role: "AI Analyst" },
    { id: "3", name: "John Smith", status: "online", role: "Risk Analyst" },
  ]);

  const totalAllocation = assets.reduce((sum, asset) => sum + asset.allocation, 0);

  const handleApplySuggestion = (suggestion: any) => {
    // This would contain the logic to apply AI suggestions
    console.log("Applying suggestion:", suggestion);
    // For now, just show a toast or update state based on suggestion type
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    console.log("Dismissing suggestion:", suggestionId);
  };

  const handleRefreshSuggestions = () => {
    console.log("Refreshing AI suggestions...");
  };

  return (
    <section className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">Portfolio Workspace</h1>
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
            onApplySuggestion={handleApplySuggestion}
            onDismissSuggestion={handleDismissSuggestion}
            onRefreshSuggestions={handleRefreshSuggestions}
          />
        </div>
      </div>
    </section>
  );
};