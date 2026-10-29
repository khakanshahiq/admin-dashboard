import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  DollarSign,
  Download,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useOrders } from "../context/OrderContext";

const currency = (value) =>
  `$${(Number(value) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const money = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const getOrderDate = (order) => {
  const value = order.date ?? order.createdAt ?? order.created_at;
  if (!value) return null;

  // Parse ISO date-only strings in local time to avoid timezone shifts.
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isPaidSale = (order) =>
  String(order.payment ?? "").toLowerCase() === "paid" &&
  String(order.status ?? "").toLowerCase() !== "cancelled";

const getOrderAmount = (order) => {
  if (Number.isFinite(Number(order.amount))) return Number(order.amount);

  return (order.items ?? []).reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  );
};

const getPeriodBounds = (period, now = new Date()) => {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);

  if (period === "This week") {
    const daysSinceMonday = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - daysSinceMonday);
    end.setDate(start.getDate() + 7);
  } else if (period === "This month") {
    start.setDate(1);
    end.setFullYear(start.getFullYear(), start.getMonth() + 1, 1);
  } else {
    start.setMonth(0, 1);
    end.setFullYear(start.getFullYear() + 1, 0, 1);
  }

  return { start, end };
};

const getPreviousBounds = (period, start) => {
  const previousStart = new Date(start);
  const previousEnd = new Date(start);

  if (period === "This week") {
    previousStart.setDate(previousStart.getDate() - 7);
  } else if (period === "This month") {
    previousStart.setMonth(previousStart.getMonth() - 1);
  } else {
    previousStart.setFullYear(previousStart.getFullYear() - 1);
  }

  return { start: previousStart, end: previousEnd };
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const escapeCsvValue = (value) => {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

function SummaryCard({ icon, label, value, change, tone = "indigo" }) {
  const tones = {
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400",
    green: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  };

  const validChange = change !== null && Number.isFinite(change);
  const positive = validChange && change >= 0;

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${tones[tone] ?? tones.indigo}`}>
          {icon}
        </span>
      </div>

      <p className="mt-3 break-words text-xl font-bold tracking-tight text-slate-950 dark:text-white">
        {value}
      </p>

      <p className="mt-2 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
        {validChange ? (
          <>
            {positive ? (
              <ArrowUpRight size={14} className="text-green-600" />
            ) : (
              <ArrowDownRight size={14} className="text-red-600" />
            )}
            <span
              className={
                positive
                  ? "font-semibold text-green-600"
                  : "font-semibold text-red-600"
              }>
              {change > 0 ? "+" : ""}
              {change.toFixed(1)}%
            </span>
            vs. previous period
          </>
        ) : (
          "No previous-period data"
        )}
      </p>
    </div>
  );
}

