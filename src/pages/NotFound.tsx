import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SsButton } from "@/components/ss/SsButton";

const NotFound = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <main className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-md">
        <p className="font-mono text-accent-emerald text-sm tracking-widest">404 · NOT FOUND</p>
        <h1 className="mt-4 font-display font-extrabold text-5xl text-text-primary">
          Lost in the scope
        </h1>
        <p className="mt-4 font-body text-text-secondary">
          The page you're looking for doesn't exist. Let's get you back home.
        </p>
        <Link to="/" className="inline-block mt-6">
          <SsButton variant="primary">Back to Home</SsButton>
        </Link>
      </div>
    </main>
    <Footer />
  </div>
);

export default NotFound;
