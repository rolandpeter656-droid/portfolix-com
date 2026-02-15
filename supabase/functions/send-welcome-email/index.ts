import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_EMAIL = "peter@portfolixapps.com";
const FROM_EMAIL = "Roland from PortfoliX <noreply@portfolixapps.com>";

// ── Sanitization helpers ──
const esc = (s: string | undefined | null) =>
  String(s || "").replace(/[<>&"']/g, "").substring(0, 100);

const sanitizeAssets = (
  arr?: Array<{ symbol: string; name: string; allocation: number }>
) =>
  (arr || []).slice(0, 10).map((a) => ({
    symbol: esc(a.symbol).substring(0, 10),
    name: esc(a.name).substring(0, 50),
    allocation: Math.min(Math.max(Number(a.allocation) || 0, 0), 100),
  }));

// ── Shared style tokens ──
const TEAL = "#14B8A6";
const DARK = "#0A0A0A";
const CARD_BG = "#1A1A1A";
const GRAY = "#9CA3AF";

const baseWrapper = (content: string) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f5f5f5;margin:0;padding:20px;">
<div style="max-width:600px;margin:0 auto;background:${DARK};border-radius:12px;overflow:hidden;">
${content}
<div style="padding:20px 30px;text-align:center;border-top:1px solid #2A2A2A;">
  <p style="color:${GRAY};font-size:12px;margin:0;">
    PortfoliX · Built for smarter investing<br>
    <a href="https://portfolix-com.lovable.app/terms" style="color:${TEAL};text-decoration:none;">Terms</a> · 
    <a href="https://portfolix-com.lovable.app/privacy" style="color:${TEAL};text-decoration:none;">Privacy</a>
  </p>
  <p style="color:#4B5563;font-size:11px;margin:8px 0 0;">
    PortfoliX provides educational research tools, not personalized financial advice.
  </p>
</div>
</div>
</body></html>`;

const ctaButton = (text: string, href: string) =>
  `<div style="text-align:center;margin:30px 0;">
    <a href="${href}" style="background:${TEAL};color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">${text}</a>
  </div>`;

const founderSig = `
<p style="color:#d1d5db;font-size:14px;margin-top:24px;">
  Cheers,<br><strong>Roland Peter</strong><br>
  <span style="color:${GRAY};font-size:13px;">Founder, PortfoliX</span>
</p>`;

// ── Email Templates ──

function welcomeEmail(name: string) {
  return baseWrapper(`
    <div style="background:linear-gradient(135deg,${TEAL} 0%,#059669 100%);padding:40px 30px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:28px;">Welcome to PortfoliX 🎉</h1>
    </div>
    <div style="padding:30px;color:#e5e7eb;">
      <p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
      <p style="font-size:16px;line-height:1.6;">
        Thanks for joining PortfoliX! You're about to build your first investment portfolio in just 3 minutes — no finance degree required.
      </p>
      <h3 style="color:white;margin-top:24px;">Here's how it works:</h3>
      <div style="margin:16px 0;">
        <div style="display:flex;align-items:flex-start;margin-bottom:16px;">
          <span style="background:${TEAL};color:white;border-radius:50%;width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;margin-right:12px;flex-shrink:0;">1</span>
          <div><strong style="color:white;">Tell us your goals</strong><br><span style="color:${GRAY};font-size:14px;">Answer 3 simple questions about your risk tolerance and timeline</span></div>
        </div>
        <div style="display:flex;align-items:flex-start;margin-bottom:16px;">
          <span style="background:${TEAL};color:white;border-radius:50%;width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;margin-right:12px;flex-shrink:0;">2</span>
          <div><strong style="color:white;">Get your portfolio</strong><br><span style="color:${GRAY};font-size:14px;">Our AI builds a diversified portfolio matched to you</span></div>
        </div>
        <div style="display:flex;align-items:flex-start;">
          <span style="background:${TEAL};color:white;border-radius:50%;width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;margin-right:12px;flex-shrink:0;">3</span>
          <div><strong style="color:white;">Start investing</strong><br><span style="color:${GRAY};font-size:14px;">Follow your personalized implementation guide</span></div>
        </div>
      </div>
      ${ctaButton("Build Your First Portfolio", "https://portfolix-com.lovable.app/portfolio-builder")}
      <div style="background:${CARD_BG};border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid ${TEAL};">
        <h4 style="color:white;margin-top:0;">What makes PortfoliX different?</h4>
        <ul style="color:${GRAY};padding-left:20px;margin:0;">
          <li style="margin:6px 0;">AI-powered portfolio recommendations</li>
          <li style="margin:6px 0;">Clear implementation guides</li>
          <li style="margin:6px 0;">Educational resources for every level</li>
          <li style="margin:6px 0;">Free to get started — no credit card needed</li>
        </ul>
      </div>
      ${founderSig}
      <p style="color:#6B7280;font-size:13px;margin-top:16px;font-style:italic;">
        P.S. Have questions? Just reply to this email — I read every message personally.
      </p>
    </div>
  `);
}

function proWelcomeEmail(name: string, nextBillingDate: string) {
  const features = [
    { icon: "🤖", title: "AI-Powered Market Analysis", desc: "Real-time insights and trend detection powered by advanced algorithms" },
    { icon: "🔔", title: "Portfolio Rebalancing Alerts", desc: "Get notified when your portfolio drifts from optimal allocation" },
    { icon: "📊", title: "Performance Tracking", desc: "Detailed recommendations to optimize your returns" },
    { icon: "📋", title: "Quarterly Portfolio Reviews", desc: "In-depth analysis of your portfolio performance every quarter" },
    { icon: "⚡", title: "Priority Email Support", desc: "Get answers faster with priority support" },
    { icon: "💡", title: "Tax Optimization Guidance", desc: "Strategies to minimize your tax burden" },
  ];
  return baseWrapper(`
    <div style="background:linear-gradient(135deg,${TEAL} 0%,#0D9488 50%,#059669 100%);padding:40px 30px;text-align:center;">
      <p style="color:rgba(255,255,255,0.8);margin:0 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:2px;">Welcome to</p>
      <h1 style="color:white;margin:0;font-size:32px;">PortfoliX Pro ⚡</h1>
      <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:16px;">Your investing just got smarter</p>
    </div>
    <div style="padding:30px;color:#e5e7eb;">
      <p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
      <p style="font-size:16px;line-height:1.6;">
        Welcome to the Pro family! You now have access to powerful tools that will help you make smarter investment decisions.
      </p>
      <h3 style="color:white;">Your Pro Features:</h3>
      ${features.map(f => `
        <div style="background:${CARD_BG};border-radius:8px;padding:16px;margin:12px 0;border:1px solid #2A2A2A;">
          <div style="font-size:16px;"><span style="margin-right:8px;">${f.icon}</span><strong style="color:white;">${f.title}</strong></div>
          <p style="color:${GRAY};font-size:14px;margin:6px 0 0;">${f.desc}</p>
        </div>
      `).join("")}
      ${ctaButton("Access Pro Features", "https://portfolix-com.lovable.app/portfolio-builder")}
      <div style="background:${CARD_BG};border-radius:8px;padding:16px;margin:20px 0;border:1px solid #2A2A2A;">
        <p style="color:${GRAY};font-size:13px;margin:0;">
          <strong style="color:white;">Billing:</strong> $15/month · Next billing: ${nextBillingDate}<br>
          <a href="https://portfolix-com.lovable.app/pricing" style="color:${TEAL};text-decoration:none;">Manage subscription →</a>
        </p>
      </div>
      ${founderSig}
    </div>
  `);
}

function eliteWelcomeEmail(name: string, nextBillingDate: string) {
  const features = [
    { icon: "🧠", title: "Advanced AI Market Intelligence", desc: "Institutional-grade analysis and predictive insights" },
    { icon: "📉", title: "Tax-Loss Harvesting Strategies", desc: "Automated strategies to offset gains and reduce taxes" },
    { icon: "🔗", title: "Multi-Account Portfolio Coordination", desc: "Optimize across all your investment accounts" },
    { icon: "⚙️", title: "Advanced Rebalancing Algorithms", desc: "Sophisticated algorithms for optimal portfolio maintenance" },
    { icon: "👤", title: "Direct Advisor Access", desc: "Schedule consultations with investment professionals" },
    { icon: "🎯", title: "White-Glove Support", desc: "Dedicated support with priority response times" },
    { icon: "📈", title: "Institutional-Grade Analytics", desc: "The same tools used by professional portfolio managers" },
  ];
  return baseWrapper(`
    <div style="background:linear-gradient(135deg,#1a1a2e 0%,${DARK} 50%,#0D9488 100%);padding:48px 30px;text-align:center;border-bottom:2px solid ${TEAL};">
      <p style="color:${TEAL};margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:3px;">Exclusive Access</p>
      <h1 style="color:white;margin:0;font-size:34px;">PortfoliX Elite 👑</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:16px;">Premium investing starts now</p>
    </div>
    <div style="padding:30px;color:#e5e7eb;">
      <p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
      <p style="font-size:16px;line-height:1.6;">
        Welcome to the most exclusive tier of PortfoliX. You now have access to institutional-grade tools designed for serious investors like you.
      </p>
      <h3 style="color:white;">Your Elite Arsenal:</h3>
      ${features.map(f => `
        <div style="background:${CARD_BG};border-radius:8px;padding:16px;margin:12px 0;border:1px solid #2A2A2A;">
          <div style="font-size:16px;"><span style="margin-right:8px;">${f.icon}</span><strong style="color:white;">${f.title}</strong></div>
          <p style="color:${GRAY};font-size:14px;margin:6px 0 0;">${f.desc}</p>
        </div>
      `).join("")}
      ${ctaButton("Access Elite Dashboard", "https://portfolix-com.lovable.app/portfolio-builder")}
      <div style="background:${CARD_BG};border-radius:8px;padding:16px;margin:20px 0;border:1px solid #2A2A2A;">
        <p style="color:${GRAY};font-size:13px;margin:0;">
          <strong style="color:white;">Billing:</strong> $49/month · Next billing: ${nextBillingDate}<br>
          <a href="https://portfolix-com.lovable.app/pricing" style="color:${TEAL};text-decoration:none;">Manage subscription →</a><br>
          <strong style="color:white;">Elite Support:</strong> <a href="mailto:elite@portfolixapps.com" style="color:${TEAL};text-decoration:none;">elite@portfolixapps.com</a>
        </p>
      </div>
      ${founderSig}
    </div>
  `);
}

function internalNotificationEmail(data: {
  userEmail: string;
  portfolioName: string;
  riskScore: number;
  timeline: string;
  experienceLevel: string;
  investmentAmount: number;
  assetCount: number;
  userPlan: string;
  userCreatedAt: string;
  totalPortfolios: number;
}) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:monospace;background:#f5f5f5;padding:20px;">
<div style="max-width:600px;margin:0 auto;background:white;border-radius:8px;padding:24px;border-left:4px solid ${TEAL};">
  <h2 style="margin-top:0;">🎯 New Portfolio Created</h2>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:6px 0;font-weight:bold;">User</td><td>${data.userEmail}</td></tr>
    <tr><td style="padding:6px 0;font-weight:bold;">Portfolio</td><td>${data.portfolioName}</td></tr>
    <tr><td style="padding:6px 0;font-weight:bold;">Risk Score</td><td>${data.riskScore}/100</td></tr>
    <tr><td style="padding:6px 0;font-weight:bold;">Timeline</td><td>${data.timeline}</td></tr>
    <tr><td style="padding:6px 0;font-weight:bold;">Experience</td><td>${data.experienceLevel}</td></tr>
    <tr><td style="padding:6px 0;font-weight:bold;">Amount</td><td>$${data.investmentAmount.toLocaleString()}</td></tr>
    <tr><td style="padding:6px 0;font-weight:bold;">Assets</td><td>${data.assetCount} holdings</td></tr>
    <tr><td style="padding:6px 0;font-weight:bold;">Plan</td><td>${data.userPlan}</td></tr>
    <tr><td style="padding:6px 0;font-weight:bold;">Joined</td><td>${data.userCreatedAt}</td></tr>
    <tr><td style="padding:6px 0;font-weight:bold;">Total Portfolios</td><td>${data.totalPortfolios}</td></tr>
  </table>
  <p style="margin-top:16px;"><a href="https://portfolix-com.lovable.app/analytics" style="color:${TEAL};">Open Admin Dashboard →</a></p>
</div>
</body></html>`;
}

// ── Handler ──

interface EmailRequest {
  emailType: "welcome" | "pro_welcome" | "elite_welcome" | "internal_notification";
  firstName?: string;
  // For plan welcome emails
  nextBillingDate?: string;
  // For internal notification
  portfolioName?: string;
  riskScore?: number;
  timeline?: string;
  experienceLevel?: string;
  investmentAmount?: number;
  assetCount?: number;
  userPlan?: string;
  userCreatedAt?: string;
  totalPortfolios?: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ success: false, error: "Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid or expired session" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userEmail = user.email;
    console.log("Authenticated email request from user:", user.id);

    const body: EmailRequest = await req.json();
    const { emailType } = body;

    const validTypes = ["welcome", "pro_welcome", "elite_welcome", "internal_notification"];
    if (!validTypes.includes(emailType)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email type" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const safeName = esc(body.firstName) || "there";
    let subject: string;
    let html: string;
    let to: string[];

    switch (emailType) {
      case "welcome":
        subject = "Welcome to PortfoliX – Build Your First Portfolio in 3 Minutes";
        html = welcomeEmail(safeName);
        to = [userEmail!];
        break;
      case "pro_welcome": {
        const nextDate = esc(body.nextBillingDate) || new Date(Date.now() + 30 * 86400000).toLocaleDateString();
        subject = "Welcome to PortfoliX Pro – Your Investing Just Got Smarter ⚡";
        html = proWelcomeEmail(safeName, nextDate);
        to = [userEmail!];
        break;
      }
      case "elite_welcome": {
        const nextDate = esc(body.nextBillingDate) || new Date(Date.now() + 30 * 86400000).toLocaleDateString();
        subject = "Welcome to PortfoliX Elite – Premium Investing Starts Now 👑";
        html = eliteWelcomeEmail(safeName, nextDate);
        to = [userEmail!];
        break;
      }
      case "internal_notification":
        subject = "🎯 New Portfolio Created on PortfoliX";
        html = internalNotificationEmail({
          userEmail: userEmail || "unknown",
          portfolioName: esc(body.portfolioName) || "Unnamed",
          riskScore: Math.min(Math.max(Number(body.riskScore) || 0, 0), 100),
          timeline: esc(body.timeline) || "N/A",
          experienceLevel: esc(body.experienceLevel) || "N/A",
          investmentAmount: Number(body.investmentAmount) || 0,
          assetCount: Number(body.assetCount) || 0,
          userPlan: esc(body.userPlan) || "free",
          userCreatedAt: esc(body.userCreatedAt) || "N/A",
          totalPortfolios: Number(body.totalPortfolios) || 0,
        });
        to = [ADMIN_EMAIL];
        break;
      default:
        return new Response(
          JSON.stringify({ success: false, error: "Invalid email type" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
    }

    console.log(`Sending ${emailType} email to ${to.join(", ")}`);

    const emailResponse = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to send email. Please try again later." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
