import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  X,
  UserRound,
  Package,
  Truck,
  CreditCard,
  Receipt,
  MapPin,
  FileText,
} from "lucide-react";

import { useOrders } from "../../context/OrderContext";

const customers = [
  {
    id: 1,
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 555-0101",
  },
  {
    id: 2,
    name: "Sophia Carter",
    email: "sophia.carter@example.com",
    phone: "+1 555-0102",
  },
  {
    id: 3,
    name: "Daniel Wilson",
    email: "daniel.wilson@example.com",
    phone: "+1 555-0103",
  },
  {
    id: 4,
    name: "Emma Johnson",
    email: "emma.johnson@example.com",
    phone: "+1 555-0104",
  },
  {
    id: 5,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1 555-0105",
  },
];

const products = [
  { id: 1, name: "Wireless Headphones", sku: "WH-1001", price: 79.99 },
  { id: 2, name: "Smart Watch Pro", sku: "SW-2001", price: 129.5 },
  { id: 3, name: "Premium Backpack", sku: "PB-3001", price: 59.99 },
  { id: 4, name: "Mechanical Keyboard", sku: "MK-4001", price: 99 },
  { id: 5, name: "USB-C Hub", sku: "UH-5001", price: 39.99 },
];

const inputClass =
  "mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500";

const selectClass =
  "mt-1 block h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500";

