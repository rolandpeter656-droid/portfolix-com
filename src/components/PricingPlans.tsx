import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Building2, Briefcase } from "lucide-react";
import { PaystackPayment } from "./PaystackPayment";
import { useNavigate } from "react-router-dom";

export type PlanType = "free" | "pro" | "institutional" | "institutional-portal";
export type Currency = "USD";

interface PricingPlan {
  id: PlanType;
  name: string;
  price: number;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  icon: React.ReactNode;
}

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free Plan",
    price: 0,
    description: "Perfect for beginners getting started with AI-powered investing",
    features: [
      "5 AI-generated investment portfolios",
      "Bitcoin and key asset suggestions",
      "Weekly AI market sentiment snapshot",
      "Beginner-level educational content",
      "Access to 3 investor network threads"
    ],
    buttonText: "Get Started Free",
    icon: <Check className="h-6 w-6" />
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: 25,
    description: "Advanced features for serious investors",
    features: [
      "Unlimited AI-generated portfolios",
      "Real-time portfolio improvement suggestions",
      "AI-generated rebalancing alerts",
      "Portfolio risk scoring",
      "Exclusive webinars and strategy guides",
      "Priority access to new investing models"
    ],
    buttonText: "Upgrade to Pro",
    popular: true,
    icon: <Crown className="h-6 w-6" />
  },
  {
    id: "institutional",
    name: "Institutional Plan",
    price: 0,
    description: "Custom solutions for institutions and large teams",
    features: [
      "Custom AI-generated model portfolios",
      "Private AI training with your strategies",
      "Full integration support",
      "Dedicated relationship manager",
      "Quarterly strategy calls",
      "Advanced data analytics dashboard",
      "Team-based billing and management",
      "Custom compliance preferences"
    ],
    buttonText: "Contact Sales",
    icon: <Building2 className="h-6 w-6" />
  },
  {
    id: "institutional-portal",
    name: "Institutional AI Portfolios",
    price: 0,
    description: "Tailored for brokerage firms, asset managers, and fintechs managing client portfolios at scale. Access categorized institutional packages, tiered billing, and powerful AI portfolio tools.",
    features: [
      "Categorized institutional packages",
      "Tiered billing by firm size",
      "AI-powered portfolio generation",
      "Custom model portfolios",
      "Institutional-grade analytics",
      "Multi-client portfolio management"
    ],
    buttonText: "Explore Institutional Portal →",
    icon: <Briefcase className="h-6 w-6" />
  }
];

interface PricingPlansProps {
  currentPlan?: PlanType;
  onPlanSelect?: (plan: PlanType) => void;
}

export const PricingPlans = ({ currentPlan = "free", onPlanSelect }: PricingPlansProps) => {
  const currency: Currency = "USD";
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();

  const handlePlanSelect = (planId: PlanType) => {
    if (planId === "free") {
      onPlanSelect?.(planId);
      return;
    }
    
    if (planId === "institutional") {
      // Handle institutional plan contact
      window.open("mailto:peter@portfolixapps.com?subject=Institutional Plan Inquiry", "_blank");
      return;
    }

    if (planId === "institutional-portal") {
      // Navigate to institutions page
      navigate("/institutions");
      return;
    }

    if (planId === "pro") {
      // Navigate directly to Paystack payment
      navigate(`/payment-method?plan=${planId}&currency=${currency}`);
      return;
    }

    setSelectedPlan(planId);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedPlan) {
      onPlanSelect?.(selectedPlan);
      setShowPayment(false);
      setSelectedPlan(null);
    }
  };

  const formatPrice = (price: number, planId: PlanType) => {
    if (price === 0 && planId === "free") return "$0";
    if (price === 0 && planId === "institutional") return "Custom";
    if (planId === "institutional-portal") return "$499-$2,999";
    return `$${price}`;
  };

  if (showPayment && selectedPlan) {
    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      return (
        <PaystackPayment
          plan={plan}
          currency={currency}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      );
    }
  }

  return (
    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="glass-blob glass-blob-cyan w-[400px] h-[400px] -top-40 -left-40 animate-blob-float opacity-10" />
        <div className="glass-blob glass-blob-purple w-[350px] h-[350px] -bottom-40 -right-40 animate-blob-float-delayed opacity-10" />
      </div>
      
      <div className="text-center mb-8 sm:mb-12 relative z-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Choose Your Plan</h1>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-2">
          Scale your portfolio management with AI-powered insights
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto relative z-10">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative glass-card glass-glow-hover ${
              plan.popular ? "border-primary/50 shadow-lg sm:scale-105" : ""
            } ${currentPlan === plan.id ? "ring-2 ring-primary" : ""}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center pb-3 sm:pb-4 p-4 sm:p-6">
              <div className="flex justify-center mb-3 sm:mb-4 text-primary">
                {plan.icon}
              </div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl">{plan.name}</CardTitle>
              <div className="text-2xl sm:text-3xl font-bold">
                {formatPrice(plan.price, plan.id)}
                {plan.price > 0 && (
                  <span className="text-xs sm:text-sm font-normal text-muted-foreground">/month</span>
                )}
              </div>
              <CardDescription className="mt-2 text-xs sm:text-sm">{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <ul className="space-y-2 sm:space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full mt-4 sm:mt-6 text-sm sm:text-base py-2 sm:py-3"
                variant={currentPlan === plan.id ? "secondary" : "default"}
                onClick={() => handlePlanSelect(plan.id)}
                disabled={currentPlan === plan.id}
              >
                {currentPlan === plan.id ? "Current Plan" : plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8 sm:mt-12 text-xs sm:text-sm text-muted-foreground px-4">
        <p>All plans include secure payment processing and 24/7 customer support.</p>
        <p className="mt-2">
          Institutional plans include team-based billing and custom pricing.
        </p>
      </div>
    </div>
  );
};