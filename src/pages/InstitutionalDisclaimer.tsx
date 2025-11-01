import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Shield, BookOpen, Database, Scale } from "lucide-react";

export default function InstitutionalDisclaimer() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <Badge variant="outline" className="mb-4 border-amber-500/50 text-amber-600 dark:text-amber-400">
            Legal & Compliance
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            Institutional Compliance & Transparency
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understanding PortfoliX Institutional Models: Methodology, Data Sources, and Legal Framework
          </p>
        </div>

        {/* Primary Disclaimer */}
        <Card className="mb-8 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
              <AlertCircle className="h-5 w-5" />
              Official Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-amber-900/90 dark:text-amber-100/90">
              PortfoliX Institutional Models are AI-generated frameworks inspired by historical corporate 
              investment literature. They are provided for educational use by licensed financial institutions 
              and do not constitute investment advice or portfolio management. All strategies should be 
              reviewed by qualified financial professionals before implementation.
            </p>
          </CardContent>
        </Card>

        {/* Methodology Section */}
        <Card className="mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              AI Model Source Methodology
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Framework Development Process</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                PortfoliX Institutional Models are derived from a comprehensive analysis of over 50+ 
                established corporate investment books and research papers, including works by Ray Dalio, 
                Benjamin Graham, Burton Malkiel, and leading institutional investment frameworks.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">AI Enhancement Layer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our AI technology extracts core allocation principles, risk management strategies, and 
                portfolio construction methodologies from historical literature. These frameworks are then 
                modernized to align with current institutional investment practices while maintaining the 
                fundamental principles that have proven successful over time.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Literature-Based Foundation</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Ray Dalio's "Principles" - Treasury optimization and risk parity concepts</li>
                <li>Benjamin Graham's "The Intelligent Investor" - Value investing and defensive strategies</li>
                <li>"Corporate Finance" textbooks - Liquidity management and capital allocation</li>
                <li>Modern Portfolio Theory - Diversification and efficient frontier principles</li>
                <li>ESG Integration Research - Sustainable investing frameworks</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Independence */}
        <Card className="mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Data Non-Dependence on Market Predictions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">No Predictive Analytics</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                PortfoliX does not generate market predictions, stock picks, or timing recommendations. 
                Our models are based on strategic allocation frameworks that have been validated through 
                historical academic research and institutional practice.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Historical Framework Basis</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All portfolio strategies are constructed using time-tested allocation principles rather 
                than market forecasting. We focus on risk-adjusted frameworks that institutional investors 
                have successfully implemented across various market cycles.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Projected Returns Disclaimer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Any projected returns displayed in our models are illustrative examples based on historical 
                asset class performance and are not guarantees or predictions of future results. Past 
                performance does not indicate future returns.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* No Advisory Intent */}
        <Card className="mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              No Advisory Intent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Educational Purpose Only</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                PortfoliX Institutional Models are provided solely for educational and research purposes. 
                They are designed to assist licensed financial professionals in exploring portfolio 
                construction frameworks derived from established investment literature.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Not Investment Advice</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The information provided through PortfoliX does not constitute financial advice, investment 
                recommendations, or asset management services. Users should consult with qualified financial 
                advisors and conduct their own due diligence before making any investment decisions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Professional Review Required</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All portfolio frameworks generated by PortfoliX should be reviewed, validated, and customized 
                by licensed financial professionals who understand the specific needs, constraints, and 
                regulatory requirements of their institutional clients.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">No Fiduciary Relationship</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use of PortfoliX does not create a fiduciary relationship between the user and PortfoliX 
                or its operators. We are a technology provider offering educational frameworks, not a 
                registered investment advisor or broker-dealer.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Licensing & Usage */}
        <Card className="mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Licensing & Proper Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Intended Users</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                PortfoliX Institutional Models are designed for use by licensed financial institutions, 
                registered investment advisors, asset managers, and corporate treasury departments with 
                appropriate regulatory oversight and compliance frameworks.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Compliance Responsibility</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Institutional users are responsible for ensuring their use of PortfoliX frameworks complies 
                with all applicable securities laws, regulations, and internal compliance policies. This 
                includes proper disclosure, suitability analysis, and fiduciary duty fulfillment.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Updates & Accuracy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                While we strive to maintain accurate and up-to-date frameworks, PortfoliX makes no 
                warranties regarding the completeness, reliability, or suitability of the information 
                provided. Users should independently verify all data and frameworks.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="border-border/50 animate-fade-in">
          <CardHeader>
            <CardTitle>Questions or Concerns?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              For compliance inquiries, licensing questions, or additional clarification on our 
              methodology and legal framework, please contact our institutional support team.
            </p>
            <p className="text-sm">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:compliance@portfolix.com"
                className="text-primary hover:underline"
              >
                compliance@portfolix.com
              </a>
            </p>
            <p className="text-sm mt-2 text-muted-foreground">
              Last updated: November 1, 2025
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
