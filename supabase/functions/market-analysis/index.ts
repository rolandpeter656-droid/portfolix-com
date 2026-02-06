import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log("Authenticated market analysis request from user:", userId);

    const { investmentAmount, goal, timeHorizon, riskTolerance } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate inputs
    const amount = Number(investmentAmount);
    if (!Number.isFinite(amount) || amount <= 0 || amount > 100000000) {
      return new Response(
        JSON.stringify({ error: "Invalid investment amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validGoals = ["Retirement", "Wealth accumulation", "Income", "Speculation"];
    const validHorizons = ["1-3yrs", "3-7yrs", "7+yrs"];
    const validRisks = ["Low", "Moderate", "High"];

    if (!validGoals.includes(goal) || !validHorizons.includes(timeHorizon) || !validRisks.includes(riskTolerance)) {
      return new Response(
        JSON.stringify({ error: "Invalid input parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing market analysis request:", { investmentAmount: amount, goal, timeHorizon, riskTolerance });

    const systemPrompt = `You are an expert financial advisor AI specializing in portfolio allocation and market analysis. 
Your role is to provide professional investment recommendations based on user inputs.
Always provide specific, actionable advice with clear allocation percentages.`;

    const userPrompt = `Based on the following investor profile, provide a detailed market analysis and portfolio recommendation:

Investment Amount: $${amount}
Primary Goal: ${goal}
Time Horizon: ${timeHorizon}
Risk Tolerance: ${riskTolerance}

Please provide:
1. A recommended asset allocation with specific percentages for stocks, bonds, real estate, and cash/alternatives
2. A 3-step actionable plan for implementing this portfolio
3. Key market insights relevant to this investment profile

Format your response as JSON with this structure:
{
  "allocation": {
    "stocks": number (percentage),
    "bonds": number (percentage),
    "realEstate": number (percentage),
    "cash": number (percentage)
  },
  "actionPlan": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ..."
  ],
  "marketInsights": "Brief market analysis relevant to this profile (2-3 sentences)"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error("AI gateway request failed");
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log("AI response received for user:", userId);

    // Parse the JSON response from AI
    let analysisResult;
    try {
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || aiResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiResponse;
      analysisResult = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      analysisResult = {
        allocation: {
          stocks: riskTolerance === "High" ? 70 : riskTolerance === "Moderate" ? 50 : 30,
          bonds: riskTolerance === "High" ? 15 : riskTolerance === "Moderate" ? 30 : 50,
          realEstate: 10,
          cash: riskTolerance === "High" ? 5 : riskTolerance === "Moderate" ? 10 : 10
        },
        actionPlan: [
          "Open an investment account with a reputable brokerage platform",
          "Allocate funds according to the recommended asset distribution",
          "Set up automatic rebalancing on a quarterly basis"
        ],
        marketInsights: "Based on current market conditions and your profile, this allocation balances growth potential with risk management."
      };
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in market-analysis function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again later." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
