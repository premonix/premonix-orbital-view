
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
import DataSources from "./pages/DataSources";
import Reports from "./pages/Reports";
import About from "./pages/About";
import Contact from "./pages/Contact";
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
            <Route path="/data-sources" element={<DataSources />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/about" element={<About />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
