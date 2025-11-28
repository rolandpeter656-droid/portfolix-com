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
    <section className="min-h-screen flex items-center justify-center bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto animate-fade-in">
          {/* Back Arrow */}
          {onBack && (
            <button
              onClick={onBack}
              className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
          )}
          
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What's Your Primary Investment Goal?
            </h2>
            <p className="text-lg text-muted-foreground">
              Help us tailor your portfolio to match your financial objectives
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
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
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${
                        selectedGoal === option.value 
                          ? "bg-primary/20" 
                          : "bg-primary/10"
                      }`}>
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{option.label}</CardTitle>
                        <p className="text-sm text-muted-foreground">
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
              className="px-8"
            >
              Continue to Portfolio
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
