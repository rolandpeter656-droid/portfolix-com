import { useState } from "react";
import { PricingPlans, PlanType } from "@/components/PricingPlans";
import { useToast } from "@/hooks/use-toast";

const Pricing = () => {
  const [currentPlan, setCurrentPlan] = useState<PlanType>("free");
  const { toast } = useToast();

  const handlePlanSelect = (plan: PlanType) => {
    setCurrentPlan(plan);
    toast({
      title: "Plan Updated!",
      description: `You are now on the ${plan} plan.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <PricingPlans 
        currentPlan={currentPlan}
        onPlanSelect={handlePlanSelect}
      />
    </div>
  );
};

export default Pricing;