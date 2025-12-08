import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Clock, 
  FileText, 
  RefreshCw, 
  Shield, 
  BarChart3, 
  Users,
  CheckCircle,
  Building2,
  Quote
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

const Advisors = () => {
  const navigate = useNavigate();

  const benefits = [
    { icon: Clock, text: "Save 8–12 hours monthly on portfolio construction" },
    { icon: FileText, text: "Access research-backed retail investor portfolios" },
    { icon: BarChart3, text: "Present cleaner, client-ready allocations instantly" },
    { icon: RefreshCw, text: "Simplify rebalancing and reporting" },
  ];

  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description: "Create a PortfoliX Advisor Account in less than 60 seconds."
    },
    {
      number: "02",
      title: "Choose Your Portfolios",
      description: "Access all portfolio models: Growth, Income, Balanced, Crypto Allocation, Conservative/Retirement."
    },
    {
      number: "03",
      title: "Present to Clients",
      description: "Download client-ready versions, rebalance guides, and allocation explanations."
    },
    {
      number: "04",
      title: "Scale Your Advisory Practice",
      description: "Save time, improve results, retain clients, and onboard new ones with confidence."
    },
  ];

  const features = [
    {
      icon: FileText,
      title: "Ready-Made Portfolios",
      description: "Built to reduce research time and improve clarity."
    },
    {
      icon: Users,
      title: "Client-Ready PDFs",
      description: "Clean, simple explanations your clients can understand."
    },
    {
      icon: RefreshCw,
      title: "Quarterly Updates",
      description: "Models adjusted based on markets and asset changes."
    },
    {
      icon: Shield,
      title: "Risk Buckets",
      description: "Clear risk scores for easy client communication."
    },
    {
      icon: BarChart3,
      title: "Advisor Resources",
      description: "Pitch decks, scripts, and onboarding templates."
    },
    {
      icon: Building2,
      title: "Private Access Dashboard",
      description: "All models stored in one simple interface."
    },
  ];

  const testimonials = [
    {
      firm: "BlueStone Advisory",
      location: "Lagos, Nigeria",
      quote: "We reduced portfolio-building time from 3 hours to 30 minutes per client. PortfoliX standardized our investment offering completely.",
      person: "Adebayo O., Principal Advisor"
    },
    {
      firm: "HarborPoint Wealth",
      location: "Nairobi, Kenya",
      quote: "The Balanced and Income models for retirees were exactly what our clients needed. They appreciated the clarity and simplicity.",
      person: "Grace M., Wealth Manager"
    },
    {
      firm: "CrestRock Financial Partners",
      location: "Accra, Ghana",
      quote: "The Crypto Allocation model helped us offer modern diversification options without needing internal research analysts.",
      person: "Kwame A., Managing Director"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full mb-4 sm:mb-6">
            <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary mr-2" />
            <span className="text-xs sm:text-sm font-medium text-primary">For Financial Advisors</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            Upgrade Your Advisory Business
            <span className="text-gradient block mt-2">With Ready-to-Use Model Portfolios</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
            Built for independent advisors, small firms, and boutique wealth managers. 
            Save time, scale your client offering, and deploy institutional-grade portfolios without building an investment research team.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-glow w-full sm:w-auto text-sm sm:text-base"
              onClick={() => navigate('/advisors/onboarding')}
            >
              Start Partnership
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto text-sm sm:text-base"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Partnership Details
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-10 sm:py-16 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-3 sm:p-4">
                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  <benefit.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <p className="text-sm sm:text-base text-foreground font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Get started in four simple steps
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-8 -right-4 h-6 w-6 text-primary/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Everything Advisors Need
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            To Deliver Professional-Grade Investing
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Used by Advisors Who Want
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Efficiency and Better Client Communication
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary/30 mb-4" />
                  <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
                  <div className="border-t border-border pt-4">
                    <p className="font-semibold">{testimonial.firm}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    <p className="text-sm text-primary mt-1">{testimonial.person}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            One plan, everything included
          </p>
          
          <Card className="border-primary/30 max-w-lg mx-auto">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <p className="text-sm text-primary font-medium mb-2">ADVISOR PARTNERSHIP</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold">$49</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Unlimited access to all model portfolios</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Client-ready PDF exports</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Quarterly portfolio updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>All advisor resources included</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Private dashboard access</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Email support</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-primary hover:bg-primary-glow"
                size="lg"
                onClick={() => navigate('/advisors/onboarding')}
              >
                Start 7-Day Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                No credit card required for trial. Cancel anytime.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of advisors who are saving time and delivering better results with PortfoliX model portfolios.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary-glow"
            onClick={() => navigate('/advisors/onboarding')}
          >
            Become a Partner Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Advisors;
