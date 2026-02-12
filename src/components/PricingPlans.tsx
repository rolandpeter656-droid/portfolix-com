import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown, Gem, Sparkles, ArrowRight, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { analytics } from "@/lib/analytics/index";

export type PlanType = "free" | "pro" | "elite";
export type BillingPeriod = "monthly" | "annual";

interface PricingFeature {
  name: string;
  description: string;
  included: boolean;
  highlight?: boolean;
  upsellMessage?: string;
}

interface PricingPlan {
  id: PlanType;
  name: string;
  price: number;
  annualPrice: number;
  annualSavings: number;
  headline: string;
  description: string;
  features: PricingFeature[];
  buttonText: string;
  popular?: boolean;
  icon: React.ReactNode;
  idealFor: string[];
  trialPeriod?: number;
  trialTerms?: string;
}

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    annualPrice: 0,
    annualSavings: 0,
    headline: "Get Started with Portfolio Intelligence",
    description: "Everything you need to build your investment strategy",
    features: [
      { name: "Unlimited Portfolio Generation", description: "Build as many portfolios as you want", included: true, highlight: true },
      { name: "Personalized Recommendations", description: "Portfolios matched to your goals and risk tolerance", included: true },
      { name: "Asset Allocation Guidance", description: "Understand how to distribute your investments", included: true },
      { name: "Implementation Instructions", description: "Step-by-step guide to execute your portfolio", included: true },
      { name: "Educational Content", description: "Learn investment concepts as you build", included: true },
      { name: "Portfolio Saving & Tracking", description: "Save your portfolios for easy reference", included: true },
      { name: "AI Market Analysis", description: "Understand how events affect your investments", included: false, upsellMessage: "Upgrade to Pro" },
      { name: "Rebalancing Alerts", description: "Get notified when your portfolio needs adjustment", included: false, upsellMessage: "Available with Pro" },
      { name: "Portfolio Optimization", description: "Continuous suggestions to improve your strategy", included: false, upsellMessage: "Unlock with Pro" }
    ],
    buttonText: "Get Started Free",
    icon: <Sparkles className="h-5 w-5" />,
    idealFor: [
      "First-time investors building their strategy",
      "Anyone exploring different portfolio approaches",
      "Investors who want clear implementation guidance"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: 15,
    annualPrice: 144,
    annualSavings: 36,
    headline: "Ongoing Guidance & Optimization",
    description: "Maximize your portfolio's performance with continuous insights",
    features: [
      { name: "Everything in Free", description: "All core portfolio building features", included: true },
      { name: "AI-Powered Market Analysis", description: "How current events affect your holdings", included: true, highlight: true },
      { name: "Smart Rebalancing Alerts", description: "Notifications when allocations drift from targets", included: true, highlight: true },
      { name: "Portfolio Health Checks", description: "Monthly analysis of performance and positioning", included: true, highlight: true },
      { name: "Personalized Optimization", description: "AI recommendations based on market conditions", included: true, highlight: true },
      { name: "Priority Email Support", description: "Get answers within 24 hours", included: true },
      { name: "Early Access to New Strategies", description: "Be first to access latest portfolio models", included: true },
      { name: "Advanced Performance Analytics", description: "Track returns, volatility, and benchmarks", included: true }
    ],
    buttonText: "Try Pro Free for 14 Days",
    popular: true,
    icon: <Crown className="h-5 w-5" />,
    idealFor: [
      "Investors who have implemented their first portfolio",
      "Anyone wanting ongoing guidance and optimization",
      "People serious about maximizing investment performance"
    ],
    trialPeriod: 14,
    trialTerms: "Cancel anytime during your free trial"
  },
  {
    id: "elite",
    name: "Elite",
    price: 49,
    annualPrice: 470,
    annualSavings: 118,
    headline: "Advanced Tools for Serious Investors",
    description: "Comprehensive features for managing complex portfolios",
    features: [
      { name: "Everything in Pro", description: "All Pro features plus advanced capabilities", included: true },
      { name: "Tax-Loss Harvesting Guidance", description: "Identify opportunities to reduce your tax burden", included: true, highlight: true },
      { name: "Multi-Account Coordination", description: "Optimize across 401(k), IRA, and taxable accounts", included: true, highlight: true },
      { name: "Custom Portfolio Construction", description: "Work with experts to build specialized strategies", included: true, highlight: true },
      { name: "Advanced Risk Analytics", description: "Factor exposure, correlation, scenario testing", included: true, highlight: true },
      { name: "Direct Expert Access", description: "Monthly video consultations with investment experts", included: true, highlight: true },
      { name: "White-Glove Onboarding", description: "Personalized portfolio setup and implementation", included: true },
      { name: "API Access", description: "Integrate PortfoliX with your own tools", included: true }
    ],
    buttonText: "Schedule Consultation",
    icon: <Gem className="h-5 w-5" />,
    idealFor: [
      "Investors managing $50,000+ portfolios",
      "Anyone with complex tax optimization needs",
      "Serious investors seeking expert-level guidance"
    ]
  }
];

