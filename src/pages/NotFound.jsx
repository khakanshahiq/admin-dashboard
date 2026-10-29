import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Search, AlertCircle } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12 transition-colors">
      <div className="w-full max-w-2xl text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <AlertCircle
                size={42}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>

            <span className="absolute -top-2 -right-2 flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-30" />
              <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-600 dark:bg-blue-500" />
            </span>
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-8xl sm:text-9xl font-black tracking-tight text-gray-900 dark:text-white">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Page not found
        </h2>

        {/* Description */}
        <p className="mt-4 max-w-md mx-auto text-gray-500 dark:text-gray-400 leading-7">
          Sorry, the page you're looking for doesn't exist or may have been
          moved to another location.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Dashboard */}
          <Link
            to="/admin"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200">
            <Home size={18} />
            Back to Dashboard
          </Link>

          {/* Go Back */}
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Search suggestion */}
        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Search size={16} />
            <span>Try returning to the dashboard and continue from there.</span>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-gray-400 dark:text-gray-600">
          Error Code: 404
        </p>
      </div>
    </div>
  );
}
