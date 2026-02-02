import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PortfolioAllocation {
  asset: string;
  percentage: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { type, portfolio, riskTolerance, investmentHorizon } = await req.json();
    
    let systemPrompt = "";
    let userPrompt = "";

    if (type === "improvement") {
      systemPrompt = `You are a professional portfolio analyst. Analyze the given portfolio and provide actionable improvement suggestions. Focus on:
1. Diversification opportunities
2. Risk-adjusted returns optimization
3. Sector balance
4. Asset correlation analysis
Be concise and practical.`;
      
      userPrompt = `Analyze this portfolio and provide 3-4 specific improvement suggestions:
Portfolio: ${JSON.stringify(portfolio)}
Risk Tolerance: ${riskTolerance || "moderate"}
Investment Horizon: ${investmentHorizon || "5 years"}`;
    } else if (type === "rebalancing") {
      systemPrompt = `You are a portfolio rebalancing specialist. Analyze drift from target allocations and recommend rebalancing actions. Consider:
1. Transaction costs vs. benefit of rebalancing
2. Tax implications
3. Market timing considerations
Provide specific buy/sell recommendations.`;
      
      userPrompt = `Analyze this portfolio for rebalancing needs:
Current Portfolio: ${JSON.stringify(portfolio)}
Risk Profile: ${riskTolerance || "moderate"}
Suggest specific rebalancing actions if drift exceeds 5% from optimal allocation.`;
    } else if (type === "risk_score") {
      systemPrompt = `You are a risk assessment expert. Calculate a comprehensive risk score (1-100) for the portfolio. Consider:
1. Asset volatility
2. Concentration risk
3. Correlation risk
4. Market risk exposure
5. Liquidity risk
Return a detailed risk breakdown.`;
      
      userPrompt = `Calculate the risk score for this portfolio:
Portfolio: ${JSON.stringify(portfolio)}
Provide: overall_score (1-100), risk_level (low/medium/high), and key risk factors.`;
    }

    const body = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "portfolio_analysis",
            description: "Return portfolio analysis results",
            parameters: {
              type: "object",
              properties: {
                suggestions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      priority: { type: "string", enum: ["high", "medium", "low"] },
                      action: { type: "string" }
                    },
                    required: ["title", "description", "priority"]
                  }
                },
                risk_score: {
                  type: "object",
                  properties: {
                    overall_score: { type: "number" },
                    risk_level: { type: "string", enum: ["low", "medium", "high"] },
                    volatility_score: { type: "number" },
                    concentration_score: { type: "number" },
                    diversification_score: { type: "number" },
                    risk_factors: {
                      type: "array",
                      items: { type: "string" }
                    }
                  }
                },
                rebalancing: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      asset: { type: "string" },
                      current_weight: { type: "number" },
                      target_weight: { type: "number" },
                      action: { type: "string", enum: ["buy", "sell", "hold"] },
                      amount_change: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      ],
      tool_choice: { type: "function", function: { name: "portfolio_analysis" } }
    };

    console.log("Calling Lovable AI for:", type);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits required. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI response received");

    // Extract the function call result
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ success: true, data: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback to content if no tool call
    const content = aiResponse.choices?.[0]?.message?.content;
    return new Response(JSON.stringify({ success: true, data: { raw: content } }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    // Log full error server-side for debugging
    console.error("Error in pro-ai-suggestions:", error);
    // Return generic error to client to prevent information leakage
    return new Response(JSON.stringify({ error: "Failed to generate suggestions. Please try again later." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
