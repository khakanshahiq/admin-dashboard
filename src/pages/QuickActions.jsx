import { Link } from "react-router-dom";
import {
  UserPlus,
  PackagePlus,
  ShoppingCart,
  Settings,
  ArrowUpRight,
} from "lucide-react";

const actions = [
  {
    id: 1,
    title: "Add User",
    description: "Create a new user account",
    path: "/admin/add/user",
    icon: UserPlus,
    color:
      "bg-blue-50 text-blue-600 group-hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:group-hover:bg-blue-950/70",
  },
  {
    id: 2,
    title: "Add Product",
    description: "Add a new product",
    path: "/admin/add/product",
    icon: PackagePlus,
    color:
      "bg-violet-50 text-violet-600 group-hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-400 dark:group-hover:bg-violet-950/70",
  },
  {
    id: 3,
    title: "Manage Orders",
    description: "View and manage orders",
    path: "/admin/orders",
    icon: ShoppingCart,
    color:
      "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:group-hover:bg-emerald-950/70",
  },
  {
    id: 4,
    title: "Settings",
    description: "Manage store settings",
    path: "/admin/settings",
    icon: Settings,
    color:
      "bg-amber-50 text-amber-600 group-hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:group-hover:bg-amber-950/70",
  },
];

const QuickActions = () => {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.02] transition-shadow duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10">
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-indigo-600 dark:bg-indigo-400"
            aria-hidden="true"
          />

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Quick Actions
          </h2>
        </div>

        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Common actions to manage your store.
        </p>
      </div>

      <div className="p-4">
        <div className="space-y-2.5">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.id}
                to={action.path}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:focus-visible:ring-offset-slate-900">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${action.color}`}>
                  <Icon size={18} strokeWidth={2} aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {action.title}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                    {action.description}
                  </p>
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors duration-200 group-hover:bg-slate-100 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:bg-slate-800 dark:group-hover:text-white">
                  <ArrowUpRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
