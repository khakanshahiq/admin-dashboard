import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Truck,
  CheckCircle2,
  CreditCard,
  XCircle,
} from "lucide-react";

const Card = ({ stat }) => {
  const isNegative = stat.avg?.startsWith("↓");
  const isPositive = stat.avg?.startsWith("↑");
  const isTrend = isNegative || isPositive;

  const cardStyles = {
    "Total Users": {
      icon: Users,
      color:
        "bg-blue-50 text-blue-600 group-hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:group-hover:bg-blue-950/70",
    },
    "Demo Users": {
      icon: Users,
      color:
        "bg-blue-50 text-blue-600 group-hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:group-hover:bg-blue-950/70",
    },
    Products: {
      icon: Package,
      color:
        "bg-violet-50 text-violet-600 group-hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-400 dark:group-hover:bg-violet-950/70",
    },
    Orders: {
      icon: ShoppingCart,
      color:
        "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:group-hover:bg-indigo-950/70",
    },
    "Processing Orders": {
      icon: Clock,
      color:
        "bg-amber-50 text-amber-600 group-hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:group-hover:bg-amber-950/70",
    },
    "Shipped Orders": {
      icon: Truck,
      color:
        "bg-sky-50 text-sky-600 group-hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-400 dark:group-hover:bg-sky-950/70",
    },
    "Delivered Orders": {
      icon: CheckCircle2,
      color:
        "bg-green-50 text-green-600 group-hover:bg-green-100 dark:bg-green-950/40 dark:text-green-400 dark:group-hover:bg-green-950/70",
    },
    Revenue: {
      icon: DollarSign,
      color:
        "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:group-hover:bg-emerald-950/70",
    },
    "Pending Payments": {
      icon: CreditCard,
      color:
        "bg-orange-50 text-orange-600 group-hover:bg-orange-100 dark:bg-orange-950/40 dark:text-orange-400 dark:group-hover:bg-orange-950/70",
    },
    "Cancelled Orders": {
      icon: XCircle,
      color:
        "bg-red-50 text-red-600 group-hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:group-hover:bg-red-950/70",
    },
  };

  const style = cardStyles[stat.title] || {
    icon: Package,
    color:
      "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:group-hover:bg-indigo-950/70",
  };

  const Icon = style.icon;
  const description = stat.avg?.replace(/^[↑↓]\s*/, "").trim();

  return (
    <article className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.02] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10 dark:hover:border-slate-700 dark:hover:shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {stat.title}
          </p>

          <p className="mt-3 truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {stat.count}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${style.color}`}>
          <Icon size={19} strokeWidth={2} aria-hidden="true" />
        </div>
      </div>

      <div className="mt-4 min-h-8">
        {isTrend ? (
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${
                isNegative
                  ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                  : "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400"
              }`}>
              {isNegative ? (
                <TrendingDown size={14} aria-hidden="true" />
              ) : (
                <TrendingUp size={14} aria-hidden="true" />
              )}

              <span>{description}</span>
            </div>

            <span className="text-xs text-slate-400 dark:text-slate-500">
              vs last month
            </span>
          </div>
        ) : (
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description || "No additional information"}
          </p>
        )}
      </div>
    </article>
  );
};

export default Card;
