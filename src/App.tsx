import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { authService } from "@/lib/rbac";
import "./lib/i18n";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ConsoleLayout from "./pages/console/Layout";
import Overview from "./pages/console/Overview";
import HeatRisk from "./pages/console/HeatRisk";
import DiseaseRisk from "./pages/console/DiseaseRisk";
import HospitalSurge from "./pages/console/HospitalSurge";
import AirQuality from "./pages/console/AirQuality";
import Scenario from "./pages/console/Scenario";
import KnowledgeGraph from "./pages/console/KnowledgeGraph";
import Evidence from "./pages/console/Evidence";
import Catalog from "./pages/console/Catalog";
import Fairness from "./pages/console/Fairness";
import Alerts from "./pages/console/Alerts";
import Settings from "./pages/console/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

const App = () => {
  const { theme } = useAppStore();

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            
            {/* Protected console routes */}
            <Route
              path="/console"
              element={
                <ProtectedRoute>
                  <ConsoleLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/console/overview" replace />} />
              <Route path="overview" element={<Overview />} />
              <Route path="heat" element={<HeatRisk />} />
              <Route path="disease" element={<DiseaseRisk />} />
              <Route path="hospital" element={<HospitalSurge />} />
              <Route path="air" element={<AirQuality />} />
              <Route path="scenario" element={<Scenario />} />
              <Route path="kg" element={<KnowledgeGraph />} />
              <Route path="evidence" element={<Evidence />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="fairness" element={<Fairness />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