const faqs = [
  {
    question: "Why is portfolio generation unlimited on the free tier?",
    answer: "We believe everyone deserves access to professional-quality investment guidance. You should be able to explore different strategies and find what works for you without hitting artificial limits. We make money when you find our ongoing guidance valuable enough to upgrade, not by restricting access to basic recommendations."
  },
  {
    question: "When should I upgrade to Pro?",
    answer: "Most users upgrade after implementing their first portfolio and wanting ongoing guidance to optimize performance. If you find yourself returning regularly to check market conditions or wondering if you should rebalance, Pro provides the continuous insights that help you make confident decisions."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. You can cancel your Pro or Elite subscription at any time with no penalties or fees. Your access continues until the end of your billing period, and you can always downgrade to the free tier to maintain access to your saved portfolios."
  },
  {
    question: "What's the difference between Pro and Elite?",
    answer: "Pro focuses on ongoing portfolio guidance and optimization for typical investors. Elite adds advanced features like tax-loss harvesting, multi-account coordination, and direct expert access for investors with larger, more complex portfolios who need comprehensive wealth management support."
  }
];

interface PricingPlansProps {
  currentPlan?: PlanType;
  onPlanSelect?: (plan: PlanType) => void;
}

export const PricingPlans = ({ currentPlan = "free", onPlanSelect }: PricingPlansProps) => {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const navigate = useNavigate();

  const handlePlanSelect = (planId: PlanType) => {
    if (planId === "free") {
      navigate("/signup");
      onPlanSelect?.(planId);
      return;
    }
    if (planId === "elite") {
      window.open("mailto:peter@portfolixapps.com?subject=Elite Plan Consultation Request", "_blank");
      return;
    }
    if (planId === "pro") {
      analytics.upgradeInitiated(planId);
      navigate(`/payment-method?plan=${planId}&billing=${billingPeriod}`);
      return;
    }
  };

  const formatPrice = (plan: PricingPlan) => {
    if (plan.price === 0) return "$0";
    if (billingPeriod === "annual") return `$${Math.round(plan.annualPrice / 12)}`;
    return `$${plan.price}`;
  };

  const getPeriodLabel = (plan: PricingPlan) => {
    if (plan.price === 0) return "";
    return "/month";
  };

  return (
    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-14 relative z-10">
        <h2 className="text-foreground mb-4">
          Choose Your Investment Journey
        </h2>
        <p className="text-lg text-muted-foreground mb-10">
          Start free and upgrade when you're ready for ongoing guidance
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-border bg-card">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
              billingPeriod === "monthly"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("annual")}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              billingPeriod === "annual"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annual
            <Badge variant="secondary" className="text-[10px] bg-success/10 text-success border-success/20">
              Save 20%
            </Badge>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto relative z-10">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-xl border bg-card flex flex-col transition-all duration-300 hover-lift ${
              plan.popular
                ? "border-primary/50 md:scale-105 z-10 shadow-lg shadow-primary/10"
                : "border-border hover:border-primary/20"
            } ${currentPlan === plan.id ? "ring-2 ring-primary" : ""}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-success text-primary-foreground font-semibold px-4">
                MOST POPULAR
              </Badge>
            )}

            <div className="text-center p-6 pb-4">
              <div className="flex justify-center mb-4 text-primary">
                {plan.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-foreground">{formatPrice(plan)}</span>
                <span className="text-sm text-muted-foreground">{getPeriodLabel(plan)}</span>
              </div>
              {plan.annualSavings > 0 && billingPeriod === "annual" && (
                <p className="text-xs text-success mt-1 font-medium">
                  Save ${plan.annualSavings} per year
                </p>
              )}
              <p className="text-sm font-medium text-foreground mt-3">{plan.headline}</p>
              <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
            </div>

            <div className="flex-1 flex flex-col px-6 pb-6">
              {/* Features */}
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    {feature.included ? (
                      <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${feature.highlight ? "text-primary" : "text-success"}`} />
                    ) : (
                      <X className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground/30" />
                    )}
                    <div className="flex-1">
                      <span className={`text-sm ${!feature.included ? "text-muted-foreground/50" : feature.highlight ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                        {feature.name}
                      </span>
                      {!feature.included && feature.upsellMessage && (
                        <span className="text-xs text-primary block mt-0.5">{feature.upsellMessage}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Ideal For */}
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 tracking-wide">IDEAL FOR:</h4>
                <ul className="space-y-1.5">
                  {plan.idealFor.map((use, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                      {use}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="mt-6">
                <Button
                  className={`w-full font-semibold ${
                    plan.popular
                      ? "bg-primary hover:bg-primary-glow text-primary-foreground shadow-lg shadow-primary/20"
                      : currentPlan === plan.id
                      ? ""
                      : "bg-card border border-border hover:border-primary/30 text-foreground hover:bg-card"
                  }`}
                  variant={currentPlan === plan.id ? "secondary" : plan.popular ? "default" : "outline"}
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={currentPlan === plan.id}
                >
                  {currentPlan === plan.id ? "Current Plan" : plan.buttonText}
                </Button>
                {plan.trialTerms && (
                  <p className="text-xs text-muted-foreground text-center mt-2">{plan.trialTerms}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Journey Section */}
      <div className="mt-20 sm:mt-24 max-w-4xl mx-auto relative z-10">
        <h3 className="text-foreground text-center mb-10">
          Your Typical Journey with PortfoliX
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: 1, title: "Start Free", desc: "Build unlimited portfolios, explore strategies, and implement in your brokerage account." },
            { step: 2, title: "Upgrade to Pro", desc: "After implementing, get ongoing market insights, rebalancing alerts, and optimization recommendations." },
            { step: 3, title: "Consider Elite", desc: "As your portfolio grows past $50K, access tax optimization, multi-account coordination, and expert access." },
          ].map((item) => (
            <div key={item.step} className="text-center p-6 rounded-xl bg-card border border-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mx-auto mb-4">
                {item.step}
              </div>
              <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-20 sm:mt-24 max-w-3xl mx-auto relative z-10">
        <div className="flex items-center justify-center gap-2 mb-10">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h3 className="text-foreground">Common Questions</h3>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`} className="border-border">
              <AccordionTrigger className="text-left text-sm sm:text-base text-foreground hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Footer Note */}
      <div className="text-center mt-12 text-sm text-muted-foreground relative z-10">
        <p>All plans include secure payment processing and email support.</p>
        <p className="mt-2">
          Questions? Contact us at{" "}
          <a href="mailto:peter@portfolixapps.com" className="text-primary hover:underline">
            peter@portfolixapps.com
          </a>
        </p>
      </div>
    </div>
  );
};
