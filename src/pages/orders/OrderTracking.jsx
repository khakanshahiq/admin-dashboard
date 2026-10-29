import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Circle,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  Truck,
  User,
} from "lucide-react";

import { useOrders } from "../../context/OrderContext";

const trackingSteps = [
  {
    title: "Order Placed",
    description: "Your order has been placed successfully.",
    icon: Package,
  },
  {
    title: "Processing",
    description: "Your order is being prepared.",
    icon: Clock3,
  },
  {
    title: "Shipped",
    description: "Your package has left the warehouse.",
    icon: Truck,
  },
  {
    title: "Out for Delivery",
    description: "Your package is on its way to you.",
    icon: MapPin,
  },
  {
    title: "Delivered",
    description: "Your package has been delivered.",
    icon: Check,
  },
];

const getTrackingStep = (status) => {
  const normalizedStatus = String(status || "")
    .trim()
    .toLowerCase();

  const statusMap = {
    pending: 0,
    confirmed: 1,
    processing: 1,
    shipped: 2,
    "out for delivery": 3,
    delivered: 4,
  };

  return statusMap[normalizedStatus] ?? 0;
};

const getStatusClasses = (status) => {
  const normalizedStatus = String(status || "")
    .trim()
    .toLowerCase();

  const styles = {
    delivered:
      "bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-900/50",
    processing:
      "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-900/50",
    shipped:
      "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:ring-blue-900/50",
    pending:
      "bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
    cancelled:
      "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-900/50",
    "out for delivery":
      "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:ring-blue-900/50",
  };

  return (
    styles[normalizedStatus] ||
    "bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
  );
};

const getPaymentClasses = (payment) => {
  const normalizedPayment = String(payment || "")
    .trim()
    .toLowerCase();

  if (normalizedPayment === "paid") {
    return "bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-900/50";
  }

  if (normalizedPayment === "refunded") {
    return "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:ring-blue-900/50";
  }

  return "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-900/50";
};

const getCancellationMessage = (payment) => {
  const normalizedPayment = String(payment || "")
    .trim()
    .toLowerCase();

  if (normalizedPayment === "refunded") {
    return {
      title: "Order cancelled — refund recorded",
      description:
        "This order was cancelled and its payment is marked as refunded.",
      tone: "blue",
    };
  }

  if (normalizedPayment === "paid") {
    return {
      title: "Order cancelled — payment still marked as paid",
      description:
        "The order is cancelled, but the payment is still recorded as paid. Review the payment and refund status.",
      tone: "amber",
    };
  }

  if (
    normalizedPayment === "pending" ||
    normalizedPayment === "unpaid" ||
    !normalizedPayment
  ) {
    return {
      title: "Order cancelled",
      description:
        "This order was cancelled. No completed payment is recorded.",
      tone: "amber",
    };
  }

  return {
    title: "Order cancelled",
    description:
      "This order was cancelled. Review the payment status if a refund is required.",
    tone: "red",
  };
};

const InfoCard = ({
  icon: Icon,
  label,
  value,
  description,
  tone = "indigo",
}) => {
  const iconStyles = {
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900/50">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            iconStyles[tone] || iconStyles.indigo
          }`}>
          <Icon size={18} aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-1 break-words text-sm font-semibold text-slate-950 dark:text-white">
            {value || "Not available"}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ icon: Icon, title, description, tone = "indigo" }) => {
  const iconStyles = {
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          iconStyles[tone] || iconStyles.indigo
        }`}>
        <Icon size={17} aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
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

