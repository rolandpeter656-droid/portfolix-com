import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, ArrowRight, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    // Open Beehiiv subscribe page with email pre-filled
    const subscribeUrl = `https://portfolix.beehiiv.com/subscribe?email=${encodeURIComponent(email)}`;
    window.open(subscribeUrl, "_blank");
    setEmail("");
    toast.success("Redirecting to newsletter signup...");
  };

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-10 sm:py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Company Info */}
            <div className="col-span-2 md:col-span-2 lg:col-span-1">
              <h3 className="text-xl sm:text-2xl font-sans-bold text-gradient mb-3 sm:mb-4">PortfoliX</h3>
              <p className="text-muted-foreground mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                AI-powered portfolio management platform that helps investors build smarter, 
                more profitable portfolios with cutting-edge technology.
              </p>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <a href="mailto:peter@portfolixapps.com" className="hover:text-primary transition-colors truncate">
                    peter@portfolixapps.com
                  </a>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>+2349053462215</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Lagos, Nigeria</span>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-sans-bold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <li><a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">API</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Integrations</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-sans-bold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <li><a href="#team" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Resources - Hidden on smallest screens */}
            <div className="hidden lg:block">
              <h4 className="font-sans-bold text-foreground mb-4 text-sm sm:text-base">Resources</h4>
              <ul className="space-y-3 text-xs sm:text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-6 sm:py-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center md:text-left">
              <h4 className="font-sans-bold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">
                Stay updated with PortfoliX
              </h4>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Get the latest insights and product updates.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                className="flex-1 md:w-48 lg:w-64 px-3 sm:px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <Button onClick={handleSubscribe} className="bg-primary hover:bg-primary-glow text-primary-foreground text-sm px-3 sm:px-4">
                Subscribe
                <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 hidden sm:inline" />
              </Button>
            </div>
          </div>
        </div>

        {/* Investment Disclaimer */}
        <div className="py-6 border-t border-border">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Investment Disclaimer:</strong> PortfoliX is an investment research and portfolio-modeling platform. We do not provide personalized financial advice and are not a registered investment adviser, broker-dealer, or asset manager. All investments involve risk, including potential loss of principal. Past performance does not guarantee future results.
              </p>
              <div className="flex flex-wrap gap-4 text-xs">
                <Link to="/legal/disclaimers" className="text-primary hover:underline">Full Disclaimers</Link>
                <Link to="/legal/risk-disclosure" className="text-primary hover:underline">Risk Disclosure</Link>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4 sm:my-6 md:my-8" />

        {/* Bottom Footer */}
        <div className="py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <div>
            © 2026 PortfoliX. All rights reserved.
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/legal/disclaimers" className="hover:text-primary transition-colors">Disclaimers</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};