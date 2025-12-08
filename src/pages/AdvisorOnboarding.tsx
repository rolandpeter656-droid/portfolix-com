import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";
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

const AdvisorOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<OnboardingData>({
    fullName: "",
    email: user?.email || "",
    phone: "",
    firmName: "",
    firmLocation: "",
    numberOfClients: "",
    investmentFocus: [],
    lookingFor: ""
  });

  const investmentOptions = [
    { id: "growth", label: "Growth" },
    { id: "income", label: "Income" },
    { id: "balanced", label: "Balanced" },
    { id: "retirement", label: "Retirement" },
    { id: "crypto", label: "Crypto" },
  ];

  const handleFocusChange = (focus: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        investmentFocus: [...prev.investmentFocus, focus]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        investmentFocus: prev.investmentFocus.filter(f => f !== focus)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.firmName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // If user is not logged in, redirect to signup with return URL
    if (!user) {
      sessionStorage.setItem('advisorOnboardingData', JSON.stringify(formData));
      sessionStorage.setItem('postAuthDestination', '/advisors/onboarding');
      navigate('/signup');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user already has an advisor subscription
      const { data: existingSub } = await supabase
        .from('advisor_subscriptions')
        .select('id, subscription_status')
        .eq('user_id', user.id)
        .single();

      if (existingSub?.subscription_status === 'active') {
        toast({
          title: "Already Subscribed",
          description: "You already have an active advisor subscription.",
        });
        navigate('/advisors/dashboard');
        return;
      }

      // Store onboarding data and proceed to payment
      sessionStorage.setItem('advisorOnboardingData', JSON.stringify(formData));
      navigate('/advisors/payment');
    } catch (error) {
      console.error('Error checking subscription:', error);
      // Proceed to payment anyway
      sessionStorage.setItem('advisorOnboardingData', JSON.stringify(formData));
      navigate('/advisors/payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-3 sm:px-4 pt-24 sm:pt-32 pb-12 sm:pb-20 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/advisors')}
          className="mb-4 sm:mb-6 text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Back to Partnership Details</span>
          <span className="sm:hidden">Back</span>
        </Button>

        <Card>
          <CardHeader className="text-center p-4 sm:p-6">
            <div className="mx-auto p-2 sm:p-3 bg-primary/10 rounded-lg w-fit mb-3 sm:mb-4">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <CardTitle className="text-xl sm:text-2xl">Advisor Partnership Onboarding</CardTitle>
            <CardDescription className="text-sm">
              Tell us about your advisory practice so we can tailor your experience.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
              </div>

              {/* Firm Information */}
              <div className="space-y-4">
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Firm Details</h3>
                </div>

                <div>
                  <Label htmlFor="firmName">Firm Name *</Label>
                  <Input
                    id="firmName"
                    value={formData.firmName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firmName: e.target.value }))}
                    placeholder="Your Advisory Firm"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firmLocation">Firm Location</Label>
                    <Input
                      id="firmLocation"
                      value={formData.firmLocation}
                      onChange={(e) => setFormData(prev => ({ ...prev, firmLocation: e.target.value }))}
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <Label htmlFor="numberOfClients">Number of Clients</Label>
                    <Input
                      id="numberOfClients"
                      value={formData.numberOfClients}
                      onChange={(e) => setFormData(prev => ({ ...prev, numberOfClients: e.target.value }))}
                      placeholder="e.g., 50-100"
                    />
                  </div>
                </div>
              </div>

              {/* Investment Focus */}
              <div className="space-y-4">
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Investment Focus</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select all that apply to your practice
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {investmentOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={formData.investmentFocus.includes(option.id)}
                        onCheckedChange={(checked) => handleFocusChange(option.id, checked as boolean)}
                      />
                      <Label htmlFor={option.id} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* What are you looking for */}
              <div className="space-y-4">
                <div className="border-t pt-6">
                  <Label htmlFor="lookingFor">What are you looking for? (Optional)</Label>
                  <Textarea
                    id="lookingFor"
                    value={formData.lookingFor}
                    onChange={(e) => setFormData(prev => ({ ...prev, lookingFor: e.target.value }))}
                    placeholder="Tell us what you hope to achieve with PortfoliX model portfolios..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-glow"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Continue to Membership"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvisorOnboarding;
