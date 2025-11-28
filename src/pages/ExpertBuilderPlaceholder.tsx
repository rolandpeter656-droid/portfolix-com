import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Grip, Sparkles } from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";
import { useToast } from "@/hooks/use-toast";

const ExpertBuilderPlaceholder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      toast({
        title: "You're on the list!",
        description: "We'll notify you when the Expert Builder launches.",
      });
      setEmail("");
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Thanks for your interest!",
        description: "We'll notify you when the Expert Builder launches.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/app/builder")}
          className="mb-8 hover:bg-muted/50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Builder Choice
        </Button>

        <div className="max-w-3xl mx-auto">
          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 rounded-full bg-orange-500/10 w-fit">
                <Grip className="h-12 w-12 text-orange-500" />
              </div>
              <CardTitle className="text-3xl mb-2">Expert Drag & Drop Builder</CardTitle>
              <CardDescription className="text-lg">
                Coming soon — Be the first to know when it launches
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  We're building an advanced drag-and-drop portfolio builder for experienced investors who want complete control over their allocations.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mt-8">
                  <div className="p-4 border rounded-lg">
                    <Sparkles className="h-6 w-6 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Visual Interface</h3>
                    <p className="text-sm text-muted-foreground">Drag assets to adjust allocations in real-time</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Sparkles className="h-6 w-6 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Custom Assets</h3>
                    <p className="text-sm text-muted-foreground">Add any stock, ETF, or crypto to your portfolio</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Sparkles className="h-6 w-6 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Advanced Tools</h3>
                    <p className="text-sm text-muted-foreground">Rebalancing, risk analysis, and backtesting</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 text-center">Get Early Access</h3>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="beta-email">Email Address</Label>
                    <Input 
                      id="beta-email"
                      type="email" 
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Joining..." : "Join Beta Waitlist"}
                  </Button>
                </form>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  In the meantime, try our guided builder
                </p>
                <Button variant="outline" onClick={() => navigate("/?start=builder")}>
                  Try Beginner Builder
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpertBuilderPlaceholder;
