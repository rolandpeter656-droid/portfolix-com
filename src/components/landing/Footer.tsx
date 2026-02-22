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
    const subscribeUrl = `https://portfolix.beehiiv.com/subscribe?email=${encodeURIComponent(email)}`;
    window.open(subscribeUrl, "_blank");
    setEmail("");
    toast.success("Redirecting to newsletter signup...");
  };

  return (
    <footer className="border-t border-border" style={{ background: 'hsl(0 0% 6%)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company */}
            <div className="col-span-2 lg:col-span-1">
              <h3 className="text-xl font-bold text-gradient mb-4">PortfoliX</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                AI-powered portfolio management platform that helps investors build smarter portfolios.
              </p>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <a href="mailto:peter@portfolixapps.com" className="hover:text-primary transition-colors">peter@portfolixapps.com</a>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>+2349053462215</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Lagos, Nigeria</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Product</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
                <li><Link to="/learn" className="text-muted-foreground hover:text-primary transition-colors">Learn</Link></li>
                <li><Link to="/documentation" className="text-muted-foreground hover:text-primary transition-colors">Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Company</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#team" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
                <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div className="hidden lg:block">
              <h4 className="font-semibold text-foreground mb-4 text-sm">Resources</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="py-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-foreground mb-1 text-sm">Stay updated with PortfoliX</h4>
              <p className="text-muted-foreground text-xs">Get the latest insights and product updates.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                className="flex-1 md:w-64 px-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 text-sm transition-all"
              />
              <Button onClick={handleSubscribe} className="bg-primary hover:bg-primary-glow text-primary-foreground text-sm px-4 font-medium">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4 hidden sm:inline" />
              </Button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="py-6 border-t border-border">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground/70">Investment Disclaimer:</strong> PortfoliX is an investment research and portfolio-modeling platform. We do not provide personalized financial advice and are not a registered investment adviser, broker-dealer, or asset manager. All investments involve risk, including potential loss of principal.
              </p>
              <div className="flex flex-wrap gap-4 text-xs">
                <Link to="/legal/disclaimers" className="text-primary hover:underline">Full Disclaimers</Link>
                <Link to="/legal/risk-disclosure" className="text-primary hover:underline">Risk Disclosure</Link>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>© 2026 PortfoliX. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/legal/disclaimers" className="hover:text-primary transition-colors">Disclaimers</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
