import { useState, useEffect, useId } from "react";
import {
  LogIn,
  UserPlus,
  KeyRound,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "bg-slate-200" };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: "Weak", color: "bg-rose-500", textColor: "text-rose-500" };
  if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-500", textColor: "text-amber-500" };
  if (score === 3) return { score: 3, label: "Good", color: "bg-blue-500", textColor: "text-blue-500" };
  return { score: 4, label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-500" };
}

export default function AuthModal({
  isOpen,
  onClose,
  onAuthenticate,
  onOpenTerms,
}) {
  const [mode, setMode] = useState("login"); // "login" | "signup" | "reset"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleId = useId();

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset errors when mode changes
  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccessMessage("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  if (!isOpen) return null;

  const isSignUp = mode === "signup";
  const isReset = mode === "reset";
  const isLogin = mode === "login";

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch =
    (isSignUp || isReset) && confirmPassword
      ? password === confirmPassword
      : null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (isSignUp && !name.trim()) {
      setError("Please enter your full name to create an account.");
      return;
    }

    if ((isSignUp || isReset) && password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if ((isSignUp || isReset) && password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (isSignUp && !acceptedTerms) {
      setError("Please accept the Terms & Conditions to create your account.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isReset) {
        await onAuthenticate({
          mode: "reset",
          email: trimmedEmail,
          newPassword: password,
        });
        setSuccessMessage("Password reset successfully! You are now signed in.");
      } else {
        await onAuthenticate({
          mode,
          name: name.trim(),
          email: trimmedEmail,
          password,
        });
      }

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAcceptedTerms(false);
    } catch (authError) {
      setError(authError.message || "Unable to authenticate. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-3 sm:p-5 backdrop-blur-sm overflow-y-auto animate-fadeIn"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md my-auto max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Top Header Row with Segmented Tabs and Perfectly Aligned Close Button */}
        <div className="flex items-center justify-between gap-3 mb-4">
          {!isReset ? (
            <div className="flex-1 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isLogin
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSignUp
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Create Account</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-[var(--campus-primary-dark)] dark:bg-orange-950/70 dark:text-[var(--campus-accent)]">
                <KeyRound className="h-4 w-4" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base">
                Reset Password
              </span>
            </div>
          )}

          {/* Close Button - Perfectly aligned in header row */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="shrink-0 flex items-center justify-center h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Header Icon & Title */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-[var(--campus-primary-dark)] dark:bg-orange-950/70 dark:text-[var(--campus-accent)]">
            {isSignUp ? (
              <UserPlus className="h-5 w-5" />
            ) : isReset ? (
              <KeyRound className="h-5 w-5" />
            ) : (
              <LogIn className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight truncate"
            >
              {isSignUp
                ? "Create your account"
                : isReset
                  ? "Reset your password"
                  : "Welcome back"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {isSignUp
                ? "Join CampusVibe to register for events"
                : isReset
                  ? "Choose a new password for your account"
                  : "Sign in to access your registered event passes"}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name (Sign Up only) */}
          {isSignUp && (
            <div>
              <label
                htmlFor="auth-fullname"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
              >
                Full Name *
              </label>
              <input
                id="auth-fullname"
                name="name"
                type="text"
                autoComplete="name"
                required
                autoFocus
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[var(--campus-primary-dark)] focus:ring-2 focus:ring-[var(--campus-primary)]/25 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="e.g. Alex Rivera"
              />
            </div>
          )}

          {/* Email Address */}
          <div>
            <label
              htmlFor="auth-email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
            >
              Email Address *
            </label>
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              autoFocus={!isSignUp}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[var(--campus-primary-dark)] focus:ring-2 focus:ring-[var(--campus-primary)]/25 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              placeholder="you@campus.edu"
            />
          </div>

          {/* Password with Eye Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="auth-password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                {isReset ? "New Password *" : "Password *"}
              </label>

              {isLogin && (
                <button
                  type="button"
                  onClick={() => switchMode("reset")}
                  className="text-xs font-semibold text-[var(--campus-link)] hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>

            <div className="relative">
              <input
                id="auth-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isSignUp || isReset ? "new-password" : "current-password"}
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white pl-3.5 pr-10 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[var(--campus-primary-dark)] focus:ring-2 focus:ring-[var(--campus-primary)]/25 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder={isSignUp || isReset ? "At least 6 characters" : "Enter password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Password strength meter for sign up or reset */}
            {(isSignUp || isReset) && password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">Password strength:</span>
                  <span className={`font-semibold ${passwordStrength.textColor}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full rounded-full transition-all duration-300 ${
                        passwordStrength.score >= step
                          ? passwordStrength.color
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password (Sign Up & Reset) */}
          {(isSignUp || isReset) && (
            <div>
              <label
                htmlFor="auth-confirm-password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
              >
                Confirm {isReset ? "New " : ""}Password *
              </label>

              <div className="relative">
                <input
                  id="auth-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className={`w-full rounded-xl border ${
                    passwordsMatch === false
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : passwordsMatch === true
                        ? "border-emerald-500 focus:ring-emerald-500/20"
                        : "border-slate-300 dark:border-slate-700"
                  } bg-white pl-3.5 pr-10 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[var(--campus-primary-dark)] focus:ring-2 focus:ring-[var(--campus-primary)]/25 dark:bg-slate-800 dark:text-white`}
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <p
                  className={`mt-1 text-xs flex items-center gap-1 ${
                    passwordsMatch ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
                  }`}
                >
                  {passwordsMatch ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>Passwords do not match</span>
                    </>
                  )}
                </p>
              )}
            </div>
          )}

          {/* Local Security Disclaimer */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <ShieldCheck className="h-4 w-4 shrink-0 text-orange-500" />
            <span>Passes and accounts are securely hashed & encrypted in this browser.</span>
          </div>

          {/* Terms & Conditions Checkbox (Sign Up) */}
          {isSignUp && (
            <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-[var(--campus-primary)] cursor-pointer"
              />
              <span className="leading-5">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={onOpenTerms}
                  className="font-semibold text-[var(--campus-link)] hover:underline"
                >
                  Terms & Conditions
                </button>{" "}
                and acknowledge the community guidelines.
              </span>
            </label>
          )}

          {/* Error Message Alert */}
          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 p-3 text-xs sm:text-sm text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-3 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[var(--campus-primary)] py-3 px-4 font-semibold text-white shadow-lg shadow-orange-900/15 transition-all hover:bg-[var(--campus-primary-dark)] active:scale-[0.99] disabled:cursor-wait disabled:opacity-70 cursor-pointer text-sm"
          >
            {isSubmitting
              ? "Authenticating..."
              : isSignUp
                ? "Create Account"
                : isReset
                  ? "Save New Password & Sign In"
                  : "Sign In"}
          </button>
        </form>

        {/* Footer Navigation Switch */}
        <div className="mt-4 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
          {isReset ? (
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="font-semibold text-[var(--campus-link)] hover:underline cursor-pointer"
            >
              &larr; Back to Sign In
            </button>
          ) : isSignUp ? (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="font-semibold text-[var(--campus-link)] hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to CampusVibe?{" "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="font-semibold text-[var(--campus-link)] hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