const OrderTracking = () => {
  const { id } = useParams();
  const { getOrderById } = useOrders();

  let decodedId = id || "";

  try {
    decodedId = decodeURIComponent(decodedId);
  } catch {
    // Keep the original route ID if decoding fails.
  }

  const routeId = String(decodedId).trim();
  const normalizedId = routeId.replace(/^#/, "");

  const order =
    getOrderById(routeId) ||
    getOrderById(normalizedId) ||
    getOrderById(`#${normalizedId}`);

  if (!order) {
    return (
      <div className="flex min-h-[500px] items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Package size={24} aria-hidden="true" />
          </div>

          <h1 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
            Order not found
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            The order you are trying to track does not exist or is no longer
            available.
          </p>

          <Link
            to="/admin/orders"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-offset-slate-950">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const cleanOrderId = String(order.id ?? normalizedId)
    .trim()
    .replace(/^#/, "");

  const orderDetailsPath = `/admin/orders/${encodeURIComponent(cleanOrderId)}`;

  const isCancelled =
    String(order.status || "")
      .trim()
      .toLowerCase() === "cancelled";

  const currentStep = getTrackingStep(order.status);
  const cancellation = getCancellationMessage(order.payment);

  const cancellationStyles = {
    blue: {
      panel:
        "border-blue-100 bg-blue-50/60 dark:border-blue-900/40 dark:bg-blue-950/20",
      icon: "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
      title: "text-blue-900 dark:text-blue-200",
      description: "text-blue-700/80 dark:text-blue-300/70",
    },
    amber: {
      panel:
        "border-amber-100 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/20",
      icon: "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
      title: "text-amber-900 dark:text-amber-200",
      description: "text-amber-700/80 dark:text-amber-300/70",
    },
    red: {
      panel:
        "border-red-100 bg-red-50/60 dark:border-red-900/40 dark:bg-red-950/20",
      icon: "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400",
      title: "text-red-900 dark:text-red-200",
      description: "text-red-700/80 dark:text-red-300/70",
    },
  };

  const cancellationStyle =
    cancellationStyles[cancellation.tone] || cancellationStyles.red;

  const amount =
    order.amount !== undefined && order.amount !== null && order.amount !== ""
      ? Number(order.amount)
      : null;

  const formattedAmount =
    amount !== null && Number.isFinite(amount)
      ? `$${amount.toFixed(2)}`
      : "Not available";

  const email = String(order.email || "").trim();
  const phone = String(order.phone || "").trim();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:text-slate-400 dark:hover:text-indigo-400 dark:focus:ring-offset-slate-950">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Orders
          </Link>

          <div className="mt-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Order Management
            </span>
          </div>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Track Order
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track the fulfillment progress of {order.id || cleanOrderId}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
              order.status,
            )}`}>
            {order.status || "Pending"}
          </span>

          <Link
            to={orderDetailsPath}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400">
            <Package size={15} aria-hidden="true" />
            Order Details
          </Link>
        </div>
      </div>

      {/* Order summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard
          icon={Package}
          label="Order"
          value={order.id || cleanOrderId}
          description={`Placed on ${order.date || "Date not available"}`}
        />

        {!isCancelled ? (
          <>
            <InfoCard
              icon={Truck}
              label="Tracking number"
              value={order.trackingNumber}
              description="Carrier tracking reference"
              tone="blue"
            />

            <InfoCard
              icon={MapPin}
              label="Estimated delivery"
              value={order.estimatedDelivery}
              description="Expected delivery date"
              tone="amber"
            />
          </>
        ) : (
          <div className="flex items-center rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 md:col-span-2">
            This order has been cancelled. Shipment progress is no longer
            active.
          </div>
        )}
      </div>

      {/* Tracking timeline and side information */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Shipment progress */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <SectionHeader
              icon={Truck}
              title="Shipment Progress"
              description="Follow the current status of your order."
            />
          </div>

          <div className="p-5 sm:p-6">
            {isCancelled ? (
              <div
                className={`rounded-xl border p-5 ${cancellationStyle.panel}`}
                role="status">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${cancellationStyle.icon}`}>
                    <Package size={18} aria-hidden="true" />
                  </div>

                  <div>
                    <p
                      className={`text-sm font-semibold ${cancellationStyle.title}`}>
                      {cancellation.title}
                    </p>

                    <p
                      className={`mt-1 text-sm leading-6 ${cancellationStyle.description}`}>
                      {cancellation.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <ol aria-label="Order tracking timeline">
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const completed = index <= currentStep;
                  const active = index === currentStep;

                  return (
                    <li
                      key={step.title}
                      className="relative flex gap-4 pb-8 last:pb-0">
                      {index < trackingSteps.length - 1 && (
                        <div
                          aria-hidden="true"
                          className={`absolute left-5 top-10 h-[calc(100%-16px)] w-px ${
                            index < currentStep
                              ? "bg-green-400 dark:bg-green-500"
                              : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
                          active
                            ? "border-indigo-500 bg-indigo-600 text-white shadow-sm ring-4 ring-indigo-50 dark:border-indigo-400 dark:bg-indigo-500 dark:ring-indigo-950/50"
                            : completed
                              ? "border-green-500 bg-green-500 text-white ring-4 ring-green-50 dark:border-green-500 dark:bg-green-500 dark:ring-green-950/40"
                              : "border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-600"
                        }`}>
                        {completed ? (
                          active ? (
                            <Icon size={17} aria-hidden="true" />
                          ) : (
                            <Check size={16} aria-hidden="true" />
                          )
                        ) : (
                          <Circle size={10} aria-hidden="true" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p
                            className={`text-sm font-semibold ${
                              completed
                                ? "text-slate-950 dark:text-white"
                                : "text-slate-400 dark:text-slate-500"
                            }`}>
                            {step.title}
                          </p>

                          {active && (
                            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 ring-1 ring-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-900/50">
                              Current
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                          {step.description}
                        </p>

                        {completed && (
                          <p
                            className={`mt-2 text-[11px] font-medium ${
                              active
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-green-600 dark:text-green-400"
                            }`}>
                            {active ? "Current status" : "Completed"}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

            {!isCancelled &&
              !order.trackingNumber &&
              ["shipped", "out for delivery"].includes(
                String(order.status || "")
                  .trim()
                  .toLowerCase(),
              ) && (
                <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300">
                  No tracking number has been recorded for this shipment yet.
                </p>
              )}
          </div>
        </section>

        {/* Customer, shipping and payment */}
        <div className="space-y-6">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <SectionHeader
                icon={User}
                title="Customer"
                description="Customer information"
              />
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <User size={18} aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-slate-900 dark:text-white">
                    {order.customer || "Customer not available"}
                  </p>

                  {email ? (
                    <a
                      href={`mailto:${email}`}
                      className="mt-0.5 block break-all text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                      {email}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-xs text-slate-400">
                      No email provided
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Phone
                </p>

                {phone ? (
                  <a
                    href={`tel:${phone}`}
                    className="mt-1 block break-words text-sm text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400">
                    {phone}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-slate-400">
                    No phone provided
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <SectionHeader
                icon={MapPin}
                title="Shipping Address"
                description="Delivery destination"
                tone="blue"
              />
            </div>

            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <MapPin size={17} aria-hidden="true" />
                </div>

                <p className="min-w-0 break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {order.shippingAddress || "No shipping address provided"}
                </p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <SectionHeader
                icon={CreditCard}
                title="Payment"
                description="Payment information"
                tone="amber"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="text-xs text-slate-400">Total amount</p>
                <p className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
                  {formattedAmount}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getPaymentClasses(
                  order.payment,
                )}`}>
                {order.payment || "Pending"}
              </span>
            </div>
          </section>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/admin/orders"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Orders
        </Link>

        <Link
          to={orderDetailsPath}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-offset-slate-950">
          <Package size={16} aria-hidden="true" />
          View Order Details
        </Link>
      </div>
    </div>
  );
};

export default OrderTracking;
