import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, PieChart, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SignupModal } from "@/components/SignupModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import portfolioLogo from "@/assets/portfolio-logo-optimized.webp";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);

  const handleBuildPortfolio = () => {
    navigate("/?start=builder");
    closeMenu();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 safe-area-inset border-b border-white/5" style={{ background: 'hsl(0 0% 4% / 0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img
              src={portfolioLogo}
              alt="PortfoliX"
              width={36}
              height={36}
              className="h-9 w-auto"
              loading="eager"
              {...{ fetchpriority: "high" } as any}
            />
            <span className="text-xl font-bold text-gradient">PortfoliX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {["Features", "Product", "Pricing", "Testimonials"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {item}
              </a>
            ))}
            <Link to="/learn" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
              Learn
            </Link>
            <Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
              Careers
            </Link>
            <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
              Blog
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Button
                  className="bg-primary hover:bg-primary-glow text-primary-foreground text-sm font-medium"
                  onClick={handleBuildPortfolio}
                >
                  <PieChart className="mr-2 h-4 w-4" />
                  Build Portfolio
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm gap-2">
                      <User className="h-4 w-4" />
                      <span className="truncate max-w-[120px]">{user.email?.split('@')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleBuildPortfolio}>
                      <PieChart className="mr-2 h-4 w-4" />
                      Build Portfolio
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground text-sm font-medium"
                  onClick={() => navigate('/signin')}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-primary hover:bg-primary-glow text-primary-foreground text-sm font-medium"
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
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/5 absolute left-0 right-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto" style={{ background: 'hsl(0 0% 4% / 0.97)', backdropFilter: 'blur(20px)' }}>
            <div className="px-4 py-4 space-y-1">
              {user && (
                <Button className="w-full bg-primary hover:bg-primary-glow text-primary-foreground mb-3 font-medium" onClick={handleBuildPortfolio}>
                  <PieChart className="mr-2 h-4 w-4" />
                  Build Portfolio
                </Button>
              )}

              {["Features", "Product", "Pricing", "Testimonials"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={closeMenu}
                  className="block px-3 py-3 text-muted-foreground hover:text-foreground hover:bg-card rounded-lg transition-colors text-sm"
                >
                  {item}
                </a>
              ))}
              <Link to="/learn" onClick={closeMenu} className="block px-3 py-3 text-muted-foreground hover:text-foreground hover:bg-card rounded-lg transition-colors text-sm">
                Learn
              </Link>
              <Link to="/careers" onClick={closeMenu} className="block px-3 py-3 text-muted-foreground hover:text-foreground hover:bg-card rounded-lg transition-colors text-sm">
                Careers
              </Link>
              <Link to="/blog" onClick={closeMenu} className="block px-3 py-3 text-muted-foreground hover:text-foreground hover:bg-card rounded-lg transition-colors text-sm">
                Blog
              </Link>

              <div className="flex flex-col space-y-2 pt-4 border-t border-border mt-4">
                {user ? (
                  <>
                    <span className="text-muted-foreground text-sm px-3 py-2">
                      Welcome, {user.email?.split('@')[0]}
                    </span>
                    <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground" onClick={() => { signOut(); closeMenu(); }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground" onClick={() => { navigate('/signin'); closeMenu(); }}>
                      Sign In
                    </Button>
                    <Button className="bg-primary hover:bg-primary-glow text-primary-foreground font-medium" onClick={() => { setShowSignupModal(true); closeMenu(); }}>
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
