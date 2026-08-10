import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const TARGET_ID = "portfolio-allocations";

export const ScrollToPortfolioCue = () => {
  const isMobile = useIsMobile();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!isMobile) return;

    const onScroll = () => {
      if (window.scrollY > 120) setHidden(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const target = document.getElementById(TARGET_ID);
    let observer: IntersectionObserver | undefined;
    if (target && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) setHidden(true);
        },
        { threshold: 0.05 }
      );
      observer.observe(target);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, [isMobile]);

  if (!isMobile) return null;

  const handleClick = () => {
    const target = document.getElementById(TARGET_ID);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    setHidden(true);
  };

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)" }}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label="Scroll down to view your portfolio"
        aria-hidden={hidden}
        tabIndex={hidden ? -1 : 0}
        className={`pointer-events-auto inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full font-sans font-semibold text-white shadow-lg transition-opacity duration-200 motion-safe:animate-[px-cue-bounce_1.6s_ease-in-out_infinite] ${
          hidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ backgroundColor: "#14B8A6" }}
      >
        See your portfolio
        <ChevronDown className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ScrollToPortfolioCue;