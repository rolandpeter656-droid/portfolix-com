import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvestmentDisclaimer } from "@/components/compliance";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last Updated: January 2026
            </p>
          </div>

          {/* Investment Disclaimer Banner */}
          <InvestmentDisclaimer variant="compact" className="mb-8" />

          {/* Terms Content */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  By accessing or using PortfoliX ("Platform", "Service", "we", "us", or "our"), 
                  you agree to be bound by these Terms of Service and all applicable laws and 
                  regulations. If you do not agree with any of these terms, you are prohibited 
                  from using this Platform.
                </p>
                <p>
                  You must be at least 18 years of age (or the age of majority in your 
                  jurisdiction) to use this Service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Nature of Service</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  <strong className="text-foreground">PortfoliX is an investment research, 
                  education, and portfolio-modeling platform.</strong>
                </p>
                <p>
                  PortfoliX is NOT a registered investment adviser, broker-dealer, or asset 
                  manager with any regulatory authority. We do not provide personalized 
                  financial advice, investment recommendations tailored to your individual 
                  circumstances, or fiduciary services.
                </p>
                <p>
                  All portfolio models, projections, and educational content are provided 
                  for informational and educational purposes only. They are hypothetical 
                  in nature and do not represent actual trading results.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. No Investment Advice</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  The information provided on PortfoliX does not constitute investment advice, 
                  financial advice, trading advice, or any other sort of advice. You should 
                  not treat any of the Platform's content as such.
                </p>
                <p>
                  PortfoliX does not recommend that any security, portfolio, or strategy is 
                  suitable for any specific person. Any mention of a particular security or 
                  asset is not a recommendation to buy, sell, or hold that security.
                </p>
                <p>
                  <strong className="text-foreground">You are solely responsible for your 
                  investment decisions.</strong> Always conduct your own due diligence and 
                  consult with a qualified financial professional before making any 
                  investment decisions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Risk Acknowledgment</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  By using PortfoliX, you acknowledge and agree that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>All investments involve risk, including the potential loss of principal</li>
                  <li>Past performance does not guarantee future results</li>
                  <li>Hypothetical performance results have inherent limitations</li>
                  <li>Cryptocurrency investments carry extreme volatility and regulatory risks</li>
                  <li>You may lose some or all of your invested capital</li>
                  <li>You should only invest money you can afford to lose</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>As a user of PortfoliX, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Provide accurate and complete information when creating an account</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Not use the Platform for any unlawful purpose</li>
                  <li>Not attempt to gain unauthorized access to any part of the Platform</li>
                  <li>Accept full responsibility for any investment decisions you make</li>
                  <li>Independently verify all information before acting upon it</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Subscription and Payment</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  PortfoliX offers both free and paid subscription plans. Paid subscriptions 
                  are billed on a recurring basis. You authorize us to charge your payment 
                  method on a recurring basis until you cancel.
                </p>
                <p>
                  All fees are non-refundable unless otherwise stated. We reserve the right 
                  to change our pricing at any time with reasonable notice.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  All content on PortfoliX, including but not limited to text, graphics, 
                  logos, algorithms, and software, is the property of PortfoliX or its 
                  licensors and is protected by intellectual property laws.
                </p>
                <p>
                  You may not reproduce, distribute, modify, or create derivative works 
                  of any content without our express written consent.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, PORTFOLIX AND ITS AFFILIATES, 
                  OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY 
                  INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, 
                  INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR INVESTMENT LOSSES, 
                  ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE PLATFORM.
                </p>
                <p>
                  Our total liability for any claims arising from your use of the Platform 
                  shall not exceed the amount you paid to us in the twelve months preceding 
                  the claim.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Indemnification</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  You agree to indemnify and hold harmless PortfoliX, its affiliates, 
                  officers, directors, employees, and agents from any claims, damages, 
                  losses, or expenses arising from your use of the Platform, your violation 
                  of these Terms, or your violation of any rights of a third party.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Modifications to Terms</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  We reserve the right to modify these Terms at any time. We will notify 
                  users of material changes through the Platform or via email. Your 
                  continued use of the Platform after such modifications constitutes 
                  acceptance of the updated Terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  These Terms shall be governed by and construed in accordance with the 
                  laws of the Federal Republic of Nigeria, without regard to its conflict 
                  of law provisions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>12. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  For questions about these Terms, please contact us at:
                </p>
                <p>
                  <strong className="text-foreground">Email:</strong>{" "}
                  <a href="mailto:legal@portfolixapps.com" className="text-primary hover:underline">
                    legal@portfolixapps.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
