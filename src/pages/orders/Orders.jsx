import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  MoreHorizontal,
  PackageCheck,
  Search,
  ShoppingCart,
  Clock3,
  DollarSign,
  X,
  Ban,
  Eye,
  Pencil,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../../context/OrderContext";

const statusStyles = {
  Delivered:
    "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  Processing:
    "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400",
  Shipped: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  Pending:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  Cancelled: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
};

const paymentStyles = {
  Paid: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  Pending:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  Refunded: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
};

const ORDERS_PER_PAGE = 5;

const STATUSES = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const PAYMENTS = ["All", "Paid", "Pending", "Refunded"];

// Normalize IDs so "#ORD-001" and "ORD-001" match.
const normalizeOrderId = (id) =>
  String(id ?? "")
    .trim()
    .replace(/^#+/, "")
    .toLowerCase();

const formatAmount = (amount) => {
  const value = Number(amount);

  return `$${(Number.isFinite(value) ? value : 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getItemCount = (order) => {
  if (!Array.isArray(order?.items)) return 0;

  return order.items.reduce((total, item) => {
    const quantity = Number(item?.quantity);

    return total + (Number.isFinite(quantity) && quantity > 0 ? quantity : 0);
  }, 0);
};

const Orders = () => {
  const navigate = useNavigate();
  const { orders: contextOrders, setOrders } = useOrders();

  const orders = Array.isArray(contextOrders) ? contextOrders : [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);
  const [cancelOrder, setCancelOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const searchRef = useRef(null);
  const cancelButtonRef = useRef(null);

  // Close menus when clicking outside and support Escape.
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!event.target.closest?.("[data-order-menu-container]")) {
        setOpenMenu(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (cancelOrder) {
          setCancelOrder(null);
        } else {
          setOpenMenu(null);
        }
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [cancelOrder]);

  // Lock background scrolling while the confirmation modal is open.
  useEffect(() => {
    if (!cancelOrder) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [cancelOrder]);

  // Return keyboard focus to the cancellation trigger when possible.
  useEffect(() => {
    if (!cancelOrder) return undefined;

    const timer = window.setTimeout(() => {
      cancelButtonRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [cancelOrder]);

  // Search and filter.
  const filteredOrders = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !searchValue ||
        String(order?.id ?? "")
          .toLowerCase()
          .includes(searchValue) ||
        String(order?.customer ?? "")
          .toLowerCase()
          .includes(searchValue) ||
        String(order?.email ?? "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || order?.status === statusFilter;

      const matchesPayment =
        paymentFilter === "All" || order?.payment === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  // Reset to the first page whenever search or filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, paymentFilter]);

  // Pagination.
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

  const safeCurrentPage =
    totalPages > 0 ? Math.min(Math.max(currentPage, 1), totalPages) : 1;

  const startIndex = (safeCurrentPage - 1) * ORDERS_PER_PAGE;
  const endIndex = startIndex + ORDERS_PER_PAGE;

  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  const showingFrom = filteredOrders.length > 0 ? startIndex + 1 : 0;

  const showingTo = Math.min(endIndex, filteredOrders.length);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
    setOpenMenu(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Summary statistics.
  const totalOrders = orders.length;

  const deliveredOrders = orders.filter(
    (order) => order?.status === "Delivered",
  ).length;

  const processingOrders = orders.filter(
    (order) => order?.status === "Processing",
  ).length;

  const revenue = orders
    .filter((order) => order?.payment === "Paid")
    .reduce((total, order) => {
      const amount = Number(order?.amount);

      return total + (Number.isFinite(amount) ? amount : 0);
    }, 0);

  const hasFilters =
    search.trim() !== "" || statusFilter !== "All" || paymentFilter !== "All";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPaymentFilter("All");
    setCurrentPage(1);
    setOpenMenu(null);
    searchRef.current?.focus();
  };

  const getRouteOrderId = (orderId) =>
    String(orderId ?? "")
      .trim()
      .replace(/^#/, "");

  const handleViewOrder = (orderId) => {
    setOpenMenu(null);
    navigate(`/admin/orders/${encodeURIComponent(getRouteOrderId(orderId))}`);
  };

  const handleNewOrder = () => {
    setOpenMenu(null);
    navigate("/admin/add/order");
  };

  const handleEditOrder = (orderId) => {
    setOpenMenu(null);
    navigate(
      `/admin/orders/${encodeURIComponent(getRouteOrderId(orderId))}/edit`,
    );
  };

  const handleTrackOrder = (orderId) => {
    setOpenMenu(null);
    navigate(
      `/admin/orders/${encodeURIComponent(getRouteOrderId(orderId))}/track`,
    );
  };

  // Find orders consistently, regardless of "#" in their IDs.
  const handleCancelOrder = (orderId) => {
    setOpenMenu(null);

    const selectedOrder = orders.find(
      (order) => normalizeOrderId(order?.id) === normalizeOrderId(orderId),
    );

    if (!selectedOrder || selectedOrder.status === "Cancelled") {
      return;
    }

    setCancelOrder(selectedOrder);
  };

  // Update the context without mutating existing orders.
  const confirmCancelOrder = () => {
    if (!cancelOrder) return;

    const targetId = normalizeOrderId(cancelOrder.id);

    setOrders((currentOrders) => {
      if (!Array.isArray(currentOrders)) {
        return currentOrders;
      }

      return currentOrders.map((order) => {
        if (
          normalizeOrderId(order?.id) !== targetId ||
          order?.status === "Cancelled"
        ) {
          return order;
        }

        return {
          ...order,
          status: "Cancelled",
        };
      });
    });

    setCancelOrder(null);
    setOpenMenu(null);
  };

  const toggleMenu = (orderId) => {
    setOpenMenu((current) => (current === orderId ? null : orderId));
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Order Management
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Orders
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track orders, payments, and fulfillment status.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewOrder}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-indigo-400/30 dark:focus:ring-offset-slate-900">
          <ShoppingCart size={17} aria-hidden="true" />
          New Order
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard
          icon={<ShoppingCart size={17} aria-hidden="true" />}
          label="Total orders"
          value={totalOrders}
          iconClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
        />

        <SummaryCard
          icon={<PackageCheck size={17} aria-hidden="true" />}
          label="Delivered"
          value={deliveredOrders}
          iconClass="bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
        />

        <SummaryCard
          icon={<Clock3 size={17} aria-hidden="true" />}
          label="Processing"
          value={processingOrders}
          iconClass="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
        />

        <SummaryCard
          icon={<DollarSign size={17} aria-hidden="true" />}
          label="Revenue"
          value={formatAmount(revenue)}
          iconClass="bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
        />
      </div>

      {/* Main orders card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {/* Search and filters */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <label htmlFor="orders-search" className="sr-only">
              Search orders
            </label>

            <input
              ref={searchRef}
              id="orders-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search orders..."
              autoComplete="off"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <label htmlFor="order-status-filter" className="sr-only">
                Filter by order status
              </label>

              <select
                id="order-status-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-9 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20 sm:w-40">
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status === "All" ? "All statuses" : status}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            <div className="relative">
              <label htmlFor="order-payment-filter" className="sr-only">
                Filter by payment status
              </label>

              <select
                id="order-payment-filter"
                value={paymentFilter}
                onChange={(event) => setPaymentFilter(event.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-9 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20 sm:w-36">
                {PAYMENTS.map((payment) => (
                  <option key={payment} value={payment}>
                    {payment === "All" ? "All payments" : payment}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:border-slate-700 dark:text-slate-400 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 dark:focus:ring-indigo-400/30 dark:focus:ring-offset-slate-900">
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <p
            className="text-xs text-slate-500 dark:text-slate-400"
            aria-live="polite">
            Showing{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {showingFrom}
              {filteredOrders.length > 0 && `-${showingTo}`}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {filteredOrders.length}
            </span>{" "}
            orders
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px]">
            <caption className="sr-only">
              Orders with customer, item, amount, status, payment, and date
              information
            </caption>

            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/40">
                <TableHeader>Order</TableHeader>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Items</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Payment</TableHeader>
                <TableHeader>Date</TableHeader>
                <th scope="col" className="w-16 px-5 py-3.5">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => {
                  const itemCount = getItemCount(order);
                  const menuOpen = openMenu === order.id;

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-slate-100 transition hover:bg-indigo-50/40 last:border-b-0 dark:border-slate-800 dark:hover:bg-indigo-950/10">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                            <PackageCheck size={18} aria-hidden="true" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              {order.id}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              Order
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                            {order.customer || "Unknown customer"}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-slate-400">
                            {order.email || "No email"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                        {formatAmount(order.amount)}
                      </td>

                      <td className="px-5 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>

                      <td className="px-5 py-4">
                        <PaymentBadge payment={order.payment} />
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {order.date || "—"}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div
                          className="relative inline-block"
                          data-order-menu-container>
                          <button
                            type="button"
                            onClick={() => toggleMenu(order.id)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 dark:focus:ring-indigo-400/30 dark:focus:ring-offset-slate-900"
                            aria-label={`Actions for ${order.id}`}
                            aria-expanded={menuOpen}
                            aria-haspopup="menu">
                            <MoreHorizontal size={18} aria-hidden="true" />
                          </button>

                          {menuOpen && (
                            <ActionMenu
                              order={order}
                              onView={handleViewOrder}
                              onEdit={handleEditOrder}
                              onTrack={handleTrackOrder}
                              onCancel={handleCancelOrder}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <EmptyOrders />
              )}
            </tbody>
          </table>
        </div>

        {/* Responsive mobile cards */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
          {paginatedOrders.length > 0 ? (
            paginatedOrders.map((order) => {
              const itemCount = getItemCount(order);
              const menuOpen = openMenu === order.id;

              return (
                <div key={order.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                        <PackageCheck size={18} aria-hidden="true" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {order.id}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {order.customer || "Unknown customer"}
                        </p>
                      </div>
                    </div>

                    <div
                      className="relative shrink-0"
                      data-order-menu-container>
                      <button
                        type="button"
                        onClick={() => toggleMenu(order.id)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 dark:focus:ring-indigo-400/30 dark:focus:ring-offset-slate-900"
                        aria-label={`Actions for ${order.id}`}
                        aria-expanded={menuOpen}
                        aria-haspopup="menu">
                        <MoreHorizontal size={18} aria-hidden="true" />
                      </button>

                      {menuOpen && (
                        <ActionMenu
                          order={order}
                          onView={handleViewOrder}
                          onEdit={handleEditOrder}
                          onTrack={handleTrackOrder}
                          onCancel={handleCancelOrder}
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <MobileInfo
                      label="Amount"
                      value={formatAmount(order.amount)}
                      strong
                    />

                    <MobileInfo
                      label="Items"
                      value={`${itemCount} ${
                        itemCount === 1 ? "item" : "items"
                      }`}
                    />

                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">
                        Status
                      </p>
                      <div className="mt-1.5">
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">
                        Payment
                      </p>
                      <div className="mt-1.5">
                        <PaymentBadge payment={order.payment} />
                      </div>
                    </div>

                    <MobileInfo
                      label="Email"
                      value={order.email || "No email"}
                      truncate
                    />

                    <MobileInfo label="Date" value={order.date || "—"} />
                  </div>
                </div>
              );
            })
          ) : (
            <MobileEmptyOrders />
          )}
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {showingFrom}-{showingTo}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {filteredOrders.length}
              </span>{" "}
              orders
            </p>

            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                className={`rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:focus:ring-indigo-400/30 dark:focus:ring-offset-slate-900 ${
                  safeCurrentPage === 1
                    ? "cursor-not-allowed border-slate-200 text-slate-400 dark:border-slate-700 dark:text-slate-600"
                    : "border-slate-200 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                }`}>
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    aria-current={safeCurrentPage === page ? "page" : undefined}
                    aria-label={`Go to page ${page}`}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:focus:ring-indigo-400/30 dark:focus:ring-offset-slate-900 ${
                      safeCurrentPage === page
                        ? "bg-indigo-600 text-white dark:bg-indigo-500"
                        : "border border-slate-200 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                    }`}>
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                className={`rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:focus:ring-indigo-400/30 dark:focus:ring-offset-slate-900 ${
                  safeCurrentPage === totalPages
                    ? "cursor-not-allowed border-slate-200 text-slate-400 dark:border-slate-700 dark:text-slate-600"
                    : "border-slate-200 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                }`}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cancellation confirmation modal */}
      {cancelOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setCancelOrder(null);
            }
          }}>
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-order-title"
            aria-describedby="cancel-order-description">
            <div className="flex items-start justify-between gap-4 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                  <Ban size={20} aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <h2
                    id="cancel-order-title"
                    className="text-lg font-semibold text-slate-950 dark:text-white">
                    Cancel order?
                  </h2>

                  <p
                    id="cancel-order-description"
                    className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                    Are you sure you want to cancel{" "}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {cancelOrder.id}
                    </span>{" "}
                    for{" "}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {cancelOrder.customer || "this customer"}
                    </span>
                    ?
                  </p>
                </div>
              </div>

              <button
                ref={cancelButtonRef}
                type="button"
                onClick={() => setCancelOrder(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-indigo-400/30 dark:focus:ring-offset-slate-900"
                aria-label="Close cancel confirmation">
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="mx-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 dark:border-red-900/40 dark:bg-red-950/20">
              <p className="text-xs leading-5 text-red-700 dark:text-red-400">
                This action marks the order as cancelled. If a payment was
                already collected, process the refund separately and update its
                payment status only after the refund is confirmed.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 p-6 sm:flex-row sm:justify-end dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCancelOrder(null)}
                className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 dark:focus:ring-indigo-400/30 dark:focus:ring-offset-slate-900">
                Keep Order
              </button>

              <button
                type="button"
                onClick={confirmCancelOrder}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:ring-offset-2 dark:bg-red-500 dark:hover:bg-red-400 dark:focus:ring-red-400/30 dark:focus:ring-offset-slate-900">
                <Ban size={16} aria-hidden="true" />
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Table header */
const TableHeader = ({ children }) => (
  <th
    scope="col"
    className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
    {children}
  </th>
);

/* Summary card */
const SummaryCard = ({ icon, label, value, iconClass }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
        {icon}
      </span>
    </div>

    <p className="mt-3 text-xl font-bold text-slate-950 dark:text-white">
      {value}
    </p>
  </div>
);

/* Mobile information field */
const MobileInfo = ({ label, value, strong = false, truncate = false }) => (
  <div className="min-w-0">
    <p className="text-[11px] uppercase tracking-wide text-slate-400">
      {label}
    </p>

    <p
      className={`mt-1 text-sm ${
        strong
          ? "font-semibold text-slate-900 dark:text-white"
          : "text-slate-600 dark:text-slate-400"
      } ${truncate ? "truncate" : "break-words"}`}>
      {value}
    </p>
  </div>
);

/* Order status badge */
const OrderStatusBadge = ({ status }) => {
  const style =
    statusStyles[status] ||
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {status || "Unknown"}
    </span>
  );
};

/* Payment status badge */
const PaymentBadge = ({ payment }) => {
  const style =
    paymentStyles[payment] ||
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {payment || "Unknown"}
    </span>
  );
};

