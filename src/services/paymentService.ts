export interface PaymentProvider {
  name: string;
  processPayment: (data: PaymentData) => Promise<PaymentResult>;
  verifyPayment: (reference: string) => Promise<boolean>;
}

export interface PaymentData {
  amount: number;
  currency: "NGN" | "USD";
  email: string;
  plan: string;
  reference: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  reference: string;
  message: string;
  data?: any;
}

// Paystack implementation
export class PaystackProvider implements PaymentProvider {
  name = "paystack";
  
  async processPayment(data: PaymentData): Promise<PaymentResult> {
    try {
      // In production, this would be handled by Supabase Edge Functions
      // For now, we'll simulate the payment verification
      const response = await fetch('/api/payments/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: data.reference,
          amount: data.amount,
          currency: data.currency
        })
      });

      const result = await response.json();
      return {
        success: result.status === 'success',
        reference: data.reference,
        message: result.message || 'Payment processed successfully',
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        reference: data.reference,
        message: 'Payment processing failed'
      };
    }
  }

  async verifyPayment(reference: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/payments/paystack/verify/${reference}`);
      const result = await response.json();
      return result.status === 'success';
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }
}

// Stripe implementation (for future use)
export class StripeProvider implements PaymentProvider {
  name = "stripe";
  
  async processPayment(data: PaymentData): Promise<PaymentResult> {
    // Stripe implementation will be added later
    throw new Error("Stripe provider not implemented yet");
  }

  async verifyPayment(reference: string): Promise<boolean> {
    // Stripe verification will be added later
    throw new Error("Stripe provider not implemented yet");
  }
}

// Flutterwave implementation (for future use)
export class FlutterwaveProvider implements PaymentProvider {
  name = "flutterwave";
  
  async processPayment(data: PaymentData): Promise<PaymentResult> {
    // Flutterwave implementation will be added later
    throw new Error("Flutterwave provider not implemented yet");
  }

  async verifyPayment(reference: string): Promise<boolean> {
    // Flutterwave verification will be added later
    throw new Error("Flutterwave provider not implemented yet");
  }
}

// Payment service manager
export class PaymentService {
  private providers: Map<string, PaymentProvider> = new Map();
  private defaultProvider: string = "paystack";

  constructor() {
    this.registerProvider(new PaystackProvider());
    // Future providers will be registered here
    // this.registerProvider(new StripeProvider());
    // this.registerProvider(new FlutterwaveProvider());
  }

  registerProvider(provider: PaymentProvider) {
    this.providers.set(provider.name, provider);
  }

  setDefaultProvider(providerName: string) {
    if (this.providers.has(providerName)) {
      this.defaultProvider = providerName;
    } else {
      throw new Error(`Provider ${providerName} not found`);
    }
  }

  async processPayment(data: PaymentData, providerName?: string): Promise<PaymentResult> {
    const provider = this.providers.get(providerName || this.defaultProvider);
    if (!provider) {
      throw new Error(`Payment provider ${providerName || this.defaultProvider} not found`);
    }

    return provider.processPayment(data);
  }

  async verifyPayment(reference: string, providerName?: string): Promise<boolean> {
    const provider = this.providers.get(providerName || this.defaultProvider);
    if (!provider) {
      throw new Error(`Payment provider ${providerName || this.defaultProvider} not found`);
    }

    return provider.verifyPayment(reference);
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

// Export singleton instance
export const paymentService = new PaymentService();