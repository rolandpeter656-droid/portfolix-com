import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, DollarSign, Zap, ArrowLeft } from "lucide-react";

interface GoalSelectionProps {
  onComplete: (goal: string) => void;
  onBack?: () => void;
}

const goalOptions = [
  {
    value: "Retirement",
    label: "Retirement",
    description: "Build long-term wealth for retirement security",
    icon: Target,
  },
  {
    value: "Wealth accumulation",
    label: "Wealth Accumulation",
    description: "Grow wealth steadily over time",
    icon: TrendingUp,
  },
  {
    value: "Income",
    label: "Income Generation",
    description: "Generate regular passive income",
    icon: DollarSign,
  },
  {
    value: "Speculation",
    label: "Speculation",
    description: "Take calculated risks for higher returns",
    icon: Zap,
  },
];

export const GoalSelection = ({ onComplete, onBack }: GoalSelectionProps) => {
  const [selectedGoal, setSelectedGoal] = useState<string>("");

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
  };

  const handleContinue = () => {
    if (selectedGoal) {
      onComplete(selectedGoal);
    }
  };

  return (
    <section className="min-h-[100svh] flex items-center justify-center bg-background py-16 sm:py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto animate-fade-in">
          {onBack && (
            <button
              onClick={onBack}
              className="mb-4 sm:mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Back</span>
            </button>
          )}
          
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-4">
              What's Your Primary Investment Goal?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
              Help us tailor your portfolio to match your financial objectives
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {goalOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedGoal === option.value
                      ? "border-primary bg-primary/5 shadow-glow"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => handleGoalSelect(option.value)}
                >
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${
                        selectedGoal === option.value 
                          ? "bg-primary/20" 
                          : "bg-primary/10"
                      }`}>
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg mb-1 sm:mb-2">{option.label}</CardTitle>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              disabled={!selectedGoal}
              onClick={handleContinue}
              className="w-full sm:w-auto px-6 sm:px-8 py-3"
            >
              Continue to Portfolio
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
