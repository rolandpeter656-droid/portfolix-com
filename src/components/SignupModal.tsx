import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SignupModal = ({ open, onOpenChange }: SignupModalProps) => {
  const [step, setStep] = useState<"signup" | "survey">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string>("");
  
  // Survey state
  const [investmentExperience, setInvestmentExperience] = useState("");
  const [riskTolerance, setRiskTolerance] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("");
  
  const { signUp } = useAuth();
  const { toast } = useToast();

  const resetForm = () => {
    setStep("signup");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setReferralCode("");
    setShowPassword(false);
    setInvestmentExperience("");
    setRiskTolerance("");
    setTimeHorizon("");
    setPrimaryGoal("");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
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
            referred_by: referralCode || null,
            referral_code: generatedReferralCode,
            credit_balance: 5,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        } else {
          // Log credit transaction for signup
          await supabase.from('credit_transactions').insert({
            user_id: data.user.id,
            amount: 5,
            reason: 'Signup bonus',
          });

          // If user was referred, process referral rewards
          if (referralCode) {
            const { data: referrerData } = await supabase
              .from('users')
              .select('user_id, credit_balance, referral_count')
              .eq('referral_code', referralCode)
              .single();

            if (referrerData) {
              await supabase.from('referrals').insert({
                referrer_code: referralCode,
                referee_email: email,
                status: 'activated',
              });

              const newReferrerBalance = (referrerData.credit_balance || 0) + 10;
              const newReferralCount = (referrerData.referral_count || 0) + 1;

              await supabase
                .from('users')
                .update({
                  credit_balance: newReferrerBalance,
                  referral_count: newReferralCount,
                })
                .eq('user_id', referrerData.user_id);

              await supabase.from('credit_transactions').insert({
                user_id: referrerData.user_id,
                amount: 10,
                reason: `Referral reward for ${email}`,
              });
            }
          }
        }
        
        setUserId(data.user.id);
        setStep("survey");
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

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!investmentExperience || !riskTolerance || !timeHorizon || !primaryGoal) {
      toast({
        title: "Complete all questions",
        description: "Please answer all survey questions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          investment_experience: investmentExperience,
          risk_tolerance: riskTolerance,
          time_horizon: timeHorizon,
          primary_goal: primaryGoal,
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Profile update error:', error);
        toast({
          title: "Profile saved with limited data",
          description: "Please check your email to verify your account.",
        });
      } else {
        toast({
          title: "Welcome to PortfoliX!",
          description: "Your profile has been created. Please check your email to verify your account. You've earned 5 credits!",
        });
      }
      
      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Profile save failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const surveyOptions = {
    experience: ["Beginner", "Intermediate", "Expert"],
    risk: ["Low", "Moderate", "High"],
    horizon: ["1-3yrs", "3-7yrs", "7+yrs"],
    goal: ["Retirement", "Wealth accumulation", "Income", "Speculation"],
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-md">
        {step === "signup" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Create Your Account</DialogTitle>
              <DialogDescription>
                Join thousands of investors building smarter portfolios
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSignup} className="space-y-4 mt-4">
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                <Input
                  id="referralCode"
                  type="text"
                  placeholder="Enter referral code if you have one"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Continue"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                Tell Us About Yourself
              </DialogTitle>
              <DialogDescription>
                Help us personalize your investment experience
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSurveySubmit} className="space-y-6 mt-4">
              {/* Question 1: Investment Experience */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">1. Investment Experience</Label>
                <div className="grid grid-cols-3 gap-2">
                  {surveyOptions.experience.map((option) => (
                    <Card
                      key={option}
                      className={`p-3 cursor-pointer text-center transition-all hover:border-primary ${
                        investmentExperience === option ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setInvestmentExperience(option)}
                    >
                      <span className="text-sm font-medium">{option}</span>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Question 2: Risk Tolerance */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">2. Risk Tolerance</Label>
                <div className="grid grid-cols-3 gap-2">
                  {surveyOptions.risk.map((option) => (
                    <Card
                      key={option}
                      className={`p-3 cursor-pointer text-center transition-all hover:border-primary ${
                        riskTolerance === option ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setRiskTolerance(option)}
                    >
                      <span className="text-sm font-medium">{option}</span>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Question 3: Time Horizon */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">3. Time Horizon</Label>
                <div className="grid grid-cols-3 gap-2">
                  {surveyOptions.horizon.map((option) => (
                    <Card
                      key={option}
                      className={`p-3 cursor-pointer text-center transition-all hover:border-primary ${
                        timeHorizon === option ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setTimeHorizon(option)}
                    >
                      <span className="text-sm font-medium">{option}</span>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Question 4: Primary Goal */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">4. Primary Goal</Label>
                <div className="grid grid-cols-2 gap-2">
                  {surveyOptions.goal.map((option) => (
                    <Card
                      key={option}
                      className={`p-3 cursor-pointer text-center transition-all hover:border-primary ${
                        primaryGoal === option ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setPrimaryGoal(option)}
                    >
                      <span className="text-sm font-medium">{option}</span>
                    </Card>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Completing setup..." : "Complete Setup"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
