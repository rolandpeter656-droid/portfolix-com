import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Target, TrendingUp, DollarSign, Shield, Zap, Clock, Rocket, HelpCircle, Scale } from "lucide-react";
import { analytics } from "@/lib/analytics";

interface OnboardingOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  preview: string;
  allocation?: { stocks: number; bonds: number };
  expectedReturn?: string;
  volatility?: string;
  riskProfile?: string;
}

interface OnboardingQuestion {
  id: string;
  step: number;
  question: string;
  helpText: string;
  options: OnboardingOption[];
}

const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: "goal",
    step: 1,
    question: "What's your primary investment goal?",
    helpText: "This helps us recommend the right mix of investments for your situation.",
    options: [
      {
        value: "retirement",
        label: "Build retirement savings",
        icon: <Target className="h-6 w-6" />,
        preview: "Long-term growth with balanced risk"
      },
      {
        value: "wealth",
        label: "Grow wealth over time",
        icon: <TrendingUp className="h-6 w-6" />,
        preview: "Maximum growth potential"
      },
      {
        value: "income",
        label: "Generate passive income",
        icon: <DollarSign className="h-6 w-6" />,
        preview: "Regular dividends and distributions"
      },
      {
        value: "preserve",
        label: "Preserve capital",
        icon: <Shield className="h-6 w-6" />,
        preview: "Stability with modest growth"
      }
    ]
  },
  {
    id: "timeline",
    step: 2,
    question: "When will you need this money?",
    helpText: "Longer timelines allow for more growth-focused investments.",
    options: [
      {
        value: "short",
        label: "Less than 3 years",
        icon: <Zap className="h-6 w-6" />,
        preview: "Conservative, stable investments",
        riskProfile: "conservative"
      },
      {
        value: "medium",
        label: "3-10 years",
        icon: <Clock className="h-6 w-6" />,
        preview: "Balanced growth and stability",
        riskProfile: "moderate"
      },
      {
        value: "long",
        label: "10+ years",
        icon: <Rocket className="h-6 w-6" />,
        preview: "Growth-focused investments",
        riskProfile: "aggressive"
      },
      {
        value: "unsure",
        label: "Not sure yet",
        icon: <HelpCircle className="h-6 w-6" />,
        preview: "Balanced approach recommended",
        riskProfile: "moderate"
      }
    ]
  },
  {
    id: "volatility",
    step: 3,
    question: "How do you feel about market ups and downs?",
    helpText: "There's no wrong answer. This helps us match your comfort level.",
    options: [
      {
        value: "low",
        label: "I prefer stability even if returns are lower",
        icon: <Shield className="h-6 w-6" />,
        preview: "Conservative approach",
        allocation: { stocks: 40, bonds: 60 },
        expectedReturn: "4-6%",
        volatility: "Low"
      },
      {
        value: "medium",
        label: "I can handle some ups and downs",
        icon: <Scale className="h-6 w-6" />,
        preview: "Balanced approach",
        allocation: { stocks: 60, bonds: 40 },
        expectedReturn: "6-8%",
        volatility: "Moderate"
      },
      {
        value: "high",
        label: "I want maximum growth and can handle big swings",
        icon: <Rocket className="h-6 w-6" />,
        preview: "Aggressive approach",
        allocation: { stocks: 80, bonds: 20 },
        expectedReturn: "8-10%",
        volatility: "High"
      }
    ]
  }
];

interface OnboardingAnswers {
  goal?: OnboardingOption;
  timeline?: OnboardingOption;
  volatility?: OnboardingOption;
}

interface SimplifiedOnboardingProps {
  onComplete: (answers: OnboardingAnswers) => void;
  onBack?: () => void;
}

