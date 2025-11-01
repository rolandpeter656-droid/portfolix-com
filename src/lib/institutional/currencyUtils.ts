// PortfoliX Institutional v1.0 - Currency Utilities
// Global currency support for B2B expansion

import { CurrencyType, SUPPORTED_CURRENCIES } from "./types";

export class CurrencyUtils {
  /**
   * Convert amount from one currency to another
   */
  static convert(
    amount: number,
    fromCurrency: CurrencyType,
    toCurrency: CurrencyType
  ): number {
    if (fromCurrency === toCurrency) return amount;

    // Convert to USD first
    const fromRate = SUPPORTED_CURRENCIES[fromCurrency].exchangeRateToUSD || 1;
    const amountInUSD = amount * fromRate;

    // Convert from USD to target currency
    const toRate = SUPPORTED_CURRENCIES[toCurrency].exchangeRateToUSD || 1;
    return amountInUSD / toRate;
  }

  /**
   * Format amount with currency symbol
   */
  static format(amount: number, currency: CurrencyType): string {
    const { symbol } = SUPPORTED_CURRENCIES[currency];
    return `${symbol}${amount.toLocaleString()}`;
  }

  /**
   * Get currency config
   */
  static getCurrencyConfig(currency: CurrencyType) {
    return SUPPORTED_CURRENCIES[currency];
  }

  /**
   * Detect user's currency based on location (placeholder for future implementation)
   */
  static detectUserCurrency(): CurrencyType {
    // For now, default to USD
    // In future: implement IP-based geolocation or browser locale detection
    return 'USD';
  }

  /**
   * Get all supported currencies
   */
  static getAllCurrencies() {
    return Object.values(SUPPORTED_CURRENCIES);
  }
}
