import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, Zap } from "lucide-react";

interface CategoryConfig {
  id: string;
  title: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minReturn: number;
  maxReturn: number;
  riskLevel: "Low" | "Medium" | "High";
  riskColor: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

const categories: CategoryConfig[] = [
  {
    id: "beginner",
    title: "Beginner",
    description: "Low risk, stable growth",
    minAmount: 10,
    maxAmount: 1000,
    minReturn: 3,
    maxReturn: 7,
    riskLevel: "Low",
    riskColor: "bg-green-500/10 text-green-600 border-green-200",
    icon: Shield,
    gradient: "from-green-500/20 to-emerald-500/20"
  },
  {
    id: "experienced",
    title: "Experienced",
    description: "Moderate risk, balanced growth",
    minAmount: 1000,
    maxAmount: 10000,
    minReturn: 7,
    maxReturn: 15,
    riskLevel: "Medium",
    riskColor: "bg-orange-500/10 text-orange-600 border-orange-200",
    icon: TrendingUp,
    gradient: "from-orange-500/20 to-amber-500/20"
  },
  {
    id: "expert",
    title: "Expert",
    description: "High risk, aggressive growth",
    minAmount: 10000,
    maxAmount: 250000,
    minReturn: 15,
    maxReturn: 30,
    riskLevel: "High",
    riskColor: "bg-red-500/10 text-red-600 border-red-200",
    icon: Zap,
    gradient: "from-red-500/20 to-rose-500/20"
  }
];

const PortfolioBuilder = () => {
  const [amounts, setAmounts] = useState<Record<string, number>>({
    beginner: 100,
    experienced: 5000,
    expert: 50000
  });

  const calculateReturns = (amount: number, minReturn: number, maxReturn: number) => {
    const minAnnualReturn = Math.round(amount * (minReturn / 100));
    const maxAnnualReturn = Math.round(amount * (maxReturn / 100));
    return { minAnnualReturn, maxAnnualReturn };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSliderChange = (categoryId: string, value: number[]) => {
    setAmounts(prev => ({
      ...prev,
      [categoryId]: value[0]
    }));
  };

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-headline mb-3 sm:mb-4">
            Build Your Perfect Portfolio
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto px-2">
            Choose your investment level and see real-time projections for your portfolio growth
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {categories.map((category) => {
            const amount = amounts[category.id];
            const { minAnnualReturn, maxAnnualReturn } = calculateReturns(
              amount,
              category.minReturn,
              category.maxReturn
            );
            const Icon = category.icon;

            return (
              <Card key={category.id} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-50`} />
                
                <CardHeader className="relative z-10 text-center pb-3 sm:pb-4 p-4 sm:p-6">
                  <div className="mx-auto mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-full bg-background/80 backdrop-blur-sm w-fit">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl md:text-title">{category.title}</CardTitle>
                  <p className="text-sm sm:text-base text-muted-foreground">{category.description}</p>
                  <Badge className={`w-fit mx-auto mt-2 text-xs sm:text-sm ${category.riskColor}`}>
                    {category.riskLevel} Risk
                  </Badge>
                </CardHeader>

                <CardContent className="relative z-10 space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                      <span>{formatCurrency(category.minAmount)}</span>
                      <span>{formatCurrency(category.maxAmount)}+</span>
                    </div>
                    
                    <Slider
                      value={[amount]}
                      onValueChange={(value) => handleSliderChange(category.id, value)}
                      max={category.maxAmount}
                      min={category.minAmount}
                      step={category.id === 'beginner' ? 10 : category.id === 'experienced' ? 100 : 1000}
                      className="w-full"
                    />
                  </div>

                  <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="text-center">
                      <h4 className="metric-label mb-1 text-[10px] sm:text-xs">
                        Amount You're Investing
                      </h4>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                        {formatCurrency(amount)}
                      </p>
                    </div>

                    <div className="text-center">
                      <h4 className="metric-label mb-1 text-[10px] sm:text-xs">
                        Estimated Annual Returns
                      </h4>
                      <p className="text-base sm:text-lg md:text-xl font-bold text-foreground">
                        {formatCurrency(minAnnualReturn)} – {formatCurrency(maxAnnualReturn)}
                      </p>
                      <p className="text-caption text-[10px] sm:text-xs">
                        ({category.minReturn}% – {category.maxReturn}% annually)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto px-4">
            * Returns are estimates based on historical data and market analysis. 
            Actual returns may vary and past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PortfolioBuilder;
