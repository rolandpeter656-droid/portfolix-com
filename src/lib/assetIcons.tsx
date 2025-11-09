import { TrendingUp, DollarSign, Coins, Landmark, Bitcoin } from "lucide-react";

// Consistent asset category icons with uniform styling
export const AssetIcons = {
  Stocks: TrendingUp,
  Crypto: Bitcoin,
  Commodities: Coins,
  FixedIncome: Landmark,
  Cash: DollarSign,
} as const;

export type AssetCategory = keyof typeof AssetIcons;

// Icon wrapper with consistent sizing
export const AssetIcon = ({ 
  category, 
  size = "md",
  className = "" 
}: { 
  category: AssetCategory; 
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const Icon = AssetIcons[category];
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }[size];
  
  return <Icon className={`${sizeClass} ${className}`} />;
};
