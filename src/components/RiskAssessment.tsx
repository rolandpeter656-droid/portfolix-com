import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Shield, Zap, Target, ArrowLeft } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: { value: number; label: string; icon: React.ReactNode }[];
}

const questions: Question[] = [
  {
    id: "experience",
    question: "What's your investment experience?",
    options: [
      { value: 1, label: "Beginner", icon: <Shield className="h-5 w-5" /> },
      { value: 2, label: "Some experience", icon: <Target className="h-5 w-5" /> },
      { value: 3, label: "Experienced", icon: <TrendingUp className="h-5 w-5" /> },
      { value: 4, label: "Expert", icon: <Zap className="h-5 w-5" /> },
    ],
  },
  {
    id: "timeline",
    question: "What's your investment timeline?",
    options: [
      { value: 1, label: "1-2 years", icon: <Shield className="h-5 w-5" /> },
      { value: 2, label: "3-5 years", icon: <Target className="h-5 w-5" /> },
      { value: 3, label: "6-10 years", icon: <TrendingUp className="h-5 w-5" /> },
      { value: 4, label: "10+ years", icon: <Zap className="h-5 w-5" /> },
    ],
  },
  {
    id: "volatility",
    question: "How comfortable are you with market volatility?",
    options: [
      { value: 1, label: "Very conservative", icon: <Shield className="h-5 w-5" /> },
      { value: 2, label: "Somewhat conservative", icon: <Target className="h-5 w-5" /> },
      { value: 3, label: "Moderate risk", icon: <TrendingUp className="h-5 w-5" /> },
      { value: 4, label: "High risk tolerance", icon: <Zap className="h-5 w-5" /> },
    ],
  },
];

interface RiskAssessmentProps {
  onComplete: (riskScore: number, experienceLevel: string, timeline: string) => void;
  onBack?: () => void;
}

export const RiskAssessment = ({ onComplete, onBack }: RiskAssessmentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate risk score
      const totalScore = Object.values(newAnswers).reduce((sum, score) => sum + score, 0);
      const riskScore = (totalScore / (questions.length * 4)) * 100;
      
      // Map experience level
      const experienceMapping = {
        1: "beginner",
        2: "intermediate", 
        3: "advanced",
        4: "advanced"
      };
      
      // Map timeline
      const timelineMapping = {
        1: "1-2 years",
        2: "3-5 years", 
        3: "6-10 years",
        4: "10+ years"
      };
      
      const experienceLevel = experienceMapping[newAnswers.experience as keyof typeof experienceMapping];
      const timeline = timelineMapping[newAnswers.timeline as keyof typeof timelineMapping];
      
      onComplete(riskScore, experienceLevel, timeline);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <section className="min-h-screen flex items-center justify-center bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto animate-fade-in">
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
          
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Let's Assess Your Risk Profile
            </h2>
            <p className="text-lg text-muted-foreground">
              Answer a few questions to help our AI create the perfect portfolio for you
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="shadow-soft border-0 animate-scale-in">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-foreground">
                {questions[currentQuestion].question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {questions[currentQuestion].options.map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className="h-auto p-6 justify-start text-left hover:bg-accent hover:border-primary transition-all"
                    onClick={() => handleAnswer(option.value)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 p-2 bg-primary/10 rounded-full">
                        {option.icon}
                      </div>
                      <span className="text-lg font-medium">{option.label}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};