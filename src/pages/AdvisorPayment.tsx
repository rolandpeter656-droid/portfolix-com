import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePaystackPayment } from "react-paystack";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CreditCard, 
  Globe, 
  Shield, 
  CheckCircle,
  Building2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/landing/Navigation";

interface OnboardingData {
  fullName: string;
  email: string;
  phone: string;
  firmName: string;
  firmLocation: string;
  numberOfClients: string;
  investmentFocus: string[];
  lookingFor: string;
}

const AdvisorPayment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const basePrice = 49;
  const discountAmount = (basePrice * discount) / 100;
  const finalPrice = basePrice - discountAmount;

  // Environment variable for Paystack
  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  useEffect(() => {
    // Get onboarding data from session storage
    const storedData = sessionStorage.getItem('advisorOnboardingData');
    if (storedData) {
      setOnboardingData(JSON.parse(storedData));
    }

    // If user is not logged in, redirect to signup
    if (!user) {
      sessionStorage.setItem('postAuthDestination', '/advisors/payment');
      navigate('/signup');
    }
  }, [user, navigate]);

  // Paystack configuration
  const config = {
    reference: `advisor_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    email: user?.email || onboardingData?.email || "",
    amount: finalPrice * 100, // Paystack expects amount in kobo/cents
    currency: "USD" as const,
    publicKey: paystackPublicKey || "",
    metadata: {
      custom_fields: [
        {
          display_name: "Plan",
          variable_name: "plan",
          value: "advisor-partnership"
        },
        {
          display_name: "Firm Name",
          variable_name: "firm_name",
          value: onboardingData?.firmName || ""
        }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const handleCouponApply = () => {
    const validCoupons: Record<string, number> = {
      "ADVISOR20": 20,
      "WELCOME10": 10,
      "PARTNER15": 15
    };

    const couponDiscount = validCoupons[couponCode.toUpperCase()];
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

  const handlePaymentSuccess = async (reference: any) => {
    if (!user || !onboardingData) return;

    try {
      // Create advisor subscription in database
      const { error } = await supabase
        .from('advisor_subscriptions')
        .insert({
          user_id: user.id,
          firm_name: onboardingData.firmName,
          firm_location: onboardingData.firmLocation || null,
          number_of_clients: onboardingData.numberOfClients || null,
          investment_focus: onboardingData.investmentFocus,
          looking_for: onboardingData.lookingFor || null,
          subscription_status: 'active',
          monthly_price: finalPrice * 100,
          payment_reference: reference.reference,
          subscription_starts_at: new Date().toISOString(),
          subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        });

      if (error) throw error;

      // Clear session storage
      sessionStorage.removeItem('advisorOnboardingData');

      toast({
        title: "Welcome to PortfoliX Advisors!",
        description: "Your subscription is now active. Redirecting to your dashboard...",
      });

      setTimeout(() => {
        navigate('/advisors/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Error",
        description: "Payment successful but there was an issue activating your account. Please contact support.",
        variant: "destructive"
      });
    }
  };

  const handlePayment = () => {
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
      onSuccess: (reference) => {
        handlePaymentSuccess(reference);
        setIsProcessing(false);
      },
      onClose: () => {
        setIsProcessing(false);
        toast({
          title: "Payment Cancelled",
          description: "Your payment was cancelled. No charges were made.",
        });
      },
    });
  };

  const handleStartTrial = async () => {
    if (!user || !onboardingData) {
      toast({
        title: "Error",
        description: "Please complete the onboarding form first.",
        variant: "destructive"
      });
      navigate('/advisors/onboarding');
      return;
    }

    setIsProcessing(true);

    try {
      // Create trial subscription
      const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days trial

      const { error } = await supabase
        .from('advisor_subscriptions')
        .insert({
          user_id: user.id,
          firm_name: onboardingData.firmName,
          firm_location: onboardingData.firmLocation || null,
          number_of_clients: onboardingData.numberOfClients || null,
          investment_focus: onboardingData.investmentFocus,
          looking_for: onboardingData.lookingFor || null,
          subscription_status: 'pending', // Trial status
          monthly_price: 4900,
          trial_ends_at: trialEndsAt.toISOString(),
          subscription_starts_at: new Date().toISOString()
        });

      if (error) throw error;

      // Clear session storage
      sessionStorage.removeItem('advisorOnboardingData');

      toast({
        title: "Trial Started!",
        description: "Your 7-day free trial is now active. Enjoy full access to all features.",
      });

      navigate('/advisors/dashboard');
    } catch (error: any) {
      console.error('Error starting trial:', error);
      if (error.code === '23505') {
        toast({
          title: "Already Registered",
          description: "You already have an advisor account. Redirecting to dashboard...",
        });
        navigate('/advisors/dashboard');
      } else {
        toast({
          title: "Error",
          description: "Failed to start trial. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!onboardingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="mb-4">Please complete the onboarding form first.</p>
            <Button onClick={() => navigate('/advisors/onboarding')}>
              Go to Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-20 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/advisors/onboarding')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Onboarding
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Complete Your Membership</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {onboardingData.firmName}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Plan Summary */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Advisor Partnership</h3>
                <Badge variant="secondary">Monthly</Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Unlimited model portfolios</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Client-ready PDF exports</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Quarterly updates</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <span>Monthly Subscription</span>
                <span className="font-semibold">${basePrice}/month</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Discount ({discount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>${finalPrice}/month</span>
              </div>
            </div>

            {/* Coupon Code */}
            <div>
              <Label htmlFor="couponCode">Coupon Code (Optional)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="couponCode"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
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
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleStartTrial}
                variant="outline"
                className="w-full"
                size="lg"
                disabled={isProcessing}
              >
                Start 7-Day Free Trial
              </Button>
              
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-primary-glow"
                size="lg"
              >
                {isProcessing ? "Processing..." : `Subscribe Now - $${finalPrice}/month`}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Secure payment processing by Paystack. Your payment information is encrypted and secure.
              You can cancel your subscription at any time.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvisorPayment;
