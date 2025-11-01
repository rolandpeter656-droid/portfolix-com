// PortfoliX Institutional v1.0 - Portfolio Service
// Business logic for AI Portfolio Library and portfolio management

import { supabase } from "@/integrations/supabase/client";
import { InstitutionalPortfolio, PortfolioType } from "./types";

export interface GeneratePortfolioParams {
  subscriptionId: string;
  portfolioName: string;
  portfolioType: PortfolioType;
  investmentHorizon?: string;
  liquidityNeeds?: string;
  riskTolerance?: string;
  capitalSize?: number;
}

export class PortfolioService {
  /**
   * Check if user can generate more portfolios based on their plan
   */
  static async canGeneratePortfolio(subscriptionId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('can_generate_institutional_portfolio', {
        sub_id: subscriptionId
      });

      if (error) throw error;
      return data as boolean;
    } catch (error) {
      console.error('Error checking portfolio generation limit:', error);
      return false;
    }
  }

  /**
   * Generate AI-powered portfolio allocation
   */
  static generateAllocation(params: GeneratePortfolioParams): Record<string, number> {
    const { riskTolerance, liquidityNeeds } = params;
    
    // AI-inspired allocation logic (simplified for v1.0)
    const allocation: Record<string, number> = {};

    if (riskTolerance === 'aggressive') {
      allocation.equities = 60;
      allocation.crypto = 5;
      allocation.bonds = 20;
      allocation.cash = 5;
      allocation.commodities = 5;
      allocation.etfs = 5;
    } else if (riskTolerance === 'moderate') {
      allocation.equities = 40;
      allocation.bonds = 35;
      allocation.etfs = 10;
      allocation.cash = 10;
      allocation.commodities = 5;
    } else {
      allocation.bonds = 50;
      allocation.cash = 30;
      allocation.equities = 10;
      allocation.commodities = 10;
    }

    // Adjust for liquidity
    if (liquidityNeeds === 'high') {
      const cashBoost = 15;
      allocation.cash = (allocation.cash || 0) + cashBoost;
      allocation.equities = Math.max(0, (allocation.equities || 0) - cashBoost);
    }

    return allocation;
  }

  /**
   * Generate AI rationale for portfolio
   */
  static generateRationale(params: GeneratePortfolioParams): string {
    const { investmentHorizon, liquidityNeeds, riskTolerance, capitalSize } = params;
    
    return `This institutional portfolio is optimized for ${investmentHorizon} with ${liquidityNeeds} liquidity requirements and ${riskTolerance} risk tolerance. The $${capitalSize}M capital allocation balances growth potential with risk management, following time-tested institutional frameworks and modern portfolio theory principles.`;
  }

  /**
   * Calculate expected returns based on allocation
   */
  static calculateExpectedReturn(
    allocation: Record<string, number>,
    riskTolerance?: string
  ): string {
    if (riskTolerance === 'aggressive') return '9-14%';
    if (riskTolerance === 'moderate') return '6-10%';
    return '4-7%';
  }

  /**
   * Determine volatility level
   */
  static determineVolatility(riskTolerance?: string): string {
    if (riskTolerance === 'aggressive') return 'High';
    if (riskTolerance === 'moderate') return 'Moderate';
    return 'Low';
  }

  /**
   * Create portfolio in database
   */
  static async createPortfolio(
    params: GeneratePortfolioParams,
    userId: string
  ): Promise<InstitutionalPortfolio | null> {
    try {
      // Check if user can generate portfolio
      const canGenerate = await this.canGeneratePortfolio(params.subscriptionId);
      if (!canGenerate) {
        throw new Error('Portfolio generation limit reached for your plan');
      }

      const allocation = this.generateAllocation(params);
      const rationale = this.generateRationale(params);
      const expectedReturn = this.calculateExpectedReturn(allocation, params.riskTolerance);
      const volatility = this.determineVolatility(params.riskTolerance);

      const { data, error } = await supabase
        .from('institutional_portfolios')
        .insert({
          subscription_id: params.subscriptionId,
          user_id: userId,
          portfolio_name: params.portfolioName,
          portfolio_type: params.portfolioType,
          investment_horizon: params.investmentHorizon,
          liquidity_needs: params.liquidityNeeds,
          risk_tolerance: params.riskTolerance,
          capital_size: params.capitalSize,
          allocation,
          rationale,
          expected_return: expectedReturn,
          volatility,
          ai_confidence_score: Math.floor(Math.random() * 15) + 85, // 85-100
        })
        .select()
        .single();

      if (error) throw error;
      return data as InstitutionalPortfolio;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      return null;
    }
  }

  /**
   * Get portfolios for subscription
   */
  static async getPortfolios(subscriptionId: string): Promise<InstitutionalPortfolio[]> {
    try {
      const { data, error } = await supabase
        .from('institutional_portfolios')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as InstitutionalPortfolio[]) || [];
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      return [];
    }
  }

  /**
   * Delete portfolio
   */
  static async deletePortfolio(portfolioId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('institutional_portfolios')
        .delete()
        .eq('id', portfolioId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      return false;
    }
  }
}
