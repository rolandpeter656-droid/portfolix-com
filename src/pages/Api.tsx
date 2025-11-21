import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const Api = () => {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);
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

    if (!captchaToken) {
      toast({
        title: "Verification required",
        description: "Please complete the captcha verification.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("api_waitlist")
        .insert({ email, company: company || null });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already registered",
            description: "This email is already on our waitlist.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success!",
          description: "You've been added to the waitlist. We'll notify you when the API launches.",
        });
        setEmail("");
        setCompany("");
        setCaptchaToken(null);
        captchaRef.current?.resetCaptcha();
      }
    } catch (error) {
      console.error("Error joining waitlist:", error);
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
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            PortfoliX API{" "}
            <span className="text-muted-foreground">(Coming Soon)</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-12">
            We're building an API to make it easy for brokerages and fintechs to integrate 
            PortfoliX packages. Join the waitlist to be notified at launch.
          </p>

          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Join the Waitlist</CardTitle>
              <CardDescription>
                Be the first to know when our API is ready
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Your Company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                <div className="flex justify-center">
                  <HCaptcha
                    ref={captchaRef}
                    sitekey="c72a67e8-3fb8-4f80-b682-f3c8bff87750"
                    onVerify={(token) => setCaptchaToken(token)}
                    onExpire={() => setCaptchaToken(null)}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !captchaToken}
                >
                  {isLoading ? "Joining..." : "Join Waitlist"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Api;