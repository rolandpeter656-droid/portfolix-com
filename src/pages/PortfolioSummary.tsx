import { useState, useEffect } from "react";
import { ArrowLeft, Download, ExternalLink, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Portfolio3DPieChart } from "@/components/Portfolio3DPieChart";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';

interface Asset {
  symbol: string;
  name: string;
  allocation: number;
  rationale: string;
  assetClass: string;
  color: string;
}

interface PortfolioSummaryProps {
  riskScore: number;
  experienceLevel: "beginner" | "intermediate" | "advanced";
  timeline: string;
  onBack: () => void;
  onCustomize: () => void;
}

const PortfolioSummary = ({ riskScore, experienceLevel, timeline, onBack, onCustomize }: PortfolioSummaryProps) => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000);
  const [isInputMode, setIsInputMode] = useState(false);
  const [isBrokerModalOpen, setIsBrokerModalOpen] = useState(false);
  const [portfolioName, setPortfolioName] = useState<string>("");
  const { toast } = useToast();

  // Suggested amounts based on experience level
  const getSuggestedAmount = () => {
    switch (experienceLevel) {
      case "beginner": return 500;
      case "intermediate": return 5000;
      case "advanced": return 25000;
      default: return 1000;
    }
  };

  const getAmountLimits = () => {
    switch (experienceLevel) {
      case "beginner": return { min: 10, max: 1000 };
      case "intermediate": return { min: 25, max: 50000 };
      case "advanced": return { min: 50, max: 1000000 };
      default: return { min: 10, max: 1000 };
    }
  };

  useEffect(() => {
    setInvestmentAmount(getSuggestedAmount());
  }, [experienceLevel]);

  // Roland Alphas Portfolio Mapping - Hedge-fund-tested strategies
  const generatePortfolio = (): { portfolio: Asset[], name: string } => {
    let basePortfolio: Asset[] = [];
    let currentPortfolioName = "";
    
    // Beginner Level Portfolios (1-2 years, Conservative)
    if (experienceLevel === "beginner") {
      if (timeline === "1-2 years" || timeline === "less than 1 year") {
        if (riskScore <= 20) {
          currentPortfolioName = "Smart Saver Portfolio";
          basePortfolio = [
            { symbol: "SHY", name: "iShares 1-3 Year Treasury", allocation: 40, rationale: "Short-term treasury bonds protect capital when rates are low while maintaining liquidity", assetClass: "Short-Term Bonds", color: "#8B5CF6" },
            { symbol: "VMOT", name: "Vanguard Ultra-Short Bond", allocation: 30, rationale: "Ultra-short duration minimizes rate risk while providing steady income", assetClass: "Ultra-Short Bonds", color: "#06B6D4" },
            { symbol: "HYLS", name: "First Trust High Yield", allocation: 20, rationale: "High-yield exposure for enhanced income in low-rate environment", assetClass: "High Yield", color: "#F59E0B" },
            { symbol: "CASH", name: "Cash & Money Market", allocation: 10, rationale: "Emergency liquidity and opportunity fund for market dislocations", assetClass: "Cash", color: "#10B981" }
          ];
        } else if (riskScore <= 40) {
          currentPortfolioName = "Steady Yield Bond Portfolio";
          basePortfolio = [
            { symbol: "LQD", name: "iShares Investment Grade Corporate", allocation: 35, rationale: "Corporate bonds from strong companies provide high interest payments with credit quality", assetClass: "Corporate Bonds", color: "#8B5CF6" },
            { symbol: "VCIT", name: "Vanguard Intermediate Corporate", allocation: 25, rationale: "Intermediate duration balances yield and interest rate sensitivity", assetClass: "Corporate Bonds", color: "#06B6D4" },
            { symbol: "VYM", name: "Vanguard High Dividend Yield", allocation: 20, rationale: "Dividend-focused stocks from established companies provide income stability", assetClass: "Dividend Stocks", color: "#10B981" },
            { symbol: "VTEB", name: "Vanguard Tax-Exempt Bond", allocation: 20, rationale: "Municipal bonds offer tax-efficient income for conservative investors", assetClass: "Municipal Bonds", color: "#F59E0B" }
          ];
        } else if (riskScore <= 60) {
          currentPortfolioName = "Value Stability Portfolio";
          basePortfolio = [
            { symbol: "VTV", name: "Vanguard Value ETF", allocation: 40, rationale: "Undervalued but stable businesses trading below book value with strong fundamentals", assetClass: "Value Stocks", color: "#10B981" },
            { symbol: "SCHD", name: "Schwab US Dividend Equity", allocation: 25, rationale: "Quality dividend stocks with consistent earnings and shareholder returns", assetClass: "Dividend Stocks", color: "#06B6D4" },
            { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 25, rationale: "Broad bond diversification provides stability and income", assetClass: "Bonds", color: "#8B5CF6" },
            { symbol: "VNQ", name: "Vanguard Real Estate", allocation: 10, rationale: "Real estate exposure for inflation protection and yield", assetClass: "REITs", color: "#F59E0B" }
          ];
        } else if (riskScore <= 80) {
          currentPortfolioName = "Cashflow Compounders Portfolio";
          basePortfolio = [
            { symbol: "MSFT", name: "Microsoft Corporation", allocation: 15, rationale: "Strong cashflow generation and reinvestment in growth opportunities", assetClass: "Large Cap Growth", color: "#10B981" },
            { symbol: "AAPL", name: "Apple Inc", allocation: 15, rationale: "Exceptional free cash flow with consistent shareholder returns", assetClass: "Large Cap Growth", color: "#06B6D4" },
            { symbol: "BRK.B", name: "Berkshire Hathaway", allocation: 20, rationale: "Master of capital allocation and cash compounding over decades", assetClass: "Conglomerate", color: "#8B5CF6" },
            { symbol: "JNJ", name: "Johnson & Johnson", allocation: 15, rationale: "Healthcare giant with predictable cash flows and dividend growth", assetClass: "Healthcare", color: "#EF4444" },
            { symbol: "KO", name: "Coca-Cola Company", allocation: 15, rationale: "Brand moat generates consistent cash that compounds through reinvestment", assetClass: "Consumer Staples", color: "#F59E0B" },
            { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 20, rationale: "Bond allocation for stability and income diversification", assetClass: "Bonds", color: "#DC2626" }
          ];
        } else {
          currentPortfolioName = "Shareholder-Friendly Portfolio";
          basePortfolio = [
            { symbol: "AAPL", name: "Apple Inc", allocation: 20, rationale: "Massive treasury stock buyback program returning billions to shareholders", assetClass: "Large Cap Growth", color: "#10B981" },
            { symbol: "MSFT", name: "Microsoft Corporation", allocation: 20, rationale: "Consistent dividend growth and share repurchases reward long-term investors", assetClass: "Large Cap Growth", color: "#06B6D4" },
            { symbol: "JPM", name: "JPMorgan Chase", allocation: 15, rationale: "Strong capital returns through dividends and buybacks in financial sector", assetClass: "Financials", color: "#8B5CF6" },
            { symbol: "HD", name: "Home Depot", allocation: 15, rationale: "Retail leader with shareholder-focused capital allocation strategy", assetClass: "Consumer Discretionary", color: "#EF4444" },
            { symbol: "UNH", name: "UnitedHealth Group", allocation: 15, rationale: "Healthcare services with consistent shareholder value creation", assetClass: "Healthcare", color: "#F59E0B" },
            { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 15, rationale: "Fixed income component for portfolio balance", assetClass: "Bonds", color: "#DC2626" }
          ];
        }
      }
    } 
    // Experienced Level Portfolios (3-5 years, Moderate)
    else if (experienceLevel === "intermediate") {
      if (timeline === "3-5 years") {
        if (riskScore <= 30) {
          currentPortfolioName = "Wide Moat Portfolio";
          basePortfolio = [
            { symbol: "GOOGL", name: "Alphabet Inc", allocation: 18, rationale: "Search monopoly and data moats create durable competitive advantages", assetClass: "Technology", color: "#10B981" },
            { symbol: "AMZN", name: "Amazon.com Inc", allocation: 15, rationale: "Logistics network and AWS cloud dominance form wide economic moats", assetClass: "Technology", color: "#06B6D4" },
            { symbol: "NVDA", name: "NVIDIA Corporation", allocation: 12, rationale: "AI chip leadership with patent protection and switching costs", assetClass: "Technology", color: "#8B5CF6" },
            { symbol: "META", name: "Meta Platforms", allocation: 12, rationale: "Social network effects create user retention and advertiser stickiness", assetClass: "Technology", color: "#EF4444" },
            { symbol: "DIS", name: "Walt Disney Company", allocation: 10, rationale: "Content library and brand moats in entertainment ecosystem", assetClass: "Entertainment", color: "#F59E0B" },
            { symbol: "BRK.B", name: "Berkshire Hathaway", allocation: 15, rationale: "Insurance float and investment moats from Buffett's expertise", assetClass: "Conglomerate", color: "#DC2626" },
            { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 18, rationale: "Fixed income diversification for moderate risk profile", assetClass: "Bonds", color: "#8884d8" }
          ];
        } else if (riskScore <= 50) {
          currentPortfolioName = "Future Trends Growth Portfolio";
          basePortfolio = [
            { symbol: "QQQ", name: "Invesco QQQ Trust", allocation: 25, rationale: "Technology leaders driving AI, cloud computing, and digital transformation", assetClass: "Technology", color: "#10B981" },
            { symbol: "ICLN", name: "iShares Clean Energy", allocation: 15, rationale: "Clean energy transition creates massive long-term growth opportunity", assetClass: "Clean Energy", color: "#06B6D4" },
            { symbol: "ARKG", name: "ARK Genomics ETF", allocation: 12, rationale: "Healthcare innovation in genomics and personalized medicine", assetClass: "Healthcare Innovation", color: "#8B5CF6" },
            { symbol: "ARKK", name: "ARK Innovation ETF", allocation: 13, rationale: "Disruptive innovation across AI, robotics, and space exploration", assetClass: "Innovation", color: "#EF4444" },
            { symbol: "VGT", name: "Vanguard Technology", allocation: 20, rationale: "Broad technology exposure to secular growth trends", assetClass: "Technology", color: "#F59E0B" },
            { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 15, rationale: "Portfolio stability through fixed income allocation", assetClass: "Bonds", color: "#DC2626" }
          ];
        } else if (riskScore <= 70) {
          currentPortfolioName = "Recovery Trades Portfolio";
          basePortfolio = [
            { symbol: "XLF", name: "Financial Select SPDR", allocation: 20, rationale: "Banking sector recovering from interest rate pressures with improving fundamentals", assetClass: "Financials", color: "#10B981" },
            { symbol: "XLE", name: "Energy Select SPDR", allocation: 15, rationale: "Energy companies with strengthened balance sheets after commodity cycle", assetClass: "Energy", color: "#06B6D4" },
            { symbol: "IYR", name: "iShares Real Estate", allocation: 15, rationale: "Real estate recovery from oversold conditions with rate stabilization", assetClass: "Real Estate", color: "#8B5CF6" },
            { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 25, rationale: "Broad market exposure to capture overall economic recovery", assetClass: "US Stocks", color: "#EF4444" },
            { symbol: "EEM", name: "iShares Emerging Markets", allocation: 15, rationale: "Emerging markets bouncing back from oversold conditions", assetClass: "Emerging Markets", color: "#F59E0B" },
            { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 10, rationale: "Limited bond allocation given recovery focus", assetClass: "Bonds", color: "#DC2626" }
          ];
        } else if (riskScore <= 85) {
          currentPortfolioName = "Dividend Rebound Portfolio";
          basePortfolio = [
            { symbol: "T", name: "AT&T Inc", allocation: 15, rationale: "Telecom giant rebuilding dividend after strategic restructuring", assetClass: "Telecommunications", color: "#10B981" },
            { symbol: "XOM", name: "Exxon Mobil", allocation: 15, rationale: "Energy major restoring shareholder returns after cost cutting", assetClass: "Energy", color: "#06B6D4" },
            { symbol: "GE", name: "General Electric", allocation: 12, rationale: "Industrial conglomerate turning around operations and cash flow", assetClass: "Industrials", color: "#8B5CF6" },
            { symbol: "INTC", name: "Intel Corporation", allocation: 13, rationale: "Chip maker investing heavily in manufacturing to regain market share", assetClass: "Technology", color: "#EF4444" },
            { symbol: "F", name: "Ford Motor Company", allocation: 10, rationale: "Auto manufacturer transitioning to EVs with improving profitability", assetClass: "Automotive", color: "#F59E0B" },
            { symbol: "VYM", name: "Vanguard High Dividend", allocation: 25, rationale: "Diversified dividend stocks for steady income and recovery exposure", assetClass: "Dividend Stocks", color: "#DC2626" },
            { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 10, rationale: "Minimal fixed income given dividend focus", assetClass: "Bonds", color: "#8884d8" }
          ];
        } else {
          currentPortfolioName = "Insider Edge Portfolio";
          basePortfolio = [
            { symbol: "NVDA", name: "NVIDIA Corporation", allocation: 18, rationale: "Heavy insider buying signals confidence in AI market expansion", assetClass: "Technology", color: "#10B981" },
            { symbol: "META", name: "Meta Platforms", allocation: 15, rationale: "Management purchases indicate belief in metaverse and AI investments", assetClass: "Technology", color: "#06B6D4" },
            { symbol: "AMZN", name: "Amazon.com Inc", allocation: 15, rationale: "Executive buying suggests undervaluation in cloud and retail segments", assetClass: "Technology", color: "#8B5CF6" },
            { symbol: "TSLA", name: "Tesla Inc", allocation: 12, rationale: "Insider confidence in robotaxi rollout and energy storage growth", assetClass: "Automotive", color: "#EF4444" },
            { symbol: "GOOGL", name: "Alphabet Inc", allocation: 15, rationale: "Leadership buying indicates AI advertising integration opportunities", assetClass: "Technology", color: "#F59E0B" },
            { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 20, rationale: "Broad market exposure to capture insider knowledge spillovers", assetClass: "US Stocks", color: "#DC2626" },
            { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 5, rationale: "Minimal bonds given high-conviction equity focus", assetClass: "Bonds", color: "#8884d8" }
          ];
        }
      }
    }
    // Expert Level Portfolios (6-10 years & 10+ years, Aggressive)
    else if (experienceLevel === "advanced") {
      if (timeline === "6-10 years" || timeline === "10+ years") {
        if (riskScore <= 40) {
          currentPortfolioName = "Crisis Alpha Portfolio";
          basePortfolio = [
            { symbol: "VWO", name: "Vanguard Emerging Markets", allocation: 20, rationale: "Eastern Europe and emerging market equities offer crisis-driven opportunities", assetClass: "Emerging Markets", color: "#10B981" },
            { symbol: "HYG", name: "iShares High Yield Corporate", allocation: 15, rationale: "Distressed corporate debt trading at discounts during market stress", assetClass: "High Yield Bonds", color: "#06B6D4" },
            { symbol: "CWB", name: "SPDR Bloomberg Convertible", allocation: 15, rationale: "Convertible bonds provide downside protection with upside participation", assetClass: "Convertible Bonds", color: "#8B5CF6" },
            { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 25, rationale: "US equity exposure for stability during global market stress", assetClass: "US Stocks", color: "#EF4444" },
            { symbol: "GLD", name: "SPDR Gold Trust", allocation: 15, rationale: "Gold hedge against currency debasement and geopolitical risk", assetClass: "Commodities", color: "#F59E0B" },
            { symbol: "TLT", name: "iShares 20+ Year Treasury", allocation: 10, rationale: "Long-term treasuries for flight-to-quality during crisis periods", assetClass: "Long-Term Bonds", color: "#DC2626" }
          ];
        } else if (riskScore <= 60) {
          currentPortfolioName = "Event-Driven Tactical Portfolio";
          basePortfolio = [
            { symbol: "SPY", name: "SPDR S&P 500", allocation: 30, rationale: "Core holding for quick tactical trades around market events and earnings", assetClass: "Large Cap Stocks", color: "#10B981" },
            { symbol: "QQQ", name: "Invesco QQQ Trust", allocation: 20, rationale: "Technology focus for event-driven momentum plays", assetClass: "Technology", color: "#06B6D4" },
            { symbol: "IWM", name: "iShares Russell 2000", allocation: 15, rationale: "Small cap exposure for volatility and event sensitivity", assetClass: "Small Cap Stocks", color: "#8B5CF6" },
            { symbol: "EFA", name: "iShares MSCI EAFE", allocation: 15, rationale: "International developed markets for global event exposure", assetClass: "International Stocks", color: "#EF4444" },
            { symbol: "VXX", name: "iPath S&P 500 VIX", allocation: 5, rationale: "Volatility hedge for market event protection", assetClass: "Volatility", color: "#F59E0B" },
            { symbol: "SHY", name: "iShares 1-3 Year Treasury", allocation: 15, rationale: "Short-term bonds for tactical cash management", assetClass: "Short-Term Bonds", color: "#DC2626" }
          ];
        } else if (riskScore <= 75) {
          currentPortfolioName = "Hedged Instruments Portfolio";
          basePortfolio = [
            { symbol: "CWB", name: "SPDR Bloomberg Convertible", allocation: 25, rationale: "Convertible bonds offer equity upside with bond downside protection", assetClass: "Convertible Bonds", color: "#10B981" },
            { symbol: "PUTW", name: "WisdomTree CBOE S&P 500 PutWrite", allocation: 15, rationale: "Options strategies generate income while providing downside hedge", assetClass: "Options Strategy", color: "#06B6D4" },
            { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 30, rationale: "Core equity position hedged with convertible and options exposure", assetClass: "US Stocks", color: "#8B5CF6" },
            { symbol: "VTIAX", name: "Vanguard Total International", allocation: 15, rationale: "International diversification for hedged global exposure", assetClass: "International Stocks", color: "#EF4444" },
            { symbol: "GLD", name: "SPDR Gold Trust", allocation: 10, rationale: "Precious metals hedge against portfolio correlation risk", assetClass: "Commodities", color: "#F59E0B" },
            { symbol: "TLT", name: "iShares 20+ Year Treasury", allocation: 5, rationale: "Duration hedge for interest rate and deflation protection", assetClass: "Long-Term Bonds", color: "#DC2626" }
          ];
        } else if (riskScore <= 85) {
          currentPortfolioName = "Market Neutral Smart Beta Portfolio";
          basePortfolio = [
            { symbol: "MTUM", name: "iShares Momentum Factor", allocation: 20, rationale: "Long momentum stocks while shorting low-momentum names for market-neutral exposure", assetClass: "Factor Investing", color: "#10B981" },
            { symbol: "QUAL", name: "iShares Quality Factor", allocation: 20, rationale: "Quality factor tilt balanced against growth factor shorts", assetClass: "Factor Investing", color: "#06B6D4" },
            { symbol: "SIZE", name: "iShares Size Factor", allocation: 15, rationale: "Small cap factor exposure hedged with large cap shorts", assetClass: "Factor Investing", color: "#8B5CF6" },
            { symbol: "VLUE", name: "iShares Value Factor", allocation: 20, rationale: "Value factor long positions balanced with growth shorts", assetClass: "Factor Investing", color: "#EF4444" },
            { symbol: "USMV", name: "iShares Minimum Volatility", allocation: 15, rationale: "Low volatility factor for stability in market-neutral strategy", assetClass: "Factor Investing", color: "#F59E0B" },
            { symbol: "SHY", name: "iShares 1-3 Year Treasury", allocation: 10, rationale: "Short-term bonds for cash management in neutral strategy", assetClass: "Short-Term Bonds", color: "#DC2626" }
          ];
        } else if (riskScore <= 95) {
          currentPortfolioName = "Dynamic Macro Portfolio";
          basePortfolio = [
            { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 25, rationale: "Growth exposure for economic expansion periods", assetClass: "US Stocks", color: "#10B981" },
            { symbol: "TIP", name: "iShares TIPS Bond", allocation: 20, rationale: "Inflation-protected securities hedge against macro policy shifts", assetClass: "Inflation Protected", color: "#06B6D4" },
            { symbol: "GLD", name: "SPDR Gold Trust", allocation: 15, rationale: "Gold as hedge against currency debasement and macro instability", assetClass: "Commodities", color: "#8B5CF6" },
            { symbol: "VNQ", name: "Vanguard Real Estate", allocation: 15, rationale: "Real estate for inflation hedge and macro diversification", assetClass: "Real Estate", color: "#EF4444" },
            { symbol: "DBC", name: "Invesco DB Commodity", allocation: 10, rationale: "Broad commodity exposure for macro theme capture", assetClass: "Commodities", color: "#F59E0B" },
            { symbol: "EEM", name: "iShares Emerging Markets", allocation: 10, rationale: "Emerging markets for global macro trend participation", assetClass: "Emerging Markets", color: "#DC2626" },
            { symbol: "TLT", name: "iShares 20+ Year Treasury", allocation: 5, rationale: "Duration exposure for deflationary macro scenarios", assetClass: "Long-Term Bonds", color: "#8884d8" }
          ];
        } else {
          currentPortfolioName = "AI Global Macro Portfolio";
          basePortfolio = [
            { symbol: "AIEQ", name: "AI Powered Equity ETF", allocation: 25, rationale: "AI-driven stock selection across global markets using machine learning", assetClass: "AI Strategy", color: "#10B981" },
            { symbol: "ROBO", name: "Global Robotics & AI ETF", allocation: 20, rationale: "Robotics and AI companies driving cross-market algorithmic strategies", assetClass: "AI/Robotics", color: "#06B6D4" },
            { symbol: "BOTZ", name: "Global X Robotics & AI", allocation: 15, rationale: "Automated trading systems and AI-powered investment platforms", assetClass: "AI/Robotics", color: "#8B5CF6" },
            { symbol: "QTUM", name: "Defiance Quantum ETF", allocation: 15, rationale: "Quantum computing infrastructure for next-generation AI trading", assetClass: "Quantum Computing", color: "#EF4444" },
            { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 15, rationale: "Broad market exposure enhanced by AI overlay strategies", assetClass: "US Stocks", color: "#F59E0B" },
            { symbol: "VTIAX", name: "Vanguard Total International", allocation: 10, rationale: "International markets accessed through AI-powered cross-market trades", assetClass: "International Stocks", color: "#DC2626" }
          ];
        }
      }
    }

    // Cross-Level Strategies (fallback for any unmatched combinations)
    if (basePortfolio.length === 0) {
      if (riskScore <= 30) {
        currentPortfolioName = "Risk Balanced Portfolio";
        basePortfolio = [
          { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 30, rationale: "Equal risk contribution from US equity markets", assetClass: "US Stocks", color: "#10B981" },
          { symbol: "VTIAX", name: "Vanguard Total International", allocation: 20, rationale: "International equity risk diversification", assetClass: "International Stocks", color: "#06B6D4" },
          { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 30, rationale: "Fixed income risk balanced with equity exposure", assetClass: "Bonds", color: "#8B5CF6" },
          { symbol: "VNQ", name: "Vanguard Real Estate", allocation: 10, rationale: "Real estate provides independent risk factor", assetClass: "Real Estate", color: "#EF4444" },
          { symbol: "GLD", name: "SPDR Gold Trust", allocation: 10, rationale: "Commodities for risk diversification across asset classes", assetClass: "Commodities", color: "#F59E0B" }
        ];
      } else if (riskScore <= 60) {
        currentPortfolioName = "Deep Value Portfolio";
        basePortfolio = [
          { symbol: "VTV", name: "Vanguard Value ETF", allocation: 35, rationale: "One-time bargains from fundamental analysis of undervalued companies", assetClass: "Value Stocks", color: "#10B981" },
          { symbol: "VBR", name: "Vanguard Small-Cap Value", allocation: 20, rationale: "Small cap value stocks often overlooked by institutional investors", assetClass: "Small Cap Value", color: "#06B6D4" },
          { symbol: "EEM", name: "iShares Emerging Markets", allocation: 15, rationale: "Emerging market value opportunities trading at deep discounts", assetClass: "Emerging Markets", color: "#8B5CF6" },
          { symbol: "PDBC", name: "Invesco Optimum Yield Commodities", allocation: 15, rationale: "Commodity value plays in oversold natural resource sectors", assetClass: "Commodities", color: "#EF4444" },
          { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 15, rationale: "Bond allocation for portfolio stability during value discovery", assetClass: "Bonds", color: "#F59E0B" }
        ];
      } else if (riskScore <= 80) {
        currentPortfolioName = "Contrarian Picks Portfolio";
        basePortfolio = [
          { symbol: "RSP", name: "Invesco S&P 500 Equal Weight", allocation: 25, rationale: "Equal-weight approach captures leaders on temporary decline", assetClass: "Equal Weight", color: "#10B981" },
          { symbol: "FDVV", name: "Fidelity High Dividend ETF", allocation: 20, rationale: "High-quality companies temporarily out of favor but fundamentally sound", assetClass: "High Dividend", color: "#06B6D4" },
          { symbol: "IWN", name: "iShares Russell 2000 Value", allocation: 20, rationale: "Small cap value stocks hitting new lows with recovery potential", assetClass: "Small Cap Value", color: "#8B5CF6" },
          { symbol: "EWJ", name: "iShares Japan ETF", allocation: 15, rationale: "Japanese market contrarian play on corporate governance improvements", assetClass: "Japan", color: "#EF4444" },
          { symbol: "XLE", name: "Energy Select SPDR", allocation: 10, rationale: "Energy sector contrarian bet on oversold commodity cycle", assetClass: "Energy", color: "#F59E0B" },
          { symbol: "BND", name: "Vanguard Total Bond Market", allocation: 10, rationale: "Defensive allocation during contrarian positioning", assetClass: "Bonds", color: "#DC2626" }
        ];
      } else {
        currentPortfolioName = "Special Situations Portfolio";
        basePortfolio = [
          { symbol: "SPAC", name: "Defiance Next Gen SPAC", allocation: 20, rationale: "SPAC arbitrage and special purpose acquisition opportunities", assetClass: "SPACs", color: "#10B981" },
          { symbol: "ARKK", name: "ARK Innovation ETF", allocation: 20, rationale: "Disruptive innovation in rare market setup opportunities", assetClass: "Innovation", color: "#06B6D4" },
          { symbol: "BITO", name: "ProShares Bitcoin Strategy", allocation: 15, rationale: "Cryptocurrency exposure through regulated Bitcoin futures", assetClass: "Cryptocurrency", color: "#8B5CF6" },
          { symbol: "TAIL", name: "Cambria Tail Risk ETF", allocation: 10, rationale: "Tail risk hedging for special situation downside protection", assetClass: "Tail Risk", color: "#EF4444" },
          { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 25, rationale: "Core equity exposure with special situation overlay", assetClass: "US Stocks", color: "#F59E0B" },
          { symbol: "SHY", name: "iShares 1-3 Year Treasury", allocation: 10, rationale: "Short-term bonds for liquidity during special situations", assetClass: "Short-Term Bonds", color: "#DC2626" }
        ];
      }
    }

    // Add Tesla for experienced/advanced investors with 6-10 year timeline
    const shouldAddTesla = (experienceLevel === "intermediate" || experienceLevel === "advanced") && timeline === "6-10 years";
    
    if (shouldAddTesla) {
      // Reduce all allocations proportionally to make room for 8% Tesla allocation
      const reductionFactor = 0.92; // Reduce by 8% total
      basePortfolio = basePortfolio.map(asset => ({
        ...asset,
        allocation: Math.round(asset.allocation * reductionFactor * 10) / 10
      }));
      
      // Add Tesla with robotaxi rationale
      basePortfolio.push({
        symbol: "TSLA",
        name: "Tesla Inc",
        allocation: 8.0,
        rationale: "Tesla's launch of Robotaxis opens a new multi-trillion-dollar transportation market, competing with Uber and driving robotics innovation in automobiles. This positions Tesla at the forefront of autonomous vehicle technology.",
        assetClass: "Growth Stocks",
        color: "#DC2626"
      });
    }

    return { portfolio: basePortfolio, name: currentPortfolioName };
  };

  const { portfolio, name } = generatePortfolio();
  
  // Update portfolio name state when portfolio changes
  useEffect(() => {
    setPortfolioName(name);
  }, [name]);
  
  const expectedReturn = 6 + (riskScore / 100) * 6; // 6-12% based on risk
  const volatility = 5 + (riskScore / 100) * 15; // 5-20% based on risk
  const diversificationScore = Math.max(60, 100 - riskScore * 0.4);

  const limits = getAmountLimits();

  const handleAmountChange = (value: number[]) => {
    setInvestmentAmount(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    if (value >= limits.min && value <= limits.max) {
      setInvestmentAmount(value);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();
    
    // Set dark theme colors
    const primaryColor = [139, 92, 246]; // Purple
    const textColor = [255, 255, 255]; // White
    const bgColor = [17, 17, 19]; // Dark background
    
    // Background
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Header
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('PortfoliX - AI Generated Portfolio', 20, 30);
    
    // Date
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Generated on: ${today}`, 20, 45);
    
    // Investment amount
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`Investment Amount: ${formatCurrency(investmentAmount)}`, 20, 65);
    
    // Portfolio metrics
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Portfolio Metrics:', 20, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Expected Return: ${formatPercentage(expectedReturn)}`, 20, 100);
    doc.text(`Volatility: ${formatPercentage(volatility)}`, 20, 115);
    doc.text(`Diversification Score: ${formatPercentage(diversificationScore)}`, 20, 130);
    
    // Portfolio breakdown
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Portfolio Breakdown:', 20, 155);
    
    let yPosition = 175;
    portfolio.forEach((asset, index) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`${asset.symbol} - ${asset.name}`, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Asset Class: ${asset.assetClass}`, 25, yPosition + 10);
      doc.text(`Allocation: ${formatPercentage(asset.allocation)}`, 25, yPosition + 20);
      doc.text(`Investment: ${formatCurrency(investmentAmount * asset.allocation / 100)}`, 25, yPosition + 30);
      doc.text(`Rationale: ${asset.rationale}`, 25, yPosition + 40, { maxWidth: 160 });
      yPosition += 55;
      
      if (yPosition > 250 && index < portfolio.length - 1) {
        doc.addPage();
        doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        doc.rect(0, 0, 210, 297, 'F');
        yPosition = 30;
      }
    });
    
    // Footer disclaimer
    if (yPosition > 220) {
      doc.addPage();
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.rect(0, 0, 210, 297, 'F');
      yPosition = 30;
    }
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const disclaimer = 'Legal Disclaimer: This portfolio was generated by AI based on your input. While significant effort went into optimizing it, your investment decisions are entirely your own. PortfoliX does not provide financial advice, and you are solely responsible for any trades you place or outcomes from your investment choices.';
    doc.text(disclaimer, 20, yPosition + 20, { maxWidth: 170 });
    
    doc.save(`PortfoliX_Portfolio_${today.replace(/\//g, '-')}.pdf`);
    toast({
      title: "Portfolio Exported",
      description: "Your portfolio has been downloaded as a PDF.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {portfolioName || "Your AI-Generated Portfolio"}
              </h1>
              <p className="text-muted-foreground">
                Roland Alphas • {experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)} Level • {timeline}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Investment Amount Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Investment Amount
              <Badge variant="secondary">
                {experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount">Amount to Invest</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsInputMode(!isInputMode)}
                >
                  {isInputMode ? "Use Slider" : "Type Amount"}
                </Button>
              </div>
              
              {isInputMode ? (
                <div className="space-y-2">
                  <Input
                    type="number"
                    value={investmentAmount}
                    onChange={handleInputChange}
                    min={limits.min}
                    max={limits.max}
                    className="text-lg font-semibold"
                  />
                  <p className="text-sm text-muted-foreground">
                    Range: {formatCurrency(limits.min)} - {formatCurrency(limits.max)}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {formatCurrency(investmentAmount)}
                    </div>
                  </div>
                  <Slider
                    value={[investmentAmount]}
                    onValueChange={handleAmountChange}
                    min={limits.min}
                    max={limits.max}
                    step={limits.min < 1000 ? 25 : 1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatCurrency(limits.min)}</span>
                    <span>{formatCurrency(limits.max)}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Portfolio Metrics */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Portfolio Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-card rounded-lg">
                  <div className="text-2xl font-bold text-success">
                    {formatPercentage(expectedReturn)}
                  </div>
                  <div className="text-sm text-muted-foreground">Expected Return</div>
                </div>
                <div className="text-center p-4 bg-gradient-card rounded-lg">
                  <div className="text-2xl font-bold text-warning">
                    {formatPercentage(volatility)}
                  </div>
                  <div className="text-sm text-muted-foreground">Volatility</div>
                </div>
                <div className="text-center p-4 bg-gradient-card rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {formatPercentage(diversificationScore)}
                  </div>
                  <div className="text-sm text-muted-foreground">Diversification</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Allocation Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <Portfolio3DPieChart data={portfolio} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Breakdown Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Portfolio Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Asset Class</TableHead>
                  <TableHead>Allocation</TableHead>
                  <TableHead>Investment</TableHead>
                  <TableHead>Rationale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.map((asset) => (
                  <TableRow key={asset.symbol}>
                    <TableCell className="font-mono font-semibold">{asset.symbol}</TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" style={{ borderColor: asset.color, color: asset.color }}>
                        {asset.assetClass}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatPercentage(asset.allocation)}</TableCell>
                    <TableCell>{formatCurrency(investmentAmount * asset.allocation / 100)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs">
                      {asset.rationale}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Dialog open={isBrokerModalOpen} onOpenChange={setIsBrokerModalOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Place Trades on Your Broker
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Broker Integration</DialogTitle>
                <DialogDescription>
                  Broker integration is coming soon! For now, you can export your portfolio and place trades manually on your broker.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end">
                <Button onClick={() => setIsBrokerModalOpen(false)}>
                  Got it
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="lg" onClick={onCustomize} className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Customize Portfolio Further
          </Button>
          <Button variant="outline" size="lg" onClick={exportToPDF} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Portfolio as PDF
          </Button>
        </div>

        {/* Legal Disclaimer */}
        <Card className="bg-muted/30 border-warning/20">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Legal Disclaimer:</strong> This portfolio was generated by AI based on your input. 
              While significant effort went into optimizing it, your investment decisions are entirely your own. 
              PortfoliX does not provide financial advice, and you are solely responsible for any trades you 
              place or outcomes from your investment choices. Past performance does not guarantee future results. 
              Please consult with a qualified financial advisor before making investment decisions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioSummary;