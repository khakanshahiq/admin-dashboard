import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Restore remembered email for demo purposes
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("demo_remembered_email");

    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
      }));

      setRememberMe(true);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setIsLoading(true);

    // Demo remember-me behavior
    if (rememberMe) {
      localStorage.setItem("demo_remembered_email", email);
    } else {
      localStorage.removeItem("demo_remembered_email");
    }

    // Demo login
    window.setTimeout(() => {
      login({
        id: 1,
        name: "Admin",
        email,
        role: "Administrator",
      });

      setIsLoading(false);
      setSuccess(true);

      window.setTimeout(() => {
        navigate("/admin");
      }, 500);
    }, 700);
  };

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
              Welcome back. Please sign in to your account.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
            {/* Header */}
            <div className="mb-7">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />

                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Authentication
                </span>
              </div>

              <h1 className="text-xl font-bold text-gray-950 dark:text-white">
                Sign in
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter your details to access the dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error */}
              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                  <p>{error}</p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
                  <CheckCircle2 size={17} />

                  <span>Login successful. Redirecting...</span>
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
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    disabled={isLoading || success}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:border-gray-600 dark:focus:border-indigo-500 dark:focus:ring-indigo-950 dark:disabled:bg-gray-950"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-indigo-600 transition hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300">
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={isLoading || success}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:border-gray-600 dark:focus:border-indigo-500 dark:focus:ring-indigo-950 dark:disabled:bg-gray-950"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={isLoading || success}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-indigo-400 dark:focus:ring-indigo-900"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    title={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  disabled={isLoading || success}
                  className="h-4 w-4 rounded border-gray-300 accent-indigo-600 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed dark:border-gray-700"
                />

                <label
                  htmlFor="remember"
                  className="cursor-pointer text-sm text-gray-500 dark:text-gray-400">
                  Remember me
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || success}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-offset-gray-900">
                {isLoading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Signing in...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 size={17} />
                    Signed in
                  </>
                ) : (
                  <>
                    <ShieldCheck size={17} />
                    Sign in
                  </>
                )}
              </button>
            </form>

            {/* Register */}
            <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300">
                Create account
              </Link>
            </p>
          </div>

          {/* Demo Notice */}
          <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-center dark:border-indigo-900/50 dark:bg-indigo-950/30">
            <p className="text-xs leading-5 text-indigo-700 dark:text-indigo-300">
              Demo template — enter any email and password to continue.
            </p>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Sardar KS UI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
