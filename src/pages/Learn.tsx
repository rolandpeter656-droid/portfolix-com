import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { EducationalGlossary } from "@/components/EducationalGlossary";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Learn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Page loaded
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24">
        <div className="mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/")}
            className="bg-card/50 backdrop-blur-sm border-border hover:bg-card"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Investment Education</h1>
            <p className="text-lg text-muted-foreground">
              Learn the key concepts you need to become a confident investor
            </p>
          </div>
          
          <EducationalGlossary showStrategies={true} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Learn;
