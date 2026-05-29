import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { analytics } from "@/lib/analytics/index";
import { getOrCreateSessionId } from "@/lib/analytics/session";

const REF_KEY = "portfolix_ref_id";
const SOURCE_KEY = "portfolix_ref_source";
const ROW_KEY = "portfolix_ref_row_id";

/**
 * Captures ?ref={referrer_id}&src=whatsapp|x|copy on any page load.
 * First-touch wins: never overwrites an existing ref in localStorage.
 * Records a row in `referrals` and stores its id so we can attach the
 * signup later.
 */
export function useReferralCapture() {
  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get("ref");
        const src = params.get("src") || "unknown";
        if (!ref) return;

        // First-touch wins
        if (localStorage.getItem(REF_KEY)) return;

        localStorage.setItem(REF_KEY, ref);
        localStorage.setItem(SOURCE_KEY, src);

        analytics.referralLinkClicked(ref);

        const sessionId = getOrCreateSessionId();
        const { data, error } = await supabase
          .from("referrals")
          .insert({
            referrer_user_id: ref,
            referred_session_id: sessionId,
            source: src,
          })
          .select("id")
          .maybeSingle();

        if (!error && data?.id) {
          localStorage.setItem(ROW_KEY, data.id);
        }
      } catch (e) {
        // referral capture should never break the app
        console.warn("[referral] capture failed", e);
      }
    };
    run();
  }, []);
}

/**
 * Attach a freshly-signed-up user to the pending referral row, if any.
 * Call right after a successful signup (email/password or OAuth callback).
 */
export async function attachReferralToSignup(userId: string) {
  try {
    const rowId = localStorage.getItem(ROW_KEY);
    const ref = localStorage.getItem(REF_KEY);
    if (!rowId || !ref) return;

    const { error } = await supabase
      .from("referrals")
      .update({ referred_user_id: userId })
      .eq("id", rowId)
      .is("referred_user_id", null);

    if (!error) {
      analytics.referralSignup(ref);
      // keep ref id around for potential future analytics, but mark row consumed
      localStorage.removeItem(ROW_KEY);
    }
  } catch (e) {
    console.warn("[referral] attach failed", e);
  }
}

export const getStoredReferrerId = () => localStorage.getItem(REF_KEY);
