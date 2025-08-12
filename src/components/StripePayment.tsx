import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Shield, Smartphone, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

interface StripePaymentFormProps {
  plan: {
    id: string;
    name: string;
    price: { NGN: number; USD: number };
    description: string;
  };
  currency: "NGN" | "USD";
  onSuccess: () => void;
  onCancel: () => void;
}

const StripePaymentForm = ({ plan, currency, onSuccess, onCancel }: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const [customerData, setCustomerData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple_pay">("card");

  const basePrice = plan.price[currency];

  const formatPrice = (price: number) => {
    const symbol = currency === "NGN" ? "₦" : "$";
    return `${symbol}${price.toLocaleString()}`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!customerData.email || !customerData.firstName || !customerData.lastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment method
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error: methodError, paymentMethod: pm } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `${customerData.firstName} ${customerData.lastName}`,
          email: customerData.email,
          phone: customerData.phone,
        },
      });

      if (methodError) {
        throw new Error(methodError.message);
      }

      // In a real implementation, you would:
      // 1. Create a subscription on your backend
      // 2. Confirm the payment
      // For now, we'll simulate success
      
      setTimeout(() => {
        toast({
          title: "Payment Successful!",
          description: `Welcome to ${plan.name}! Your subscription is now active.`,
        });
        setIsProcessing(false);
        onSuccess();
      }, 2000);

    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const handleApplePay = async () => {
    if (!stripe) return;

    setIsProcessing(true);

    try {
      // Check if Apple Pay is available
      const paymentRequest = stripe.paymentRequest({
        country: 'US',
        currency: currency.toLowerCase(),
        total: {
          label: `${plan.name} Subscription`,
          amount: basePrice * 100, // Convert to cents
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      const canMakePayment = await paymentRequest.canMakePayment();
      
      if (canMakePayment) {
        paymentRequest.show();
        
        paymentRequest.on('paymentmethod', async (ev) => {
          // In a real implementation, confirm the payment on your backend
          setTimeout(() => {
            ev.complete('success');
            toast({
              title: "Payment Successful!",
              description: `Welcome to ${plan.name}! Your subscription is now active.`,
            });
            setIsProcessing(false);
            onSuccess();
          }, 2000);
        });
      } else {
        throw new Error("Apple Pay is not available on this device");
      }
    } catch (error) {
      console.error('Apple Pay failed:', error);
      toast({
        title: "Apple Pay Failed",
        description: error instanceof Error ? error.message : "Apple Pay is not available.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Button
        variant="ghost"
        onClick={onCancel}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Payment Methods
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Complete Your Subscription
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Plan Summary */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{plan.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
            <div className="flex justify-between items-center">
              <span>Subscription ({currency})</span>
              <span className="font-semibold">{formatPrice(basePrice)}/month</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center font-bold">
              <span>Total</span>
              <span>{formatPrice(basePrice)}/month</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={paymentMethod === "card" ? "default" : "outline"}
                onClick={() => setPaymentMethod("card")}
                className="justify-start"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Card
              </Button>
              <Button
                variant={paymentMethod === "apple_pay" ? "default" : "outline"}
                onClick={() => setPaymentMethod("apple_pay")}
                className="justify-start"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Apple Pay
              </Button>
            </div>
          </div>

          {paymentMethod === "card" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={customerData.firstName}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={customerData.lastName}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Card Element */}
              <div>
                <Label htmlFor="card-element">Card Information</Label>
                <div className="border rounded-md p-3 mt-1">
                  <CardElement
                    id="card-element"
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isProcessing || !stripe}
                className="w-full"
                size="lg"
              >
                {isProcessing ? "Processing..." : `Pay ${formatPrice(basePrice)}`}
              </Button>
            </form>
          )}

          {paymentMethod === "apple_pay" && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold">Pay with Apple Pay</h3>
                <p className="text-sm text-muted-foreground">
                  Use Touch ID, Face ID, or your passcode to complete your purchase securely.
                </p>
                
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>Secure biometric authentication</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>No card details required</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>Instant payment processing</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleApplePay}
                disabled={isProcessing}
                className="w-full bg-black hover:bg-gray-800 text-white"
                size="lg"
              >
                {isProcessing ? "Processing..." : (
                  <div className="flex items-center justify-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Pay {formatPrice(basePrice)}
                  </div>
                )}
              </Button>
            </div>
          )}

          <div className="space-y-4">
            <div className="border rounded-lg p-3 bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Stripe Secure Processing</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>PCI DSS Compliant</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>256-bit SSL Encryption</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>Fraud Protection</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>Global Coverage</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Secure payment processing by Stripe. Your payment information is encrypted and secure.
            You can cancel your subscription at any time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

interface StripePaymentProps {
  plan: {
    id: string;
    name: string;
    price: { NGN: number; USD: number };
    description: string;
  };
  currency: "NGN" | "USD";
  onSuccess: () => void;
  onCancel: () => void;
}

export const StripePayment = (props: StripePaymentProps) => {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm {...props} />
    </Elements>
  );
};