export const SimplifiedOnboarding = ({ onComplete, onBack }: SimplifiedOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});

  const currentQuestion = ONBOARDING_QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_QUESTIONS.length) * 100;

  const handleOptionSelect = (questionId: string, option: OnboardingOption) => {
    const newAnswers = {
      ...answers,
      [questionId]: option
    };
    setAnswers(newAnswers);

    // Track step completion
    analytics.onboardingStepCompleted(currentStep + 1, questionId);

    // Auto-advance to next question after brief delay
    setTimeout(() => {
      if (currentStep < ONBOARDING_QUESTIONS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Generate portfolio recommendation
        onComplete(newAnswers);
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (onBack) {
      onBack();
    }
  };

  // Calculate live allocation preview
  const getLiveAllocation = () => {
    if (!answers.volatility?.allocation) {
      // Default balanced allocation
      return { stocks: 60, bonds: 40 };
    }

    let stockAllocation = answers.volatility.allocation.stocks;
    let bondAllocation = answers.volatility.allocation.bonds;

    // Adjust based on timeline if selected
    if (answers.timeline) {
      if (answers.timeline.value === "short") {
        stockAllocation = Math.max(stockAllocation - 20, 20);
        bondAllocation = Math.min(bondAllocation + 20, 80);
      } else if (answers.timeline.value === "long") {
        stockAllocation = Math.min(stockAllocation + 10, 90);
        bondAllocation = Math.max(bondAllocation - 10, 10);
      }
    }

    return { stocks: stockAllocation, bonds: bondAllocation };
  };

  const allocation = getLiveAllocation();

  return (
    <section className="min-h-[100svh] flex items-center justify-center bg-background py-16 sm:py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto animate-fade-in">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-4 sm:mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Back</span>
          </button>

          {/* Progress Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                Step {currentStep + 1} of {ONBOARDING_QUESTIONS.length}
              </span>
              <span className="text-xs sm:text-sm font-medium text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="shadow-soft border-0 animate-scale-in mb-6">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
                {currentQuestion.question}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground text-center mb-6 sm:mb-8">
                {currentQuestion.helpText}
              </p>

              {/* Options Grid */}
              <div className="grid gap-3 sm:gap-4">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id as keyof OnboardingAnswers]?.value === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      className={`w-full text-left rounded-xl border p-4 sm:p-5 transition-all duration-200 ease-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        isSelected 
                          ? "bg-primary border-primary shadow-glow scale-[1.02]" 
                          : "glass-card border-border hover:border-primary/50 hover:scale-[1.01]"
                      }`}
                      onClick={() => handleOptionSelect(currentQuestion.id, option)}
                    >
                      <div className="flex items-start gap-3 sm:gap-4 w-full">
                        <div className={`flex-shrink-0 p-2.5 sm:p-3 rounded-full ${
                          isSelected 
                            ? "bg-primary-foreground/20 text-primary-foreground" 
                            : "bg-primary/10 text-primary"
                        }`}>
                          {option.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-[15px] sm:text-base md:text-lg leading-snug block mb-1 ${
                            isSelected 
                              ? "font-semibold text-primary-foreground" 
                              : "font-medium text-foreground"
                          }`}>
                            {option.label}
                          </span>
                          <span className={`text-xs sm:text-sm leading-relaxed block ${
                            isSelected 
                              ? "text-primary-foreground/90" 
                              : "text-muted-foreground"
                          }`}>
                            {option.preview}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Live Portfolio Preview - shown after first answer */}
          {Object.keys(answers).length > 0 && (
            <Card className="shadow-soft border-0 bg-card/50 backdrop-blur-sm animate-fade-in mt-2">
              <CardContent className="p-5 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Your Portfolio is Taking Shape
                </h3>
                
                <div className="space-y-4">
                  {/* Show selected answers */}
                  <div className="flex flex-wrap gap-2">
                    {answers.goal && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm">
                        {answers.goal.icon}
                        <span className="truncate max-w-[200px]">{answers.goal.label}</span>
                      </span>
                    )}
                    {answers.timeline && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs sm:text-sm">
                        {answers.timeline.icon}
                        <span className="truncate max-w-[200px]">{answers.timeline.label}</span>
                      </span>
                    )}
                  </div>

                  {/* Allocation Preview Bar */}
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-muted-foreground">Suggested Allocation:</p>
                    <div className="h-9 sm:h-10 rounded-lg overflow-hidden flex">
                      <div 
                        className="bg-primary flex items-center justify-center text-primary-foreground text-xs sm:text-sm font-medium transition-all duration-500"
                        style={{ width: `${allocation.stocks}%` }}
                      >
                        Stocks {allocation.stocks}%
                      </div>
                      <div 
                        className="bg-secondary flex items-center justify-center text-secondary-foreground text-xs sm:text-sm font-medium transition-all duration-500"
                        style={{ width: `${allocation.bonds}%` }}
                      >
                        Bonds {allocation.bonds}%
                      </div>
                    </div>
                    {answers.volatility && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Expected Return: <span className="text-foreground font-medium">{answers.volatility.expectedReturn}</span> annually
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

// Portfolio generation helper functions
export const generatePortfolioFromAnswers = (answers: OnboardingAnswers) => {
  const { goal, timeline, volatility } = answers;

  if (!goal || !timeline || !volatility) {
    throw new Error("Missing required answers");
  }

  // Base allocation from volatility preference
  let stockAllocation = volatility.allocation?.stocks || 60;
  let bondAllocation = volatility.allocation?.bonds || 40;

  // Adjust based on timeline
  if (timeline.value === "short") {
    stockAllocation = Math.max(stockAllocation - 20, 20);
    bondAllocation = Math.min(bondAllocation + 20, 80);
  } else if (timeline.value === "long") {
    stockAllocation = Math.min(stockAllocation + 10, 90);
    bondAllocation = Math.max(bondAllocation - 10, 10);
  }

  // Map to risk score (0-100)
  const riskScoreMap: Record<string, number> = {
    low: 25,
    medium: 50,
    high: 75
  };
  const riskScore = riskScoreMap[volatility.value] || 50;

  // Map to experience level
  const experienceLevel = volatility.value === "high" ? "advanced" : 
                          volatility.value === "medium" ? "intermediate" : "beginner";

  // Map timeline to string format
  const timelineMap: Record<string, string> = {
    short: "1-2 years",
    medium: "3-5 years",
    long: "10+ years",
    unsure: "6-10 years"
  };

  return {
    riskScore,
    experienceLevel: experienceLevel as "beginner" | "intermediate" | "advanced",
    timeline: timelineMap[timeline.value] || "6-10 years",
    goal: goal.value,
    allocation: {
      stocks: stockAllocation,
      bonds: bondAllocation
    },
    expectedReturn: volatility.expectedReturn,
    volatilityLevel: volatility.volatility
  };
};
