// PortfoliX Institutional v1.0 - Subscription Service
// Business logic for subscription management and billing

import { supabase } from "@/integrations/supabase/client";
import { 
  InstitutionalSubscription, 
  InstitutionalPlanTier, 
  CurrencyType,
  PLAN_PRICES 
} from "./types";

export interface CreateSubscriptionParams {
  organizationName: string;
  planTier: InstitutionalPlanTier;
  currency: CurrencyType;
  paymentReference?: string;
}

export class SubscriptionService {
  /**
   * Create new institutional subscription with 7-day trial
   */
  static async createSubscription(
    params: CreateSubscriptionParams,
    userId: string
  ): Promise<InstitutionalSubscription | null> {
    try {
      const price = PLAN_PRICES[params.planTier][params.currency];
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 7);

      const { data, error } = await supabase
        .from('institutional_subscriptions')
        .insert({
          user_id: userId,
          organization_name: params.organizationName,
          plan_tier: params.planTier,
          subscription_status: 'trial',
          currency: params.currency,
          monthly_price: price,
          trial_ends_at: trialEndsAt.toISOString(),
          payment_reference: params.paymentReference,
        })
        .select()
        .single();

      if (error) throw error;
      return data as InstitutionalSubscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      return null;
    }
  }

  /**
   * Get active subscription for user
   */
  static async getActiveSubscription(userId: string): Promise<InstitutionalSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('institutional_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .in('subscription_status', ['active', 'trial'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as InstitutionalSubscription | null;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  }

  /**
   * Activate subscription after successful payment
   */
  static async activateSubscription(
    subscriptionId: string,
    paymentReference: string
  ): Promise<boolean> {
    try {
      const subscriptionEndsAt = new Date();
      subscriptionEndsAt.setMonth(subscriptionEndsAt.getMonth() + 1);

      const { error } = await supabase
        .from('institutional_subscriptions')
        .update({
          subscription_status: 'active',
          payment_reference: paymentReference,
          subscription_ends_at: subscriptionEndsAt.toISOString(),
        })
        .eq('id', subscriptionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error activating subscription:', error);
      return false;
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('institutional_subscriptions')
        .update({ subscription_status: 'cancelled' })
        .eq('id', subscriptionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }
  }

  /**
   * Format price with currency symbol
   */
  static formatPrice(amount: number, currency: CurrencyType): string {
    const symbols: Record<CurrencyType, string> = {
      USD: '$',
      NGN: '₦',
      EUR: '€',
      GBP: '£',
    };

    return `${symbols[currency]}${amount.toLocaleString()}`;
  }
}
