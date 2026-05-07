import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ClientProviders } from "@/components/ClientProviders";
import { RequireAuth } from "@/components/RequireAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import AcquisitionTiers from "./pages/AcquisitionTiers";
import BusinessDetails from "./pages/BusinessDetails";
import BusinessPlan from "./pages/BusinessPlan";
import Roadmap from "./pages/Roadmap";
import Contact from "./pages/Contact";
import PaymentSuccess from "./pages/PaymentSuccess";
import { Chatbot } from "@/components/chatbot/Chatbot";
import { ScrollToHash } from "@/components/ScrollToHash";

const App = () => (
  <ClientProviders>
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/business-details"
          element={
            <RequireAuth>
              <BusinessDetails />
            </RequireAuth>
          }
        />
        <Route
          path="/business-plan"
          element={
            <RequireAuth>
              <BusinessPlan />
            </RequireAuth>
          }
        />
        <Route
          path="/roadmap"
          element={
            <RequireAuth>
              <Roadmap />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route
          path="/acquisition-tiers"
          element={
            <RequireAuth>
              <AcquisitionTiers />
            </RequireAuth>
          }
        />
        <Route path="/auth" element={<Auth />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  </ClientProviders>
);

export default App;
