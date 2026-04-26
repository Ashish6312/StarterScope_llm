import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SsButton } from "@/components/ss/SsButton";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center px-4 py-20"
      >
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 mx-auto rounded-full bg-accent-emerald-light flex items-center justify-center"
          >
            <CheckCircle2 className="w-14 h-14 text-accent-emerald" strokeWidth={2.5} />
          </motion.div>
          <h1 className="mt-8 font-display font-extrabold text-3xl sm:text-4xl text-text-primary">
            Payment Successful!
          </h1>
          <p className="mt-4 font-body text-base text-text-secondary">
            Welcome aboard. Your intelligence engine is ready. Start scanning
            opportunities right now.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard">
              <SsButton variant="primary">Go to Dashboard</SsButton>
            </Link>
            <Link to="/profile">
              <SsButton variant="secondary">View Subscription</SsButton>
            </Link>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}
