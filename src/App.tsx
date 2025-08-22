import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Payment from "./pages/Payment";
import PaymentMethod from "./pages/PaymentMethod";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PortfolioSummary from "./pages/PortfolioSummary";
import Api from "./pages/Api";
import Integrations from "./pages/Integrations";
import MobileApp from "./pages/MobileApp";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
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
          <Route path="/payment-method" element={<PaymentMethod />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/portfolio-summary" element={<PortfolioSummary riskScore={50} experienceLevel="intermediate" onBack={() => window.history.back()} onCustomize={() => {}} />} />
          <Route path="/api" element={<Api />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/mobile-app" element={<MobileApp />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