const Sales = () => {
  const { orders = [] } = useOrders();
  const [period, setPeriod] = useState("This year");
  const [exported, setExported] = useState(false);

  const now = new Date();
  const { start, end } = useMemo(
    () => getPeriodBounds(period, now),
    [period, now.getFullYear(), now.getMonth(), now.getDate()],
  );

  const previousBounds = useMemo(
    () => getPreviousBounds(period, start),
    [period, start],
  );

  const datedOrders = useMemo(
    () =>
      orders.map((order) => ({
        ...order,
        parsedDate: getOrderDate(order),
        amountValue: getOrderAmount(order),
      })),
    [orders],
  );

  const periodOrders = useMemo(
    () =>
      datedOrders.filter(
        (order) =>
          order.parsedDate &&
          order.parsedDate >= start &&
          order.parsedDate < end,
      ),
    [datedOrders, start, end],
  );

  const previousOrders = useMemo(
    () =>
      datedOrders.filter(
        (order) =>
          order.parsedDate &&
          order.parsedDate >= previousBounds.start &&
          order.parsedDate < previousBounds.end,
      ),
    [datedOrders, previousBounds],
  );

  const paidSales = useMemo(
    () => periodOrders.filter(isPaidSale),
    [periodOrders],
  );

  const previousPaidSales = useMemo(
    () => previousOrders.filter(isPaidSale),
    [previousOrders],
  );

  const totalRevenue = useMemo(
    () => money(paidSales.reduce((sum, order) => sum + order.amountValue, 0)),
    [paidSales],
  );

  const totalOrders = paidSales.length;

  const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  const previousRevenue = previousPaidSales.reduce(
    (sum, order) => sum + order.amountValue,
    0,
  );

  const previousAverage =
    previousPaidSales.length > 0
      ? previousRevenue / previousPaidSales.length
      : 0;

  const getChange = (current, previous) => {
    if (previous === 0) return null;
    return ((current - previous) / previous) * 100;
  };

  const revenueChange = getChange(totalRevenue, previousRevenue);
  const ordersChange = getChange(totalOrders, previousPaidSales.length);
  const averageChange = getChange(averageOrderValue, previousAverage);

  const salesData = useMemo(() => {
    let buckets = [];

    if (period === "This week") {
      buckets = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(start);
        date.setDate(date.getDate() + index);
        return {
          key: date.toDateString(),
          label: date.toLocaleDateString("en-US", { weekday: "short" }),
          revenue: 0,
          orders: 0,
        };
      });
    } else if (period === "This month") {
      const days = new Date(
        start.getFullYear(),
        start.getMonth() + 1,
        0,
      ).getDate();

      buckets = Array.from({ length: days }, (_, index) => {
        const date = new Date(start.getFullYear(), start.getMonth(), index + 1);
        return {
          key: date.toDateString(),
          label: String(index + 1),
          revenue: 0,
          orders: 0,
        };
      });
    } else {
      buckets = Array.from({ length: 12 }, (_, index) => ({
        key: String(index),
        label: new Date(start.getFullYear(), index, 1).toLocaleDateString(
          "en-US",
          { month: "short" },
        ),
        revenue: 0,
        orders: 0,
      }));
    }

    const bucketMap = new Map(
      buckets.map((bucket, index) => [bucket.key, index]),
    );

    paidSales.forEach((order) => {
      let key;

      if (period === "This year") {
        key = String(order.parsedDate.getMonth());
      } else {
        key = new Date(
          order.parsedDate.getFullYear(),
          order.parsedDate.getMonth(),
          order.parsedDate.getDate(),
        ).toDateString();
      }

      const index = bucketMap.get(key);
      if (index === undefined) return;

      buckets[index].revenue += order.amountValue;
      buckets[index].orders += 1;
    });

    return buckets.map((bucket) => ({
      ...bucket,
      revenue: money(bucket.revenue),
    }));
  }, [paidSales, period, start]);

  const categoryData = useMemo(() => {
    const totals = new Map();

    paidSales.forEach((order) => {
      const items = Array.isArray(order.items) ? order.items : [];

      if (!items.length) {
        totals.set("Other", (totals.get("Other") ?? 0) + order.amountValue);
        return;
      }

      items.forEach((item) => {
        const category = item.category?.trim() || "Other";
        const lineTotal =
          (Number(item.price) || 0) * (Number(item.quantity) || 0);

        totals.set(category, (totals.get(category) ?? 0) + lineTotal);
      });
    });

    return [...totals.entries()]
      .map(([category, sales]) => ({ category, sales: money(sales) }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 8);
  }, [paidSales]);

  const recentSales = useMemo(
    () =>
      [...paidSales]
        .sort((a, b) => b.parsedDate - a.parsedDate)
        .slice(0, 10)
        .map((order) => {
          const items = Array.isArray(order.items) ? order.items : [];
          const firstItem = items[0];

          return {
            id: String(order.id ?? "—"),
            customer: order.customer ?? "Unknown customer",
            product:
              items.length > 1
                ? `${firstItem?.name ?? firstItem?.product ?? "Product"} + ${items.length - 1} more`
                : (firstItem?.name ?? firstItem?.product ?? "Order"),
            category: firstItem?.category ?? "Other",
            amount: order.amountValue,
            date: order.parsedDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          };
        }),
    [paidSales],
  );

  const chartSubtitle =
    period === "This week"
      ? "Daily revenue performance"
      : period === "This month"
        ? "Daily revenue performance"
        : "Monthly revenue performance";

  const handleExport = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Products",
      "Amount",
      "Payment",
      "Status",
      "Date",
    ];

    const rows = periodOrders.map((order) => {
      const items = Array.isArray(order.items) ? order.items : [];
      const products = items
        .map((item) => item.name ?? item.product ?? "Product")
        .join("; ");

      return [
        order.id,
        order.customer,
        products,
        order.amountValue.toFixed(2),
        order.payment,
        order.status,
        order.parsedDate?.toLocaleDateString("en-US") ?? "",
      ];
    });

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sales-${period.toLowerCase().replace(/\s+/g, "-")}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setExported(true);
    window.setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 dark:bg-slate-950 sm:p-5 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Sales analytics
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Sales
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor revenue, orders, and sales performance.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <label htmlFor="sales-period" className="sr-only">
              Sales period
            </label>
            <select
              id="sales-period"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 sm:w-36">
              <option>This week</option>
              <option>This month</option>
              <option>This year</option>
            </select>
            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:bg-indigo-500">
            <Download size={16} />
            {exported ? "Exported" : "Export CSV"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          icon={<DollarSign size={17} />}
          label="Paid revenue"
          value={currency(totalRevenue)}
          change={revenueChange}
          tone="indigo"
        />
        <SummaryCard
          icon={<ShoppingBag size={17} />}
          label="Paid orders"
          value={totalOrders.toLocaleString("en-US")}
          change={ordersChange}
          tone="green"
        />
        <SummaryCard
          icon={<TrendingUp size={17} />}
          label="Avg. order value"
          value={currency(averageOrderValue)}
          change={averageChange}
          tone="blue"
        />
        <SummaryCard
          icon={<BarChart3 size={17} />}
          label="Unpaid orders"
          value={periodOrders
            .filter(
              (order) =>
                String(order.payment ?? "").toLowerCase() !== "paid" &&
                String(order.status ?? "").toLowerCase() !== "cancelled",
            )
            .length.toLocaleString("en-US")}
          change={null}
          tone="amber"
        />
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <TrendingUp size={16} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
                Revenue overview
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {chartSubtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
            Revenue
          </div>
        </div>

        <div className="h-[320px] w-full p-4 sm:h-[350px] sm:p-5">
          {paidSales.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient
                    id="salesRevenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  tickFormatter={(value) =>
                    `$${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`
                  }
                />
                <Tooltip
                  formatter={(value) => [currency(value), "Revenue"]}
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fill="url(#salesRevenueGradient)"
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              message={`No paid orders found for ${period.toLowerCase()}.`}
            />
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
              Sales by category
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Based on product categories in paid orders
            </p>
          </div>

          <div className="h-[320px] p-4 sm:h-[350px]">
            {categoryData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid
                    horizontal={false}
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickFormatter={(value) =>
                      `$${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="category"
                    axisLine={false}
                    tickLine={false}
                    width={80}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <Tooltip
                    formatter={(value) => [currency(value), "Sales"]}
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="sales"
                    radius={[0, 6, 6, 0]}
                    fill="#4f46e5"
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No category sales available for this period." />
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
                Recent sales
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Latest paid orders in the selected period
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="self-start text-xs font-semibold text-indigo-600 hover:text-indigo-700 sm:self-auto dark:text-indigo-400">
              View all orders
            </Link>
          </div>

          {recentSales.length ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[580px]">
                  <caption className="sr-only">Recent paid sales</caption>
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/40">
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.map((sale) => (
                      <tr
                        key={sale.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-indigo-50/40 dark:border-slate-800 dark:hover:bg-indigo-950/20">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                              {getInitials(sale.customer)}
                            </span>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {sale.customer}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-400">
                                {sale.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {sale.product}
                          </p>
                          <span className="mt-1 inline-flex rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                            {sale.category}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm font-bold text-slate-900 dark:text-white">
                          {currency(sale.amount)}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {sale.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                          {getInitials(sale.customer)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {sale.customer}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {sale.id}
                          </p>
                        </div>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-slate-900 dark:text-white">
                        {currency(sale.amount)}
                      </p>
                    </div>
                    <div className="mt-3 pl-12">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {sale.product}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {sale.category} · {sale.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              message={`No paid orders found for ${period.toLowerCase()}.`}
            />
          )}

          <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {recentSales.length} of {paidSales.length} paid orders for{" "}
              {period.toLowerCase()}.
            </p>
          </div>
        </section>
      </div>

      <p className="sr-only" aria-live="polite">
        {exported
          ? "Sales data exported successfully."
          : `Sales period selected: ${period}.`}
      </p>
    </div>
  );
};

function EmptyState({ message }) {
  return (
    <div className="flex h-full min-h-40 flex-col items-center justify-center px-5 text-center">
      <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <ShoppingBag size={20} />
      </span>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {message}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Sales will appear here when matching paid orders exist.
      </p>
    </div>
  );
}

export default Sales;
