import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [extraInfo, setExtraInfo] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Detect referral code from URL on mount
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferredBy(refCode);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check - if filled, it's likely a bot
    if (extraInfo.trim() !== "") {
      toast({
        title: "Something went wrong. Please try again.",
        description: "",
        variant: "destructive",
      });
      return;
    }
    
    if (!agreeToTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signUp(email, password);
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (data.user) {
        // Generate unique referral code
        const { data: referralCodeData, error: referralCodeError } = await supabase
          .rpc('generate_unique_referral_code');
        
        if (referralCodeError) {
          console.error('Referral code generation error:', referralCodeError);
        }

        const generatedReferralCode = referralCodeData || `PORTFOLIX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Save user profile with referral code and initial credits
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            user_id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            referred_by: referredBy || null,
            referral_code: generatedReferralCode,
            credit_balance: 5, // Award 5 credits for signing up
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          toast({
            title: "Account created with limited profile",
            description: "Please check your email to verify your account, then sign in.",
          });
        } else {
          // Log credit transaction for signup
          await supabase.from('credit_transactions').insert({
            user_id: data.user.id,
            amount: 5,
            reason: 'Signup bonus',
          });

          // If user was referred, process referral rewards
          if (referredBy) {
            // Find referrer by referral code
            const { data: referrerData } = await supabase
              .from('users')
              .select('user_id, credit_balance, referral_count')
              .eq('referral_code', referredBy)
              .single();

            if (referrerData) {
              // Create referral record
              await supabase.from('referrals').insert({
                referrer_code: referredBy,
                referee_email: email,
                status: 'activated',
              });

              // Award 10 credits to referrer
              const newReferrerBalance = (referrerData.credit_balance || 0) + 10;
              const newReferralCount = (referrerData.referral_count || 0) + 1;

              await supabase
                .from('users')
                .update({
                  credit_balance: newReferrerBalance,
                  referral_count: newReferralCount,
                })
                .eq('user_id', referrerData.user_id);

              // Log credit transaction for referrer
              await supabase.from('credit_transactions').insert({
                user_id: referrerData.user_id,
                amount: 10,
                reason: `Referral reward for ${email}`,
              });
            }
          }

          toast({
            title: "Account created successfully!",
            description: "Please check your email to verify your account, then sign in. You've earned 5 credits!",
          });
        }
        navigate("/signin");
      }
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to home button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to PortfoliX
        </Button>

        <Card className="animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              Create Your Account
            </CardTitle>
            <CardDescription>
              Join thousands of investors building smarter portfolios with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field - hidden from users to catch bots */}
              <input
                type="text"
                name="extra_info"
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />
              
              {/* Hidden referral tracking field */}
              <input
                type="hidden"
                name="referred_by"
                value={referredBy}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralCodeInput">Referral Code (Optional)</Label>
                <Input
                  id="referralCodeInput"
                  type="text"
                  placeholder="Enter referral code if you have one"
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value.toUpperCase())}
                  className="h-11"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;