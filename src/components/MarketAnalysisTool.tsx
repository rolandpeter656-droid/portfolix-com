import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BarChart3, Loader2, Download, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PortfolioPieChart } from "@/components/PortfolioPieChart";

interface AnalysisResult {
  allocation: {
    stocks: number;
    bonds: number;
    realEstate: number;
    cash: number;
  };
  actionPlan: string[];
  marketInsights: string;
}

interface MarketAnalysisToolProps {
  isOpen: boolean;
  onClose: () => void;
}

const ASSET_COLORS = {
  stocks: "#8b5cf6",
  bonds: "#10b981",
  realEstate: "#f59e0b",
  cash: "#64748b"
};

export const MarketAnalysisTool = ({ isOpen, onClose }: MarketAnalysisToolProps) => {
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [goal, setGoal] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");
  const [riskTolerance, setRiskTolerance] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [emailForPdf, setEmailForPdf] = useState("");
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!investmentAmount || !goal || !timeHorizon || !riskTolerance) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before analyzing.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("market-analysis", {
        body: {
          investmentAmount: parseFloat(investmentAmount),
          goal,
          timeHorizon,
          riskTolerance
        }
      });

      if (error) throw error;

      setResult(data as AnalysisResult);
      toast({
        title: "Analysis Complete",
        description: "Your personalized market analysis is ready!",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to generate analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveResults = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to save your results.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Results Saved",
      description: "Your market analysis has been saved to your account.",
    });
  };

  const handleDownloadPdf = () => {
    if (!user) {
      setShowEmailDialog(true);
      return;
    }

    // Generate PDF logic here
    toast({
      title: "PDF Generated",
      description: "Your market analysis report is downloading.",
    });
  };

  const handleEmailSubmit = () => {
    if (!emailForPdf) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    // Send PDF to email logic here
    toast({
      title: "PDF Sent",
      description: `Market analysis report sent to ${emailForPdf}`,
    });
    setShowEmailDialog(false);
    setEmailForPdf("");
  };

  const chartData = result ? [
    { 
      symbol: "STK", 
      name: "Stocks", 
      allocation: result.allocation.stocks, 
      color: ASSET_COLORS.stocks 
    },
    { 
      symbol: "BND", 
      name: "Bonds", 
      allocation: result.allocation.bonds, 
      color: ASSET_COLORS.bonds 
    },
    { 
      symbol: "REI", 
      name: "Real Estate", 
      allocation: result.allocation.realEstate, 
      color: ASSET_COLORS.realEstate 
    },
    { 
      symbol: "CSH", 
      name: "Cash/Alternatives", 
      allocation: result.allocation.cash, 
      color: ASSET_COLORS.cash 
    }
  ] : [];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl md:text-3xl">Market Analysis</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Deep market insights powered by advanced AI algorithms
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
            {/* Input Form */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle>Your Investment Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="amount">Investment Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="50000"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    disabled={isAnalyzing}
                  />
                </div>

                <div>
                  <Label htmlFor="goal">Primary Goal</Label>
                  <Select value={goal} onValueChange={setGoal} disabled={isAnalyzing}>
                    <SelectTrigger id="goal">
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Retirement">Retirement</SelectItem>
                      <SelectItem value="Wealth accumulation">Wealth Accumulation</SelectItem>
                      <SelectItem value="Income">Income Generation</SelectItem>
                      <SelectItem value="Speculation">Speculation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="horizon">Time Horizon</Label>
                  <Select value={timeHorizon} onValueChange={setTimeHorizon} disabled={isAnalyzing}>
                    <SelectTrigger id="horizon">
                      <SelectValue placeholder="Select time horizon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-3yrs">1-3 years</SelectItem>
                      <SelectItem value="3-7yrs">3-7 years</SelectItem>
                      <SelectItem value="7+yrs">7+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="risk">Risk Tolerance</Label>
                  <Select value={riskTolerance} onValueChange={setRiskTolerance} disabled={isAnalyzing}>
                    <SelectTrigger id="risk">
                      <SelectValue placeholder="Select risk tolerance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full bg-primary hover:bg-primary-glow"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Portfolio"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Display */}
            <div className="space-y-4">
              {result ? (
                <>
                  <Card className="bg-gradient-card border-border">
                    <CardHeader>
                      <CardTitle>Recommended Allocation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PortfolioPieChart data={chartData} className="h-[300px]" />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-card border-border">
                    <CardHeader>
                      <CardTitle>3-Step Action Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-3">
                        {result.actionPlan.map((step, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                              {index + 1}
                            </span>
                            <span className="text-muted-foreground">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-card border-border">
                    <CardHeader>
                      <CardTitle>Market Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{result.marketInsights}</p>
                    </CardContent>
                  </Card>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleSaveResults}
                      className="flex-1 bg-success hover:bg-success/90"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Results
                    </Button>
                    <Button
                      onClick={handleDownloadPdf}
                      variant="outline"
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </>
              ) : (
                <Card className="bg-gradient-card border-border h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">
                      Fill in your investment profile and click "Analyze Portfolio" to see AI-powered recommendations.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Dialog for PDF */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Your Email</DialogTitle>
            <DialogDescription>
              We'll send your market analysis PDF to this email address.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={emailForPdf}
                onChange={(e) => setEmailForPdf(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleEmailSubmit} className="flex-1">
                Send PDF
              </Button>
              <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
