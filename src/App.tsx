import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ClientProviders } from "@/components/ClientProviders";
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

const App = () => (
  <ClientProviders>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/business-details" element={<BusinessDetails />} />
        <Route path="/business-plan" element={<BusinessPlan />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/acquisition-tiers" element={<AcquisitionTiers />} />
        <Route path="/auth" element={<Auth />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </ClientProviders>
);

export default App;
