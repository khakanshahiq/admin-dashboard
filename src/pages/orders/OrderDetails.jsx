import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Clock3,
  CreditCard,
  Download,
  MapPin,
  Package,
  Pencil,
  Printer,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";

import { useOrders } from "../../context/OrderContext";

/* -------------------------------------------------------
   HELPERS
------------------------------------------------------- */

const getRouteOrderId = (order) =>
  String(order?.id ?? "")
    .trim()
    .replace(/^#/, "");

const getStatusClasses = (status) => {
  const classes = {
    Delivered:
      "bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-900/50",
    Processing:
      "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-900/50",
    Shipped:
      "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:ring-blue-900/50",
    Pending:
      "bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
    Cancelled:
      "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-900/50",
  };

  return (
    classes[status] ||
    "bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
  );
};

const getPaymentClasses = (payment) => {
  if (payment === "Paid") {
    return "bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-900/50";
  }

  if (payment === "Refunded") {
    return "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:ring-blue-900/50";
  }

  return "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-900/50";
};

const getTimelineIcon = (title) => {
  const value = title.toLowerCase();

  if (value.includes("delivered") || value.includes("placed")) {
    return <Check size={13} aria-hidden="true" />;
  }

  if (value.includes("shipped") || value.includes("delivery")) {
    return <Truck size={12} aria-hidden="true" />;
  }

  if (value.includes("cancelled")) {
    return <Check size={13} aria-hidden="true" />;
  }

  return <Clock3 size={12} aria-hidden="true" />;
};

const getTimelineIconClasses = (title, completed = true) => {
  if (!completed) {
    return "bg-slate-200 text-slate-400 ring-4 ring-slate-50 dark:bg-slate-800 dark:text-slate-500 dark:ring-slate-950";
  }

  const value = title.toLowerCase();

  if (value.includes("cancelled")) {
    return "bg-red-500 text-white ring-4 ring-red-50 dark:ring-red-950/40";
  }

  if (value.includes("delivered")) {
    return "bg-green-500 text-white ring-4 ring-green-50 dark:ring-green-950/40";
  }

  if (value.includes("shipped") || value.includes("delivery")) {
    return "bg-blue-500 text-white ring-4 ring-blue-50 dark:ring-blue-950/40";
  }

  return "bg-indigo-500 text-white ring-4 ring-indigo-50 dark:ring-indigo-950/40";
};

const SectionHeader = ({ icon: Icon, title, description, tone = "indigo" }) => {
  const iconClasses = {
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    green:
      "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          iconClasses[tone] || iconClasses.indigo
        }`}>
        <Icon size={17} aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

const getInitials = (name = "") =>
  String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

const getPaymentMethod = (order) => {
  if (order.paymentMethod) return order.paymentMethod;

  if (order.payment === "Refunded") {
    return "Original payment method";
  }

  if (order.payment === "Paid") {
    return "Payment completed";
  }

  return "Payment not completed";
};

const formatMoney = (value) =>
  `$${(Number.isFinite(Number(value)) ? Number(value) : 0).toFixed(2)}`;

const getTimeline = (order) => {
  const status = order.status;

  if (status === "Cancelled") {
    return [
      {
        title: "Order placed",
        description: "The order was placed successfully.",
        date: order.date,
        completed: true,
      },
      {
        title: "Order cancelled",
        description: "This order has been cancelled.",
        date: order.cancelledAt || "",
        completed: true,
      },
    ];
  }

  const confirmed = ["Processing", "Shipped", "Delivered"].includes(status);
  const shipped = ["Shipped", "Delivered"].includes(status);
  const delivered = status === "Delivered";

  return [
    {
      title: "Order placed",
      description: "The order was placed successfully.",
      date: order.date,
      completed: true,
    },
    {
      title: "Order confirmed",
      description: "The order has been confirmed and is being prepared.",
      date: order.confirmedAt || "",
      completed: confirmed,
    },
    {
      title: "Shipped",
      description: "The package has left the fulfillment center.",
      date: order.shippedAt || "",
      completed: shipped,
    },
    {
      title: "Out for delivery",
      description: "The package is on its way to the customer.",
      date: order.outForDeliveryAt || "",
      completed: delivered,
    },
    {
      title: "Order delivered",
      description: "The package was delivered successfully.",
      date: order.deliveredAt || order.estimatedDelivery || "",
      completed: delivered,
    },
  ];
};

/* -------------------------------------------------------
   ORDER DETAILS
------------------------------------------------------- */

export default function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getOrderById } = useOrders();

  const order = getOrderById(id);

  const items = useMemo(
    () => (Array.isArray(order?.items) ? order.items : []),
    [order],
  );

  const totals = useMemo(() => {
    if (!order) {
      return {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        totalProducts: 0,
      };
    }

    const itemSubtotal = items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;

      return sum + price * quantity;
    }, 0);

    const subtotal =
      order.subtotal !== undefined &&
      order.subtotal !== null &&
      order.subtotal !== ""
        ? Number(order.subtotal) || 0
        : itemSubtotal;

    const shipping =
      order.shipping !== undefined &&
      order.shipping !== null &&
      order.shipping !== ""
        ? Number(order.shipping) || 0
        : 0;

    const tax =
      order.tax !== undefined && order.tax !== null && order.tax !== ""
        ? Number(order.tax) || 0
        : 0;

    const total =
      order.amount !== undefined && order.amount !== null && order.amount !== ""
        ? Number(order.amount) || 0
        : subtotal + shipping + tax;

    const totalProducts = items.reduce(
      (count, item) => count + (Number(item.quantity) || 0),
      0,
    );

    return {
      subtotal,
      shipping,
      tax,
      total,
      totalProducts,
    };
  }, [order, items]);

  const timeline = useMemo(() => (order ? getTimeline(order) : []), [order]);

  const cleanOrderId = getRouteOrderId(order);

  const handleEditOrder = () => {
    if (!cleanOrderId) return;

    navigate(`/admin/orders/${encodeURIComponent(cleanOrderId)}/edit`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleInvoice = () => {
    // Opens the browser's print dialog. Choose "Save as PDF"
    // to save a PDF copy of the invoice/details.
    window.print();
  };

  /* -----------------------------------------------------
     ORDER NOT FOUND
  ----------------------------------------------------- */

  if (!order) {
    return (
      <div className="flex min-h-[420px] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Package size={26} aria-hidden="true" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">
            Order not found
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            This order could not be found. It may have been removed, or the
            order ID in the URL may not match your saved order.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-offset-slate-900">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  /* -----------------------------------------------------
     MAIN PAGE
  ----------------------------------------------------- */

  return (
    <div className="order-details-page space-y-6">
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }

          .order-details-page {
            padding: 0 !important;
            margin: 0 !important;
          }

          .order-details-page button {
            display: none !important;
          }

          .order-details-page,
          .order-details-page * {
            color: black !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .order-details-page .overflow-hidden {
            overflow: visible !important;
          }
        }
      `}</style>

      {/* PAGE HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            aria-label="Back to orders"
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 dark:focus:ring-offset-slate-950">
            <ArrowLeft size={18} aria-hidden="true" />
          </button>

          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Order Management
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Order {order.id ?? cleanOrderId}
              </h1>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                  order.status,
                )}`}>
                {order.status || "Pending"}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Placed on {order.date || "Date unavailable"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 dark:focus:ring-offset-slate-950">
            <Printer size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            type="button"
            onClick={handleEditOrder}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:border-indigo-900/60 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-950/60 dark:focus:ring-offset-slate-950">
            <Pencil size={16} aria-hidden="true" />
            <span>Edit Order</span>
          </button>

          <button
            type="button"
            onClick={handleInvoice}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-offset-slate-950">
            <Download size={16} aria-hidden="true" />
            <span>Invoice / PDF</span>
          </button>
        </div>
      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* LEFT COLUMN */}

        <div className="space-y-6 xl:col-span-2">
          {/* ORDER ITEMS */}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <SectionHeader
                icon={Package}
                title="Order Items"
                description={`${items.length} ${
                  items.length === 1 ? "product" : "products"
                } in this order`}
              />
            </div>

            {items.length > 0 ? (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {items.map((item, index) => {
                  const price = Number(item.price) || 0;
                  const quantity = Number(item.quantity) || 0;

                  return (
                    <div
                      key={item.id ?? `${item.name}-${index}`}
                      className="flex flex-col gap-4 p-5 transition hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 sm:flex-row sm:items-center">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-900/50">
                        <ShoppingBag size={22} aria-hidden="true" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-semibold text-slate-900 dark:text-white">
                          {item.name || "Unnamed product"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          SKU: {item.sku || "N/A"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:hidden">
                          Quantity: {quantity}
                        </p>
                      </div>

                      <div className="hidden text-center sm:block sm:w-24">
                        <p className="text-xs font-medium text-slate-400">
                          Quantity
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                          {quantity}
                        </p>
                      </div>

                      <div className="text-left sm:w-32 sm:text-right">
                        <p className="text-xs font-medium text-slate-400">
                          Item Total
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                          {formatMoney(price * quantity)}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {formatMoney(price)} each
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="p-5 text-sm text-slate-500 dark:text-slate-400">
                No products are recorded for this order.
              </p>
            )}

            {/* TOTALS */}

            <div className="border-t border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/30">
              <div className="ml-auto max-w-sm space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Subtotal
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatMoney(totals.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Shipping
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatMoney(totals.shipping)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Tax
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatMoney(totals.tax)}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Total
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Including tax and shipping
                      </p>
                    </div>

                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatMoney(totals.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ORDER TIMELINE */}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <SectionHeader
                icon={Clock3}
                title="Order Timeline"
                description="Track the progress of this order."
              />
            </div>

            <div className="p-5">
              <div className="relative">
                {timeline.map((event, index) => (
                  <div
                    key={`${event.title}-${index}`}
                    className="relative flex gap-4 pb-7 last:pb-0">
                    {index !== timeline.length - 1 && (
                      <div className="absolute left-3 top-7 h-full w-px bg-slate-200 dark:bg-slate-800" />
                    )}

                    <div
                      className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${getTimelineIconClasses(
                        event.title,
                        event.completed,
                      )}`}>
                      {getTimelineIcon(event.title)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p
                          className={`text-sm font-semibold ${
                            event.completed
                              ? "text-slate-900 dark:text-white"
                              : "text-slate-400 dark:text-slate-500"
                          }`}>
                          {event.title}
                        </p>

                        <p className="text-xs text-slate-400">
                          {event.date || "Date unavailable"}
                        </p>
                      </div>

                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ORDER NOTES */}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <SectionHeader
                icon={ShoppingBag}
                title="Order Notes"
                description="Additional instructions from the customer."
                tone="amber"
              />
            </div>

            <div className="p-5">
              <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 px-4 py-3 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                <p className="break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                  {order.notes || "No additional notes for this order."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}

        <div className="space-y-6">
          {/* CUSTOMER */}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <SectionHeader
                icon={User}
                title="Customer"
                description="Customer information"
              />
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600 ring-1 ring-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-900/50">
                  {getInitials(order.customer)}
                </div>

                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-slate-900 dark:text-white">
                    {order.customer || "Customer not provided"}
                  </p>
                  <p className="break-words text-xs text-slate-500 dark:text-slate-400">
                    {order.email || "Email not provided"}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                <div className="flex gap-3">
                  <User
                    size={16}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-indigo-500 dark:text-indigo-400"
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="mt-0.5 break-words text-sm text-slate-700 dark:text-slate-300">
                      {order.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin
                    size={16}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-indigo-500 dark:text-indigo-400"
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Shipping address</p>
                    <p className="mt-0.5 break-words text-sm leading-5 text-slate-700 dark:text-slate-300">
                      {order.shippingAddress || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT */}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <SectionHeader
                icon={CreditCard}
                title="Payment Information"
                description="Payment method and status"
                tone="amber"
              />
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                  <CreditCard size={18} aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <p className="break-words text-sm font-medium text-slate-900 dark:text-white">
                    {getPaymentMethod(order)}
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getPaymentClasses(
                      order.payment,
                    )}`}>
                    {order.payment || "Pending"}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Amount
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatMoney(totals.total)}
                </span>
              </div>
            </div>
          </div>

          {/* SHIPPING */}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <SectionHeader
                icon={Truck}
                title="Shipping"
                description="Delivery information"
                tone="blue"
              />
            </div>

            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <Truck size={18} aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {order.shippingMethod || "Standard Delivery"}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {order.estimatedDelivery
                      ? `Estimated delivery: ${order.estimatedDelivery}`
                      : "Delivery date not available."}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                <MapPin
                  size={16}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-blue-500 dark:text-blue-400"
                />

                <p className="break-words text-sm leading-5 text-slate-600 dark:text-slate-400">
                  {order.shippingAddress || "Shipping address not provided"}
                </p>
              </div>

              {order.trackingNumber && (
                <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                  <p className="text-xs text-slate-400">Tracking number</p>
                  <p className="mt-1 break-all text-sm font-medium text-slate-900 dark:text-white">
                    {order.trackingNumber}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/admin/orders/${encodeURIComponent(cleanOrderId)}/track`,
                  )
                }
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-medium text-blue-700 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/60">
                <Truck size={16} aria-hidden="true" />
                Track Order
              </button>
            </div>
          </div>

          {/* ORDER SUMMARY */}

          <div className="overflow-hidden rounded-xl border border-indigo-100 bg-indigo-50/50 dark:border-indigo-900/40 dark:bg-indigo-950/20">
            <div className="p-5">
              <div className="flex items-center gap-2">
                <Package
                  size={17}
                  aria-hidden="true"
                  className="text-indigo-600 dark:text-indigo-400"
                />
                <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                  Order Summary
                </p>
              </div>

              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-indigo-700/70 dark:text-indigo-300/70">
                    Products
                  </span>
                  <span className="font-medium text-indigo-900 dark:text-indigo-100">
                    {totals.totalProducts}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-indigo-700/70 dark:text-indigo-300/70">
                    Status
                  </span>
                  <span className="font-medium text-indigo-900 dark:text-indigo-100">
                    {order.status || "Pending"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-t border-indigo-200/70 pt-3 dark:border-indigo-900/50">
                  <span className="font-semibold text-indigo-900 dark:text-indigo-100">
                    Total
                  </span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {formatMoney(totals.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTIONS */}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 dark:focus:ring-offset-slate-950">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Orders
        </button>

        <button
          type="button"
          onClick={handleEditOrder}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-offset-slate-950">
          <Pencil size={16} aria-hidden="true" />
          Edit Order
        </button>
      </div>
    </div>
  );
}
