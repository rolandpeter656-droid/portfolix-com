import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check URL parameters for email confirmation
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
        const type = urlParams.get('type');

        // Handle email confirmation
        if (accessToken && refreshToken && type === 'signup') {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("Email confirmation error:", error);
            toast({
              title: "Email Confirmation Failed",
              description: error.message,
              variant: "destructive",
            });
            navigate("/signin");
            return;
          }

          if (data.session) {
            toast({
              title: "Email Confirmed!",
              description: "Welcome to PortfoliX. Your account is now active.",
            });
            navigate("/");
            return;
          }
        }

        // Handle regular auth callback (OAuth, etc.)
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
          navigate("/signin");
          return;
        }

        if (data.session) {
          toast({
            title: "Welcome!",
            description: "Successfully signed in to PortfoliX.",
          });
          navigate("/");
        } else {
          navigate("/signin");
        }
      } catch (error) {
        console.error("Unexpected error during auth callback:", error);
        toast({
          title: "Authentication Error",
          description: "An unexpected error occurred during sign in.",
          variant: "destructive",
        });
        navigate("/signin");
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}