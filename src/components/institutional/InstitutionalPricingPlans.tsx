import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Building2, TrendingUp, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type InstitutionalPlanType = "corporate-starter" | "corporate-growth" | "corporate-enterprise";
export type Currency = "USD";

interface InstitutionalPricingPlan {
  id: InstitutionalPlanType;
  name: string;
  price: number;
  target: string;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  icon: React.ReactNode;
}

const institutionalPlans: InstitutionalPricingPlan[] = [
  {
    id: "corporate-starter",
    name: "Corporate Starter",
    price: 499,
    target: "SMEs ($100k–$1M AUM)",
    description: "Essential institutional portfolio frameworks for growing businesses",
    features: [
      "3 institutional portfolio models",
      "Dashboard access and analytics",
      "Basic performance tracking",
      "Email support",
      "Monthly AI market insights",
      "Educational resources"
    ],
    buttonText: "Start Free for 7 Days",
    icon: <Building2 className="h-6 w-6" />
  },
  {
    id: "corporate-growth",
    name: "Corporate Growth",
    price: 1499,
    target: "Mid-sized firms, asset managers",
    description: "Advanced institutional frameworks with risk management tools",
    features: [
      "6 institutional portfolio models",
      "Advanced risk dashboards",
      "Performance simulation tools",
      "Priority email & chat support",
      "Weekly AI strategy updates",
      "Custom allocation parameters",
      "Quarterly strategy review"
    ],
    buttonText: "Start Free for 7 Days",
    popular: true,
    icon: <TrendingUp className="h-6 w-6" />
  },
  {
    id: "corporate-enterprise",
    name: "Corporate Enterprise",
    price: 2999,
    target: "Large corporations, family offices",
    description: "Complete institutional portfolio suite with white-label capabilities",
    features: [
      "Full suite - unlimited models",
      "White-label reports & branding",
      "Custom AI optimization",
      "Dedicated account manager",
      "Priority phone & video support",
      "API access for integration",
      "Custom compliance frameworks",
      "Bi-weekly strategy calls"
    ],
    buttonText: "Start Free for 7 Days",
    icon: <Crown className="h-6 w-6" />
  }
];

interface InstitutionalPricingPlansProps {
  className?: string;
}

export const InstitutionalPricingPlans = ({ className }: InstitutionalPricingPlansProps) => {
  const currency: Currency = "USD";
  const navigate = useNavigate();

  const handlePlanSelect = (planId: InstitutionalPlanType) => {
    // Navigate directly to Paystack payment
    navigate(`/payment-method?plan=${planId}&currency=${currency}&type=institutional`);
  };

  const formatPrice = (price: number) => {
    if (price >= 2999) return `$${price.toLocaleString()}+`;
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className={`container mx-auto px-4 py-16 ${className}`}>
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 border-amber-500/50 text-amber-600 dark:text-amber-400">
          Institutional Pricing
        </Badge>
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
          Self-Service Institutional Plans
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          AI-powered portfolio frameworks designed for corporations, asset managers, and financial institutions
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {institutionalPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              plan.popular 
                ? "border-amber-500/50 shadow-lg shadow-amber-500/20 scale-105" 
                : "border-border/50"
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-600 to-amber-500 border-0">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4 text-amber-600 dark:text-amber-400">
                {plan.icon}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{plan.target}</p>
              <div className="text-4xl font-bold mt-4">
                {formatPrice(plan.price)}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
              <CardDescription className="mt-2">{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white border-0"
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.buttonText}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-2">
                7-day free trial • Cancel anytime
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12 space-y-2">
        <p className="text-sm text-muted-foreground">
          All plans include automated billing, invoice generation, and instant dashboard access
        </p>
        <p className="text-xs text-muted-foreground">
          Secure payments powered by Paystack • PCI DSS compliant
        </p>
      </div>
    </div>
  );
};
