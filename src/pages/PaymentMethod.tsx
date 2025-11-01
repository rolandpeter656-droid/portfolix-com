import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Shield, Smartphone, Globe, Building, Check } from "lucide-react";

const PaymentMethod = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const plan = searchParams.get("plan") || "pro";
  const currency = (searchParams.get("currency") || "USD") as "NGN" | "USD";
  const type = searchParams.get("type") || "retail";
  
  // Plan details for both retail and institutional
  const allPlanDetails: Record<string, { name: string; price: { NGN: number; USD: number }; description: string }> = {
    // Retail plans
    pro: {
      name: "Pro Plan",
      price: { NGN: 12000, USD: 25 },
      description: "Advanced features for serious investors"
    },
    // Institutional plans
    "corporate-starter": {
      name: "Corporate Starter",
      price: { NGN: 240000, USD: 499 },
      description: "Essential institutional portfolio frameworks for growing businesses"
    },
    "corporate-growth": {
      name: "Corporate Growth",
      price: { NGN: 720000, USD: 1499 },
      description: "Advanced institutional frameworks with risk management tools"
    },
    "corporate-enterprise": {
      name: "Corporate Enterprise",
      price: { NGN: 1440000, USD: 2999 },
      description: "Complete institutional portfolio suite with white-label capabilities"
    }
  };

  const planDetails = allPlanDetails[plan] || allPlanDetails.pro;
  const isInstitutional = type === "institutional";

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
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(isInstitutional ? "/institutions" : "/pricing")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {isInstitutional ? "Institutions" : "Pricing"}
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold">Complete Your Purchase</h1>
            <p className="text-muted-foreground mt-2">
              Secure payment processing for {planDetails.name}
              {isInstitutional && " • 7-day free trial included"}
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