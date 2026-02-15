import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, CreditCard, Building, Shield } from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import { useToast } from "@/hooks/use-toast";
import { analytics } from "@/lib/analytics/index";
import { useWelcomeEmail } from "@/hooks/useWelcomeEmail";

interface PaymentConfig {
  reference: string;
  email: string;
  amount: number;
  currency: "NGN" | "USD";
  publicKey: string;
  text: string;
  onSuccess: (reference: any) => void;
  onClose: () => void;
  channels?: string[];
  metadata?: any;
}

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendProWelcomeEmail, sendEliteWelcomeEmail } = useWelcomeEmail();
  const plan = searchParams.get("plan") || "pro";
  const currency = (searchParams.get("currency") || "USD") as "NGN" | "USD";
  
  
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Plan details
  const planDetails = {
    name: "Pro Plan",
    price: { NGN: 12000, USD: 15 },
    description: "Advanced features for serious investors",
    features: [
      "Unlimited AI-generated portfolios",
      "Real-time portfolio improvement suggestions", 
      "AI-generated rebalancing alerts",
      "Portfolio risk scoring",
      "Exclusive webinars and strategy guides",
      "Priority access to new investing models"
    ]
  };

  const amount = planDetails.price[currency] * 100; // Paystack expects amount in kobo/cents
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder";

  const handlePaymentSuccess = (reference: any) => {
    analytics.upgradeCompleted("pro", planDetails.price[currency]);
    toast({
      title: "Payment Successful!",
      description: "Welcome to Pro Plan! Your subscription is now active.",
    });
    // Send plan welcome email
    if (plan === "elite") {
      sendEliteWelcomeEmail(customerData.firstName);
    } else {
      sendProWelcomeEmail(customerData.firstName);
    }
    setIsProcessing(false);
    setTimeout(() => {
      navigate("/", { state: { plan: "pro" } });
    }, 2000);
  };

  const handlePaymentClose = () => {
    setIsProcessing(false);
  };

  const config = {
    reference: `portfolix_${Date.now()}`,
    email: customerData.email,
    amount,
    currency,
    publicKey,
    channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
    metadata: {
      plan: plan,
      custom_fields: [
        {
          display_name: "Plan",
          variable_name: "plan",
          value: "Pro Plan"
        }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    if (!customerData.email || !customerData.firstName || !customerData.lastName) {
      toast({
        title: "Missing Information", 
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    // The hook should accept the callbacks as parameters to the returned function
    (initializePayment as any)(handlePaymentSuccess, handlePaymentClose);
  };

  const formatPrice = (price: number, curr: "NGN" | "USD") => {
    const symbol = curr === "NGN" ? "₦" : "$";
    return `${symbol}${price.toLocaleString()}`;
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/payment-method")}
            className="mb-3 sm:mb-4 text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Payment</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">Complete Your Purchase</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              Upgrade to Pro Plan with Paystack secure payment
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={customerData.firstName}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={customerData.lastName}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Payment Methods Available</h3>
                
                {/* Primary Paystack Methods */}
                <div className="border rounded-lg p-3 bg-muted/30">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Paystack Secure Checkout
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      Credit Card
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      Debit Card
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      Bank Transfer
                    </Badge>
                    <Badge variant="outline">USSD</Badge>
                    <Badge variant="outline">Mobile Money</Badge>
                  </div>
                </div>

                {/* Additional Payment Options */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded-lg p-3 text-center">
                    <CreditCard className="h-6 w-6 mx-auto mb-1 text-primary" />
                    <p className="text-xs font-medium">International Cards</p>
                    <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <div className="h-6 w-6 mx-auto mb-1 text-primary flex items-center justify-center">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </div>
                    <p className="text-xs font-medium">Apple Pay</p>
                    <p className="text-xs text-muted-foreground">Quick & Secure</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessing || !customerData.email || !customerData.firstName || !customerData.lastName}
                className="w-full h-12 text-base"
                size="lg"
              >
                {isProcessing ? "Processing..." : `Pay ${formatPrice(planDetails.price[currency], currency)}`}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                Secured by Paystack
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{planDetails.name}</span>
                  <Badge>Most Popular</Badge>
                </div>
                
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span>Total</span>
                  <span>{formatPrice(planDetails.price[currency], currency)}</span>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Billing Cycle: <strong>Recurring Monthly</strong></p>
                  <p>Currency: <strong>{currency}</strong></p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {planDetails.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="space-y-2 text-sm">
                  <h4 className="font-semibold">Subscription Terms:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Monthly recurring billing</li>
                    <li>• Cancel anytime with 3-day grace period</li>
                    <li>• Automatic downgrade to Free Plan after cancellation</li>
                    <li>• 24/7 customer support included</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;