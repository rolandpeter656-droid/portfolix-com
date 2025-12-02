import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  Shield, 
  PieChart, 
  BarChart3, 
  ArrowUpRight,
  Settings,
  Bell,
  User,
  LogOut,
  Home
} from "lucide-react";

export default function AIDashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      // Store intended destination for post-auth redirect
      sessionStorage.setItem("redirectAfterAuth", "/dashboard");
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/7695f634-65fb-45d3-801d-359be5d4a29b.png" 
              alt="PortfoliX" 
              className="h-8 w-auto"
            />
            <span className="font-sans-bold text-xl text-foreground">PortfoliX</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-sans-bold text-foreground mb-2">
            Welcome back{user.email ? `, ${user.email.split('@')[0]}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your portfolio performance.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-card border-border hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <Badge className="bg-success/20 text-success border-success/30">+12.4%</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Portfolio Value</p>
            <p className="text-2xl font-sans-bold text-foreground">$248,593.00</p>
          </Card>

          <Card className="p-6 bg-gradient-card border-border hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <Badge className="bg-success/20 text-success border-success/30">+8.2%</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Monthly Return</p>
            <p className="text-2xl font-sans-bold text-success">+$18,432.50</p>
          </Card>

          <Card className="p-6 bg-gradient-card border-border hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-warning" />
              </div>
              <Badge className="bg-warning/20 text-warning border-warning/30">Moderate</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Risk Score</p>
            <p className="text-2xl font-sans-bold text-foreground">6.2 / 10</p>
          </Card>

          <Card className="p-6 bg-gradient-card border-border hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/30">Optimized</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Active Portfolios</p>
            <p className="text-2xl font-sans-bold text-foreground">3</p>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Allocation */}
          <Card className="lg:col-span-2 p-6 bg-gradient-card border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-sans-bold text-foreground">Portfolio Allocation</h2>
              <Button variant="ghost" size="sm" className="text-primary">
                View Details <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "US Stocks", value: 40, color: "bg-primary" },
                { name: "Bonds", value: 25, color: "bg-success" },
                { name: "International", value: 20, color: "bg-warning" },
                { name: "Crypto", value: 15, color: "bg-destructive" },
              ].map((item) => (
                <div key={item.name} className="text-center">
                  <div className="relative h-24 w-24 mx-auto mb-3">
                    <div className={`absolute inset-0 rounded-full ${item.color}/20`}></div>
                    <div 
                      className={`absolute inset-2 rounded-full ${item.color} flex items-center justify-center`}
                      style={{ opacity: item.value / 100 + 0.3 }}
                    >
                      <span className="text-lg font-bold text-white">{item.value}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.name}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Insights */}
          <Card className="p-6 bg-gradient-card border-border">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-sans-bold text-foreground">AI Insights</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <p className="text-sm font-medium text-success mb-1">Bullish Signal</p>
                <p className="text-xs text-muted-foreground">
                  Tech sector showing strong momentum. Consider increasing allocation.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm font-medium text-warning mb-1">Rebalance Alert</p>
                <p className="text-xs text-muted-foreground">
                  Portfolio drift detected. Review bond allocation.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium text-primary mb-1">Opportunity</p>
                <p className="text-xs text-muted-foreground">
                  Emerging markets showing value. AI confidence: 87%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col gap-2"
            onClick={() => navigate("/app/builder")}
          >
            <PieChart className="h-6 w-6" />
            <span>Build Portfolio</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
            <BarChart3 className="h-6 w-6" />
            <span>Market Analysis</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col gap-2"
            onClick={() => navigate("/referrals")}
          >
            <User className="h-6 w-6" />
            <span>Referrals</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
            <Settings className="h-6 w-6" />
            <span>Settings</span>
          </Button>
        </div>
      </main>
    </div>
  );
}
