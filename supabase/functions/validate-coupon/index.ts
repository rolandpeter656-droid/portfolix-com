import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Hardcoded valid coupons for now (can be migrated to database table later)
const VALID_COUPONS: Record<string, { discount: number; active: boolean; expiresAt?: Date }> = {
  "EARLY20": { discount: 20, active: true },
  "STUDENT15": { discount: 15, active: true },
  "WELCOME10": { discount: 10, active: true },
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, planId, originalPrice } = await req.json();

    // Validate input
    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid coupon code format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (code.length > 50) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Coupon code is too long' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const normalizedCode = code.toUpperCase().trim();
    const coupon = VALID_COUPONS[normalizedCode];

    if (!coupon) {
      console.log(`Invalid coupon attempted: ${normalizedCode}`);
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid coupon code' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (!coupon.active) {
      return new Response(
        JSON.stringify({ valid: false, error: 'This coupon is no longer active' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return new Response(
        JSON.stringify({ valid: false, error: 'This coupon has expired' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Calculate discounted price if originalPrice is provided
    let discountedPrice = undefined;
    if (typeof originalPrice === 'number' && originalPrice > 0) {
      discountedPrice = originalPrice - (originalPrice * coupon.discount / 100);
    }

    console.log(`Coupon validated: ${normalizedCode} - ${coupon.discount}% discount`);

    return new Response(
      JSON.stringify({ 
        valid: true, 
        discount: coupon.discount,
        discountedPrice,
        code: normalizedCode
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error validating coupon:', error);
    return new Response(
      JSON.stringify({ valid: false, error: 'Unable to validate coupon' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
