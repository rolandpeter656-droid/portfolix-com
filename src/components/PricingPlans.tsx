import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Building2 } from "lucide-react";
import { PaystackPayment } from "./PaystackPayment";
import { useNavigate } from "react-router-dom";

export type PlanType = "free" | "pro" | "institutional";
export type Currency = "NGN" | "USD";

interface PricingPlan {
  id: PlanType;
  name: string;
  price: { NGN: number; USD: number };
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
    price: { NGN: 0, USD: 0 },
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
    price: { NGN: 12000, USD: 25 },
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
    price: { NGN: 0, USD: 0 },
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
  }
];

interface PricingPlansProps {
  currentPlan?: PlanType;
  onPlanSelect?: (plan: PlanType) => void;
}

export const PricingPlans = ({ currentPlan = "free", onPlanSelect }: PricingPlansProps) => {
  const [currency, setCurrency] = useState<Currency>("USD");
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
      window.open("mailto:sales@portfolix.com?subject=Institutional Plan Inquiry", "_blank");
      return;
    }

    if (planId === "pro") {
      // Open Paystack payment link in new tab
      window.open("https://paystack.shop/pay/mkxrul537n", "_blank");
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

  const formatPrice = (price: number, curr: Currency, planId: PlanType) => {
    if (price === 0 && planId === "free") return "Free";
    if (price === 0 && planId === "institutional") return "Custom";
    const symbol = curr === "NGN" ? "₦" : "$";
    return `${symbol}${price.toLocaleString()}`;
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
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Investment Plan</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Scale your portfolio management with AI-powered insights
        </p>
        
        {/* Currency Toggle */}
        <div className="inline-flex rounded-lg border p-1 mb-8">
          <button
            onClick={() => setCurrency("USD")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currency === "USD"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            USD ($)
          </button>
          <button
            onClick={() => setCurrency("NGN")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currency === "NGN"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            NGN (₦)
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative transition-all duration-300 hover:shadow-lg ${
              plan.popular ? "border-primary shadow-lg scale-105" : ""
            } ${currentPlan === plan.id ? "ring-2 ring-primary" : ""}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4 text-primary">
                {plan.icon}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                {formatPrice(plan.price[currency], currency, plan.id)}
                {plan.price[currency] > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                )}
              </div>
              <CardDescription className="mt-2">{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full mt-6"
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

      <div className="text-center mt-12 text-sm text-muted-foreground">
        <p>All plans include secure payment processing and 24/7 customer support.</p>
        <p className="mt-2">
          Institutional plans include team-based billing and custom pricing.
        </p>
      </div>
    </div>
  );
};