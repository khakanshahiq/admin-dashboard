import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = useMemo(() => {
    const password = formData.password;

    if (!password) {
      return {
        label: "Enter a password",
        width: "0%",
        level: 0,
      };
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) {
      return {
        label: "Weak",
        width: "25%",
        level: 1,
      };
    }

    if (score === 2) {
      return {
        label: "Fair",
        width: "50%",
        level: 2,
      };
    }

    if (score === 3) {
      return {
        label: "Good",
        width: "75%",
        level: 3,
      };
    }

    return {
      label: "Strong",
      width: "100%",
      level: 4,
    };
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter.";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number.";
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      newErrors.password =
        "Password must contain at least one special character.";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    // Demo password reset
    window.setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 800);
  };

  const requirementClass = (isValid) =>
    isValid
      ? "text-green-600 dark:text-green-400"
      : "text-gray-500 dark:text-gray-400";

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const disabled = isLoading;

  if (success) {
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
                Your account is secure.
              </p>
            </div>

            {/* Success Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50 dark:bg-green-900/30 dark:ring-green-950/30">
                  <CheckCircle2
                    size={34}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
              </div>

              <div className="text-center">
                <div className="mb-3 flex items-center justify-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400" />

                  <span className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
                    Password Updated
                  </span>
                </div>

                <h1 className="text-xl font-bold text-gray-950 dark:text-white sm:text-2xl">
                  Password reset successful
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Your password has been updated successfully. You can now sign
                  in with your new password.
                </p>
              </div>

              {/* Demo Notice */}
              <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-center dark:border-indigo-900/50 dark:bg-indigo-950/30">
                <p className="text-xs leading-5 text-indigo-700 dark:text-indigo-300">
                  Demo template — password changes are simulated for preview
                  purposes.
                </p>
              </div>

              {/* Login Button */}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-offset-gray-900">
                <ShieldCheck size={17} />
                Continue to sign in
              </button>
            </div>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
              © {new Date().getFullYear()} Sardar KS UI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              Create a new secure password.
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

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50">
                <ShieldCheck
                  size={22}
                  className="text-indigo-600 dark:text-indigo-400"
                />
              </div>

              <h1 className="text-xl font-bold text-gray-950 dark:text-white sm:text-2xl">
                Reset your password
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Create a new password for your account. Make sure it is strong
                and easy for you to remember.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    disabled={disabled}
                    aria-invalid={Boolean(errors.password)}
                    className={`h-11 w-full rounded-lg border bg-white pl-10 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-gray-950 dark:text-white dark:hover:border-gray-600 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-red-800 dark:focus:ring-red-950"
                        : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={disabled}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-indigo-400 dark:focus:ring-indigo-900"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password && (
                  <p
                    role="alert"
                    className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                    {errors.password}
                  </p>
                )}

                {/* Password Strength */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Password strength
                      </span>

                      <span
                        className={`text-xs font-semibold ${
                          passwordStrength.level <= 1
                            ? "text-red-500"
                            : passwordStrength.level === 2
                              ? "text-amber-600 dark:text-amber-400"
                              : passwordStrength.level === 3
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-green-600 dark:text-green-400"
                        }`}>
                        {passwordStrength.label}
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          passwordStrength.level <= 1
                            ? "bg-red-500"
                            : passwordStrength.level === 2
                              ? "bg-amber-500"
                              : passwordStrength.level === 3
                                ? "bg-blue-500"
                                : "bg-green-500"
                        }`}
                        style={{
                          width: passwordStrength.width,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    disabled={disabled}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    className={`h-11 w-full rounded-lg border bg-white pl-10 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-gray-950 dark:text-white dark:hover:border-gray-600 ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-red-800 dark:focus:ring-red-950"
                        : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    disabled={disabled}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-indigo-400 dark:focus:ring-indigo-900"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }>
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword ? (
                  <p
                    role="alert"
                    className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                    {errors.confirmPassword}
                  </p>
                ) : passwordsMatch ? (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                    <CheckCircle2 size={13} />
                    Passwords match.
                  </p>
                ) : null}
              </div>

              {/* Requirements */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck
                    size={16}
                    className="text-indigo-600 dark:text-indigo-400"
                  />

                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Password requirements
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <p
                    className={`text-xs transition ${requirementClass(
                      formData.password.length >= 8,
                    )}`}>
                    • At least 8 characters
                  </p>

                  <p
                    className={`text-xs transition ${requirementClass(
                      /[A-Z]/.test(formData.password),
                    )}`}>
                    • One uppercase letter
                  </p>

                  <p
                    className={`text-xs transition ${requirementClass(
                      /[0-9]/.test(formData.password),
                    )}`}>
                    • One number
                  </p>

                  <p
                    className={`text-xs transition ${requirementClass(
                      /[^A-Za-z0-9]/.test(formData.password),
                    )}`}>
                    • One special character
                  </p>
                </div>
              </div>

              {/* Demo Notice */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 dark:border-indigo-900/50 dark:bg-indigo-950/30">
                <p className="text-xs leading-5 text-indigo-700 dark:text-indigo-300">
                  <span className="font-semibold">Demo mode:</span> This page is
                  frontend-only. A real application would send the new password
                  to a backend API.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={disabled}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-offset-gray-900">
                {isLoading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={17} />
                    Reset password
                  </>
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center rounded-lg px-2 py-1 text-sm font-medium text-gray-600 transition hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:text-gray-400 dark:hover:text-indigo-400 dark:focus:ring-indigo-900">
                ← Back to sign in
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Sardar KS UI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
