import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SignupModal } from "@/components/SignupModal";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-sans-bold text-gradient cursor-pointer hover:opacity-80 transition-opacity">PortfoliX</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#product" className="text-muted-foreground hover:text-foreground transition-colors">
              Product
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <Link to="/institutions" className="text-muted-foreground hover:text-foreground transition-colors">
              For Institutions
            </Link>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
            <a href="#team" className="text-muted-foreground hover:text-foreground transition-colors">
              Team
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => navigate('/referrals')}
                >
                  Referrals
                </Button>
                <span className="text-muted-foreground text-sm">
                  Welcome, {user.email?.split('@')[0]}
                </span>
                <Button 
                  variant="ghost" 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => navigate('/signin')}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary-glow text-primary-foreground"
                  onClick={() => setShowSignupModal(true)}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#product" className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
                Product
              </a>
              <a href="#pricing" className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <Link to="/institutions" className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
                For Institutions
              </Link>
              <a href="#testimonials" className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
                Testimonials
              </a>
              <a href="#team" className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
                Team
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => navigate('/referrals')}
                    >
                      Referrals
                    </Button>
                    <span className="text-muted-foreground text-sm px-3 py-2">
                      Welcome, {user.email?.split('@')[0]}
                    </span>
                    <Button 
                      variant="ghost" 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => signOut()}
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => navigate('/signin')}
                    >
                      Sign In
                    </Button>
                    <Button 
                      className="bg-primary hover:bg-primary-glow text-primary-foreground"
                      onClick={() => setShowSignupModal(true)}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <SignupModal open={showSignupModal} onOpenChange={setShowSignupModal} />
    </nav>
  );
};