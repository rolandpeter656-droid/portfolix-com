import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Globe, Shield, Smartphone, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface PaystackPaymentProps {
  plan: PricingPlan;
  currency: "USD";
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaystackPayment = ({ plan, currency, onSuccess, onCancel }: PaystackPaymentProps) => {
  const [customerData, setCustomerData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    couponCode: "",
    teamSize: 1
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [discount, setDiscount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Environment variable validation
  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  
  if (!paystackPublicKey) {
    console.error('VITE_PAYSTACK_PUBLIC_KEY environment variable is not configured');
  }

  // Get price
  const basePrice = plan.price;
  const discountAmount = (basePrice * discount) / 100;
  const finalPrice = basePrice - discountAmount;

  // Paystack configuration
  const config = {
    reference: `portfolix_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    email: customerData.email,
    amount: finalPrice * 100, // Paystack expects amount in kobo/cents
    currency,
    publicKey: paystackPublicKey || "",
    metadata: {
      custom_fields: [
        {
          display_name: "Plan",
          variable_name: "plan",
          value: plan.id
        },
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: `${customerData.firstName} ${customerData.lastName}`
        },
        {
          display_name: "Team Size",
          variable_name: "team_size",
          value: customerData.teamSize.toString()
        }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const handleCouponApply = () => {
    // Mock coupon validation - In real app, this would be an API call
    const validCoupons: Record<string, number> = {
      "EARLY20": 20,
      "STUDENT15": 15,
      "WELCOME10": 10
    };

    const couponDiscount = validCoupons[customerData.couponCode.toUpperCase()];
    if (couponDiscount) {
      setDiscount(couponDiscount);
      toast({
        title: "Coupon Applied!",
        description: `${couponDiscount}% discount applied to your order.`,
      });
    } else {
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is not valid.",
        variant: "destructive"
      });
    }
  };

  const handlePayment = () => {
    if (!customerData.email || !customerData.firstName || !customerData.lastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!paystackPublicKey) {
      toast({
        title: "Payment Configuration Error",
        description: "Payment system is currently unavailable. Please try again later.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    initializePayment({
      onSuccess: async (reference) => {
        console.log("Payment successful:", reference);
        setIsProcessing(false);
        setIsVerifying(true);
        
        toast({
          title: "Payment Received!",
          description: "Verifying your payment and activating subscription...",
        });

        // Poll for subscription status update (webhook processes async)
        let attempts = 0;
        const maxAttempts = 10;
        const pollInterval = 2000; // 2 seconds

        const checkSubscriptionStatus = async () => {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              throw new Error("User not authenticated");
            }

            // Check for active subscription based on plan type
            const { data: subscription, error } = await supabase
              .from('users')
              .select('subscription_plan')
              .eq('user_id', user.id)
              .maybeSingle();

            if (error) {
              console.error("Error checking subscription:", error);
            }

            if (subscription?.subscription_plan === 'pro' || subscription?.subscription_plan === plan.id) {
              setIsVerifying(false);
              toast({
                title: "Subscription Activated!",
                description: `Welcome to ${plan.name}! Redirecting to your dashboard...`,
              });
              onSuccess();
              navigate('/dashboard');
              return true;
            }

            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(checkSubscriptionStatus, pollInterval);
            } else {
              // Max attempts reached, assume success since payment went through
              setIsVerifying(false);
              toast({
                title: "Payment Successful!",
                description: `Your ${plan.name} subscription is being processed. You'll have full access shortly.`,
              });
              onSuccess();
              navigate('/dashboard');
            }
          } catch (error) {
            console.error("Error verifying subscription:", error);
            setIsVerifying(false);
            toast({
              title: "Payment Successful!",
              description: "Your subscription is being activated. Please refresh if you don't see updates.",
            });
            onSuccess();
          }
        };

        // Start polling after a brief delay to allow webhook processing
        setTimeout(checkSubscriptionStatus, 1500);
      },
      onClose: () => {
        console.log("Payment closed");
        setIsProcessing(false);
        toast({
          title: "Payment Cancelled",
          description: "Your payment was cancelled. No charges were made.",
        });
      },
    });
  };

  const formatPrice = (price: number) => {
    return `$${price}`;
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Button
        variant="ghost"
        onClick={onCancel}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Plans
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
              <span>Subscription (USD)</span>
              <span className="font-semibold">{formatPrice(basePrice)}/month</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between items-center text-green-600">
                <span>Discount ({discount}%)</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between items-center font-bold">
              <span>Total</span>
              <span>{formatPrice(finalPrice)}/month</span>
            </div>
          </div>

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
                placeholder="+234 800 000 0000"
              />
            </div>

            {plan.id === "institutional" && (
              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Input
                  id="teamSize"
                  type="number"
                  min="1"
                  value={customerData.teamSize}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, teamSize: parseInt(e.target.value) || 1 }))}
                />
              </div>
            )}
          </div>

          {/* Coupon Code */}
          <div>
            <Label htmlFor="couponCode">Coupon Code (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="couponCode"
                value={customerData.couponCode}
                onChange={(e) => setCustomerData(prev => ({ ...prev, couponCode: e.target.value }))}
                placeholder="Enter coupon code"
              />
              <Button variant="outline" onClick={handleCouponApply} type="button">
                Apply
              </Button>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <Label>Payment Methods</Label>
            
            {/* Primary Payment Method - Paystack */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Paystack Payment</h4>
                <Badge variant="default">Recommended</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>Visa/Mastercard</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>International Cards</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Bank Transfer</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>Mobile Money</span>
                </div>
              </div>
            </div>

            {/* Additional Payment Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-background">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span className="font-medium">Credit/Debit Cards</span>
                </div>
                <p className="text-xs text-muted-foreground">Direct card processing</p>
                <p className="text-xs text-muted-foreground mt-1">Visa, Mastercard, Amex</p>
              </div>
              
              <div className="border rounded-lg p-4 bg-background">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <span className="font-medium">Apple Pay</span>
                </div>
                <p className="text-xs text-muted-foreground">Quick and secure payments</p>
                <p className="text-xs text-muted-foreground mt-1">iOS and Safari only</p>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>• All payment methods are secured with industry-standard encryption</p>
              <p>• International cards accepted worldwide</p>
              <p>• Additional payment options available at checkout</p>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={isProcessing || isVerifying || !customerData.email || !customerData.firstName || !customerData.lastName}
            className="w-full"
            size="lg"
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Activating Subscription...
              </>
            ) : isProcessing ? (
              "Processing..."
            ) : (
              `Pay ${formatPrice(finalPrice)}`
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Secure payment processing by Paystack. Your payment information is encrypted and secure.
            You can cancel your subscription at any time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};