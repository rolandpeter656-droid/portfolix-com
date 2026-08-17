import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { BROKERS, brokerUrl } from "@/config/brokers";
import {
  tradeConfirmationPromptShown,
  tradeSelfReported,
} from "@/lib/analytics/index";

const SESSION_KEY = "px_trade_prompt_shown";
/** Fallback delay if the user never leaves/returns to the tab. */
const FALLBACK_DELAY_MS = 45_000;

interface Props {
  portfolioId?: string | null;
}

/**
 * Lightweight "did you place your trade?" prompt.
 * Armed by a brokerage CTA tap, shown when the user returns to the tab
 * (or after a short delay), at most once per session.
 */
export const TradeConfirmationModal = ({ portfolioId }: Props) => {
  const [open, setOpen] = useState(false);
  const [notYet, setNotYet] = useState(false);
  const brokerRef = useRef<string | undefined>(undefined);
  const armedRef = useRef(false);
  const shownRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;

    const show = () => {
      if (shownRef.current || !armedRef.current) return;
      if (sessionStorage.getItem(SESSION_KEY) === "1") return;
      shownRef.current = true;
      sessionStorage.setItem(SESSION_KEY, "1");
      window.clearTimeout(timerRef.current);
      setOpen(true);
      tradeConfirmationPromptShown("in_app");
    };

    const onClick = (e: Event) => {
      const detail = (e as CustomEvent).detail as { broker?: string } | undefined;
      brokerRef.current = detail?.broker;
      armedRef.current = true;
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(show, FALLBACK_DELAY_MS);
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") show();
    };

    window.addEventListener("px:brokerage-clicked", onClick as EventListener);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onVisibility);
    return () => {
      window.removeEventListener("px:brokerage-clicked", onClick as EventListener);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onVisibility);
      window.clearTimeout(timerRef.current);
    };
  }, []);

  const answer = (placed: boolean) => {
    tradeSelfReported({
      placed,
      surface: "in_app",
      broker: brokerRef.current,
      portfolioId: portfolioId || undefined,
    });
    if (placed) {
      setOpen(false);
    } else {
      setNotYet(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {notYet ? "No rush — it takes about 2 minutes" : "Did you place your trade?"}
          </DialogTitle>
          <DialogDescription>
            {notYet
              ? "Your portfolio is ready whenever you are. Pick up where you left off:"
              : "Quick check so we can keep your portfolio on track."}
          </DialogDescription>
        </DialogHeader>

        {notYet ? (
          <div className="grid grid-cols-2 gap-2">
            {BROKERS.map((b) => (
              <Button
                key={b.id}
                asChild
                variant={b.id === "bamboo" ? "default" : "secondary"}
              >
                <a href={brokerUrl(b)} target="_blank" rel="noopener noreferrer">
                  Open {b.name}
                  <ExternalLink className="h-4 w-4 ml-1.5" />
                </a>
              </Button>
            ))}
          </div>
        ) : (
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => answer(true)}>
              Yes, done
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => answer(false)}>
              Not yet
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TradeConfirmationModal;
