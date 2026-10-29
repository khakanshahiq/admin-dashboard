import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Download,
  FileText,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useOrders } from "../context/OrderContext";

const PERIODS = ["This week", "This month", "This year"];

const getOrderDate = (order) => {
  const value =
    order.date ??
    order.createdAt ??
    order.created_at ??
    order.orderDate ??
    order.order_date;

  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getItems = (order) => {
  if (Array.isArray(order.items)) return order.items;
  if (Array.isArray(order.products)) return order.products;
  return [];
};

const getQuantity = (item) => {
  const quantity = Number(item.quantity ?? item.qty ?? 1);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
};

const getItemPrice = (item) => {
  const price = Number(
    item.price ?? item.unitPrice ?? item.unit_price ?? item.salePrice ?? 0,
  );
  return Number.isFinite(price) && price > 0 ? price : 0;
};

const getOrderAmount = (order) => {
  const amountValue =
    order.totalAmount ??
    order.total_amount ??
    order.total ??
    order.amount ??
    order.grandTotal ??
    order.grand_total;

  if (
    amountValue !== undefined &&
    amountValue !== null &&
    String(amountValue).trim() !== ""
  ) {
    const amount = Number(amountValue);
    if (Number.isFinite(amount)) return Math.max(0, amount);
  }

  return getItems(order).reduce(
    (sum, item) => sum + getItemPrice(item) * getQuantity(item),
    0,
  );
};

const getOrderStatus = (order) =>
  String(order.status ?? order.orderStatus ?? order.order_status ?? "")
    .trim()
    .toLowerCase();

const getPaymentStatus = (order) =>
  String(
    order.paymentStatus ??
      order.payment_status ??
      order.payment?.status ??
      order.payment ??
      "",
  )
    .trim()
    .toLowerCase();

const isCancelled = (order) => {
  const status = getOrderStatus(order);
  return (
    status === "cancelled" ||
    status === "canceled" ||
    status.includes("cancelled") ||
    status.includes("canceled")
  );
};

const isRevenueOrder = (order) => {
  if (isCancelled(order)) return false;

  const payment = getPaymentStatus(order);

  // When payment information exists, count only confirmed payments.
  if (payment) {
    return ["paid", "completed", "succeeded", "success"].includes(payment);
  }

  // If the project doesn't track payment separately, use non-cancelled orders.
  return true;
};

const getCustomerName = (order) => {
  const customer = order.customer;

  if (typeof customer === "string" && customer.trim()) {
    return customer;
  }

  return (
    customer?.name ??
    order.customerName ??
    order.customer_name ??
    order.user?.name ??
    order.name ??
    order.email ??
    order.customerEmail ??
    order.customer_email ??
    "Guest"
  );
};

const getCustomerKey = (order) =>
  String(
    order.customerId ??
      order.customer_id ??
      order.userId ??
      order.user_id ??
      order.customer?.id ??
      order.email ??
      order.customerEmail ??
      order.customer_email ??
      getCustomerName(order),
  )
    .trim()
    .toLowerCase();

const getProductName = (item) =>
  item.name ??
  item.productName ??
  item.product_name ??
  item.title ??
  item.product?.name ??
  "Unnamed product";

const getCategoryName = (item) =>
  item.category?.name ??
  item.categoryName ??
  item.category_name ??
  item.category ??
  item.product?.category?.name ??
  item.product?.category ??
  "Uncategorized";

const getPeriodBounds = (period) => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (period === "This week") {
    const day = (now.getDay() + 6) % 7;
    start.setDate(now.getDate() - day);
  } else if (period === "This month") {
    start.setDate(1);
  } else {
    start.setMonth(0, 1);
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const isWithinBounds = (date, bounds) =>
  date && date >= bounds.start && date <= bounds.end;

const getPreviousBounds = (period, currentBounds) => {
  const start = new Date(currentBounds.start);
  const end = new Date(currentBounds.start.getTime() - 1);

  if (period === "This week") {
    start.setDate(start.getDate() - 7);
  } else if (period === "This month") {
    start.setMonth(start.getMonth() - 1);
  } else {
    start.setFullYear(start.getFullYear() - 1);
  }

  start.setHours(0, 0, 0, 0);
  return { start, end };
};

const getBuckets = (period, bounds) => {
  const buckets = [];

  if (period === "This week") {
    for (let i = 0; i < 7; i += 1) {
      const date = new Date(bounds.start);
      date.setDate(date.getDate() + i);

      buckets.push({
        key: date.toDateString(),
        month: date.toLocaleDateString("en-US", { weekday: "short" }),
        revenue: 0,
        orders: 0,
        customers: new Set(),
      });
    }
  } else if (period === "This month") {
    const cursor = new Date(bounds.start);
    let week = 1;

    while (cursor <= bounds.end) {
      const bucketStart = new Date(cursor);
      const bucketEnd = new Date(cursor);
      bucketEnd.setDate(bucketEnd.getDate() + 6);
      bucketEnd.setHours(23, 59, 59, 999);

      buckets.push({
        key: `week-${week}`,
        month: `Week ${week}`,
        start: bucketStart,
        end: bucketEnd,
        revenue: 0,
        orders: 0,
        customers: new Set(),
      });

      cursor.setDate(cursor.getDate() + 7);
      week += 1;
    }
  } else {
    for (let month = 0; month < 12; month += 1) {
      const date = new Date(bounds.start.getFullYear(), month, 1);

      buckets.push({
        key: date.toISOString().slice(0, 7),
        month: date.toLocaleDateString("en-US", { month: "short" }),
        start: new Date(date.getFullYear(), date.getMonth(), 1),
        end: new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        ),
        revenue: 0,
        orders: 0,
        customers: new Set(),
      });
    }
  }

  return buckets;
};

const formatMoney = (amount) =>
  `$${Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatCompactMoney = (amount) => {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}k`;
  return `$${Math.round(amount)}`;
};

