import { useMemo } from "react";

import Card from "./Card";
import RecentOrders from "./RecentOrders";
import RecentUsers from "./RecentUsers";
import QuickActions from "./QuickActions";
import Chart from "../components/Chart";

import { useProducts } from "../context/ProductContext";
import { useOrders } from "../context/OrderContext";

const demoUsers = [
  {
    id: 1,
    name: "Ahmed",
    email: "ahmed@email.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Ali",
    email: "ali@email.com",
    role: "User",
    status: "Active",
  },
  {
    id: 3,
    name: "Hamza",
    email: "hamza@email.com",
    role: "User",
    status: "Inactive",
  },
];

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

const getOrderDate = (order) =>
  order.date ??
  order.createdAt ??
  order.created_at ??
  order.orderDate ??
  order.order_date ??
  null;

const getOrderAmount = (order) => {
  const totalFields = [
    order.totalAmount,
    order.total_amount,
    order.grandTotal,
    order.grand_total,
    order.total,
    order.amount,
  ];

  for (const value of totalFields) {
    if (value !== null && value !== undefined && value !== "") {
      const amount = Number(value);

      if (Number.isFinite(amount)) {
        return Math.max(0, amount);
      }
    }
  }

  // Legacy orders may store items as a number instead of an array.
  // Only calculate a total from items when actual item objects exist.
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

const formatCurrency = (amount) =>
  `$${Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const Dashboard = () => {
  const { products = [] } = useProducts();
  const { orders = [] } = useOrders();

  const dashboardData = useMemo(() => {
    const totalInventoryValue = products.reduce((sum, product) => {
      const price = Number(product.price ?? 0);
      const stock = Number(product.stock ?? product.quantity ?? 0);

      if (
        !Number.isFinite(price) ||
        !Number.isFinite(stock) ||
        price < 0 ||
        stock < 0
      ) {
        return sum;
      }

      return sum + price * stock;
    }, 0);

    const activeOrders = orders.filter(
      (order) => getOrderStatus(order) !== "cancelled",
    );

    const paidOrders = activeOrders.filter((order) =>
      ["paid", "completed", "succeeded", "success"].includes(
        getPaymentStatus(order),
      ),
    );

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + getOrderAmount(order),
      0,
    );

    const pendingPayments = orders
      .filter((order) => {
        const paymentStatus = getPaymentStatus(order);

        return (
          !["cancelled", "refunded"].includes(paymentStatus) &&
          [
            "pending",
            "unpaid",
            "awaiting payment",
            "awaiting_payment",
            "",
          ].includes(paymentStatus) &&
          getOrderStatus(order) !== "cancelled"
        );
      })
      .reduce((sum, order) => sum + getOrderAmount(order), 0);

    const countByStatus = (status) =>
      orders.filter((order) => getOrderStatus(order) === status).length;

    const stats = [
      {
        title: "Products",
        count: products.length.toLocaleString(),
        avg: `Inventory value: ${formatCurrency(totalInventoryValue)}`,
      },
      {
        title: "Orders",
        count: orders.length.toLocaleString(),
        avg: "All orders, including cancelled",
      },
      {
        title: "Processing Orders",
        count: countByStatus("processing").toLocaleString(),
        avg: "Orders being prepared",
      },
      {
        title: "Shipped Orders",
        count: countByStatus("shipped").toLocaleString(),
        avg: "Orders dispatched",
      },
      {
        title: "Delivered Orders",
        count: countByStatus("delivered").toLocaleString(),
        avg: "Orders delivered",
      },
      {
        title: "Pending Payments",
        count: formatCurrency(pendingPayments),
        avg: "Value awaiting payment",
      },
      {
        title: "Cancelled Orders",
        count: countByStatus("cancelled").toLocaleString(),
        avg: "Orders cancelled",
      },
      {
        title: "Revenue",
        count: formatCurrency(totalRevenue),
        avg: "Paid orders excluding cancellations",
      },
    ];

    const recentOrders = [...orders]
      .sort((a, b) => {
        const dateA = Date.parse(getOrderDate(a) ?? "");
        const dateB = Date.parse(getOrderDate(b) ?? "");

        const validA = Number.isFinite(dateA) ? dateA : 0;
        const validB = Number.isFinite(dateB) ? dateB : 0;

        return validB - validA;
      })
      .slice(0, 5);

    return {
      stats,
      recentOrders,
      totalRevenue,
      totalInventoryValue,
      pendingPayments,
    };
  }, [products, orders]);

  return (
    <main className="min-h-full bg-slate-50 p-4 dark:bg-slate-950 sm:p-6 lg:p-7">
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-indigo-600 dark:bg-indigo-400"
              aria-hidden="true"
            />

            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Dashboard
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Overview
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Monitor your store&apos;s products, orders, inventory, and sales
            performance.
          </p>
        </div>

        <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span
            className="h-2 w-2 rounded-full bg-green-500"
            aria-hidden="true"
          />

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Store overview
          </span>
        </div>
      </header>

      <section aria-labelledby="dashboard-statistics">
        <h2 id="dashboard-statistics" className="sr-only">
          Dashboard statistics
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardData.stats.map((stat) => (
            <Card key={stat.title} stat={stat} />
          ))}
        </div>
      </section>

      <section aria-labelledby="sales-overview" className="mt-6">
        <h2 id="sales-overview" className="sr-only">
          Sales overview
        </h2>

        <Chart />
      </section>

      <section aria-labelledby="recent-orders" className="mt-6">
        <h2 id="recent-orders" className="sr-only">
          Recent orders
        </h2>

        <RecentOrders orders={dashboardData.recentOrders} />
      </section>

      <section
        aria-labelledby="dashboard-activity"
        className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <h2 id="dashboard-activity" className="sr-only">
          Dashboard activity
        </h2>

        <div className="min-w-0 xl:col-span-2">
          <RecentUsers users={demoUsers} />
        </div>

        <div className="min-w-0">
          <QuickActions />
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
