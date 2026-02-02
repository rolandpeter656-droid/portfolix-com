import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface WelcomeEmailRequest {
  email: string;
  firstName?: string;
  portfolioName?: string;
  portfolioAssets?: Array<{ symbol: string; name: string; allocation: number }>;
  emailType: "welcome" | "day3_followup" | "day7_context";
}

const getWelcomeEmailHtml = (firstName: string, portfolioName?: string, assets?: Array<{ symbol: string; name: string; allocation: number }>) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to PortfoliX</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Your Portfolio is Ready!</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <p style="color: #333; font-size: 16px; line-height: 1.6;">
        Hi ${firstName || "there"},
      </p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">
        Congratulations on creating your personalized investment portfolio${portfolioName ? `: <strong>${portfolioName}</strong>` : ""}! You've taken an important step toward building long-term wealth.
      </p>
      
      ${assets && assets.length > 0 ? `
      <!-- Portfolio Summary -->
      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Your Portfolio Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${assets.map(a => `
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <strong style="color: #8B5CF6;">${a.symbol}</strong>
              <span style="color: #666; font-size: 14px;"> ${a.name}</span>
            </td>
            <td style="text-align: right; padding: 8px 0; border-bottom: 1px solid #eee; color: #333;">
              ${a.allocation}%
            </td>
          </tr>
          `).join("")}
        </table>
      </div>
      ` : ""}
      
      <!-- Implementation Checklist -->
      <div style="background: #f0fdf4; border-left: 4px solid #10B981; padding: 20px; margin: 20px 0;">
        <h3 style="color: #166534; margin-top: 0;">📋 Implementation Checklist</h3>
        <ul style="color: #333; padding-left: 20px; margin: 0;">
          <li style="margin: 8px 0;">Open your brokerage account (Fidelity, Vanguard, or Schwab)</li>
          <li style="margin: 8px 0;">Search for each ticker symbol</li>
          <li style="margin: 8px 0;">Purchase the exact dollar amounts shown</li>
          <li style="margin: 8px 0;">Set a calendar reminder to review annually</li>
        </ul>
      </div>
      
      <p style="color: #333; font-size: 16px; line-height: 1.6;">
        <strong>Need help?</strong> Visit your PortfoliX dashboard anytime to view your portfolio, get AI-powered suggestions, and track your progress.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://portfolix-com.lovable.app/my-portfolios" style="background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
          View My Portfolio
        </a>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px; margin: 0;">
        PortfoliX provides educational research tools, not personalized financial advice.<br>
        You are solely responsible for your investment decisions.
      </p>
    </div>
  </div>
</body>
</html>
`;

const getDay3FollowupHtml = (firstName: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Have you implemented your portfolio yet?</h1>
    </div>
    
    <div style="padding: 30px;">
      <p style="color: #333; font-size: 16px; line-height: 1.6;">
        Hi ${firstName || "there"},
      </p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">
        We noticed you created a portfolio 3 days ago. If you haven't implemented it yet, here are some common questions that might be holding you back:
      </p>
      
      <div style="margin: 24px 0;">
        <div style="border-bottom: 1px solid #eee; padding: 16px 0;">
          <h4 style="color: #8B5CF6; margin: 0 0 8px 0;">❓ "Which brokerage should I use?"</h4>
          <p style="color: #666; margin: 0; font-size: 14px;">
            Fidelity, Vanguard, and Charles Schwab all offer commission-free trading for ETFs. Choose based on your existing accounts or sign up for a new one in about 15 minutes.
          </p>
        </div>
        
        <div style="border-bottom: 1px solid #eee; padding: 16px 0;">
          <h4 style="color: #8B5CF6; margin: 0 0 8px 0;">❓ "Is now a good time to invest?"</h4>
          <p style="color: #666; margin: 0; font-size: 14px;">
            Time in the market beats timing the market. Studies show investors who wait for the "perfect" moment typically underperform those who invest consistently.
          </p>
        </div>
        
        <div style="padding: 16px 0;">
          <h4 style="color: #8B5CF6; margin: 0 0 8px 0;">❓ "What if I make a mistake?"</h4>
          <p style="color: #666; margin: 0; font-size: 14px;">
            ETFs are flexible—you can sell anytime. Start with a small amount to get comfortable, then add more as you build confidence.
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://portfolix-com.lovable.app/my-portfolios" style="background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
          Review My Portfolio
        </a>
      </div>
      
      <p style="color: #666; font-size: 14px; text-align: center;">
        Reply to this email if you have any questions—we're here to help!
      </p>
    </div>
  </div>
</body>
</html>
`;

const getDay7ContextHtml = (firstName: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">📈 Your Weekly Portfolio Check-In</h1>
    </div>
    
    <div style="padding: 30px;">
      <p style="color: #333; font-size: 16px; line-height: 1.6;">
        Hi ${firstName || "there"},
      </p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">
        It's been a week since you created your portfolio. Here's what you should know about long-term investing:
      </p>
      
      <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #92400e; margin-top: 0;">🎯 Remember: This is a Marathon, Not a Sprint</h3>
        <p style="color: #78350f; margin: 0; font-size: 14px;">
          Daily or weekly market movements are normal. Your portfolio is designed for your specific timeline and goals. Checking obsessively can lead to emotional decisions that hurt returns.
        </p>
      </div>
      
      <h3 style="color: #333;">What Successful Investors Do:</h3>
      <ul style="color: #666; line-height: 1.8;">
        <li><strong>Check monthly, not daily</strong> — Less stress, better decisions</li>
        <li><strong>Keep contributing</strong> — Regular investments smooth out volatility</li>
        <li><strong>Stay the course</strong> — The biggest gains come from patience</li>
        <li><strong>Rebalance annually</strong> — We'll remind you when it's time</li>
      </ul>
      
      <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #166534; margin-top: 0;">🚀 Upgrade to Pro for More</h3>
        <p style="color: #166534; margin: 0; font-size: 14px;">
          Get AI-powered rebalancing alerts, personalized market insights, and unlimited portfolio tracking with PortfoliX Pro.
        </p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://portfolix-com.lovable.app/my-portfolios" style="background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
          View My Portfolio
        </a>
      </div>
    </div>
  </div>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, firstName, portfolioName, portfolioAssets, emailType }: WelcomeEmailRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    let subject: string;
    let html: string;

    switch (emailType) {
      case "welcome":
        subject = portfolioName 
          ? `Your ${portfolioName} is Ready! 🎉`
          : "Your PortfoliX Portfolio is Ready! 🎉";
        html = getWelcomeEmailHtml(firstName || "", portfolioName, portfolioAssets);
        break;
      
      case "day3_followup":
        subject = "Have you implemented your portfolio yet?";
        html = getDay3FollowupHtml(firstName || "");
        break;
      
      case "day7_context":
        subject = "📈 Your Weekly Portfolio Check-In";
        html = getDay7ContextHtml(firstName || "");
        break;
      
      default:
        throw new Error("Invalid email type");
    }

    console.log(`Sending ${emailType} email to ${email}`);

    const emailResponse = await resend.emails.send({
      from: "PortfoliX <noreply@resend.dev>", // Replace with verified domain
      to: [email],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
