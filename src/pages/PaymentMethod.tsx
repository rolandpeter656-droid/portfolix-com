import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Shield, Smartphone, Globe, Building, Check } from "lucide-react";

type PaymentMethod = "paystack" | "stripe";

const PaymentMethod = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  
  const plan = searchParams.get("plan") || "pro";
  const currency = (searchParams.get("currency") || "USD") as "NGN" | "USD";
  
  const planDetails = {
    name: "Pro Plan",
    price: { NGN: 12000, USD: 25 },
    description: "Advanced features for serious investors"
  };

  const formatPrice = (price: number, curr: "NGN" | "USD") => {
    const symbol = curr === "NGN" ? "₦" : "$";
    return `${symbol}${price.toLocaleString()}`;
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    if (method === "paystack") {
      // Redirect to existing Paystack payment link
      window.open("https://paystack.shop/pay/mkxrul537n", "_blank");
    } else if (method === "stripe") {
      // Navigate to Stripe payment page
      navigate(`/payment?plan=${plan}&currency=${currency}&method=stripe`);
    }
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
            <h1 className="text-3xl font-bold">Choose Payment Method</h1>
            <p className="text-muted-foreground mt-2">
              Select your preferred payment gateway for {planDetails.name}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Order Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{planDetails.name}</h3>
                  <p className="text-sm text-muted-foreground">{planDetails.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {formatPrice(planDetails.price[currency], currency)}
                  </div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Paystack Option */}
            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                selectedMethod === "paystack" ? "border-primary" : "border-border"
              }`}
              onClick={() => setSelectedMethod("paystack")}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    Paystack
                  </div>
                  <Badge variant="default">Recommended</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Africa's leading payment gateway with local and international support
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Supported Methods:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      <span>Visa/Mastercard</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      <span>International Cards</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      <span>Bank Transfer</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Smartphone className="h-3 w-3" />
                      <span>Mobile Money</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>Fast local payments</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>USSD & QR codes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>Multi-currency support</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => handleMethodSelect("paystack")}
                >
                  Pay with Paystack
                </Button>
              </CardContent>
            </Card>

            {/* Stripe Option */}
            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                selectedMethod === "stripe" ? "border-primary" : "border-border"
              }`}
              onClick={() => setSelectedMethod("stripe")}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-primary" />
                    Stripe
                  </div>
                  <Badge variant="outline">Global</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Global payment platform trusted by millions worldwide
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Supported Methods:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      <span>Credit Cards</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      <span>Debit Cards</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Smartphone className="h-3 w-3" />
                      <span>Apple Pay</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Smartphone className="h-3 w-3" />
                      <span>Google Pay</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>One-click payments</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>Advanced security</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>Instant processing</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleMethodSelect("stripe")}
                >
                  Pay with Stripe
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Security Information */}
          <Card className="mt-8 bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                  <Shield className="h-4 w-4 text-primary" />
                  Bank-level Security & Encryption
                </div>
                <p className="text-xs text-muted-foreground">
                  All payment methods use industry-standard encryption and are PCI DSS compliant.
                  Your payment information is never stored on our servers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;