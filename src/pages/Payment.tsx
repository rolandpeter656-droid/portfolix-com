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
    price: { NGN: 12000, USD: 25 },
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
    toast({
      title: "Payment Successful!",
      description: "Welcome to Pro Plan! Your subscription is now active.",
    });
    setIsProcessing(false);
    // In a real app, you'd verify the payment on your backend
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
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/pricing")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pricing
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold">Complete Your Purchase</h1>
            <p className="text-muted-foreground mt-2">
              Upgrade to Pro Plan and unlock advanced portfolio management
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
          
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
                <h3 className="font-semibold">Supported Payment Methods</h3>
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