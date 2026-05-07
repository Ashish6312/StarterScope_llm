import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SsButton } from "@/components/ss/SsButton";
import { SsInput } from "@/components/ss/SsInput";
import { Hexagon } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";

export default function AuthPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string } | null)?.from || "/dashboard";

  const submit = async () => {
    if (!email.trim() || !password) {
      toast.error("Please enter email and password");
      return;
    }
    if (mode === "signup" && !name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signin") {
        await signIn({ email: email.trim(), password });
        toast.success("Signed in");
      } else {
        await signUp({ name: name.trim(), email: email.trim(), password });
        toast.success("Account created");
      }
      navigate(from, { replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        // useGoogleLogin implicitly returns access_token, not credential. 
        // We'll need to fetch user info from google API since it's access token based
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const payload = await res.json();
        
        const u = { 
          id: payload.sub, 
          email: payload.email, 
          name: payload.name,
          image_url: payload.picture
        };
        // Use our googleSignIn method to hit the sync endpoint
        await googleSignIn(payload);
        toast.success("Signed in with Google");
        navigate(from, { replace: true });
      } catch (e) {
        toast.error("Failed to fetch Google user info");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error("Google Login Failed");
    }
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Left visual panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-brand text-white">
        <div className="absolute -top-32 -left-20 w-[400px] h-[400px] rounded-full bg-white/10" />
        <div className="absolute bottom-0 -right-20 w-[300px] h-[300px] rounded-full bg-white/5" />

        <div className="relative flex flex-col justify-between p-12 h-full w-full">
          <div className="flex items-center gap-2">
            <Hexagon className="w-7 h-7 text-white fill-white/20" strokeWidth={2.5} />
            <div className="flex items-baseline gap-0.5 font-semibold text-lg">
              <span>Starter</span>
              <span className="font-display font-extrabold">Scope</span>
            </div>
          </div>

          <div>
            <span className="font-display text-[120px] leading-none text-white/20">"</span>
            <p className="font-display font-bold text-2xl xl:text-3xl leading-tight -mt-8">
              Discover the opportunity
              <br />
              you were meant to build.
            </p>
            <p className="mt-4 font-body text-[15px] text-white/70">
              — powered by StarterScope
            </p>
          </div>

          <ul className="space-y-3">
            {[
              "Real market data, not guesswork",
              "Verified business opportunities",
              "India-first intelligence platform",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">
                  ✓
                </span>
                <span className="font-body text-sm text-white/80">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md lg:glass-card lg:p-10"
        >
          <h1 className="font-display font-extrabold text-3xl text-text-primary">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 font-body text-base text-text-secondary">
            {mode === "signin" ? "Sign in to your intelligence platform" : "Start using your intelligence platform"}
          </p>

          <button
            onClick={() => loginWithGoogle()}
            disabled={loading}
            className="mt-8 w-full h-14 rounded-xl border-2 border-border bg-surface hover:bg-elevated transition-colors flex items-center justify-center gap-3 font-body font-medium text-text-primary hover:border-accent-emerald/40 active:scale-[0.98] disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5 44.5 36.3 44.5 25c0-1.5-.2-3-.4-4.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4.5 24 4.5 16.3 4.5 9.6 8.6 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 45.5c5.2 0 10-2 13.5-5.2l-6.2-5.3c-2 1.4-4.5 2.3-7.3 2.3-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.4 40.9 16.1 45.5 24 45.5z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.8-3.7 5l6.2 5.3c-.4.4 6.7-4.9 6.7-13.3 0-1.5-.2-3-.4-4.5z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="font-body text-[13px] text-text-muted">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-4">
            {mode === "signup" && (
              <SsInput
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <SsInput
              leftIcon={<Mail className="w-4 h-4" />}
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <SsInput
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button onClick={() => setShowPwd((v) => !v)} aria-label="Toggle password">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              type={showPwd ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <div className="text-right">
              <Link to="/auth" className="font-body text-[13px] text-accent-emerald hover:underline">
                Forgot password?
              </Link>
            </div>
            <SsButton variant="primary" className="w-full" onClick={submit} disabled={loading}>
              {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Sign Up"}{" "}
              <LogIn className="w-4 h-4" />
            </SsButton>
          </div>

          <p className="font-body text-sm text-text-muted text-center mt-6">
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-accent-emerald font-medium hover:underline"
                >
                  Sign up free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-accent-emerald font-medium hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
