import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Users, 
  FileText, 
  TrendingUp,
  BarChart3,
  PieChart,
  Globe,
  Flag,
  Plus,
  Edit3,
  MessageSquare,
  History,
  CheckCircle2
} from "lucide-react";

interface PortfolioWorkspaceProps {
  riskScore: number;
}

export const PortfolioWorkspace = ({ riskScore }: PortfolioWorkspaceProps) => {
  const [activePortfolio, setActivePortfolio] = useState("Global Growth");

  const portfolios = [
    { 
      id: "global-growth", 
      name: "Global Growth", 
      status: "In Progress", 
      region: "Global",
      lastEdited: "2 hours ago",
      collaborators: 3
    },
    { 
      id: "nigeria-conservative", 
      name: "Nigeria Conservative", 
      status: "Under Review", 
      region: "Nigeria",
      lastEdited: "1 day ago",
      collaborators: 2
    },
    { 
      id: "us-tech-focused", 
      name: "US Tech Focused", 
      status: "Draft", 
      region: "US",
      lastEdited: "3 days ago",
      collaborators: 1
    }
  ];

  return (
    <section className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Portfolio Workspace</h1>
              <p className="text-muted-foreground mt-1">
                Collaborate with AI to build and refine investment portfolios
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Assistant Active
              </Badge>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Portfolio List Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Active Portfolios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {portfolios.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      activePortfolio === portfolio.name 
                        ? "bg-primary/10 border-primary" 
                        : "hover:bg-accent"
                    }`}
                    onClick={() => setActivePortfolio(portfolio.name)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{portfolio.name}</h4>
                      <div className="flex items-center gap-1">
                        {portfolio.region === "Global" && <Globe className="h-3 w-3" />}
                        {portfolio.region === "Nigeria" && <Flag className="h-3 w-3" />}
                        {portfolio.region === "US" && <Flag className="h-3 w-3" />}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Badge 
                        variant={portfolio.status === "In Progress" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {portfolio.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {portfolio.lastEdited} • {portfolio.collaborators} collaborators
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Workspace */}
          <div className="lg:col-span-3 space-y-6">
            {/* Portfolio Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{activePortfolio}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Risk Score: {Math.round(riskScore)}% • Last updated 2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Comments (3)
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      History
                    </Button>
                    <Button size="sm" className="flex items-center gap-2">
                      <Edit3 className="h-4 w-4" />
                      Edit Portfolio
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Collaboration Panel */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Collaboration Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">AI Assistant</p>
                        <p className="text-xs text-muted-foreground">Analyzing market data</p>
                      </div>
                    </div>
                    <Badge variant="default" className="text-xs">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        You
                      </div>
                      <div>
                        <p className="font-medium text-sm">Portfolio Manager</p>
                        <p className="text-xs text-muted-foreground">Lead collaborator</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">Online</Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Recent Activity</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>AI suggested US Tech allocation increase</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Edit3 className="h-4 w-4 text-primary" />
                        <span>You modified risk parameters</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span>New comment on bond allocation</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Portfolio Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-accent rounded-lg">
                      <PieChart className="h-6 w-6 text-primary mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Asset Classes</p>
                      <p className="font-bold">7</p>
                    </div>
                    <div className="text-center p-3 bg-accent rounded-lg">
                      <TrendingUp className="h-6 w-6 text-success mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Expected Return</p>
                      <p className="font-bold">10.2%</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">US Stocks</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">International</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Bonds</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Alternatives</span>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    View Detailed Allocation
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Action Center */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <Brain className="h-6 w-6 text-primary" />
                    <span className="font-medium">Get AI Suggestions</span>
                    <span className="text-xs text-muted-foreground text-center">
                      Let AI analyze and recommend improvements
                    </span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <Edit3 className="h-6 w-6 text-primary" />
                    <span className="font-medium">Manual Adjustments</span>
                    <span className="text-xs text-muted-foreground text-center">
                      Fine-tune allocations manually
                    </span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <span className="font-medium">Review & Approve</span>
                    <span className="text-xs text-muted-foreground text-center">
                      Finalize portfolio for deployment
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};