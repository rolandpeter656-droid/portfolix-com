import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { RiskDisclosure as RiskDisclosureComponent } from "@/components/compliance";
import { AlertTriangle } from "lucide-react";

const RiskDisclosurePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-destructive/10 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Risk Disclosure Statement
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Important information about the risks associated with various investment types 
              available through PortfoliX portfolio models.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last Updated: January 2026
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Important: Read Before Using PortfoliX
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Before using PortfoliX or making any investment decisions based on our portfolio 
              models, you must understand and acknowledge the following risks. This is not a 
              complete list of all risks. Investment risk is inherent and varies based on 
              individual circumstances.
            </p>
            <p className="text-sm font-medium text-destructive">
              You may lose some or all of your invested capital. Only invest money you can 
              afford to lose.
            </p>
          </div>

          {/* Risk Disclosures */}
          <RiskDisclosureComponent variant="full" />

          {/* Additional Important Notes */}
          <div className="mt-12 space-y-6">
            <div className="bg-muted/50 border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Hypothetical Portfolio Limitations
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  All portfolio models shown on PortfoliX are hypothetical. Hypothetical 
                  performance results have many inherent limitations, some of which are 
                  described below:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    No representation is being made that any account will or is likely to 
                    achieve profits or losses similar to those shown
                  </li>
                  <li>
                    Hypothetical performance does not involve financial risk, and no 
                    hypothetical trading record can completely account for the impact of 
                    financial risk in actual trading
                  </li>
                  <li>
                    The ability to withstand losses or adhere to a particular trading 
                    program in spite of trading losses are material points which can 
                    adversely affect actual trading results
                  </li>
                  <li>
                    There are numerous other factors related to the markets in general 
                    or to the implementation of any specific trading program which cannot 
                    be fully accounted for in hypothetical performance results
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-muted/50 border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                No Guarantee of Results
              </h3>
              <p className="text-sm text-muted-foreground">
                PortfoliX makes no guarantee or representation as to the accuracy, timeliness, 
                or completeness of any information provided. No guarantee is made that any 
                investment strategy will be successful. Investment decisions should not be 
                made solely based on portfolio models shown on this platform. Always conduct 
                your own research and consult with qualified professionals before investing.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RiskDisclosurePage;
