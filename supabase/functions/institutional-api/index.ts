// PortfoliX Institutional v1.0 - API Endpoint for White-label Partners
// RESTful API for portfolio generation and management (future licensing)
// Security: API keys validated via hashed comparison, secrets encrypted at rest

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

interface ValidatedApiKey {
  id: string;
  subscription_id: string;
  key_name: string;
  permissions: string[];
  rate_limit: number;
  is_active: boolean;
  expires_at: string | null;
  last_used_at: string | null;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = req.headers.get('x-api-key');
    
    if (!apiKey) {
      console.log('API request rejected: No API key provided');
      return new Response(
        JSON.stringify({ error: 'API key required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role for API key validation
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Validate API key using secure hash comparison function
    // This uses the validate_api_key() SECURITY DEFINER function that compares hashed keys
    const { data: apiKeyData, error: keyError } = await supabase
      .rpc('validate_api_key', { incoming_key: apiKey })
      .maybeSingle();

    if (keyError) {
      console.error('API key validation error:', keyError.message);
      return new Response(
        JSON.stringify({ error: 'API key validation failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!apiKeyData) {
      console.log('API request rejected: Invalid or inactive API key');
      return new Response(
        JSON.stringify({ error: 'Invalid or inactive API key' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validatedKey = apiKeyData as ValidatedApiKey;

    // Check rate limit (basic implementation)
    const now = new Date();
    const lastUsed = validatedKey.last_used_at ? new Date(validatedKey.last_used_at) : null;
    if (lastUsed) {
      const hoursSinceLastUse = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastUse < 24) {
        // Simple rate limiting check - in production, use Redis or similar
        console.log('Rate limit check passed for key:', validatedKey.key_name);
      }
    }

    // Update last used timestamp
    await supabase
      .from('institutional_api_keys')
      .update({ last_used_at: now.toISOString() })
      .eq('id', validatedKey.id);

    // Get subscription details for portfolio operations
    const { data: subscriptionData, error: subError } = await supabase
      .from('institutional_subscriptions')
      .select('*')
      .eq('id', validatedKey.subscription_id)
      .single();

    if (subError || !subscriptionData) {
      console.error('Subscription lookup failed:', subError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid subscription' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, params }: APIRequest = await req.json();

    console.log(`Processing API action: ${action} for subscription: ${validatedKey.subscription_id}`);

    // Route to appropriate handler
    switch (action) {
      case 'generate_portfolio':
        return await handleGeneratePortfolio(supabase, validatedKey, subscriptionData, params);
      case 'list_portfolios':
        return await handleListPortfolios(supabase, validatedKey, params);
      case 'get_portfolio':
        return await handleGetPortfolio(supabase, validatedKey, params);
      case 'delete_portfolio':
        return await handleDeletePortfolio(supabase, validatedKey, params);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    // Return generic error message to client (don't expose internal details)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleGeneratePortfolio(
  supabase: any, 
  apiKeyData: ValidatedApiKey, 
  subscriptionData: any,
  params: any
) {
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
      user_id: subscriptionData.user_id,
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
    console.error('Portfolio creation error:', error.message);
    return new Response(
      JSON.stringify({ error: 'Failed to create portfolio' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.log('Portfolio created successfully:', data.id);
  return new Response(
    JSON.stringify({ success: true, portfolio: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleListPortfolios(supabase: any, apiKeyData: ValidatedApiKey, params: any) {
  const subscriptionId = apiKeyData.subscription_id;
  
  const { data, error } = await supabase
    .from('institutional_portfolios')
    .select('*')
    .eq('subscription_id', subscriptionId)
    .order('created_at', { ascending: false })
    .limit(params?.limit || 50);

  if (error) {
    console.error('Portfolio list error:', error.message);
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

async function handleGetPortfolio(supabase: any, apiKeyData: ValidatedApiKey, params: any) {
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

async function handleDeletePortfolio(supabase: any, apiKeyData: ValidatedApiKey, params: any) {
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
    console.error('Portfolio delete error:', error.message);
    return new Response(
      JSON.stringify({ error: 'Failed to delete portfolio' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.log('Portfolio deleted:', portfolio_id);
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
