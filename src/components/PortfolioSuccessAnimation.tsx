import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface PortfolioSuccessAnimationProps {
  onViewPortfolio: () => void;
  onGenerateAnother: () => void;
}

export const PortfolioSuccessAnimation = ({
  onViewPortfolio,
  onGenerateAnother,
}: PortfolioSuccessAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger confetti burst
    const duration = 2000;
    const end = Date.now() + duration;

    const colors = ["#1e40af", "#f59e0b", "#10b981"];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Show checkmark animation
    setTimeout(() => setShowCheckmark(true), 300);
    
    // Show content
    setTimeout(() => setShowContent(true), 800);
  }, []);

  const handleViewPortfolio = () => {
    setIsVisible(false);
    setTimeout(onViewPortfolio, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center animate-fade-in">
      <div className="text-center space-y-6 px-4 max-w-md animate-scale-in">
        {/* Checkmark Circle Animation */}
        <div className="relative inline-flex items-center justify-center">
          <div
            className={cn(
              "w-24 h-24 rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 shadow-[0_0_40px_rgba(30,64,175,0.4)] flex items-center justify-center transition-all duration-700",
              showCheckmark ? "scale-100 opacity-100" : "scale-0 opacity-0"
            )}
          >
            <Check
              className={cn(
                "w-12 h-12 text-primary-foreground transition-all duration-500 delay-200",
                showCheckmark ? "scale-100 opacity-100" : "scale-0 opacity-0"
              )}
              strokeWidth={3}
            />
          </div>
          
          {/* Glow ring */}
          <div
            className={cn(
              "absolute inset-0 w-24 h-24 rounded-full bg-primary/20 animate-ping transition-opacity duration-1000",
              showCheckmark ? "opacity-100" : "opacity-0"
            )}
          />
        </div>

        {/* Text Content */}
        <div
          className={cn(
            "space-y-3 transition-all duration-500",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <h2 className="text-3xl font-bold text-foreground">
            🎯 Your Personalized Portfolio is Ready!
          </h2>
          <p className="text-muted-foreground text-lg">
            You've taken your first step toward smarter investing.
            <br />
            Explore your portfolio below.
          </p>
        </div>

        {/* Action Buttons */}
        <div
          className={cn(
            "flex flex-col sm:flex-row gap-3 justify-center pt-4 transition-all duration-500 delay-200",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <Button
            onClick={handleViewPortfolio}
            size="lg"
            className="shadow-lg hover:shadow-xl transition-all duration-300"
          >
            View My Portfolio
          </Button>
          <Button
            onClick={onGenerateAnother}
            variant="outline"
            size="lg"
            className="transition-all duration-300"
          >
            Generate Another
          </Button>
        </div>
      </div>
    </div>
  );
};
