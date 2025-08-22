import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Target, TrendingUp, DollarSign } from "lucide-react";

interface DocumentationContentProps {
  activeSection: string;
}

export function DocumentationContent({ activeSection }: DocumentationContentProps) {
  const renderContent = () => {
    switch (activeSection) {
      case "getting-started-how-it-works":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">How PortfoliX Works</h1>
              <p className="text-muted-foreground text-lg">
                PortfoliX simplifies investing by offering AI-driven portfolio management tailored to your goals.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">1. Set Your Goals</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Complete our risk assessment to determine your investment profile and financial objectives.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">2. Choose Package</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Select from our curated investment packages: Retirement, High-Growth, or Passive Income.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">3. Start Investing</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Fund your account and watch your personalized portfolio grow with automated rebalancing.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>AI-powered portfolio optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Automatic rebalancing and tax-loss harvesting</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Low fees and transparent pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>24/7 portfolio monitoring</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "getting-started-quick-start":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Quick Start Guide</h1>
              <p className="text-muted-foreground text-lg">
                Get started with PortfoliX in just a few simple steps.
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  <strong>Coming Soon:</strong> Step-by-step guide to setting up your first portfolio, 
                  from account creation to making your first investment.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "getting-started-account-setup":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Account Setup</h1>
              <p className="text-muted-foreground text-lg">
                Learn how to configure your PortfoliX account for optimal performance.
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  <strong>Coming Soon:</strong> Detailed instructions for account verification, 
                  linking bank accounts, and setting up automatic deposits.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "packages-retirement":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Retirement Package</h1>
              <Badge className="mb-4">Conservative Growth</Badge>
              <p className="text-muted-foreground text-lg">
                Build long-term wealth with our retirement-focused investment strategy.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Package Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div><strong>Target Return:</strong> 6-8% annually</div>
                <div><strong>Risk Level:</strong> Low to Moderate</div>
                <div><strong>Time Horizon:</strong> 10+ years</div>
                <div><strong>Asset Allocation:</strong> 60% Stocks, 35% Bonds, 5% Alternatives</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  <strong>Coming Soon:</strong> Detailed breakdown of retirement planning strategies, 
                  tax advantages, and portfolio composition.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "packages-high-growth":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">High-Growth Package</h1>
              <Badge className="mb-4">Aggressive Growth</Badge>
              <p className="text-muted-foreground text-lg">
                Maximize returns with our growth-oriented investment approach.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Package Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div><strong>Target Return:</strong> 12-18% annually</div>
                <div><strong>Risk Level:</strong> High</div>
                <div><strong>Time Horizon:</strong> 5+ years</div>
                <div><strong>Asset Allocation:</strong> 85% Stocks, 10% Growth Assets, 5% Bonds</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  <strong>Coming Soon:</strong> Growth investing strategies, sector allocation, 
                  and risk management techniques.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "packages-passive-income":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Passive Income Package</h1>
              <Badge className="mb-4">Income Focused</Badge>
              <p className="text-muted-foreground text-lg">
                Generate steady income with dividend-focused investments.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Package Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div><strong>Target Income:</strong> 4-6% annually</div>
                <div><strong>Risk Level:</strong> Low to Moderate</div>
                <div><strong>Time Horizon:</strong> Any</div>
                <div><strong>Asset Allocation:</strong> 50% Dividend Stocks, 30% REITs, 20% Bonds</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  <strong>Coming Soon:</strong> Dividend investing strategies, REIT analysis, 
                  and income optimization techniques.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "faq-general":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">General Questions</h1>
              <p className="text-muted-foreground text-lg">
                Common questions about PortfoliX and how it works.
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  <strong>Coming Soon:</strong> Frequently asked questions about our platform, 
                  services, and investment philosophy.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "faq-investing":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Investing Questions</h1>
              <p className="text-muted-foreground text-lg">
                Technical questions about our investment strategies and processes.
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  <strong>Coming Soon:</strong> Detailed answers about portfolio construction, 
                  rebalancing, tax strategies, and market volatility.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "faq-account":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Account & Billing</h1>
              <p className="text-muted-foreground text-lg">
                Questions about account management, fees, and billing.
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  <strong>Coming Soon:</strong> Information about account setup, fee structure, 
                  billing cycles, and account management features.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome to PortfoliX Documentation</h1>
              <p className="text-muted-foreground text-lg">
                Select a topic from the sidebar to get started.
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>What would you like to learn about?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Getting Started</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn the basics of how PortfoliX works
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Investment Packages</h3>
                    <p className="text-sm text-muted-foreground">
                      Explore our curated investment strategies
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">FAQ</h3>
                    <p className="text-sm text-muted-foreground">
                      Find answers to common questions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl">
      {renderContent()}
    </div>
  );
}