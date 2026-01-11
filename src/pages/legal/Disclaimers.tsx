import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  InvestmentDisclaimer,
  RegulatoryDisclosure,
  RiskDisclosure,
  AIDisclosure,
  MethodologyDisclosure,
  ConflictDisclosure,
  EligibilityDisclosure
} from "@/components/compliance";
import { Shield, AlertTriangle, FileText } from "lucide-react";

const Disclaimers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Legal Disclosures & Disclaimers
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Important legal information about PortfoliX services, our regulatory status, 
              and your responsibilities as a user.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last Updated: January 2026
            </p>
          </div>

          {/* Quick Summary */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quick Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong className="text-foreground">What PortfoliX Is:</strong> An investment 
                research, education, and portfolio-modeling platform.
              </p>
              <p>
                <strong className="text-foreground">What PortfoliX Is NOT:</strong> A registered 
                investment adviser, broker-dealer, or asset manager. We do not provide 
                personalized financial advice.
              </p>
              <p>
                <strong className="text-foreground">Key Point:</strong> All portfolio models 
                are hypothetical and for educational purposes only. You are solely responsible 
                for your investment decisions.
              </p>
            </CardContent>
          </Card>

          {/* Core Investment Disclaimer */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              Investment Disclaimer
            </h2>
            <InvestmentDisclaimer variant="full" showLearnMore={false} />
          </section>

          {/* All Disclosure Sections */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Regulatory Status
              </h2>
              <RegulatoryDisclosure variant="full" />
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Risk Disclosures
              </h2>
              <RiskDisclosure variant="full" />
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                AI & Automation
              </h2>
              <AIDisclosure variant="full" />
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Portfolio Methodology
              </h2>
              <MethodologyDisclosure variant="full" />
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Conflicts of Interest
              </h2>
              <ConflictDisclosure variant="full" />
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                User Eligibility & Jurisdiction
              </h2>
              <EligibilityDisclosure variant="full" />
            </section>
          </div>

          {/* Contact Information */}
          <Card className="mt-12 border-border">
            <CardHeader>
              <CardTitle>Questions or Concerns</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                If you have any questions about these disclosures or our services, 
                please contact us:
              </p>
              <p>
                <strong className="text-foreground">Email:</strong>{" "}
                <a href="mailto:legal@portfolixapps.com" className="text-primary hover:underline">
                  legal@portfolixapps.com
                </a>
              </p>
              <p>
                <strong className="text-foreground">General Inquiries:</strong>{" "}
                <a href="mailto:peter@portfolixapps.com" className="text-primary hover:underline">
                  peter@portfolixapps.com
                </a>
              </p>
              <p className="pt-4 text-xs">
                <strong>Note:</strong> We strongly recommend that users consult with a 
                qualified securities attorney or licensed financial professional for 
                specific legal or investment advice.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Disclaimers;
