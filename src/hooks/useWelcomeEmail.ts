import { supabase } from "@/integrations/supabase/client";

type EmailType = "welcome" | "pro_welcome" | "elite_welcome" | "internal_notification";

interface SendEmailParams {
  emailType: EmailType;
  firstName?: string;
  nextBillingDate?: string;
  // Internal notification fields
  portfolioName?: string;
  riskScore?: number;
  timeline?: string;
  experienceLevel?: string;
  investmentAmount?: number;
  assetCount?: number;
  userPlan?: string;
  userCreatedAt?: string;
  totalPortfolios?: number;
}

export const useWelcomeEmail = () => {
  const sendEmail = async (params: SendEmailParams) => {
    try {
      const { data, error } = await supabase.functions.invoke("send-welcome-email", {
        body: params,
      });

      if (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error invoking email function:", error);
      return { success: false, error };
    }
  };

  const sendWelcomeEmail = (firstName?: string) =>
    sendEmail({ emailType: "welcome", firstName });

  const sendProWelcomeEmail = (firstName?: string) =>
    sendEmail({ emailType: "pro_welcome", firstName });

  const sendEliteWelcomeEmail = (firstName?: string) =>
    sendEmail({ emailType: "elite_welcome", firstName });

  const sendPortfolioNotification = (data: {
    portfolioName: string;
    riskScore: number;
    timeline: string;
    experienceLevel: string;
    investmentAmount: number;
    assetCount: number;
    userPlan: string;
    userCreatedAt: string;
    totalPortfolios: number;
  }) =>
    sendEmail({ emailType: "internal_notification", ...data });

  return {
    sendEmail,
    sendWelcomeEmail,
    sendProWelcomeEmail,
    sendEliteWelcomeEmail,
    sendPortfolioNotification,
  };
};
