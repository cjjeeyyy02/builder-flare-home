import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ManageProfile from "./pages/ManageProfile";
import ViewDetails from "./pages/ViewDetails";
import NewOffboarding from "./pages/NewOffboarding";
import NewOffboardingStep2 from "./pages/NewOffboardingStep2";
import NewOffboardingStep3 from "./pages/NewOffboardingStep3";
import ExitInterview from "./pages/ExitInterview";
import ExitInterviewForm from "./pages/ExitInterviewForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/new-offboarding" element={<NewOffboarding />} />
          <Route
            path="/new-offboarding-exit-details"
            element={<NewOffboardingStep2 />}
          />
          <Route
            path="/new-offboarding-review"
            element={<NewOffboardingStep3 />}
          />
          <Route path="/exit-interview" element={<ExitInterview />} />
          <Route path="/exit-interview-form" element={<ExitInterviewForm />} />
          <Route path="/manage-profile/:id" element={<ManageProfile />} />
          <Route path="/view-details/:id" element={<ViewDetails />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
