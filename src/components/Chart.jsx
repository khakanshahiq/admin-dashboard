import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useOrders } from "../context/OrderContext";

const periods = ["Weekly", "Monthly", "Yearly"];

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const getOrderStatus = (order) =>
  normalize(order.status ?? order.orderStatus ?? order.order_status);

const getPaymentStatus = (order) =>
  normalize(
    order.paymentStatus ??
      order.payment_status ??
      order.payment ??
      order.paymentMethodStatus,
  );

const getOrderDate = (order) => {
  const value =
    order.date ??
    order.createdAt ??
    order.created_at ??
    order.orderDate ??
    order.order_date;

  if (!value) return null;

  const parsedDate = new Date(value);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getOrderAmount = (order) => {
  const fields = [
    order.totalAmount,
    order.total_amount,
    order.grandTotal,
    order.grand_total,
    order.total,
    order.amount,
  ];

  for (const value of fields) {
    if (value !== undefined && value !== null && value !== "") {
      const amount = Number(value);

      if (Number.isFinite(amount)) {
        return Math.max(0, amount);
      }
    }
  }

  const items = Array.isArray(order.items)
    ? order.items
    : Array.isArray(order.products)
      ? order.products
      : [];

  const itemsTotal = items.reduce((sum, item) => {
    const price = Number(item.price ?? item.unitPrice ?? item.unit_price ?? 0);
    const quantity = Number(item.quantity ?? item.qty ?? 1);

    if (
      !Number.isFinite(price) ||
      !Number.isFinite(quantity) ||
      price < 0 ||
      quantity < 0
    ) {
      return sum;
    }

    return sum + price * quantity;
  }, 0);

  const shipping = Number(order.shipping ?? order.shippingCost ?? 0);
  const tax = Number(order.tax ?? order.taxAmount ?? order.tax_amount ?? 0);

  return (
    itemsTotal +
    (Number.isFinite(shipping) ? shipping : 0) +
    (Number.isFinite(tax) ? tax : 0)
  );
};

const formatCurrency = (value) =>
  `$${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatAxisCurrency = (value) => {
  if (Math.abs(value) >= 1000) {
    return `$${Number(value / 1000).toLocaleString("en-US", {
      maximumFractionDigits: 1,
    })}k`;
  }

  return `$${value}`;
};

const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-[150px] rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
        {formatCurrency(payload[0].value)}
      </p>

      <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
        Paid order revenue
      </p>
    </div>
  );
};

const Chart = () => {
  const [period, setPeriod] = useState("Yearly");
  const { orders = [] } = useOrders();

  const paidOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const paymentStatus = getPaymentStatus(order);
        const status = getOrderStatus(order);

        return (
          ["paid", "completed", "succeeded", "success"].includes(
            paymentStatus,
          ) &&
          status !== "cancelled" &&
          status !== "refunded"
        );
      })
      .map((order) => ({
        amount: getOrderAmount(order),
        parsedDate: getOrderDate(order),
      }))
      .filter(
        (order) =>
          order.parsedDate !== null &&
          Number.isFinite(order.amount) &&
          order.amount >= 0,
      );
  }, [orders]);

  const latestOrderDate = useMemo(() => {
    if (paidOrders.length === 0) return new Date();

    return new Date(
      Math.max(...paidOrders.map((order) => order.parsedDate.getTime())),
    );
  }, [paidOrders]);

  const data = useMemo(() => {
    const year = latestOrderDate.getFullYear();
    const month = latestOrderDate.getMonth();

    const dailySales = new Map();

    paidOrders.forEach((order) => {
      const key = getDateKey(order.parsedDate);

      dailySales.set(key, (dailySales.get(key) || 0) + order.amount);
    });

    if (period === "Weekly") {
      const weekEnd = new Date(year, month, latestOrderDate.getDate());

      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);

      return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + index);

        return {
          label: date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          sales: dailySales.get(getDateKey(date)) || 0,
        };
      });
    }

    if (period === "Monthly") {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const numberOfWeeks = Math.ceil(daysInMonth / 7);

      return Array.from({ length: numberOfWeeks }, (_, index) => {
        const startDay = index * 7 + 1;
        const endDay = Math.min(startDay + 6, daysInMonth);

        let sales = 0;

        for (let day = startDay; day <= endDay; day += 1) {
          sales += dailySales.get(getDateKey(new Date(year, month, day))) || 0;
        }

        return {
          label: `${startDay}–${endDay}`,
          sales,
        };
      });
    }

    return Array.from({ length: 12 }, (_, index) => {
      const monthDate = new Date(year, index, 1);

      const sales = paidOrders.reduce((sum, order) => {
        const date = order.parsedDate;

        if (date.getFullYear() === year && date.getMonth() === index) {
          return sum + order.amount;
        }

        return sum;
      }, 0);

      return {
        label: monthDate.toLocaleDateString("en-US", {
          month: "short",
        }),
        sales,
      };
    });
  }, [paidOrders, period, latestOrderDate]);

  const totalSales = useMemo(
    () => data.reduce((total, item) => total + item.sales, 0),
    [data],
  );

  const periodDescription = {
    Weekly: "Daily revenue for the 7 days ending with your latest paid order.",
    Monthly: "Revenue grouped by week for the month of your latest paid order.",
    Yearly: "Monthly revenue for the year of your latest paid order.",
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.02] transition-shadow duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-indigo-600 dark:bg-indigo-400"
              aria-hidden="true"
            />

            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Sales Overview
            </h2>
          </div>

          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {periodDescription[period]}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div
            className="inline-flex w-fit rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
            aria-label="Sales reporting period">
            {periods.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPeriod(item)}
                aria-pressed={period === item}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  period === item
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}>
                {item}
              </button>
            ))}
          </div>

          <div className="w-full rounded-lg bg-indigo-50 px-4 py-2.5 dark:bg-indigo-950/40 sm:w-auto sm:text-right">
            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              Total {period} Sales
            </p>

            <p className="mt-0.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(totalSales)}
            </p>
          </div>
        </div>
      </div>

      <div
        className="h-[300px] w-full p-3 sm:h-[360px] sm:p-5"
        role="img"
        aria-label={`Paid order revenue chart for the ${period.toLowerCase()} period`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-slate-100 dark:stroke-slate-800"
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              className="fill-slate-500 dark:fill-slate-400"
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              width={55}
              tick={{ fontSize: 12 }}
              tickFormatter={formatAxisCurrency}
              className="fill-slate-500 dark:fill-slate-400"
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#818CF8",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            <Line
              type="monotone"
              dataKey="sales"
              name="Revenue"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{
                r: 3,
                fill: "#4F46E5",
                strokeWidth: 2,
                stroke: "#ffffff",
              }}
              activeDot={{
                r: 6,
                fill: "#4F46E5",
                strokeWidth: 3,
                stroke: "#ffffff",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
