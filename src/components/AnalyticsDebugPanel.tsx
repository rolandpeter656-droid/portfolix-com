import { useEffect, useState, useCallback } from "react";
import { Bug, X, Trash2, Download } from "lucide-react";

interface DebugEntry {
  eventName: string;
  properties: Record<string, unknown>;
  country?: string;
  userId: string | null;
  sessionId: string;
  timestamp: string;
  insertError?: string;
}

const TRACKED = [
  "country_selected",
  "ng_local_sleeve_generated",
  "portfolio_saved",
  "user_returned",
];

function isEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (import.meta.env.DEV) return true;
  return localStorage.getItem("px_analytics_debug") === "1";
}

export default function AnalyticsDebugPanel() {
  const [enabled, setEnabled] = useState<boolean>(isEnabled());
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<DebugEntry[]>([]);
  const [onlyTracked, setOnlyTracked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Toggle via ?debug=1 or Alt+Shift+D
    const params = new URLSearchParams(window.location.search);
    if (params.get("debug") === "1") {
      localStorage.setItem("px_analytics_debug", "1");
      setEnabled(true);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && (e.key === "D" || e.key === "d")) {
        const next = !enabled;
        localStorage.setItem("px_analytics_debug", next ? "1" : "0");
        setEnabled(next);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);

  const onEvent = useCallback((e: Event) => {
    const detail = (e as CustomEvent<DebugEntry>).detail;
    if (!detail) return;
    setEntries((prev) => [detail, ...prev].slice(0, 100));
  }, []);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener("px:analytics", onEvent as EventListener);
    return () =>
      window.removeEventListener("px:analytics", onEvent as EventListener);
  }, [enabled, onEvent]);

  if (!enabled) return null;

  const visible = onlyTracked
    ? entries.filter((e) => TRACKED.includes(e.eventName))
    : entries;

  const download = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-debug-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2 rounded-full bg-[#14B8A6] px-3 py-2 text-xs font-semibold text-black shadow-lg hover:bg-[#0d9488]"
        title="Analytics debug (Alt+Shift+D to toggle)"
      >
        <Bug className="h-4 w-4" />
        {entries.length}
      </button>

      {open && (
        <div className="fixed bottom-16 right-4 z-[9999] flex h-[70vh] w-[min(480px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-[#14B8A6]/30 bg-[#0A0A0A] text-xs text-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 p-2">
            <div className="font-semibold text-[#14B8A6]">
              Analytics Debug ({entries.length})
            </div>
            <div className="flex items-center gap-1">
              <label className="flex items-center gap-1 pr-2 text-white/70">
                <input
                  type="checkbox"
                  checked={onlyTracked}
                  onChange={(e) => setOnlyTracked(e.target.checked)}
                />
                tracked only
              </label>
              <button
                onClick={download}
                className="rounded p-1 hover:bg-white/10"
                title="Download JSON"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setEntries([])}
                className="rounded p-1 hover:bg-white/10"
                title="Clear"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-1 hover:bg-white/10"
                title="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {visible.length === 0 && (
              <div className="p-4 text-center text-white/50">
                Waiting for events…
              </div>
            )}
            {visible.map((e, i) => {
              const tracked = TRACKED.includes(e.eventName);
              return (
                <div
                  key={i}
                  className={`border-b border-white/5 p-2 ${
                    tracked ? "bg-[#14B8A6]/5" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono font-semibold ${
                        tracked ? "text-[#14B8A6]" : "text-white"
                      }`}
                    >
                      {e.eventName}
                    </span>
                    <span className="text-white/40">
                      {new Date(e.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 text-white/60">
                    <span>
                      country:{" "}
                      <span className="text-white">{e.country ?? "—"}</span>
                    </span>
                    <span>
                      user:{" "}
                      <span className="text-white">
                        {e.userId ? e.userId.slice(0, 8) : "anon"}
                      </span>
                    </span>
                  </div>
                  <pre className="mt-1 overflow-x-auto rounded bg-black/40 p-1.5 text-[10px] text-white/80">
{JSON.stringify(e.properties, null, 2)}
                  </pre>
                  {e.insertError && (
                    <div className="mt-1 text-red-400">
                      insert error: {e.insertError}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="border-t border-white/10 p-2 text-[10px] text-white/40">
            Toggle: Alt+Shift+D · Persist: ?debug=1
          </div>
        </div>
      )}
    </>
  );
}