import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Shield, Smartphone, Globe, Building2, Check } from "lucide-react";

const PaymentMethod = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const plan = searchParams.get("plan") || "pro";
  const currency = (searchParams.get("currency") || "USD") as "NGN" | "USD";
  
  const planDetails: Record<string, { name: string; price: { NGN: number; USD: number }; description: string }> = {
    pro: {
      name: "Pro Plan",
      price: { NGN: 12000, USD: 25 },
      description: "Advanced features for serious investors"
    },
  };

  const currentPlan = planDetails[plan] || planDetails.pro;

  const formatPrice = (price: number, curr: "NGN" | "USD") => {
    const symbol = curr === "NGN" ? "₦" : "$";
    return `${symbol}${price.toLocaleString()}`;
  };

  const handlePaystackPayment = () => {
    // Redirect to existing Paystack payment link
    window.open("https://paystack.shop/pay/mkxrul537n", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/pricing")}
            className="mb-3 sm:mb-4 text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Pricing</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <div className="text-center px-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Complete Your Purchase</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              Secure payment processing for {currentPlan.name}
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
                  <h3 className="font-semibold">{currentPlan.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentPlan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {formatPrice(currentPlan.price[currency], currency)}
                  </div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paystack Payment Section */}
          <div className="max-w-2xl mx-auto">
            <Card className="transition-all duration-200 hover:shadow-lg border-2 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    Paystack
                  </div>
                  <Badge variant="default">Secure Payment</Badge>
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
                      <Building2 className="h-3 w-3" />
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
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>Apple Pay & Google Pay</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handlePaystackPayment}
                >
                  Pay with Paystack
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
                  Paystack uses industry-standard encryption and is PCI DSS compliant.
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