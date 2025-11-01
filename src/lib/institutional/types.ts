// PortfoliX Institutional v1.0 - Type Definitions
// Core types for AI Portfolio Library, White-label APIs, and Research Terminal

export type InstitutionalPlanTier = 'corporate-starter' | 'corporate-growth' | 'corporate-enterprise';
export type SubscriptionStatus = 'active' | 'trial' | 'cancelled' | 'expired';
export type CurrencyType = 'USD' | 'NGN' | 'EUR' | 'GBP';
export type PartnerTier = 'standard' | 'premium' | 'enterprise';
export type PortfolioType = 'preset' | 'custom';

export interface CurrencyConfig {
  code: CurrencyType;
  symbol: string;
  name: string;
  exchangeRateToUSD?: number;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyType, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', exchangeRateToUSD: 0.0013 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', exchangeRateToUSD: 1.10 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRateToUSD: 1.27 },
};

export interface InstitutionalSubscription {
  id: string;
  user_id: string;
  organization_name: string;
  plan_tier: InstitutionalPlanTier;
  subscription_status: SubscriptionStatus;
  currency: CurrencyType;
  monthly_price: number;
  trial_ends_at?: string;
  subscription_starts_at: string;
  subscription_ends_at?: string;
  payment_reference?: string;
  created_at: string;
  updated_at: string;
}

export interface InstitutionalPortfolio {
  id: string;
  subscription_id: string;
  user_id: string;
  portfolio_name: string;
  portfolio_type: PortfolioType;
  investment_horizon?: string;
  liquidity_needs?: string;
  risk_tolerance?: string;
  capital_size?: number;
  allocation: Record<string, number>;
  rationale?: string;
  expected_return?: string;
  volatility?: string;
  ai_confidence_score?: number;
  inspired_by?: string;
  created_at: string;
  updated_at: string;
}

export interface WhiteLabelPartner {
  id: string;
  partner_name: string;
  partner_domain?: string;
  partner_tier: PartnerTier;
  api_enabled: boolean;
  branding_config?: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
    company_name?: string;
  };
  allowed_portfolios?: number;
  monthly_fee?: number;
  currency: CurrencyType;
  contact_email: string;
  contact_phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InstitutionalApiKey {
  id: string;
  partner_id?: string;
  subscription_id?: string;
  api_key: string;
  api_secret: string;
  key_name: string;
  permissions: string[];
  rate_limit: number;
  last_used_at?: string;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

export interface PortfolioPerformanceHistory {
  id: string;
  portfolio_id: string;
  recorded_at: string;
  portfolio_value?: number;
  return_percentage?: number;
  volatility_index?: number;
  metadata?: Record<string, any>;
}

export interface PlanLimits {
  maxPortfolios: number;
  apiAccess: boolean;
  whiteLabel: boolean;
  customAI: boolean;
  dedicatedSupport: boolean;
}

export const PLAN_LIMITS: Record<InstitutionalPlanTier, PlanLimits> = {
  'corporate-starter': {
    maxPortfolios: 3,
    apiAccess: false,
    whiteLabel: false,
    customAI: false,
    dedicatedSupport: false,
  },
  'corporate-growth': {
    maxPortfolios: 6,
    apiAccess: true,
    whiteLabel: false,
    customAI: false,
    dedicatedSupport: true,
  },
  'corporate-enterprise': {
    maxPortfolios: 999999,
    apiAccess: true,
    whiteLabel: true,
    customAI: true,
    dedicatedSupport: true,
  },
};

export const PLAN_PRICES: Record<InstitutionalPlanTier, Record<CurrencyType, number>> = {
  'corporate-starter': {
    USD: 499,
    NGN: 240000,
    EUR: 450,
    GBP: 390,
  },
  'corporate-growth': {
    USD: 1499,
    NGN: 720000,
    EUR: 1360,
    GBP: 1180,
  },
  'corporate-enterprise': {
    USD: 2999,
    NGN: 1440000,
    EUR: 2720,
    GBP: 2360,
  },
};
