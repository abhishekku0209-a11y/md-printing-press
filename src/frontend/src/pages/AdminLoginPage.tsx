import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Printer } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { PageSEO } from "../components/shared/PageSEO";
import { useAuth } from "../hooks/useAuth";

export function AdminLoginPage() {
  const { login, isAuthenticated, error: authError } = useAuth();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/admin" });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!adminId.trim()) {
      setFormError("Admin ID is required.");
      return;
    }
    if (!password) {
      setFormError("Password is required.");
      return;
    }

    setIsLoading(true);
    try {
      await login(adminId.trim(), password);
      navigate({ to: "/admin" });
    } catch {
      setFormError(authError ?? "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageSEO
        title="Admin Login"
        description="MD Printing Press admin panel login"
      />
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-sm"
        >
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-elevated mx-auto mb-4 overflow-hidden">
              <img
                src="/assets/md-printing-logo.jpg"
                alt="MD Printing Press"
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  e.currentTarget.parentElement
                    ?.querySelector(".fallback-icon")
                    ?.classList.remove("hidden");
                }}
              />
              <Printer className="w-8 h-8 text-primary-foreground fallback-icon hidden" />
            </div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              MD Printing Press
            </h1>
            <p className="text-sm text-muted-foreground font-body mt-1">
              Project BindWala — Admin Panel
            </p>
          </div>

          {/* Login Card */}
          <Card className="p-6 shadow-elevated border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-foreground leading-tight">
                  Secure Sign In
                </h2>
                <p className="text-xs text-muted-foreground font-body">
                  Enter your credentials to continue
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Admin ID */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="admin-id"
                  className="text-sm font-body font-medium text-foreground"
                >
                  Admin ID
                </Label>
                <Input
                  id="admin-id"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your admin ID"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  disabled={isLoading}
                  className="font-body"
                  data-ocid="admin-login-id"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="admin-password"
                  className="text-sm font-body font-medium text-foreground"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="font-body pr-10"
                    data-ocid="admin-login-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    data-ocid="admin-login-toggle-password"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {formError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive font-body bg-destructive/10 rounded-md px-3 py-2"
                  role="alert"
                  data-ocid="admin-login-error"
                >
                  {formError}
                </motion.p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full font-display font-bold"
                size="lg"
                disabled={isLoading}
                data-ocid="admin-login-btn"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground font-body text-center mt-4">
              Only authorized administrators can access this panel.
            </p>
          </Card>

          <div className="text-center mt-6">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-smooth font-body"
            >
              ← Back to Public Site
            </a>
          </div>
        </motion.div>
      </div>
    </>
  );
}