export default function AddOrder() {
  const navigate = useNavigate();
  const { orders, addOrder } = useOrders();

  const [customer, setCustomer] = useState("");
  const [status, setStatus] = useState("Pending");
  const [payment, setPayment] = useState("Pending");
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) return undefined;

    const timer = window.setTimeout(() => {
      navigate("/admin/orders");
    }, 900);

    return () => window.clearTimeout(timer);
  }, [success, navigate]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const shipping = items.length > 0 ? 10 : 0;
  const tax = subtotal * 0.05;
  const total = Number((subtotal + shipping + tax).toFixed(2));

  const addProductToOrder = () => {
    if (!selectedProduct || success) return;

    const product = products.find(
      (item) => item.id === Number(selectedProduct),
    );

    if (!product) return;

    const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));

    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === product.id);

      if (existing) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + safeQuantity }
            : item,
        );
      }

      return [...currentItems, { ...product, quantity: safeQuantity }];
    });

    setSelectedProduct("");
    setQuantity(1);
    setErrors((current) => ({ ...current, items: "" }));
  };

  const updateQuantity = (id, change) => {
    if (success) return;

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    if (!success) {
      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!customer) nextErrors.customer = "Please select a customer.";
    if (items.length === 0)
      nextErrors.items = "Please add at least one product.";
    if (!shippingAddress.trim()) {
      nextErrors.shippingAddress = "Shipping address is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (success || !validate()) return;

    const selectedCustomer = customers.find((item) => item.name === customer);

    // Generate an ID that does not conflict with existing orders.
    const existingNumbers = orders.map((order) => {
      const match = String(order.id).match(/ORD-(\d+)/);
      return match ? Number(match[1]) : 1000;
    });

    const nextNumber = Math.max(1000, ...existingNumbers) + 1;
    const orderId = `#ORD-${nextNumber}`;

    const today = new Date();
    const date = today.toISOString().slice(0, 10);
    const estimatedDeliveryDate = new Date(today);
    estimatedDeliveryDate.setDate(today.getDate() + 5);

    const newOrder = {
      id: orderId,
      customer,
      email: selectedCustomer?.email || "",
      phone: selectedCustomer?.phone || "",
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
      subtotal: Number(subtotal.toFixed(2)),
      shipping,
      tax: Number(tax.toFixed(2)),
      amount: total,
      status,
      payment,
      date,
      trackingNumber: `TRK-${nextNumber}`,
      estimatedDelivery: estimatedDeliveryDate.toISOString().slice(0, 10),
      shippingAddress: shippingAddress.trim(),
      notes: notes.trim(),
    };

    addOrder(newOrder);
    setSuccess(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          aria-label="Back to orders"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <ArrowLeft size={18} />
        </button>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Order Management
          </p>
          <h1 className="text-2xl font-semibold text-slate-950 dark:text-white">
            Add Order
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create a new customer order.
          </p>
        </div>
      </div>

      {success && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
          <Check size={18} />
          <div>
            <p className="font-medium">Order created successfully.</p>
            <p className="text-xs">Saved. Redirecting to orders...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <Section icon={UserRound} title="Customer Information">
              <label
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
                htmlFor="customer">
                Customer *
              </label>
              <select
                id="customer"
                value={customer}
                disabled={success}
                onChange={(event) => {
                  setCustomer(event.target.value);
                  setErrors((current) => ({ ...current, customer: "" }));
                }}
                className={selectClass}>
                <option value="">Select customer</option>
                {customers.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name} — {item.email}
                  </option>
                ))}
              </select>
              {errors.customer && <ErrorText>{errors.customer}</ErrorText>}
            </Section>

            <Section icon={Package} title="Order Items">
              <div className="grid gap-3 sm:grid-cols-[1fr_110px_auto]">
                <select
                  aria-label="Select product"
                  value={selectedProduct}
                  disabled={success}
                  onChange={(event) => setSelectedProduct(event.target.value)}
                  className={selectClass}>
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} — ${product.price.toFixed(2)}
                    </option>
                  ))}
                </select>

                <input
                  aria-label="Quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  disabled={success}
                  onChange={(event) =>
                    setQuantity(
                      Math.max(1, Math.floor(Number(event.target.value) || 1)),
                    )
                  }
                  className={`${inputClass} h-11`}
                />

                <button
                  type="button"
                  onClick={addProductToOrder}
                  disabled={!selectedProduct || success}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
                  <Plus size={16} /> Add
                </button>
              </div>

              {errors.items && <ErrorText>{errors.items}</ErrorText>}

              {items.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-700">
                  No products added yet.
                </p>
              ) : (
                <div className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 p-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          SKU: {item.sku}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={success}
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label={`Decrease ${item.name} quantity`}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700">
                          <Minus size={14} />
                        </button>
                        <span className="w-5 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={success}
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label={`Increase ${item.name} quantity`}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700">
                          <Plus size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={success}
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-50">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section icon={Truck} title="Shipping Information">
              <label
                htmlFor="shippingAddress"
                className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Shipping Address *
              </label>
              <textarea
                id="shippingAddress"
                value={shippingAddress}
                disabled={success}
                maxLength={500}
                rows={4}
                onChange={(event) => {
                  setShippingAddress(event.target.value);
                  setErrors((current) => ({ ...current, shippingAddress: "" }));
                }}
                placeholder="Enter complete shipping address"
                className={`${inputClass} resize-none py-3`}
              />
              {errors.shippingAddress && (
                <ErrorText>{errors.shippingAddress}</ErrorText>
              )}

              <label
                htmlFor="notes"
                className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Order Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                disabled={success}
                maxLength={500}
                rows={3}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Special instructions..."
                className={`${inputClass} resize-none py-3`}
              />
            </Section>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={success}
                onClick={() => navigate("/admin/orders")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm dark:border-slate-700 dark:text-slate-300">
                <X size={16} /> Cancel
              </button>
              <button
                type="submit"
                disabled={success}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
                <ShoppingCart size={16} />
                {success ? "Order Created" : "Create Order"}
              </button>
            </div>
          </div>

          <aside className="space-y-6">
            <Section icon={Receipt} title="Order Summary">
              <SummaryRow label="Items" value={String(totalItems)} />
              <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <SummaryRow label="Shipping" value={`$${shipping.toFixed(2)}`} />
              <SummaryRow label="Tax (5%)" value={`$${tax.toFixed(2)}`} />
              <div className="my-2 border-t border-slate-200 dark:border-slate-800" />
              <SummaryRow label="Total" value={`$${total.toFixed(2)}`} strong />
            </Section>

            <Section icon={Truck} title="Order Status">
              <label
                htmlFor="status"
                className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Status
              </label>
              <select
                id="status"
                value={status}
                disabled={success}
                onChange={(event) => setStatus(event.target.value)}
                className={selectClass}>
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>

              <label
                htmlFor="payment"
                className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Payment Status
              </label>
              <select
                id="payment"
                value={payment}
                disabled={success}
                onChange={(event) => setPayment(event.target.value)}
                className={selectClass}>
                <option>Pending</option>
                <option>Paid</option>
                <option>Refunded</option>
                <option>Failed</option>
              </select>
            </Section>

            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-indigo-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    Quick tip
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Select a customer, add at least one product, and enter the
                    shipping address before creating the order.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
          <Icon size={17} />
        </div>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="space-y-3 p-5">{children}</div>
    </section>
  );
}

function SummaryRow({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span
        className={
          strong
            ? "text-lg font-bold text-indigo-600 dark:text-indigo-400"
            : "font-medium text-slate-900 dark:text-white"
        }>
        {value}
      </span>
    </div>
  );
}

function ErrorText({ children }) {
  return (
    <p role="alert" className="text-xs text-red-500">
      {children}
    </p>
  );
}
