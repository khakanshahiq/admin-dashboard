import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2, Mail, ShieldCheck } from "lucide-react";

export default function VerifyEmail() {
  const navigate = useNavigate();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = window.setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);

    setCode(newCode);
    setErrors("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (isLoading) return;

    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    if (isLoading) return;

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newCode = ["", "", "", "", "", ""];

    pastedData.split("").forEach((digit, index) => {
      newCode[index] = digit;
    });

    setCode(newCode);
    setErrors("");

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const verificationCode = code.join("");

    setErrors("");

    if (verificationCode.length !== 6) {
      setErrors("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsLoading(true);

    // Demo email verification
    window.setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 800);
  };

  const handleResend = () => {
    if (!canResend || isLoading) return;

    setCode(["", "", "", "", "", ""]);
    setErrors("");
    setCountdown(30);
    setCanResend(false);

    window.setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 0);
  };

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
                Your account is ready to use.
              </p>
            </div>

            {/* Success Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
              {/* Success Icon */}
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50 dark:bg-green-900/30 dark:ring-green-950/30">
                  <CheckCircle2
                    size={34}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
              </div>

              {/* Success Header */}
              <div className="text-center">
                <div className="mb-3 flex items-center justify-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400" />

                  <span className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
                    Email Verified
                  </span>
                </div>

                <h1 className="text-xl font-bold text-gray-950 dark:text-white sm:text-2xl">
                  Email verified
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Your email address has been verified successfully. Your
                  account is now ready to use.
                </p>
              </div>

              {/* Demo Notice */}
              <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-center dark:border-indigo-900/50 dark:bg-indigo-950/30">
                <p className="text-xs leading-5 text-indigo-700 dark:text-indigo-300">
                  Demo template — email verification is simulated for preview
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
              Confirm your email address to continue.
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
                Verify your email
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                We've sent a 6-digit verification code to your email address.
                Enter the code below to verify your account.
              </p>
            </div>

            {/* Email Preview */}
            <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 dark:border-indigo-900/50 dark:bg-indigo-950/30">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-gray-900">
                <Mail
                  size={17}
                  className="text-indigo-600 dark:text-indigo-400"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Verification email
                </p>

                <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
                  your-email@example.com
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-7">
              {/* Code Inputs */}
              <div>
                <label
                  htmlFor="verification-code"
                  className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Verification code
                </label>

                <div
                  id="verification-code"
                  className="flex justify-between gap-2 sm:gap-3"
                  onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        inputRefs.current[index] = element;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      value={digit}
                      disabled={disabled}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      aria-label={`Verification digit ${index + 1}`}
                      aria-invalid={Boolean(errors)}
                      className={`h-12 w-full rounded-lg border bg-white text-center text-lg font-semibold text-gray-950 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-gray-950 dark:text-white dark:hover:border-gray-600 ${
                        errors
                          ? "border-red-300 focus:border-red-500 focus:ring-red-100 dark:border-red-800 dark:focus:ring-red-950"
                          : "border-gray-200 focus:border-indigo-400 focus:ring-indigo-100 dark:border-gray-700 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
                      }`}
                    />
                  ))}
                </div>

                {errors && (
                  <p
                    role="alert"
                    className="mt-2 text-xs text-red-500 dark:text-red-400">
                    {errors}
                  </p>
                )}
              </div>

              {/* Resend */}
              <div className="mt-5 text-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Didn't receive the code?{" "}
                </span>

                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={disabled}
                    className="rounded-md px-1 font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:focus:ring-indigo-900">
                    Resend code
                  </button>
                ) : (
                  <span className="font-medium text-gray-400 dark:text-gray-500">
                    Resend in {countdown}s
                  </span>
                )}
              </div>

              {/* Demo Notice */}
              <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 dark:border-indigo-900/50 dark:bg-indigo-950/30">
                <p className="text-xs leading-5 text-indigo-700 dark:text-indigo-300">
                  <span className="font-semibold">Demo mode:</span> Any 6-digit
                  code will be accepted. A real application would verify the
                  code through a backend API.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={disabled}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-offset-gray-900">
                {isLoading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Verifying email...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={17} />
                    Verify email
                  </>
                )}
              </button>
            </form>

            {/* Back */}
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
