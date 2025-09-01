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