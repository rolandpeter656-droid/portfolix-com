import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { EducationalGlossary } from "@/components/EducationalGlossary";
import { analytics } from "@/lib/analytics";
import { useEffect } from "react";

const Learn = () => {
  useEffect(() => {
    analytics.pageView("learn");
    analytics.glossaryViewed();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24">
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
