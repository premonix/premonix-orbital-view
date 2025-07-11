
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ThreatMap from "./pages/ThreatMap";
import RiskBySector from "./pages/RiskBySector";
import ResilienceToolkit from "./pages/ResilienceToolkit";
import DisruptionOS from "./pages/DisruptionOS";
import DisruptionOSDashboard from "./pages/DisruptionOSDashboard";
import DataSources from "./pages/DataSources";
import Reports from "./pages/Reports";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AdminConsole from "./pages/AdminConsole";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/threat-map" element={<ThreatMap />} />
            <Route path="/risk-by-sector" element={<RiskBySector />} />
            <Route path="/resilience-toolkit" element={<ResilienceToolkit />} />
            <Route path="/disruption-os" element={<DisruptionOS />} />
            <Route path="/disruption-os/dashboard" element={<DisruptionOSDashboard />} />
            <Route path="/data-sources" element={<DataSources />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/admin" element={<AdminConsole />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
