import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Tablet, TrendingUp, PieChart, BarChart3, ArrowUpRight } from "lucide-react";
import { MarketAnalysisTool } from "@/components/MarketAnalysisTool";

interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  image: string;
  metrics: { label: string; value: string; trend: string }[];
  link?: string;
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: "builder",
    title: "Portfolio Builder",
    description: "Answer 3 questions and get a personalized portfolio in minutes",
    icon: PieChart,
    image: "photo-1518770660439-4636190af475",
    metrics: [
      { label: "Asset Allocation", value: "Optimized", trend: "Updated" },
      { label: "Diversification", value: "Excellent", trend: "+7.8%" },
      { label: "Expected Return", value: "14.2%", trend: "+1.9%" }
    ],
    link: "/?start=builder"
  },
  {
    id: "analysis",
    title: "Market Analysis",
    description: "Deep market insights powered by advanced AI algorithms",
    icon: BarChart3,
    image: "photo-1487058792275-0ad4aaf24ca7",
    metrics: [
      { label: "Market Sentiment", value: "Bullish", trend: "+5.2%" },
      { label: "Volatility Index", value: "16.7", trend: "-1.3%" },
      { label: "AI Confidence", value: "94%", trend: "+3.1%" }
    ]
  },
  {
    id: "portfolio",
    title: "Portfolio Details",
    description: "View your holdings, allocations, and implementation guide",
    icon: TrendingUp,
    image: "photo-1526374965328-7f61d4dc18c5",
    metrics: [
      { label: "Holdings", value: "5 ETFs", trend: "Diversified" },
      { label: "Risk Level", value: "Matched", trend: "Personalized" },
      { label: "PDF Export", value: "Available", trend: "Download" }
    ]
  }
];

export const ProductShowcase = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(showcaseItems[0]);
  const [isMarketAnalysisOpen, setIsMarketAnalysisOpen] = useState(false);

  const handleItemClick = (item: typeof showcaseItems[0]) => {
    if (item.link) {
      navigate(item.link);
      return;
    }
    
    setActiveItem(item);
    if (item.id === "analysis") {
      setIsMarketAnalysisOpen(true);
    }
  };

  return (
    <>
      <MarketAnalysisTool 
        isOpen={isMarketAnalysisOpen} 
        onClose={() => setIsMarketAnalysisOpen(false)} 
      />
      <section id="product" className="py-12 sm:py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <Badge className="mb-3 sm:mb-4 bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm">
            Product Showcase
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sans-bold text-foreground mb-4 sm:mb-6">
            See PortfoliX in
            <span className="text-gradient block mt-2">Action</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Build personalized portfolios with AI-powered recommendations, then implement them in your own brokerage.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Product Navigation */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {/* Mobile: Horizontal scroll, Desktop: Vertical list */}
            <div className="lg:w-1/3 flex lg:flex-col gap-3 sm:gap-4 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
              {showcaseItems.map((item) => (
                <Card 
                  key={item.id}
                  className={`cursor-pointer transition-all duration-300 hover-scale flex-shrink-0 w-[260px] sm:w-[280px] lg:w-full ${
                    activeItem.id === item.id 
                      ? 'bg-gradient-card border-primary shadow-glow' 
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <CardContent className="p-4 sm:p-5 lg:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0 ${
                        activeItem.id === item.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-muted-foreground'
                      }`}>
                        <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-sans-bold text-base sm:text-lg text-foreground mb-1 sm:mb-2 truncate">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      {activeItem.id === item.id && (
                        <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Display */}
            <div className="lg:w-2/3">
              <Card className="bg-gradient-card border-border shadow-card overflow-hidden">
                <CardContent className="p-0">
                  {/* Device Mockup */}
                  <div className="relative bg-secondary/50 p-3 sm:p-4 md:p-6 lg:p-8">
                    <div className="bg-background rounded-lg shadow-2xl border border-border overflow-hidden">
                      {/* Browser Bar */}
                      <div className="bg-secondary/80 px-3 sm:px-4 py-2 sm:py-3 border-b border-border flex items-center gap-2">
                        <div className="flex gap-1.5 sm:gap-2">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500" />
                          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="flex-1 text-center hidden sm:block">
                          <div className="bg-input rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm text-muted-foreground inline-block">
                            app.portfolix.com/{activeItem.id}
                          </div>
                        </div>
                      </div>
                      
                      {/* App Content */}
                      <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 bg-gradient-to-br from-background to-secondary/30">
                        <img 
                          src={`https://images.unsplash.com/${activeItem.image}?auto=format&fit=crop&w=700&q=60`}
                          alt={activeItem.title}
                          width={700}
                          height={467}
                          className="w-full h-full object-cover opacity-20"
                          loading="lazy"
                        />
                        
                        {/* Overlay UI Elements */}
                        <div className="absolute inset-0 p-3 sm:p-4 md:p-6 flex flex-col justify-between">
                          <div>
                            <Badge className="bg-primary/10 text-primary border-primary/20 mb-2 sm:mb-4 text-xs">
                              {activeItem.title}
                            </Badge>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-sans-bold text-foreground mb-1 sm:mb-2">
                              {activeItem.description}
                            </h3>
                          </div>
                          
                          {/* Metrics Grid */}
                          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                            {activeItem.metrics.map((metric, index) => (
                              <div key={index} className="bg-card/80 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-border">
                                <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1 truncate">{metric.label}</div>
                                <div className="font-sans-bold text-foreground text-sm sm:text-base truncate">{metric.value}</div>
                                <div className="text-[10px] sm:text-xs text-success flex items-center gap-0.5 sm:gap-1">
                                  <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  <span className="truncate">{metric.trend}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Device Compatibility */}
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-sans-bold text-foreground mb-4 sm:mb-6">
              Available on all your devices
            </h3>
            <div className="flex justify-center items-center gap-6 sm:gap-8 text-muted-foreground">
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <Monitor className="h-6 w-6 sm:h-8 sm:w-8" />
                <span className="text-xs sm:text-sm">Desktop</span>
              </div>
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <Tablet className="h-6 w-6 sm:h-8 sm:w-8" />
                <span className="text-xs sm:text-sm">Tablet</span>
              </div>
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <Smartphone className="h-6 w-6 sm:h-8 sm:w-8" />
                <span className="text-xs sm:text-sm">Mobile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};