const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

export default function Reports() {
  const [period, setPeriod] = useState("This year");
  const { orders: contextOrders = [] } = useOrders();

  const orders = Array.isArray(contextOrders) ? contextOrders : [];

  const bounds = useMemo(() => getPeriodBounds(period), [period]);

  const previousBounds = useMemo(
    () => getPreviousBounds(period, bounds),
    [period, bounds],
  );

  const periodOrders = useMemo(
    () => orders.filter((order) => isWithinBounds(getOrderDate(order), bounds)),
    [orders, bounds],
  );

  const previousOrders = useMemo(
    () =>
      orders.filter((order) =>
        isWithinBounds(getOrderDate(order), previousBounds),
      ),
    [orders, previousBounds],
  );

  const revenueOrders = useMemo(
    () => periodOrders.filter(isRevenueOrder),
    [periodOrders],
  );

  const previousRevenueOrders = useMemo(
    () => previousOrders.filter(isRevenueOrder),
    [previousOrders],
  );

  const totalRevenue = useMemo(
    () => revenueOrders.reduce((sum, order) => sum + getOrderAmount(order), 0),
    [revenueOrders],
  );

  const previousRevenue = useMemo(
    () =>
      previousRevenueOrders.reduce(
        (sum, order) => sum + getOrderAmount(order),
        0,
      ),
    [previousRevenueOrders],
  );

  const totalOrders = periodOrders.length;

  const totalCustomers = useMemo(
    () => new Set(periodOrders.map(getCustomerKey)).size,
    [periodOrders],
  );

  const averageOrderValue =
    revenueOrders.length > 0 ? totalRevenue / revenueOrders.length : 0;

  const previousAverage =
    previousRevenueOrders.length > 0
      ? previousRevenue / previousRevenueOrders.length
      : 0;

  const getChange = (current, previous) => {
    if (previous === 0) return current > 0 ? null : 0;
    return ((current - previous) / previous) * 100;
  };

  const revenueChange = getChange(totalRevenue, previousRevenue);
  const orderChange = getChange(totalOrders, previousOrders.length);
  const customerChange = getChange(
    totalCustomers,
    new Set(previousOrders.map(getCustomerKey)).size,
  );
  const averageChange = getChange(averageOrderValue, previousAverage);

  const performanceData = useMemo(() => {
    const buckets = getBuckets(period, bounds);

    periodOrders.forEach((order) => {
      const date = getOrderDate(order);
      if (!date) return;

      let bucket;

      if (period === "This week") {
        bucket = buckets.find((item) => item.key === date.toDateString());
      } else {
        bucket = buckets.find((item) => date >= item.start && date <= item.end);
      }

      if (!bucket) return;

      bucket.orders += 1;

      if (isRevenueOrder(order)) {
        bucket.revenue += getOrderAmount(order);
      }

      bucket.customers.add(getCustomerKey(order));
    });

    return buckets.map((bucket) => ({
      month: bucket.month,
      revenue: Number(bucket.revenue.toFixed(2)),
      orders: bucket.orders,
      customers: bucket.customers.size,
    }));
  }, [period, bounds, periodOrders]);

  const categoryPerformance = useMemo(() => {
    const categories = new Map();

    revenueOrders.forEach((order) => {
      getItems(order).forEach((item) => {
        const category = String(getCategoryName(item));
        const existing = categories.get(category) ?? {
          category,
          revenue: 0,
          units: 0,
          orders: 0,
          orderIds: new Set(),
        };

        existing.revenue += getItemPrice(item) * getQuantity(item);
        existing.units += getQuantity(item);
        existing.orderIds.add(
          String(order.id ?? order.orderNumber ?? order.order_number ?? ""),
        );
        categories.set(category, existing);
      });
    });

    return [...categories.values()]
      .map(({ orderIds, ...category }) => ({
        ...category,
        orders: orderIds.size,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [revenueOrders]);

  const productPerformance = useMemo(() => {
    const products = new Map();

    revenueOrders.forEach((order) => {
      getItems(order).forEach((item) => {
        const name = String(getProductName(item));
        const category = String(getCategoryName(item));
        const key = String(
          item.productId ?? item.product_id ?? item.id ?? name,
        );

        const existing = products.get(key) ?? {
          product: name,
          category,
          units: 0,
          revenue: 0,
        };

        existing.units += getQuantity(item);
        existing.revenue += getItemPrice(item) * getQuantity(item);
        products.set(key, existing);
      });
    });

    return [...products.values()]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [revenueOrders]);

  const maxCategoryRevenue = Math.max(
    1,
    ...categoryPerformance.map((item) => item.revenue),
  );

  const chartDescription = {
    "This week": "Daily business performance for this week",
    "This month": "Weekly business performance for this month",
    "This year": "Monthly business performance for this year",
  };

  const handleExport = () => {
    const rows = [
      ["Business Analytics Report"],
      ["Period", period],
      ["Generated", new Date().toLocaleString()],
      [],
      ["Summary"],
      ["Total revenue", totalRevenue.toFixed(2)],
      ["Total orders", totalOrders],
      ["Customers", totalCustomers],
      ["Average order value", averageOrderValue.toFixed(2)],
      [],
      ["Performance"],
      ["Period", "Revenue", "Orders", "Customers"],
      ...performanceData.map((item) => [
        item.month,
        item.revenue.toFixed(2),
        item.orders,
        item.customers,
      ]),
      [],
      ["Category performance"],
      ["Category", "Revenue", "Units sold", "Orders"],
      ...categoryPerformance.map((item) => [
        item.category,
        item.revenue.toFixed(2),
        item.units,
        item.orders,
      ]),
      [],
      ["Product performance"],
      ["Product", "Category", "Units sold", "Revenue"],
      ...productPerformance.map((item) => [
        item.product,
        item.category,
        item.units,
        item.revenue.toFixed(2),
      ]),
      [],
      ["Orders in selected period"],
      ["Order ID", "Date", "Customer", "Status", "Amount"],
      ...periodOrders.map((order) => [
        order.orderNumber ?? order.order_number ?? order.id ?? "",
        getOrderDate(order)?.toLocaleDateString() ?? "",
        getCustomerName(order),
        order.status ?? "",
        getOrderAmount(order).toFixed(2),
      ]),
    ];

    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `business-report-${period
      .toLowerCase()
      .replaceAll(" ", "-")}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Business Analytics
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
            Reports
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Analyze your actual order data and export business reports.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-500 dark:focus:ring-indigo-950 sm:w-36">
              {PERIODS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:bg-indigo-500 dark:hover:bg-indigo-600">
            <Download size={16} />
            Export report
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 dark:border-indigo-950 dark:bg-indigo-950/30">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
            Showing report for <span className="font-bold">{period}</span>
          </p>
          <p className="text-xs text-indigo-600 dark:text-indigo-400">
            {periodOrders.length} orders found in this period
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          icon={<BarChart3 size={17} />}
          label="Total revenue"
          value={formatMoney(totalRevenue)}
          change={revenueChange}
          tone="indigo"
        />
        <SummaryCard
          icon={<ShoppingCart size={17} />}
          label="Total orders"
          value={totalOrders.toLocaleString()}
          change={orderChange}
          tone="green"
        />
        <SummaryCard
          icon={<Users size={17} />}
          label="Customers"
          value={totalCustomers.toLocaleString()}
          change={customerChange}
          tone="blue"
        />
        <SummaryCard
          icon={<FileText size={17} />}
          label="Avg. order"
          value={formatMoney(averageOrderValue)}
          change={averageChange}
          tone="amber"
        />
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <BarChart3 size={16} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-gray-950 dark:text-white">
                Performance overview
              </h2>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {chartDescription[period]}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <LegendItem label="Revenue" tone="indigo" />
            <LegendItem label="Orders" tone="blue" />
            <LegendItem label="Customers" tone="amber" />
          </div>
        </div>

        <div className="h-[340px] w-full p-4 sm:h-[360px] sm:p-5">
          {periodOrders.length === 0 ? (
            <EmptyState message="No orders were found for this period. Try another period or add an order with a valid date." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <YAxis
                  yAxisId="revenue"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  tickFormatter={formatCompactMoney}
                />
                <YAxis yAxisId="count" orientation="right" hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff",
                    fontSize: "12px",
                  }}
                  formatter={(value, name) => {
                    if (name === "revenue") {
                      return [formatMoney(value), "Revenue"];
                    }
                    return [value, name === "orders" ? "Orders" : "Customers"];
                  }}
                />
                <Line
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  name="revenue"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
                <Line
                  yAxisId="count"
                  type="monotone"
                  dataKey="orders"
                  name="orders"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="5 5"
                />
                <Line
                  yAxisId="count"
                  type="monotone"
                  dataKey="customers"
                  name="customers"
                  stroke="#d97706"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="2 4"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <SectionHeader
          icon={<Package size={16} />}
          title="Category performance"
          description={`Revenue and units by category for ${period.toLowerCase()}`}
        />

        {categoryPerformance.length === 0 ? (
          <EmptyState message="No product category data is available for this period." />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/70 dark:border-gray-800 dark:bg-gray-950/40">
                    {["Category", "Revenue", "Units sold", "Performance"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {categoryPerformance.map((category) => {
                    const percentage = Math.round(
                      (category.revenue / maxCategoryRevenue) * 100,
                    );
                    return (
                      <tr
                        key={category.category}
                        className="border-b border-gray-100 transition last:border-b-0 hover:bg-indigo-50/40 dark:border-gray-800 dark:hover:bg-indigo-950/20">
                        <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {category.category}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                          {formatMoney(category.revenue)}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {category.units}
                        </td>
                        <td className="px-5 py-4">
                          <PerformanceBar percentage={percentage} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
              {categoryPerformance.map((category) => {
                const percentage = Math.round(
                  (category.revenue / maxCategoryRevenue) * 100,
                );
                return (
                  <div key={category.category} className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {category.category}
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatMoney(category.revenue)}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{category.units} units sold</span>
                      <span>{percentage}% of top category revenue</span>
                    </div>
                    <div className="mt-2">
                      <PerformanceBar percentage={percentage} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <div className="border-t border-gray-200 px-4 py-4 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          {categoryPerformance.length} categories found
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <SectionHeader
          icon={<Package size={16} />}
          title="Product performance"
          description={`Top products by revenue for ${period.toLowerCase()}`}
        />

        {productPerformance.length === 0 ? (
          <EmptyState message="No product sales are available for this period." />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/70 dark:border-gray-800 dark:bg-gray-950/40">
                    {["Product", "Category", "Units sold", "Revenue"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {productPerformance.map((product) => (
                    <tr
                      key={`${product.product}-${product.category}`}
                      className="border-b border-gray-100 transition last:border-b-0 hover:bg-indigo-50/40 dark:border-gray-800 dark:hover:bg-indigo-950/20">
                      <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {product.product}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {product.units}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                        {formatMoney(product.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
              {productPerformance.map((product) => (
                <div
                  key={`${product.product}-${product.category}`}
                  className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {product.product}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {product.category}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-gray-900 dark:text-white">
                      {formatMoney(product.revenue)}
                    </p>
                  </div>
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    {product.units} units sold
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="border-t border-gray-200 px-4 py-4 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          Showing {productPerformance.length} top products
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ icon, label, value, change, tone = "indigo" }) {
  const tones = {
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400",
    green: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  };

  const positive = change === null || change >= 0;
  const changeText =
    change === null ? "New" : `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div
        className={`absolute inset-x-0 top-0 h-0.5 ${
          tone === "green"
            ? "bg-green-600"
            : tone === "blue"
              ? "bg-blue-600"
              : tone === "amber"
                ? "bg-amber-500"
                : "bg-indigo-600"
        }`}
      />
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${tones[tone]}`}>
          {icon}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
        <p className="break-all text-lg font-bold tracking-tight text-gray-950 dark:text-white sm:text-xl">
          {value}
        </p>
        <span
          title="Compared with the previous equivalent period"
          className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-1 text-[10px] font-bold ${
            positive
              ? "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
              : "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
          }`}>
          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {changeText}
        </span>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, description }) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-200 p-4 dark:border-gray-800">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
        {icon}
      </span>
      <div>
        <h2 className="text-sm font-semibold text-gray-950 dark:text-white">
          {title}
        </h2>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function PerformanceBar({ percentage }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className="h-full rounded-full bg-indigo-600 dark:bg-indigo-400"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
        {percentage}%
      </span>
    </div>
  );
}

function LegendItem({ label, tone }) {
  const tones = {
    indigo: "bg-indigo-600 dark:bg-indigo-400",
    blue: "bg-blue-600 dark:bg-blue-400",
    amber: "bg-amber-500 dark:bg-amber-400",
  };

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${tones[tone]}`} />
      {label}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex h-full min-h-40 flex-col items-center justify-center px-5 py-10 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        <BarChart3 size={20} />
      </span>
      <p className="mt-3 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        {message}
      </p>
    </div>
  );
}
