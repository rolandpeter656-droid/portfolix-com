import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Payment from "./pages/Payment";
import Institutions from "./pages/Institutions";
import InstitutionalDashboard from "./pages/InstitutionalDashboard";
import InstitutionalDisclaimer from "./pages/InstitutionalDisclaimer";
import PaymentMethod from "./pages/PaymentMethod";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import PortfolioSummary from "./pages/PortfolioSummary";
import Api from "./pages/Api";
import Integrations from "./pages/Integrations";
import MobileApp from "./pages/MobileApp";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import Documentation from "./pages/Documentation";
import AdminInstitutionalModels from "./pages/AdminInstitutionalModels";
import PortfolioBuilderChoice from "./pages/PortfolioBuilderChoice";
import ExpertBuilderPlaceholder from "./pages/ExpertBuilderPlaceholder";
import ReferralDashboard from "./pages/ReferralDashboard";
import AIDashboard from "./pages/AIDashboard";
import MyPortfolios from "./pages/MyPortfolios";
import Advisors from "./pages/Advisors";
import AdvisorOnboarding from "./pages/AdvisorOnboarding";
import AdvisorPayment from "./pages/AdvisorPayment";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimers from "./pages/legal/Disclaimers";
import RiskDisclosurePage from "./pages/legal/RiskDisclosure";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/institutional-dashboard" element={<InstitutionalDashboard />} />
          <Route path="/legal/institutional-disclaimer" element={<InstitutionalDisclaimer />} />
          <Route path="/payment-method" element={<PaymentMethod />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/portfolio-summary" element={<PortfolioSummary riskScore={50} experienceLevel="intermediate" timeline="6-10 years" onBack={() => window.history.back()} onCustomize={() => {}} />} />
          <Route path="/api" element={<Api />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/mobile-app" element={<MobileApp />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/admin/institutional_models" element={<AdminInstitutionalModels />} />
          <Route path="/app/builder" element={<PortfolioBuilderChoice />} />
          <Route path="/app/builder/expert" element={<ExpertBuilderPlaceholder />} />
          <Route path="/referrals" element={<ReferralDashboard />} />
          <Route path="/dashboard" element={<AIDashboard />} />
          <Route path="/my-portfolios" element={<MyPortfolios />} />
          <Route path="/advisors" element={<Advisors />} />
          <Route path="/advisors/onboarding" element={<AdvisorOnboarding />} />
          <Route path="/advisors/payment" element={<AdvisorPayment />} />
          <Route path="/advisors/dashboard" element={<AdvisorDashboard />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/legal/disclaimers" element={<Disclaimers />} />
          <Route path="/legal/risk-disclosure" element={<RiskDisclosurePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
