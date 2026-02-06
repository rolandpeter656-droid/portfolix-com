import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Video, FileText, Crown, Lock, ExternalLink, Play } from "lucide-react";

interface ProEducationSectionProps {
  isPro: boolean;
  onUpgrade?: () => void;
}

const webinars = [
  {
    title: "Advanced Portfolio Diversification Strategies",
    duration: "45 min",
    level: "Advanced",
    date: "Weekly Live",
    description: "Learn how professional investors diversify across asset classes"
  },
  {
    title: "Risk Management for Volatile Markets",
    duration: "30 min",
    level: "Intermediate",
    date: "Dec 28, 2025",
    description: "Protect your portfolio during market downturns"
  },
  {
    title: "AI-Powered Investment Decisions",
    duration: "60 min",
    level: "All Levels",
    date: "Jan 5, 2026",
    description: "How to leverage AI tools for smarter investing"
  }
];

const guides = [
  {
    title: "The Complete Guide to Asset Allocation",
    pages: 48,
    category: "Strategy",
    description: "Master the fundamentals of building a balanced portfolio"
  },
  {
    title: "Tax-Efficient Investing Handbook",
    pages: 32,
    category: "Tax",
    description: "Maximize returns with smart tax strategies"
  },
  {
    title: "Crypto Portfolio Integration",
    pages: 24,
    category: "Crypto",
    description: "Safely add digital assets to your investment mix"
  },
  {
    title: "ESG Investing: A Practical Approach",
    pages: 36,
    category: "ESG",
    description: "Align your investments with your values"
  }
];

export const ProEducationSection = ({ isPro, onUpgrade }: ProEducationSectionProps) => {
  if (!isPro) {
    return (
      <Card className="border-dashed border-2 border-muted">
        <CardContent className="p-6 sm:p-8 text-center">
          <Lock className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold text-lg sm:text-xl mb-2">Exclusive Pro Content</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
            Access exclusive webinars and strategy guides curated by investment professionals
          </p>
          {onUpgrade && (
            <Button onClick={onUpgrade} size="lg" className="text-base">
              <Crown className="h-5 w-5 mr-2" />
              Upgrade to Pro - $25/month
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Webinars Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Video className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Exclusive Webinars
            <Badge variant="secondary" className="ml-2">
              <Crown className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {webinars.map((webinar, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/50 rounded-lg gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Play className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm sm:text-base">{webinar.title}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {webinar.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {webinar.duration}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {webinar.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {webinar.date}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Watch
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategy Guides Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Strategy Guides
            <Badge variant="secondary" className="ml-2">
              <Crown className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {guides.map((guide, index) => (
              <div
                key={index}
                className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm sm:text-base">{guide.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {guide.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {guide.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {guide.pages} pages
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-3">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Download PDF
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
