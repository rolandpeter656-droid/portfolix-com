import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SignupModal } from "@/components/SignupModal";
import portfolioLogo from "@/assets/portfolio-logo.png";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav safe-area-inset">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src={portfolioLogo} alt="PortfoliX" className="h-8 sm:h-10 w-auto" />
            <span className="text-xl sm:text-2xl font-sans-bold text-gradient">PortfoliX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <a href="#features" className="text-sm xl:text-base text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#product" className="text-sm xl:text-base text-muted-foreground hover:text-foreground transition-colors">
              Product
            </a>
            <a href="#pricing" className="text-sm xl:text-base text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <Link to="/advisors" className="text-sm xl:text-base text-muted-foreground hover:text-foreground transition-colors">
              For Advisors
            </Link>
            <a href="#testimonials" className="text-sm xl:text-base text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
            <a href="#team" className="text-sm xl:text-base text-muted-foreground hover:text-foreground transition-colors">
              Team
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {user ? (
              <div className="flex items-center space-x-3 xl:space-x-4">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground text-sm"
                  onClick={() => navigate('/my-portfolios')}
                >
                  Your Built Portfolios
                </Button>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground text-sm"
                  onClick={() => navigate('/referrals')}
                >
                  Referrals
                </Button>
                <span className="text-muted-foreground text-xs xl:text-sm truncate max-w-[120px]">
                  Welcome, {user.email?.split('@')[0]}
                </span>
                <Button 
                  variant="ghost" 
                  className="text-muted-foreground hover:text-foreground text-sm"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-muted-foreground hover:text-foreground text-sm"
                  onClick={() => navigate('/signin')}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary-glow text-primary-foreground text-sm"
                  onClick={() => setShowSignupModal(true)}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/10 backdrop-blur-2xl absolute left-0 right-0 top-full max-h-[calc(100vh-3.5rem)] overflow-y-auto" style={{ background: 'hsl(218 23% 8% / 0.95)' }}>
            <div className="px-4 py-4 space-y-1">
              <a 
                href="#features" 
                onClick={closeMenu}
                className="block px-3 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              >
                Features
              </a>
              <a 
                href="#product" 
                onClick={closeMenu}
                className="block px-3 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              >
                Product
              </a>
              <a 
                href="#pricing" 
                onClick={closeMenu}
                className="block px-3 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              >
                Pricing
              </a>
              <Link 
                to="/advisors" 
                onClick={closeMenu}
                className="block px-3 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              >
                For Advisors
              </Link>
              <a 
                href="#testimonials" 
                onClick={closeMenu}
                className="block px-3 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              >
                Testimonials
              </a>
              <a 
                href="#team" 
                onClick={closeMenu}
                className="block px-3 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              >
                Team
              </a>
              
              <div className="flex flex-col space-y-2 pt-4 border-t border-border mt-4">
                {user ? (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start text-muted-foreground hover:text-foreground"
                      onClick={() => { navigate('/my-portfolios'); closeMenu(); }}
                    >
                      Your Built Portfolios
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start text-muted-foreground hover:text-foreground"
                      onClick={() => { navigate('/referrals'); closeMenu(); }}
                    >
                      Referrals
                    </Button>
                    <span className="text-muted-foreground text-sm px-3 py-2">
                      Welcome, {user.email?.split('@')[0]}
                    </span>
                    <Button 
                      variant="ghost" 
                      className="justify-start text-muted-foreground hover:text-foreground"
                      onClick={() => { signOut(); closeMenu(); }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      className="justify-start text-muted-foreground hover:text-foreground"
                      onClick={() => { navigate('/signin'); closeMenu(); }}
                    >
                      Sign In
                    </Button>
                    <Button 
                      className="bg-primary hover:bg-primary-glow text-primary-foreground"
                      onClick={() => { setShowSignupModal(true); closeMenu(); }}
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
