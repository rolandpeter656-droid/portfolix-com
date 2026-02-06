import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Integrations = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-bold">PortfoliX</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Integrations
            </h1>
            <p className="text-lg text-muted-foreground">
              PortfoliX integrates with best-in-class services to provide secure, reliable portfolio management
            </p>
          </div>

          {/* Current Integrations */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8">Current Integrations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="relative overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                      >
                        <path d="M21.362 9.354H12.2v5.292h5.268c-.2 1.4-.73 2.78-1.53 3.71l2.47 1.92c1.44-1.33 2.27-3.29 2.27-5.62 0-.52-.05-1.02-.14-1.5l-.17-.8z"/>
                        <path d="M12.2 21.7c2.97 0 5.46-.98 7.28-2.66l-2.47-1.92c-.84.53-1.91.82-3.05.82-2.35 0-4.34-1.59-5.05-3.72H6.34v1.98c1.8 3.58 5.49 6.04 9.66 6.04l.2-.54z"/>
                        <path d="M7.15 14.22c-.18-.53-.28-1.1-.28-1.69s.1-1.16.28-1.69V8.86H4.58c-.58 1.16-.91 2.47-.91 3.87s.33 2.71.91 3.87l2.57-1.38z"/>
                        <path d="M12.2 7.38c1.32 0 2.51.45 3.44 1.33l2.58-2.58C16.67 4.85 14.54 4 12.2 4c-4.17 0-7.86 2.46-9.66 6.04l2.57 1.98c.71-2.13 2.7-3.64 5.09-3.64z"/>
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Supabase</CardTitle>
                      <CardDescription>Backend & Database</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    PortfoliX integrates with Supabase for secure backend and portfolio management.
                  </p>
                  <div className="mt-4 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 dark:text-green-400">Active</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Coming Soon */}
          <div>
            <h2 className="text-2xl font-semibold mb-8">More Integrations Coming Soon</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder cards for future integrations */}
              {[1, 2, 3, 4, 5].map((index) => (
                <Card key={index} className="relative overflow-hidden opacity-50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <div className="w-6 h-6 bg-muted-foreground/20 rounded"></div>
                      </div>
                      <div>
                        <div className="w-20 h-4 bg-muted-foreground/20 rounded mb-2"></div>
                        <div className="w-16 h-3 bg-muted-foreground/10 rounded"></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="w-full h-3 bg-muted-foreground/10 rounded"></div>
                      <div className="w-3/4 h-3 bg-muted-foreground/10 rounded"></div>
                    </div>
                    <div className="mt-4 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-muted-foreground/30 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Coming Soon</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <Card className="max-w-lg mx-auto">
              <CardHeader>
                <CardTitle>Need a Custom Integration?</CardTitle>
                <CardDescription>
                  Get in touch to discuss custom integrations and tailored solutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link 
                  to="/api" 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Contact Us
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Integrations;