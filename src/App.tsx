import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Critical path - loaded immediately
import Index from "./pages/Index";

// Lazy loaded pages - reduces initial bundle size
const Pricing = lazy(() => import("./pages/Pricing"));
const Payment = lazy(() => import("./pages/Payment"));
const PaymentMethod = lazy(() => import("./pages/PaymentMethod"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const PortfolioSummary = lazy(() => import("./pages/PortfolioSummary"));
const Integrations = lazy(() => import("./pages/Integrations"));
const MobileApp = lazy(() => import("./pages/MobileApp"));
const Careers = lazy(() => import("./pages/Careers"));
const Blog = lazy(() => import("./pages/Blog"));
const Documentation = lazy(() => import("./pages/Documentation"));
const PortfolioBuilderChoice = lazy(() => import("./pages/PortfolioBuilderChoice"));
const ExpertBuilderPlaceholder = lazy(() => import("./pages/ExpertBuilderPlaceholder"));
const ReferralDashboard = lazy(() => import("./pages/ReferralDashboard"));
const AIDashboard = lazy(() => import("./pages/AIDashboard"));

const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Disclaimers = lazy(() => import("./pages/legal/Disclaimers"));
const RiskDisclosurePage = lazy(() => import("./pages/legal/RiskDisclosure"));
const Learn = lazy(() => import("./pages/Learn"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Minimal loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-method" element={<PaymentMethod />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/portfolio-summary" element={<PortfolioSummary riskScore={50} experienceLevel="intermediate" timeline="6-10 years" onBack={() => window.history.back()} onCustomize={() => {}} />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/mobile-app" element={<MobileApp />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/app/builder" element={<PortfolioBuilderChoice />} />
            <Route path="/app/builder/expert" element={<ExpertBuilderPlaceholder />} />
            <Route path="/referrals" element={<ReferralDashboard />} />
            <Route path="/dashboard" element={<AIDashboard />} />
            
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/legal/disclaimers" element={<Disclaimers />} />
            <Route path="/legal/risk-disclosure" element={<RiskDisclosurePage />} />
            <Route path="/learn" element={<Learn />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
