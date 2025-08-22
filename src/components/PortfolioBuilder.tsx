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
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Build Your Perfect Portfolio
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your investment level and see real-time projections for your portfolio growth
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
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
                
                <CardHeader className="relative z-10 text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-background/80 backdrop-blur-sm w-fit">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{category.title}</CardTitle>
                  <p className="text-muted-foreground">{category.description}</p>
                  <Badge className={`w-fit mx-auto mt-2 ${category.riskColor}`}>
                    {category.riskLevel} Risk
                  </Badge>
                </CardHeader>

                <CardContent className="relative z-10 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
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

                  <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 space-y-3">
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-foreground">
                        Amount You're Investing
                      </h4>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(amount)}
                      </p>
                    </div>

                    <div className="text-center">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Estimated Annual Returns
                      </h4>
                      <p className="text-lg font-semibold text-foreground">
                        {formatCurrency(minAnnualReturn)} – {formatCurrency(maxAnnualReturn)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ({category.minReturn}% – {category.maxReturn}% annually)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            * Returns are estimates based on historical data and market analysis. 
            Actual returns may vary and past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PortfolioBuilder;