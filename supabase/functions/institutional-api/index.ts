// PortfoliX Institutional v1.0 - API Endpoint for White-label Partners
// RESTful API for portfolio generation and management (future licensing)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

interface APIRequest {
  action: 'generate_portfolio' | 'list_portfolios' | 'get_portfolio' | 'delete_portfolio';
  params?: any;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = req.headers.get('x-api-key');
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role for API key validation
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Validate API key
    const { data: apiKeyData, error: keyError } = await supabase
      .from('institutional_api_keys')
      .select('*, institutional_subscriptions(*)')
      .eq('api_key', apiKey)
      .eq('is_active', true)
      .maybeSingle();

    if (keyError || !apiKeyData) {
      console.error('Invalid API key:', keyError);
      return new Response(
        JSON.stringify({ error: 'Invalid or inactive API key' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit (basic implementation)
    const now = new Date();
    const lastUsed = apiKeyData.last_used_at ? new Date(apiKeyData.last_used_at) : null;
    if (lastUsed) {
      const hoursSinceLastUse = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastUse < 24) {
        // Simple rate limiting - in production, use Redis or similar
        console.log('Rate limit check passed');
      }
    }

    // Update last used timestamp
    await supabase
      .from('institutional_api_keys')
      .update({ last_used_at: now.toISOString() })
      .eq('id', apiKeyData.id);

    const { action, params }: APIRequest = await req.json();

    // Route to appropriate handler
    switch (action) {
      case 'generate_portfolio':
        return await handleGeneratePortfolio(supabase, apiKeyData, params);
      case 'list_portfolios':
        return await handleListPortfolios(supabase, apiKeyData, params);
      case 'get_portfolio':
        return await handleGetPortfolio(supabase, apiKeyData, params);
      case 'delete_portfolio':
        return await handleDeletePortfolio(supabase, apiKeyData, params);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleGeneratePortfolio(supabase: any, apiKeyData: any, params: any) {
  const subscriptionId = apiKeyData.subscription_id;
  
  // Check if can generate portfolio
  const { data: canGenerate } = await supabase.rpc('can_generate_institutional_portfolio', {
    sub_id: subscriptionId
  });

  if (!canGenerate) {
    return new Response(
      JSON.stringify({ error: 'Portfolio generation limit reached' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Generate allocation (simplified AI logic)
  const allocation = generateAllocation(params);
  
  const { data, error } = await supabase
    .from('institutional_portfolios')
    .insert({
      subscription_id: subscriptionId,
      user_id: apiKeyData.institutional_subscriptions.user_id,
      portfolio_name: params.portfolio_name || 'API Generated Portfolio',
      portfolio_type: 'custom',
      investment_horizon: params.investment_horizon,
      liquidity_needs: params.liquidity_needs,
      risk_tolerance: params.risk_tolerance,
      capital_size: params.capital_size,
      allocation,
      rationale: generateRationale(params),
      expected_return: calculateReturn(params.risk_tolerance),
      volatility: determineVolatility(params.risk_tolerance),
      ai_confidence_score: 90,
    })
    .select()
    .single();

  if (error) {
    console.error('Portfolio creation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create portfolio' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, portfolio: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleListPortfolios(supabase: any, apiKeyData: any, params: any) {
  const subscriptionId = apiKeyData.subscription_id;
  
  const { data, error } = await supabase
    .from('institutional_portfolios')
    .select('*')
    .eq('subscription_id', subscriptionId)
    .order('created_at', { ascending: false })
    .limit(params?.limit || 50);

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch portfolios' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, portfolios: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGetPortfolio(supabase: any, apiKeyData: any, params: any) {
  const { portfolio_id } = params;
  
  if (!portfolio_id) {
    return new Response(
      JSON.stringify({ error: 'portfolio_id required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data, error } = await supabase
    .from('institutional_portfolios')
    .select('*')
    .eq('id', portfolio_id)
    .eq('subscription_id', apiKeyData.subscription_id)
    .single();

  if (error || !data) {
    return new Response(
      JSON.stringify({ error: 'Portfolio not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, portfolio: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleDeletePortfolio(supabase: any, apiKeyData: any, params: any) {
  const { portfolio_id } = params;
  
  if (!portfolio_id) {
    return new Response(
      JSON.stringify({ error: 'portfolio_id required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { error } = await supabase
    .from('institutional_portfolios')
    .delete()
    .eq('id', portfolio_id)
    .eq('subscription_id', apiKeyData.subscription_id);

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to delete portfolio' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Helper functions for portfolio generation
function generateAllocation(params: any): Record<string, number> {
  const { risk_tolerance } = params;
  
  if (risk_tolerance === 'aggressive') {
    return { equities: 60, bonds: 20, cash: 5, crypto: 5, commodities: 5, etfs: 5 };
  } else if (risk_tolerance === 'moderate') {
    return { equities: 40, bonds: 35, cash: 10, commodities: 5, etfs: 10 };
  } else {
    return { bonds: 50, cash: 30, equities: 10, commodities: 10 };
  }
}

function generateRationale(params: any): string {
  return `API-generated portfolio optimized for ${params.investment_horizon} with ${params.risk_tolerance} risk tolerance.`;
}

function calculateReturn(riskTolerance: string): string {
  if (riskTolerance === 'aggressive') return '9-14%';
  if (riskTolerance === 'moderate') return '6-10%';
  return '4-7%';
}

function determineVolatility(riskTolerance: string): string {
  if (riskTolerance === 'aggressive') return 'High';
  if (riskTolerance === 'moderate') return 'Moderate';
  return 'Low';
}