/* Order actions menu */
const ActionMenu = ({ order, onView, onEdit, onTrack, onCancel }) => (
  <div
    className="absolute right-0 top-full z-30 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-xl dark:border-slate-700 dark:bg-slate-900"
    role="menu"
    aria-label={`Actions for ${order.id}`}>
    <MenuButton
      icon={<Eye size={15} aria-hidden="true" />}
      label="View"
      onClick={() => onView(order.id)}
    />

    <MenuButton
      icon={<Pencil size={15} aria-hidden="true" />}
      label="Edit"
      onClick={() => onEdit(order.id)}
    />

    <MenuButton
      icon={<MapPin size={15} aria-hidden="true" />}
      label="Track"
      onClick={() => onTrack(order.id)}
    />

    {order.status !== "Cancelled" && (
      <MenuButton
        icon={<Ban size={15} aria-hidden="true" />}
        label="Cancel"
        danger
        onClick={() => onCancel(order.id)}
      />
    )}
  </div>
);

/* Reusable action menu button */
const MenuButton = ({ icon, label, onClick, danger = false }) => (
  <button
    type="button"
    role="menuitem"
    onClick={onClick}
    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-inset ${
      danger
        ? "text-red-600 hover:bg-red-50 focus:ring-red-500/30 dark:text-red-400 dark:hover:bg-red-950/30 dark:focus:ring-red-400/30"
        : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 focus:ring-indigo-500/30 dark:text-slate-300 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 dark:focus:ring-indigo-400/30"
    }`}>
    {icon}
    {label}
  </button>
);

/* Empty desktop table */
const EmptyOrders = () => (
  <tr>
    <td colSpan={8} className="px-5 py-14 text-center">
      <PackageCheck
        size={28}
        aria-hidden="true"
        className="mx-auto text-slate-300 dark:text-slate-600"
      />

      <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
        No orders found
      </p>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Try changing your search or filters.
      </p>
    </td>
  </tr>
);

/* Empty mobile list */
const MobileEmptyOrders = () => (
  <div className="px-5 py-14 text-center">
    <PackageCheck
      size={28}
      aria-hidden="true"
      className="mx-auto text-slate-300 dark:text-slate-600"
    />

    <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
      No orders found
    </p>

    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
      Try changing your search or filters.
    </p>
  </div>
);

export default Orders;
