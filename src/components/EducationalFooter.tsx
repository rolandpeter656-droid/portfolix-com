import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ChevronRight } from "lucide-react";

export const EducationalFooter = () => {
  const educationLinks = [
    { href: "/learn#diversification", label: "Understanding Diversification" },
    { href: "/learn#asset-allocation", label: "What is Asset Allocation?" },
    { href: "/learn#rebalancing", label: "When to Rebalance" },
    { href: "/learn#etfs", label: "How ETFs Work" },
  ];

  return (
    <Card className="bg-muted/30 border-muted">
      <CardContent className="py-6">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">New to Investing?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Learn more about the investment concepts behind this portfolio:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {educationLinks.map((link) => (
                <Link 
                  key={link.href}
                  to={link.href}
                  className="flex items-center gap-2 text-sm text-primary hover:underline group"
                >
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
