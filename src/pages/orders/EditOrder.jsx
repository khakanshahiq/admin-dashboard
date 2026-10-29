import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Package,
  UserRound,
  Truck,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

import { useOrders } from "../../context/OrderContext";

const normalizeOrderId = (id) =>
  String(id ?? "")
    .trim()
    .replace(/^#/, "");

const inputClass =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white";

const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);

function Section({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, getOrderById, updateOrder } = useOrders();

  const order = useMemo(() => getOrderById(id), [id, orders, getOrderById]);

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!order) {
      setForm(null);
      return;
    }

    setForm({
      customer: order.customer ?? "",
      email: order.email ?? "",
      phone: order.phone ?? "",
      status: order.status ?? "Pending",
      payment: order.payment ?? "Pending",
      shippingAddress: order.shippingAddress ?? "",
      trackingNumber: order.trackingNumber ?? "",
      estimatedDelivery: order.estimatedDelivery ?? "",
      notes: order.notes ?? "",
      items: (order.items ?? []).map((item) => ({
        ...item,
        price: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
      })),
      shipping: Math.max(0, Number(order.shipping) || 0),
      tax: Math.max(0, Number(order.tax) || 0),
    });
  }, [order]);

  const showNotice = (type, message) => {
    setNotice({ type, message });
  };

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateItem = (index, field, value) => {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addItem = () => {
    setForm((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          id: Date.now(),
          name: "",
          sku: "",
          price: 0,
          quantity: 1,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    setForm((current) => ({
      ...current,
      items: current.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const subtotal = useMemo(
    () =>
      (form?.items ?? []).reduce(
        (sum, item) =>
          sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0,
      ),
    [form?.items],
  );

  const total =
    subtotal + (Number(form?.shipping) || 0) + (Number(form?.tax) || 0);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!order || !form || saving) return;

    if (!form.customer.trim() || !form.email.trim()) {
      showNotice("error", "Customer name and email are required.");
      return;
    }

    if (!form.items.length) {
      showNotice("error", "An order must contain at least one product.");
      return;
    }

    const invalidItem = form.items.some(
      (item) =>
        !item.name.trim() ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1 ||
        !Number.isFinite(Number(item.price)) ||
        Number(item.price) < 0,
    );

    if (invalidItem) {
      showNotice("error", "Check each product name, quantity, and price.");
      return;
    }

    try {
      setSaving(true);

      updateOrder(order.id, {
        customer: form.customer.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        status: form.status,
        payment: form.payment,
        shippingAddress: form.shippingAddress.trim(),
        trackingNumber: form.trackingNumber.trim(),
        estimatedDelivery: form.estimatedDelivery.trim(),
        notes: form.notes.trim(),
        items: form.items.map((item) => ({
          ...item,
          name: item.name.trim(),
          sku: (item.sku ?? "").trim(),
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),
        subtotal: Number(subtotal.toFixed(2)),
        shipping: Number((Number(form.shipping) || 0).toFixed(2)),
        tax: Number((Number(form.tax) || 0).toFixed(2)),
        amount: Number(total.toFixed(2)),
      });

      showNotice("success", "Order updated successfully.");

      const cleanId = normalizeOrderId(order.id);

      navigate(`/admin/orders/${encodeURIComponent(cleanId)}`, {
        replace: true,
      });
    } catch (error) {
      console.error("Unable to update order:", error);
      setSaving(false);
      showNotice("error", "Unable to update the order.");
    }
  };

  const detailsPath = order
    ? `/admin/orders/${encodeURIComponent(normalizeOrderId(order.id))}`
    : "/admin/orders";

  if (!order) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-950">
          <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Order not found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            No order was found for ID {id}.
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!form) {
    return <div className="p-6 text-sm text-gray-500">Loading order...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      {/* Toast notification */}
      {notice && (
        <div
          role="status"
          className={`fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-xl border bg-white p-4 shadow-xl dark:bg-gray-950 ${
            notice.type === "success"
              ? "border-emerald-200 dark:border-emerald-900"
              : "border-red-200 dark:border-red-900"
          }`}>
          {notice.type === "success" ? (
            <CheckCircle2 className="shrink-0 text-emerald-600" size={21} />
          ) : (
            <AlertCircle className="shrink-0 text-red-600" size={21} />
          )}

          <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100">
            {notice.message}
          </p>

          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
            aria-label="Dismiss notification">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600">
            <ArrowLeft size={16} />
            Back
          </button>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Order
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer, products, payment, and delivery.
          </p>
        </div>

        <span className="w-fit rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
          {order.id}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Section
          icon={UserRound}
          title="Customer Information"
          description="Update the customer's contact information.">
          <div className="grid gap-5 md:grid-cols-2">
            <label className={labelClass}>
              Customer Name
              <input
                className={inputClass}
                value={form.customer}
                onChange={(e) => updateField("customer", e.target.value)}
                required
              />
            </label>

            <label className={labelClass}>
              Email Address
              <input
                className={inputClass}
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />
            </label>

            <label className={labelClass}>
              Phone Number
              <input
                className={inputClass}
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </label>

            <label className={labelClass}>
              Order Date
              <input
                className={`${inputClass} opacity-70`}
                value={order.date ?? ""}
                readOnly
              />
            </label>
          </div>
        </Section>

        <Section
          icon={Package}
          title="Order & Payment Status"
          description="Update order fulfillment and payment.">
          <div className="grid gap-5 md:grid-cols-2">
            <label className={labelClass}>
              Order Status
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}>
                {[
                  "Pending",
                  "Processing",
                  "Shipped",
                  "Delivered",
                  "Cancelled",
                ].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Payment Status
              <select
                className={inputClass}
                value={form.payment}
                onChange={(e) => updateField("payment", e.target.value)}>
                {["Pending", "Paid", "Refunded", "Failed"].map((payment) => (
                  <option key={payment} value={payment}>
                    {payment}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Section>

        <Section
          icon={Package}
          title="Order Items"
          description="Manage products, quantities, and unit prices.">
          <div className="mb-5 flex justify-end">
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
              <Plus size={16} />
              Add Product
            </button>
          </div>

          <div className="space-y-4">
            {form.items.map((item, index) => (
              <div
                key={item.id ?? index}
                className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    Product {index + 1}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={form.items.length === 1}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-red-500/10"
                    aria-label={`Remove product ${index + 1}`}>
                    <Trash2 size={17} />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <label className={`${labelClass} lg:col-span-2`}>
                    Product Name
                    <input
                      className={inputClass}
                      value={item.name}
                      onChange={(e) =>
                        updateItem(index, "name", e.target.value)
                      }
                      required
                    />
                  </label>

                  <label className={labelClass}>
                    SKU
                    <input
                      className={inputClass}
                      value={item.sku ?? ""}
                      onChange={(e) => updateItem(index, "sku", e.target.value)}
                    />
                  </label>

                  <label className={labelClass}>
                    Unit Price ($)
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(index, "price", e.target.value)
                      }
                      required
                    />
                  </label>

                  <label className={labelClass}>
                    Quantity
                    <input
                      className={inputClass}
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", e.target.value)
                      }
                      required
                    />
                  </label>

                  <div>
                    <p className={labelClass}>Line Total</p>
                    <p className="mt-2 rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 dark:bg-gray-900 dark:text-white">
                      {formatCurrency(
                        (Number(item.price) || 0) *
                          (Number(item.quantity) || 0),
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          icon={Truck}
          title="Shipping & Delivery"
          description="Update the shipping address and tracking details.">
          <div className="grid gap-5 md:grid-cols-2">
            <label className={`${labelClass} md:col-span-2`}>
              Shipping Address
              <textarea
                className={inputClass}
                rows={3}
                value={form.shippingAddress}
                onChange={(e) => updateField("shippingAddress", e.target.value)}
              />
            </label>

            <label className={labelClass}>
              Tracking Number
              <input
                className={inputClass}
                value={form.trackingNumber}
                onChange={(e) => updateField("trackingNumber", e.target.value)}
              />
            </label>

            <label className={labelClass}>
              Estimated Delivery
              <input
                className={inputClass}
                value={form.estimatedDelivery}
                onChange={(e) =>
                  updateField("estimatedDelivery", e.target.value)
                }
                placeholder="Sep 15, 2026"
              />
            </label>
          </div>
        </Section>

        <Section
          icon={FileText}
          title="Order Summary"
          description="Review the automatically calculated order totals.">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              Shipping Cost ($)
              <input
                className={inputClass}
                type="number"
                min="0"
                step="0.01"
                value={form.shipping}
                onChange={(e) =>
                  updateField(
                    "shipping",
                    Math.max(0, Number(e.target.value) || 0),
                  )
                }
              />
            </label>

            <label className={labelClass}>
              Tax ($)
              <input
                className={inputClass}
                type="number"
                min="0"
                step="0.01"
                value={form.tax}
                onChange={(e) =>
                  updateField("tax", Math.max(0, Number(e.target.value) || 0))
                }
              />
            </label>
          </div>

          <div className="mt-6 space-y-3 border-t border-gray-100 pt-5 dark:border-gray-800">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span>{formatCurrency(form.shipping)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tax</span>
              <span>{formatCurrency(form.tax)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-4 text-base font-bold text-gray-900 dark:border-gray-800 dark:text-white">
              <span>Total Amount</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </Section>

        <Section
          icon={FileText}
          title="Order Notes"
          description="Add customer instructions or internal notes.">
          <textarea
            className={inputClass}
            rows={4}
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder="Write notes here..."
          />
        </Section>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 pb-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate(detailsPath)}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
            <Save size={17} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
