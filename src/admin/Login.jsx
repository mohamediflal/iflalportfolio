import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/Button";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to admin dashboard
    const auth = localStorage.getItem("portfolio_admin_auth");
    if (auth === "true") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Get current credentials from settings or fallback to default
    const storedCredentials = localStorage.getItem("portfolio_admin_credentials");
    let validEmail = "iflalportfolio@admin.com";
    let validPassword = "iflal@1234";

    if (storedCredentials) {
      try {
        const parsed = JSON.parse(storedCredentials);
        if (parsed.email) validEmail = parsed.email;
        if (parsed.password) validPassword = parsed.password;
      } catch (err) {
        console.error("Failed to parse stored credentials:", err);
      }
    }

    setTimeout(() => {
      if (email === validEmail && password === validPassword) {
        localStorage.setItem("portfolio_admin_auth", "true");
        navigate("/admin");
      } else {
        setError("Invalid email or password");
        setLoading(false);
      }
    }, 600); // Add a small delay for a professional feel
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center relative px-6 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-highlight/5 rounded-full blur-3xl -z-10" />

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Portfolio
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md glass rounded-3xl p-8 md:p-10 relative overflow-hidden glow-border">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Owner <span className="text-primary">Login</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your portfolio content
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="iflalportfolio@admin.com"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors text-foreground"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors text-foreground"
              />
            </div>
          </div>

          {/* Submit button */}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};
