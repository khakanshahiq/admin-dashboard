import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Loader2,
} from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    setError("");

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    // Demo password recovery
    window.setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 700);
  };

  const disabled = isLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-3xl font-black tracking-tight text-gray-950 transition hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-black text-white shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md dark:bg-indigo-500">
                KS
              </span>
              Sardar KS UI
            </Link>

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Recover access to your account.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
            {!success ? (
              <>
                {/* Header */}
                <div className="mb-7">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />

                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Authentication
                    </span>
                  </div>

                  <h1 className="text-xl font-bold text-gray-950 dark:text-white">
                    Forgot password?
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    Enter your email address and we'll send you a link to reset
                    your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Error */}
                  {error && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                      <p>{error}</p>
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email address
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          setError("");
                        }}
                        placeholder="admin@example.com"
                        disabled={disabled}
                        className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:border-gray-600 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={disabled}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-offset-gray-900">
                    {isLoading ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={17} />
                        Send reset link
                      </>
                    )}
                  </button>
                </form>

                {/* Back to Login */}
                <div className="mt-7 text-center">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-gray-600 transition hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:text-gray-300 dark:hover:text-indigo-400 dark:focus:ring-indigo-900">
                    <ArrowLeft size={16} />
                    Back to sign in
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Success Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50 dark:bg-green-900/30 dark:ring-green-950/30">
                    <CheckCircle2
                      size={28}
                      className="text-green-600 dark:text-green-400"
                    />
                  </div>
                </div>

                {/* Success Header */}
                <div className="text-center">
                  <div className="mb-3 flex items-center justify-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400" />

                    <span className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
                      Email Sent
                    </span>
                  </div>

                  <h1 className="text-xl font-bold text-gray-950 dark:text-white">
                    Check your email
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    We've sent a password reset link to:
                  </p>

                  <p className="mt-2 break-all text-sm font-semibold text-gray-900 dark:text-white">
                    {email.trim()}
                  </p>
                </div>

                {/* Demo Notice */}
                <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-center dark:border-indigo-900/50 dark:bg-indigo-950/30">
                  <p className="text-xs leading-5 text-indigo-700 dark:text-indigo-300">
                    Demo template — connect this form to your backend API to
                    send real password reset emails.
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-3">
                  <Link
                    to="/reset-password"
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-offset-gray-900">
                    Continue to reset password
                  </Link>

                  <Link
                    to="/"
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-300">
                    <ArrowLeft size={16} />
                    Back to sign in
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Demo Notice */}
          {!success && (
            <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-center dark:border-indigo-900/50 dark:bg-indigo-950/30">
              <p className="text-xs leading-5 text-indigo-700 dark:text-indigo-300">
                Demo template — password recovery is simulated for preview
                purposes.
              </p>
            </div>
          )}

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Sardar KS UI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
