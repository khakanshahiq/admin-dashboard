import { ArrowRight, CreditCard, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formatCurrency = (amount) =>
  `$${Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return String(date);

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusClasses = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
    case "completed":
      return "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400";

    case "pending":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400";

    case "processing":
      return "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";

    case "shipped":
      return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400";

    case "cancelled":
      return "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400";

    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  }
};

const getPaymentClasses = (payment) => {
  switch (payment?.toLowerCase()) {
    case "paid":
      return "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400";

    case "pending":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400";

    case "refunded":
      return "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400";

    case "failed":
      return "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400";

    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  }
};

const RecentOrders = ({ orders = [] }) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/admin/orders");
  };

  const handleOrderClick = (orderId) => {
    if (orderId === undefined || orderId === null || orderId === "") {
      return;
    }

    navigate(`/admin/orders/${encodeURIComponent(String(orderId))}`);
  };

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.02] transition-shadow duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-indigo-600 dark:bg-indigo-400"
              aria-hidden="true"
            />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Orders
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Latest orders from your store.
          </p>
        </div>

        <button
          type="button"
          onClick={handleViewAll}
          className="group inline-flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:text-indigo-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300 dark:focus-visible:ring-offset-slate-900">
          View all
          <ArrowRight
            size={15}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <caption className="sr-only">
            Recent orders, including customer, payment, and delivery status
          </caption>

          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/40">
              {[
                "Order",
                "Customer",
                "Items",
                "Amount",
                "Payment",
                "Date",
                "Status",
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="whitespace-nowrap px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {orders.length > 0 ? (
              orders.map((order) => {
                const itemCount = Array.isArray(order.items)
                  ? order.items.length
                  : 0;

                const canOpen =
                  order.id !== undefined &&
                  order.id !== null &&
                  order.id !== "";

                return (
                  <tr
                    key={order.id}
                    onClick={() => handleOrderClick(order.id)}
                    onKeyDown={(event) => {
                      if (!canOpen) return;

                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleOrderClick(order.id);
                      }
                    }}
                    tabIndex={canOpen ? 0 : undefined}
                    aria-label={canOpen ? `View order ${order.id}` : undefined}
                    className={`group transition-colors hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 ${
                      canOpen
                        ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
                        : ""
                    }`}>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="inline-flex rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400">
                        {order.id || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          aria-hidden="true">
                          {order.customer?.charAt(0)?.toUpperCase() || "?"}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {order.customer || "Unknown"}
                          </p>

                          {order.email && (
                            <p className="mt-0.5 max-w-[180px] truncate text-xs text-slate-500 dark:text-slate-400">
                              {order.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Package
                          size={15}
                          aria-hidden="true"
                          className="shrink-0 text-slate-400 dark:text-slate-500"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(order.amount)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentClasses(
                          order.payment,
                        )}`}>
                        {order.payment || "Unknown"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(order.date)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          order.status,
                        )}`}>
                        {order.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-5 py-14 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/40">
                    <Package
                      size={22}
                      aria-hidden="true"
                      className="text-indigo-500 dark:text-indigo-400"
                    />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                    No orders found
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    There are no recent orders to display.
                  </p>

                  <button
                    type="button"
                    onClick={handleViewAll}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:text-indigo-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300 dark:focus-visible:ring-offset-slate-900">
                    Browse orders
                    <ArrowRight size={14} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {orders.length > 0 && (
        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:px-6">
          Showing {orders.length} recent{" "}
          {orders.length === 1 ? "order" : "orders"}
        </div>
      )}
    </section>
  );
};

export default RecentOrders;
