import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const APP_URL = "https://portfolixapps.com";

const page = (title: string, body: string) => `<!DOCTYPE html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0A0A0A;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
<div style="max-width:420px;text-align:center;padding:32px;">
  <h1 style="font-size:22px;margin:0 0 12px;">${title}</h1>
  <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 24px;">${body}</p>
  <a href="${APP_URL}" style="background:#14B8A6;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Back to PortfoliX</a>
</div></body></html>`;

const html = (title: string, body: string, status = 200) =>
  new Response(page(title, body), {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const placedParam = (url.searchParams.get("placed") || "").toLowerCase();

  if (!/^[a-f0-9]{32,64}$/.test(token) || !["yes", "no"].includes(placedParam)) {
    return html("Invalid link", "This link looks incomplete or has expired.", 400);
  }
  const placed = placedParam === "yes";

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  const { data: nudge, error } = await supabase
    .from("trade_nudges")
    .select("id, user_id, portfolio_id, responded_at")
    .eq("token", token)
    .maybeSingle();

  if (error || !nudge) {
    return html("Link not found", "We couldn't match this link to a portfolio.", 404);
  }

  if (!nudge.responded_at) {
    await supabase.from("trade_self_reports").insert({
      user_id: nudge.user_id,
      session_id: `nudge_${nudge.portfolio_id}`,
      placed,
      surface: "email",
      portfolio_id: nudge.portfolio_id,
    });

    await supabase.from("analytics_events").insert([
      {
        event_name: "nudge_email_clicked",
        user_id: nudge.user_id,
        session_id: `nudge_${nudge.portfolio_id}`,
        properties: { placed, portfolio_id: nudge.portfolio_id },
      },
      {
        event_name: "trade_self_reported",
        user_id: nudge.user_id,
        session_id: `nudge_${nudge.portfolio_id}`,
        properties: { placed, surface: "email", portfolio_id: nudge.portfolio_id },
      },
    ]);

    await supabase
      .from("trade_nudges")
      .update({ responded_at: new Date().toISOString() })
      .eq("id", nudge.id);
  }

  return placed
    ? html("Nice work 🎉", "Thanks for confirming — your portfolio is live.")
    : html("No problem", "We saved your answer. Your portfolio is ready whenever you are.")
});