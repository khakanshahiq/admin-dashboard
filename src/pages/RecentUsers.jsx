import { ArrowRight, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecentUsers = ({ users = [] }) => {
  const navigate = useNavigate();

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400";

      case "inactive":
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";

      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const handleViewAll = () => {
    navigate("/admin/users");
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.02] transition-shadow duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-indigo-600 dark:bg-indigo-400"
              aria-hidden="true"
            />

            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Users
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sample users and account statuses.
          </p>
        </div>

        {/* View All */}

        <button
          type="button"
          onClick={handleViewAll}
          className="group inline-flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-indigo-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300 dark:focus:ring-offset-slate-900"
          aria-label="View all users">
          <span>View all</span>

          <ArrowRight
            size={15}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </button>
      </div>

      {/* ==========================================
          USERS
      ========================================== */}

      <div>
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="group flex flex-col gap-4 border-b border-slate-100 px-5 py-4 transition-colors last:border-b-0 hover:bg-indigo-50/40 dark:border-slate-800 dark:hover:bg-indigo-950/20 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              {/* User Info */}

              <div className="flex min-w-0 items-center gap-3">
                {/* Avatar */}

                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600 transition-colors group-hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:group-hover:bg-indigo-950"
                  aria-hidden="true">
                  {user.name?.trim()?.charAt(0)?.toUpperCase() || "?"}
                </div>

                {/* Name + Email */}

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {user.name || "Unknown user"}
                  </h3>

                  <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
                    {user.email || "No email available"}
                  </p>
                </div>
              </div>

              {/* Role + Status */}

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {user.role || "User"}
                </span>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                    user.status,
                  )}`}>
                  {user.status || "Unknown"}
                </span>
              </div>
            </div>
          ))
        ) : (
          /* ==========================================
              EMPTY STATE
          ========================================== */

          <div className="px-5 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/40">
              <UserRound
                size={22}
                aria-hidden="true"
                className="text-indigo-500 dark:text-indigo-400"
              />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
              No users found
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              There are no recent users to display.
            </p>

            <button
              type="button"
              onClick={handleViewAll}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-indigo-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300 dark:focus:ring-offset-slate-900">
              Browse users
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentUsers;
