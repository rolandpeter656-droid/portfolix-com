import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FUNCTIONS_BASE = `${SUPABASE_URL}/functions/v1`;
const APP_URL = "https://portfolixapps.com";
const FROM_EMAIL = "Roland from PortfoliX <noreply@portfolixapps.com>";

const TEAL = "#14B8A6";
const DARK = "#0A0A0A";
const GRAY = "#9CA3AF";

const esc = (s: unknown) => String(s ?? "").replace(/[<>&"']/g, "").slice(0, 80);

interface Asset { symbol?: string; name?: string; allocation?: number }

const buildHtml = (
  firstName: string,
  portfolioName: string,
  holdings: Asset[],
  portfolioId: string,
  token: string,
) => {
  const rows = holdings
    .map(
      (h) =>
        `<tr><td style="padding:8px 0;color:#fff;font-size:15px;">${esc(h.symbol)} <span style="color:${GRAY}">${esc(h.name)}</span></td><td style="padding:8px 0;color:${TEAL};font-size:15px;text-align:right;font-weight:600;">${Math.round(Number(h.allocation) || 0)}%</td></tr>`,
    )
    .join("");

  const yes = `${FUNCTIONS_BASE}/trade-nudge-response?token=${token}&placed=yes`;
  const no = `${FUNCTIONS_BASE}/trade-nudge-response?token=${token}&placed=no`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;margin:0;padding:20px;">
<div style="max-width:600px;margin:0 auto;background:${DARK};border-radius:12px;overflow:hidden;">
  <div style="padding:30px;">
    <p style="color:#fff;font-size:16px;margin:0 0 12px;">Hi ${esc(firstName) || "there"},</p>
    <p style="color:#d1d5db;font-size:15px;line-height:1.6;margin:0 0 20px;">
      A couple of days ago you built <strong style="color:#fff;">${esc(portfolioName)}</strong>. Here's what it looked like:
    </p>
    <table style="width:100%;border-collapse:collapse;background:#1A1A1A;border-radius:8px;padding:8px;">
      <tbody>${rows}</tbody>
    </table>
    <div style="text-align:center;margin:28px 0;">
      <a href="${APP_URL}/?portfolio=${portfolioId}" style="background:${TEAL};color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">View your recommendation</a>
    </div>
    <p style="color:#d1d5db;font-size:15px;margin:0 0 12px;text-align:center;">Did you get it placed?</p>
    <p style="text-align:center;margin:0;">
      <a href="${yes}" style="color:${TEAL};font-weight:600;text-decoration:none;margin-right:18px;">Yes, I placed it</a>
      <a href="${no}" style="color:${GRAY};text-decoration:none;">Not yet</a>
    </p>
    <p style="color:#d1d5db;font-size:14px;margin-top:24px;">Cheers,<br><strong>Roland Peter</strong></p>
  </div>
  <div style="padding:20px 30px;text-align:center;border-top:1px solid #2A2A2A;">
    <p style="color:#4B5563;font-size:11px;margin:0;">PortfoliX provides educational research tools, not personalized financial advice.</p>
  </div>
</div></body></html>`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Only the scheduler (or an admin with the service key) may run this.
  const auth = req.headers.get("authorization") || "";
  const cronKey = req.headers.get("x-cron-key") || "";
  if (!auth.includes(SERVICE_ROLE) && cronKey !== SERVICE_ROLE) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  try {
    const now = Date.now();
    const from = new Date(now - 7 * 24 * 3600 * 1000).toISOString();
    const to = new Date(now - 48 * 3600 * 1000).toISOString();

    // Portfolios generated 48h–7d ago by signed-in users.
    const { data: portfolios, error: pErr } = await supabase
      .from("user_portfolios")
      .select("id, user_id, portfolio_name, assets, created_at")
      .gte("created_at", from)
      .lte("created_at", to)
      .order("created_at", { ascending: false })
      .limit(200);
    if (pErr) throw pErr;

    const candidates = portfolios ?? [];
    if (candidates.length === 0) {
      return new Response(JSON.stringify({ sent: 0, reason: "no candidates" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Suppression: already nudged for this portfolio.
    const { data: nudged } = await supabase
      .from("trade_nudges")
      .select("portfolio_id")
      .in("portfolio_id", candidates.map((p) => p.id));
    const nudgedIds = new Set((nudged ?? []).map((n) => n.portfolio_id));

    // Suppression: user already self-reported "placed".
    const userIds = [...new Set(candidates.map((p) => p.user_id))];
    const { data: placedRows } = await supabase
      .from("trade_self_reports")
      .select("user_id")
      .eq("placed", true)
      .in("user_id", userIds);
    const placedUsers = new Set((placedRows ?? []).map((r) => r.user_id));

    let sent = 0;
    const errors: string[] = [];
    const emailedUsers = new Set<string>();

    for (const p of candidates) {
      if (nudgedIds.has(p.id) || placedUsers.has(p.user_id)) continue;
      if (emailedUsers.has(p.user_id)) continue; // one email per user per run

      const { data: userRes } = await supabase.auth.admin.getUserById(p.user_id);
      const email = userRes?.user?.email;
      if (!email) continue; // anonymous / unreachable

      const firstName =
        (userRes?.user?.user_metadata?.first_name as string) ||
        email.split("@")[0];

      // Reserve the nudge first so we never double-send.
      const { data: nudge, error: nErr } = await supabase
        .from("trade_nudges")
        .insert({ portfolio_id: p.id, user_id: p.user_id, email })
        .select("token")
        .single();
      if (nErr || !nudge) continue;

      const holdings = (Array.isArray(p.assets) ? p.assets : []).slice(0, 3) as Asset[];
      const html = buildHtml(firstName, p.portfolio_name, holdings, p.id, nudge.token);

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [email],
          subject: "Did you get your portfolio placed?",
          html,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error(`Resend failed [${res.status}]: ${body}`);
        errors.push(`${p.id}: ${res.status}`);
        await supabase.from("trade_nudges").delete().eq("portfolio_id", p.id);
        continue;
      }

      emailedUsers.add(p.user_id);
      sent++;
      await supabase.from("analytics_events").insert({
        event_name: "nudge_email_sent",
        user_id: p.user_id,
        session_id: `nudge_${p.id}`,
        properties: { portfolio_id: p.id, surface: "email" },
      });
    }

    return new Response(JSON.stringify({ sent, errors }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-trade-nudges error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});