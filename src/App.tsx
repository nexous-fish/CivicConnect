import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OfficerAuth from "./pages/OfficerAuth";
import OfficerDashboard from "./pages/OfficerDashboard";
import OfficerComplaints from "./pages/OfficerComplaints";
import OfficerContractors from "./pages/OfficerContractors";
import OfficerAnalytics from "./pages/OfficerAnalytics";
import OfficerSettings from "./pages/OfficerSettings";
import UserAuth from "./pages/UserAuth";
import UserDashboard from "./pages/UserDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/user-auth" element={<UserAuth />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/officer-auth" element={<OfficerAuth />} />
          <Route path="/officer-dashboard" element={<OfficerDashboard />} />
          <Route path="/officer-dashboard/complaints" element={<OfficerComplaints />} />
          <Route path="/officer-dashboard/contractors" element={<OfficerContractors />} />
          <Route path="/officer-dashboard/analytics" element={<OfficerAnalytics />} />
          <Route path="/officer-dashboard/settings" element={<OfficerSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
