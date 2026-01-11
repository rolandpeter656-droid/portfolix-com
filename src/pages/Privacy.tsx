import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last Updated: January 2026
            </p>
          </div>

          {/* Privacy Content */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Introduction</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  PortfoliX ("we", "us", "our") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard 
                  your information when you use our platform.
                </p>
                <p>
                  By using PortfoliX, you consent to the data practices described in this policy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p><strong className="text-foreground">Personal Information:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Name and email address</li>
                  <li>Phone number</li>
                  <li>Payment information (processed securely by third-party providers)</li>
                  <li>Account credentials</li>
                </ul>
                <p className="mt-3"><strong className="text-foreground">Usage Information:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Risk assessment responses</li>
                  <li>Portfolio preferences and configurations</li>
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                  <li>Usage patterns and interactions with the platform</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Provide and maintain our services</li>
                  <li>Generate portfolio models based on your preferences</li>
                  <li>Process payments and manage subscriptions</li>
                  <li>Communicate with you about updates and promotions</li>
                  <li>Improve our platform and develop new features</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Data Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>We may share your information with:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    <strong className="text-foreground">Service Providers:</strong> Third parties 
                    who assist in operating our platform (payment processors, hosting providers)
                  </li>
                  <li>
                    <strong className="text-foreground">Legal Requirements:</strong> When required 
                    by law or to protect our rights
                  </li>
                  <li>
                    <strong className="text-foreground">Business Transfers:</strong> In connection 
                    with a merger, acquisition, or sale of assets
                  </li>
                </ul>
                <p className="mt-3">
                  We do not sell your personal information to third parties for marketing purposes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  We implement appropriate technical and organizational measures to protect 
                  your personal information against unauthorized access, alteration, disclosure, 
                  or destruction.
                </p>
                <p>
                  However, no method of transmission over the Internet or electronic storage 
                  is 100% secure. While we strive to protect your data, we cannot guarantee 
                  absolute security.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  We retain your personal information for as long as your account is active 
                  or as needed to provide you services. We may retain certain information 
                  as required by law or for legitimate business purposes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>Depending on your jurisdiction, you may have the right to:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to or restrict processing of your data</li>
                  <li>Data portability</li>
                  <li>Withdraw consent where processing is based on consent</li>
                </ul>
                <p className="mt-3">
                  To exercise these rights, please contact us at{" "}
                  <a href="mailto:privacy@portfolixapps.com" className="text-primary hover:underline">
                    privacy@portfolixapps.com
                  </a>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  We use cookies and similar tracking technologies to collect information 
                  about your browsing activities. You can control cookie preferences through 
                  your browser settings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  PortfoliX is not intended for individuals under 18 years of age. We do not 
                  knowingly collect personal information from children. If we learn we have 
                  collected information from a child, we will delete that information promptly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. International Data Transfers</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  Your information may be transferred to and processed in countries other 
                  than your own. We ensure appropriate safeguards are in place for such 
                  transfers in compliance with applicable data protection laws.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Updates to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you 
                  of material changes by posting the updated policy on our platform or via email.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>12. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  If you have questions about this Privacy Policy, please contact us at:
                </p>
                <p>
                  <strong className="text-foreground">Email:</strong>{" "}
                  <a href="mailto:privacy@portfolixapps.com" className="text-primary hover:underline">
                    privacy@portfolixapps.com
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

export default Privacy;
