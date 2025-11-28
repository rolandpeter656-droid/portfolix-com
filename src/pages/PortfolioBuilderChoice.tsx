import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Grip, ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";

const PortfolioBuilderChoice = () => {
  const navigate = useNavigate();

  const handleBeginnerFlow = () => {
    navigate("/?start=builder");
  };

  const handleExpertFlow = () => {
    navigate("/app/builder/expert");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-8 hover:bg-muted/50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-headline mb-4">
            Choose Your Portfolio Builder
          </h1>
          <p className="text-body text-muted-foreground">
            Select the experience that matches your investing expertise
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Beginner Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-primary/50" onClick={handleBeginnerFlow}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Beginner</CardTitle>
              <CardDescription className="text-base">
                Guided templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-center">
                AI-powered questionnaire that builds a personalized portfolio based on your goals, risk tolerance, and timeline.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Step-by-step guided flow
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  AI-generated portfolios
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Professional templates
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Perfect for first-time investors
                </li>
              </ul>
              <Button className="w-full mt-4" size="lg">
                Start Guided Builder
              </Button>
            </CardContent>
          </Card>

          {/* Expert Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-primary/50" onClick={handleExpertFlow}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 rounded-full bg-orange-500/10 w-fit">
                <Grip className="h-8 w-8 text-orange-500" />
              </div>
              <CardTitle className="text-2xl">Expert</CardTitle>
              <CardDescription className="text-base">
                Drag & Drop Builder
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-center">
                Full control with drag-and-drop interface. Build custom portfolios from scratch with advanced allocation tools.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">✓</span>
                  Visual drag & drop interface
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">✓</span>
                  Custom asset allocation
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">✓</span>
                  Advanced rebalancing tools
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">✓</span>
                  For experienced investors
                </li>
              </ul>
              <Button variant="outline" className="w-full mt-4 border-orange-500 text-orange-500 hover:bg-orange-500/10" size="lg">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PortfolioBuilderChoice;
