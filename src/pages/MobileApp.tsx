import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Smartphone, Download } from "lucide-react";
import { Link } from "react-router-dom";

const MobileApp = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("mobile_waitlist")
        .insert({ email });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already registered",
            description: "This email is already on our mobile app waitlist.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success!",
          description: "You'll be notified when our mobile apps launch.",
        });
        setEmail("");
      }
    } catch (error) {
      console.error("Error joining mobile waitlist:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-bold">PortfoliX</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-6">
                  <Smartphone className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Download className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              PortfoliX in Your{" "}
              <span className="text-gradient bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Pocket
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              We're building iOS and Android apps to make investing even easier. 
              Sign up to be notified when they launch.
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Native Mobile Experience</h3>
              <p className="text-muted-foreground">Optimized for iOS and Android with native performance</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5V9a7 7 0 11-5 6.93" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Offline Access</h3>
              <p className="text-muted-foreground">View your portfolios even without internet connection</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5V9a7 7 0 11-5 6.93" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Push Notifications</h3>
              <p className="text-muted-foreground">Stay updated with market changes and portfolio insights</p>
            </div>
          </div>

          {/* Signup Form */}
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Get Notified at Launch</CardTitle>
              <CardDescription>
                Be among the first to experience PortfoliX on mobile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing Up..." : "Notify Me at Launch"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Coming Soon Badge */}
          <div className="mt-12">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>Coming Soon to App Store & Google Play</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MobileApp;