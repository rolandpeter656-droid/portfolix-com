import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Download, Copy, Share2, MessageCircle, Twitter, ChevronRight } from "lucide-react";
import { MoneyMapCard } from "./MoneyMapCard";
import { analytics } from "@/lib/analytics/index";
import {
  ASSUMED_ANNUAL_RETURN,
  getArchetypeName,
  getGoalSubtitle,
  mapGoalToKey,
  mapTimelineToBucket,
  mapVolatilityToRisk,
  projectFutureValue,
  yearsForTimeline,
  formatCompactCurrency,
} from "@/lib/moneyMap";
import { useAuth } from "@/hooks/useAuth";

interface Asset {
  symbol: string;
  name: string;
  allocation: number;
  rationale: string;
  assetClass: string;
  color: string;
}

interface MoneyMapSectionProps {
  onboardingGoal?: string;
  onboardingTimeline?: string;
  onboardingRisk?: string;
  portfolio: Asset[];
  currency?: "USD" | "NGN";
}

export const MoneyMapSection = ({
  onboardingGoal,
  onboardingTimeline,
  onboardingRisk,
  portfolio,
  currency = "USD",
}: MoneyMapSectionProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);
  const [monthlyInput, setMonthlyInput] = useState<string>("");
  const [skipped, setSkipped] = useState(false);

  const risk = mapVolatilityToRisk(onboardingRisk);
  const timelineBucket = mapTimelineToBucket(onboardingTimeline);
  const goalKey = mapGoalToKey(onboardingGoal);
  const archetypeName = getArchetypeName(risk, timelineBucket);
  const subtitle = getGoalSubtitle(goalKey);
  const years = yearsForTimeline(timelineBucket);
  const annualReturn = ASSUMED_ANNUAL_RETURN[risk];
  const annualPct = Math.round(annualReturn * 100);

  const monthly = useMemo(() => {
    const n = parseFloat(monthlyInput.replace(/[, ]/g, ""));
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [monthlyInput]);

  const projected = useMemo(() => {
    if (!monthly) return null;
    return projectFutureValue({
      monthlyContribution: monthly,
      years,
      annualReturn,
    });
  }, [monthly, years, annualReturn]);

  const currencySymbol = currency === "NGN" ? "₦" : "$";
  const futureValueFormatted = projected
    ? formatCompactCurrency(projected, currency)
    : undefined;

  // Track viewed once
  useEffect(() => {
    analytics.moneyMapViewed(archetypeName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetypeName]);

  const referrerId = user?.id || "";
  const shareUrlBase = `${window.location.origin}/?ref=${encodeURIComponent(referrerId)}`;
  const shareText = `Just found out I'm ${archetypeName} 📈 Built my investing plan in 3 mins. What's yours?`;

  const buildShareUrl = (src: "whatsapp" | "x" | "copy") =>
    `${shareUrlBase}&src=${src}`;

  const generatePng = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0A0A0A",
      });
      analytics.moneyMapCardGenerated(archetypeName);
      return dataUrl;
    } catch (e) {
      console.error("[money-map] png generation failed", e);
      toast({
        title: "Couldn't generate image",
        description: "Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleDownload = async () => {
    const dataUrl = await generatePng();
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.download = `portfolix-money-map-${archetypeName.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = dataUrl;
    link.click();
    analytics.moneyMapShared("download", archetypeName);
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${buildShareUrl("whatsapp")}`)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    analytics.moneyMapShared("whatsapp", archetypeName);
  };

  const handleX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(buildShareUrl("x"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    analytics.moneyMapShared("x", archetypeName);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${buildShareUrl("copy")}`);
      toast({ title: "Link copied", description: "Share it anywhere." });
      analytics.moneyMapShared("copy", archetypeName);
    } catch {
      toast({ title: "Couldn't copy", variant: "destructive" });
    }
  };

  return (
    <Card className="shadow-card overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <Share2 className="h-4 w-4 text-primary" />
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              Your Money Map
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            You are{" "}
            <span className="text-primary">{archetypeName}</span>
          </h2>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">{subtitle}</p>
        </div>

        {/* Monthly contribution input */}
        {!monthly && !skipped && (
          <div className="p-6 sm:p-8 border-b border-border space-y-3">
            <Label htmlFor="monthly-contribution" className="text-base font-semibold">
              How much can you put in each month?
            </Label>
            <p className="text-sm text-muted-foreground">
              Optional. We'll show an illustrative future number on your card.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {currencySymbol}
                </span>
                <Input
                  id="monthly-contribution"
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g. 200"
                  value={monthlyInput}
                  onChange={(e) => setMonthlyInput(e.target.value)}
                  className="pl-7 h-11"
                />
              </div>
              <Button variant="ghost" onClick={() => setSkipped(true)} className="h-11">
                Skip
              </Button>
            </div>
          </div>
        )}

        {/* On-screen preview (responsive scaled wrapper) */}
        <div className="bg-[#050505] p-4 sm:p-8 flex justify-center overflow-hidden">
          <div
            style={{
              width: "100%",
              maxWidth: 540,
              aspectRatio: "1080 / 1350",
              position: "relative",
              overflow: "hidden",
              borderRadius: 16,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: "scale(0.5)",
                transformOrigin: "top left",
                width: 1080,
              }}
            >
              {/* On-screen visible card uses a separate non-ref instance for responsive preview */}
              <MoneyMapCard
                archetypeName={archetypeName}
                subtitle={subtitle}
                portfolio={portfolio}
                monthlyContribution={monthly}
                years={years}
                assumedAnnualReturnPct={annualPct}
                projectedFutureValue={projected}
                currencySymbol={currencySymbol}
                futureValueFormatted={futureValueFormatted}
              />
            </div>
          </div>
        </div>

        {/* Off-screen full-resolution card used for PNG capture */}
        <div
          style={{
            position: "fixed",
            left: -99999,
            top: 0,
            pointerEvents: "none",
            opacity: 0,
          }}
          aria-hidden
        >
          <MoneyMapCard
            ref={cardRef}
            archetypeName={archetypeName}
            subtitle={subtitle}
            portfolio={portfolio}
            monthlyContribution={monthly}
            years={years}
            assumedAnnualReturnPct={annualPct}
            projectedFutureValue={projected}
            currencySymbol={currencySymbol}
            futureValueFormatted={futureValueFormatted}
          />
        </div>

        {/* Share buttons */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button onClick={handleWhatsApp} className="bg-[#25D366] hover:bg-[#1FB855] text-white">
              <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
            </Button>
            <Button onClick={handleX} variant="secondary">
              <Twitter className="h-4 w-4 mr-2" /> X
            </Button>
            <Button onClick={handleCopy} variant="outline">
              <Copy className="h-4 w-4 mr-2" /> Copy link
            </Button>
            <Button onClick={handleDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
          </div>
          {monthly && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Illustration only.</strong> Future-value number assumes a{" "}
              {annualPct}% annual return, monthly contributions of {currencySymbol}
              {monthly.toLocaleString()} for {years} years. Not a prediction.
              Returns are not guaranteed and your actual results will differ.
            </p>
          )}
          {!monthly && skipped && (
            <Button
              variant="link"
              className="px-0 text-primary"
              onClick={() => setSkipped(false)}
            >
              Add a monthly amount to see your projection{" "}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
