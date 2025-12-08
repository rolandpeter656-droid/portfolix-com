import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Mail, MessageCircle, ArrowLeft, Gift, Users, Coins } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";

interface UserData {
  referral_code: string | null;
  credit_balance: number;
  referral_count: number;
}

interface Referral {
  id: string;
  referee_email: string;
  created_at: string;
  status: string;
}

const ReferralDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchReferrals();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("users")
      .select("referral_code, credit_balance, referral_count")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to load your referral information.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!data) {
      // User record doesn't exist - create it now
      console.log("User record not found, creating...");
      
      // Generate referral code and create user record
      const { data: newCode } = await supabase.rpc('generate_unique_referral_code');
      
      if (!newCode) {
        toast({
          title: "Error",
          description: "Failed to generate referral code. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          user_id: user.id,
          phone_number: user.phone || "",
          referral_code: newCode,
          credit_balance: 0,
          referral_count: 0,
        })
        .select("referral_code, credit_balance, referral_count")
        .single();

      if (insertError) {
        console.error("Error creating user record:", insertError);
        toast({
          title: "Error",
          description: "Failed to set up your referral account. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      setUserData(newUser);
      toast({
        title: "Success",
        description: "Your referral code has been generated!",
      });
      setLoading(false);
      return;
    }

    setUserData(data);
    setLoading(false);
  };

  const fetchReferrals = async () => {
    if (!user || !userData?.referral_code) return;

    const { data, error } = await supabase
      .from("referrals")
      .select("id, referee_email, created_at, status")
      .eq("referrer_code", userData.referral_code)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching referrals:", error);
    } else {
      setReferrals(data || []);
    }
  };

  // Refetch referrals when userData is loaded
  useEffect(() => {
    if (userData?.referral_code) {
      fetchReferrals();
    }
  }, [userData?.referral_code]);

  const copyToClipboard = () => {
    if (userData?.referral_code) {
      const referralUrl = `${window.location.origin}/signup?ref=${userData.referral_code}`;
      navigator.clipboard.writeText(referralUrl);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard.",
      });
    }
  };

  const shareViaWhatsApp = () => {
    if (userData?.referral_code) {
      const referralUrl = `${window.location.origin}/signup?ref=${userData.referral_code}`;
      const message = `Join me on PortfoliX and get 5 free credits! Build AI-powered investment portfolios. ${referralUrl}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  const shareViaEmail = () => {
    if (userData?.referral_code) {
      const referralUrl = `${window.location.origin}/signup?ref=${userData.referral_code}`;
      const subject = "Join PortfoliX and Get Free Credits!";
      const body = `Hi there!\n\nI've been using PortfoliX to build AI-powered investment portfolios, and I think you'd love it too!\n\nSign up using my referral link and you'll get 5 free credits to start with:\n${referralUrl}\n\nLet me know what you think!`;
      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  const shareViaTwitter = () => {
    if (userData?.referral_code) {
      const referralUrl = `${window.location.origin}/signup?ref=${userData.referral_code}`;
      const tweet = `Building smarter portfolios with @PortfoliX AI 🚀\n\nJoin me and get 5 free credits: ${referralUrl}`;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Navigation Bar */}
        <nav className="border-b border-border bg-card">
          <div className="container mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <h1 className="text-xl sm:text-2xl font-sans-bold text-gradient">PortfoliX</h1>
              <div className="w-16 sm:w-24"></div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-6xl">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-2">Referral Dashboard</h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Share PortfoliX with friends and earn credits together
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="bg-gradient-card border-border hover-lift">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Coins className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  Credit Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-primary">{userData?.credit_balance || 0}</div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Available credits</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border hover-lift">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
                  Total Referrals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-success">{userData?.referral_count || 0}</div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Friends joined</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border hover-lift">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Gift className="h-3 w-3 sm:h-4 sm:w-4 text-warning" />
                  Credits Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-warning">
                  {(userData?.referral_count || 0) * 10}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">From referrals</p>
              </CardContent>
            </Card>
          </div>

          {/* Referral Code Card */}
          <Card className="mb-8 border-primary/20 bg-gradient-card shadow-glow">
            <CardHeader>
              <CardTitle className="text-title flex items-center gap-2">
                <Share2 className="h-6 w-6 text-primary" />
                Your Referral Code
              </CardTitle>
              <CardDescription>
                Share this code or link with friends. You'll both earn credits when they sign up!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Referral Code Display */}
              <div className="flex items-center justify-center p-8 bg-secondary/50 rounded-lg border border-border">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2 tracking-wider">
                    {userData?.referral_code || "Loading..."}
                  </div>
                  <p className="text-caption">10 credits per successful referral</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={copyToClipboard}
                  disabled={!userData?.referral_code}
                  className="flex-1 min-w-[200px] bg-primary hover:bg-primary-glow text-primary-foreground"
                  size="lg"
                  type="button"
                >
                  <Copy className="mr-2 h-5 w-5" />
                  Copy Link
                </Button>
                <Button
                  onClick={shareViaWhatsApp}
                  disabled={!userData?.referral_code}
                  variant="outline"
                  className="flex-1 min-w-[150px] border-success/50 hover:bg-success/10"
                  size="lg"
                  type="button"
                >
                  <MessageCircle className="mr-2 h-5 w-5 text-success" />
                  WhatsApp
                </Button>
                <Button
                  onClick={shareViaEmail}
                  disabled={!userData?.referral_code}
                  variant="outline"
                  className="flex-1 min-w-[150px] border-primary/50 hover:bg-primary/10"
                  size="lg"
                  type="button"
                >
                  <Mail className="mr-2 h-5 w-5 text-primary" />
                  Email
                </Button>
                <Button
                  onClick={shareViaTwitter}
                  disabled={!userData?.referral_code}
                  variant="outline"
                  className="flex-1 min-w-[150px] border-primary/50 hover:bg-primary/10"
                  size="lg"
                  type="button"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Twitter
                </Button>
              </div>

              {/* Reward Info */}
              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <Gift className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">How it works</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Share your referral link with friends</li>
                    <li>• They sign up and get 5 welcome credits</li>
                    <li>• You earn 10 credits for each successful referral</li>
                    <li>• Use credits for premium features and portfolio exports</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral List */}
          <Card className="border-border bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-title">Your Referrals</CardTitle>
              <CardDescription>
                People who joined using your referral code
              </CardDescription>
            </CardHeader>
            <CardContent>
              {referrals.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No referrals yet. Start sharing your code to earn credits!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {referrals.map((referral) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {referral.referee_email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Joined {new Date(referral.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            referral.status === "activated"
                              ? "bg-success/20 text-success"
                              : "bg-warning/20 text-warning"
                          }`}
                        >
                          {referral.status}
                        </span>
                        <span className="text-sm font-semibold text-primary">+10</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ReferralDashboard;
