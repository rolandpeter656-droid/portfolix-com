import { useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, ExternalLink, ListChecks } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BROKERS, brokerUrl, BrokerConfig } from "@/config/brokers";
import { brokerageLinkClicked } from "@/lib/analytics/index";

export interface ActionHolding {
  symbol: string;
  name: string;
  /** 0-100 */
  allocation: number;
  /** Optional unit price in the display currency. When present we show shares. */
  price?: number;
}

interface Props {
  /** One-line strategy summary shown above the allocations. */
  summary: string;
  holdings: ActionHolding[];
  currency: "USD" | "NGN";
}

const SYMBOLS: Record<Props["currency"], string> = { USD: "$", NGN: "₦" };

export const ActionFirstAllocations = ({ summary, holdings, currency }: Props) => {
  const { toast } = useToast();
  const [amountInput, setAmountInput] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const lastFiredRef = useRef<Map<string, number>>(new Map());

  const symbol = SYMBOLS[currency];

  const amount = useMemo(() => {
    const n = parseFloat(amountInput.replace(/[, ]/g, ""));
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [amountInput]);

  const fmtMoney = (v: number) =>
    `${symbol}${v.toLocaleString(currency === "NGN" ? "en-NG" : "en-US", {
      maximumFractionDigits: v >= 100 ? 0 : 2,
    })}`;

  /** Concrete per-holding instruction, or null when no amount entered. */
  const amountFor = (h: ActionHolding): string | null => {
    if (!amount) return null;
    const value = (amount * h.allocation) / 100;
    if (h.price && h.price > 0) {
      const shares = value / h.price;
      return `${shares.toFixed(shares >= 10 ? 0 : 2)} shares (${fmtMoney(value)})`;
    }
    return fmtMoney(value);
  };

  const lineFor = (h: ActionHolding) => {
    const detail = amountFor(h);
    return `${h.symbol} — ${h.allocation.toFixed(h.allocation % 1 ? 1 : 0)}%${detail ? ` — ${detail}` : ""}`;
  };

  const copy = async (text: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
      toast({ title: label });
    } catch {
      toast({ title: "Couldn't copy", variant: "destructive" });
    }
  };

  const copyFullOrder = () => {
    const header = amount
      ? `My order — ${fmtMoney(amount)} total`
      : "My order — target allocations";
    const body = holdings.map((h) => `[ ] ${lineFor(h)}`).join("\n");
    copy(`${header}\n${body}`, "__all", "Full order copied");
  };

  const handleBroker = (broker: BrokerConfig, e?: React.MouseEvent) => {
    if (e && e.type === "auxclick" && (e as React.MouseEvent).button !== 1) return;
    const now = Date.now();
    const last = lastFiredRef.current.get(broker.id) ?? 0;
    if (now - last < 800) return;
    lastFiredRef.current.set(broker.id, now);
    brokerageLinkClicked(broker.name, { broker: broker.name, source: "recommendation_page" });
  };

  const ctaBlock = (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {BROKERS.map((b) => (
          <Button
            key={b.id}
            asChild
            className="w-full"
            variant={b.id === "bamboo" ? "default" : "secondary"}
          >
            <a
              href={brokerUrl(b)}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics="brokerage_link"
              data-broker={b.name}
              onClick={(e) => handleBroker(b, e)}
              onAuxClick={(e) => handleBroker(b, e)}
            >
              Open {b.name}
              <ExternalLink className="h-4 w-4 ml-1.5" />
            </a>
          </Button>
        ))}
      </div>
      <Button variant="outline" className="w-full" onClick={copyFullOrder}>
        {copiedKey === "__all" ? (
          <Check className="h-4 w-4 mr-1.5" />
        ) : (
          <ListChecks className="h-4 w-4 mr-1.5" />
        )}
        Copy full order
      </Button>
    </div>
  );

  return (
    <>
      <section id="portfolio-allocations" style={{ scrollMarginTop: "80px" }}>
        {/* 1. One-line strategy summary */}
        <p className="text-sm sm:text-base text-muted-foreground mb-3">{summary}</p>

        <Card className="shadow-card">
          <CardContent className="p-3 sm:p-5 space-y-3">
            {/* 3. Optional amount input */}
            <div className="space-y-1.5">
              <Label htmlFor="invest-amount" className="text-sm">
                How much are you investing?{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {symbol}
                </span>
                <Input
                  id="invest-amount"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  placeholder={currency === "NGN" ? "e.g. 500,000" : "e.g. 1,000"}
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="pl-7 h-10"
                />
              </div>
            </div>

            {/* 2. Allocation list */}
            <ul className="divide-y divide-border rounded-md border border-border">
              {holdings.map((h) => {
                const detail = amountFor(h);
                return (
                  <li
                    key={h.symbol}
                    className="flex items-center gap-2 px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono font-semibold text-sm">{h.symbol}</span>
                        <span className="truncate text-xs text-muted-foreground">{h.name}</span>
                      </div>
                      {detail && (
                        <div className="text-xs text-primary font-medium">{detail}</div>
                      )}
                    </div>
                    <Badge variant="secondary" className="tabular-nums">
                      {h.allocation.toFixed(h.allocation % 1 ? 1 : 0)}%
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      aria-label={`Copy ${h.symbol} order`}
                      onClick={() => copy(lineFor(h), h.symbol, `${h.symbol} copied`)}
                    >
                      {copiedKey === h.symbol ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </li>
                );
              })}
            </ul>

            {/* Desktop / tablet CTA stays inline */}
            <div className="hidden md:block pt-1">{ctaBlock}</div>
          </CardContent>
        </Card>
      </section>

      {/* 2. Sticky CTA on mobile */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        {ctaBlock}
      </div>
    </>
  );
};

export default ActionFirstAllocations;
