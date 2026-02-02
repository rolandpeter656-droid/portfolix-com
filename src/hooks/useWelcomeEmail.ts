import { supabase } from "@/integrations/supabase/client";

interface PortfolioAsset {
  symbol: string;
  name: string;
  allocation: number;
}

interface WelcomeEmailParams {
  email: string;
  firstName?: string;
  portfolioName?: string;
  portfolioAssets?: PortfolioAsset[];
  emailType: "welcome" | "day3_followup" | "day7_context";
}

export const useWelcomeEmail = () => {
  const sendWelcomeEmail = async (params: WelcomeEmailParams) => {
    try {
      const { data, error } = await supabase.functions.invoke("send-welcome-email", {
        body: params,
      });

      if (error) {
        console.error("Error sending welcome email:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error invoking welcome email function:", error);
      return { success: false, error };
    }
  };

  const sendPortfolioWelcomeEmail = async (
    email: string,
    firstName: string | undefined,
    portfolioName: string,
    assets: PortfolioAsset[]
  ) => {
    return sendWelcomeEmail({
      email,
      firstName,
      portfolioName,
      portfolioAssets: assets.slice(0, 5), // Only include top 5 assets
      emailType: "welcome",
    });
  };

  return {
    sendWelcomeEmail,
    sendPortfolioWelcomeEmail,
  };
};
