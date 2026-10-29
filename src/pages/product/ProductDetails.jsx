import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Package,
  Tag,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  CalendarDays,
  User,
  CheckCircle2,
  Clock3,
  Printer,
  MoreHorizontal,
  AlertTriangle,
  XCircle,
  Copy,
  Archive,
} from "lucide-react";
import { useProducts } from "../../context/ProductContext";

const recentActivity = [
  {
    id: 1,
    icon: ShoppingCart,
    title: "New order received",
    description: "Order #ORD-1008 included this product.",
    time: "2 hours ago",
    type: "indigo",
  },
  {
    id: 2,
    icon: Package,
    title: "Stock updated",
    description: "Stock quantity was updated by Admin.",
    time: "5 hours ago",
    type: "green",
  },
  {
    id: 3,
    icon: Edit3,
    title: "Product information updated",
    description: "Product details were modified.",
    time: "Yesterday",
    type: "blue",
  },
  {
    id: 4,
    icon: CheckCircle2,
    title: "Product published",
    description: "Product became available in the store.",
    time: "Aug 12, 2026",
    type: "green",
  },
];

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const menuRef = useRef(null);

  const { getProductById } = useProducts();
  const product = getProductById(id);

  const [activeImage, setActiveImage] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  /* -----------------------------------------
     PRODUCT IMAGES
  ----------------------------------------- */
  const productImages = useMemo(() => {
    if (!product?.image) return [];

    return [product.image];
  }, [product]);

  /* -----------------------------------------
     RESET PAGE STATE WHEN PRODUCT CHANGES
  ----------------------------------------- */
  useEffect(() => {
    setActiveImage(productImages[0] || "");
    setShowMore(false);
    setMenuOpen(false);
    setCopied(false);
  }, [productImages]);

  /* -----------------------------------------
     CLOSE MENU
  ----------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* -----------------------------------------
     EDIT PRODUCT
  ----------------------------------------- */
  const handleEdit = () => {
    if (!product) return;

    navigate(`/admin/product/${product.id}/edit`);
  };

  /* -----------------------------------------
     PRINT
  ----------------------------------------- */
  const handlePrint = () => {
    window.print();
    setMenuOpen(false);
  };

  /* -----------------------------------------
     COPY SKU
  ----------------------------------------- */
  const handleCopySku = async () => {
    if (!product?.sku) return;

    try {
      await navigator.clipboard.writeText(product.sku);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }

    setMenuOpen(false);
  };

  /* -----------------------------------------
     FORMAT PRICE
  ----------------------------------------- */
  const formatPrice = (price) => {
    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice)) {
      return "$0.00";
    }

    return `$${numericPrice.toFixed(2)}`;
  };

  /* -----------------------------------------
     NOT FOUND
  ----------------------------------------- */
  if (!product) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div
            aria-hidden="true"
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Package size={28} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
            Product not found
          </h2>

          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
            The product you are trying to view does not exist or is no longer
            available.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/all/products")}
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const stockPercentage = Math.min(
    Math.round((Number(product.stock) / 50) * 100),
    100,
  );

  return (
    <div className="space-y-6">
      {/* =========================================
          PAGE HEADER
      ========================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/all/products")}
            className="mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-slate-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 dark:focus:ring-offset-slate-950">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Products
          </button>

          <div className="mb-1 flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"
            />

            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Product Management
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Product Details
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View product information, performance, and recent activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 dark:focus:ring-offset-slate-950">
            <Printer size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-offset-slate-950">
            <Edit3 size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Edit Product</span>
            <span className="sm:hidden">Edit</span>
          </button>
        </div>
      </div>

      {/* =========================================
          MAIN PRODUCT CARD
      ========================================= */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid lg:grid-cols-2">
          {/* PRODUCT IMAGE */}
          <div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6 lg:border-b-0 lg:border-r">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-100 dark:bg-slate-950 dark:ring-slate-800">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <Package size={32} aria-hidden="true" />

                  <span className="mt-2 text-sm">No image available</span>
                </div>
              )}

              <div className="absolute left-3 top-3 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm dark:bg-slate-900/90 dark:text-slate-300">
                Product Image
              </div>
            </div>

            {/* THUMBNAILS */}
            {productImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {productImages.map((image, index) => {
                  const isActive = activeImage === image;

                  return (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(image)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                        isActive
                          ? "border-indigo-500 ring-2 ring-indigo-100 dark:border-indigo-400 dark:ring-indigo-950"
                          : "border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                      }`}
                      aria-label={`View product image ${index + 1}`}
                      aria-pressed={isActive}
                      title={`View image ${index + 1}`}>
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    </button>
                  );
                })}

                {/* DEMO PLACEHOLDER THUMBNAILS */}
                {productImages.length === 1 && (
                  <>
                    <div
                      aria-hidden="true"
                      className="aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                      <div className="flex h-full items-center justify-center text-slate-300 dark:text-slate-700">
                        <Package size={24} />
                      </div>
                    </div>

                    <div
                      aria-hidden="true"
                      className="aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                      <div className="flex h-full items-center justify-center text-slate-300 dark:text-slate-700">
                        <Package size={24} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* =========================================
              PRODUCT INFORMATION
          ========================================= */}
          <div className="p-5 sm:p-6 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {product.category}
                </span>

                <h2 className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                  {product.name}
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  SKU:{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {product.sku}
                  </span>
                </p>
              </div>

              {/* MORE MENU */}
              <div className="relative shrink-0" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 dark:focus:ring-offset-slate-900"
                  aria-label="More product options"
                  title="More options"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu">
                  <MoreHorizontal size={20} aria-hidden="true" />
                </button>

                {menuOpen && (
                  <div
                    className="absolute right-0 top-11 z-30 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
                    role="menu">
                    <button
                      type="button"
                      onClick={handleCopySku}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-300 dark:hover:bg-slate-800"
                      role="menuitem">
                      <Copy size={16} aria-hidden="true" />
                      {copied ? "SKU Copied" : "Copy SKU"}
                    </button>

                    <button
                      type="button"
                      onClick={handlePrint}
                      className="mt-0.5 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-300 dark:hover:bg-slate-800"
                      role="menuitem">
                      <Printer size={16} aria-hidden="true" />
                      Print details
                    </button>

                    <button
                      type="button"
                      onClick={() => setMenuOpen(false)}
                      className="mt-0.5 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-300 dark:hover:bg-slate-800"
                      role="menuitem">
                      <Archive size={16} aria-hidden="true" />
                      Archive product
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* STATUS */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ProductStatus status={product.status} />

              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <Tag size={14} aria-hidden="true" />
                {product.category}
              </span>
            </div>

            {/* PRICE */}
            <div className="mt-8">
              <p className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                {formatPrice(product.price)}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Package size={16} aria-hidden="true" />

                {product.stock > 0 ? (
                  <>
                    <span>{product.stock} units available</span>

                    {product.stock <= 12 && (
                      <span className="font-medium text-amber-600 dark:text-amber-400">
                        · Low stock
                      </span>
                    )}
                  </>
                ) : (
                  <span className="font-medium text-red-600 dark:text-red-400">
                    Currently out of stock
                  </span>
                )}
              </div>

              {/* STOCK PROGRESS */}
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Stock level
                  </span>

                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {product.stock}/50
                  </span>
                </div>

                <div
                  className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                  role="progressbar"
                  aria-label={`Stock level ${stockPercentage}%`}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={stockPercentage}>
                  <div
                    className={`h-full rounded-full transition-all ${
                      product.stock === 0
                        ? "bg-red-500"
                        : product.stock <= 12
                          ? "bg-amber-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${stockPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="my-8 border-t border-slate-200 dark:border-slate-800" />

            {/* DESCRIPTION */}
            <div>
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
                Description
              </h3>

              <p
                className={`mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400 ${
                  showMore ? "" : "line-clamp-3"
                }`}>
                {product.description}
              </p>

              {product.description?.length > 180 && (
                <button
                  type="button"
                  onClick={() => setShowMore((prev) => !prev)}
                  className="mt-2 rounded-md text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  aria-expanded={showMore}>
                  {showMore ? "Show less" : "Read more"}
                </button>
              )}
            </div>

            {/* META INFORMATION */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem
                icon={CalendarDays}
                label="Created"
                value={product.created}
              />

              <InfoItem
                icon={Clock3}
                label="Last Updated"
                value={product.updated}
              />

              <InfoItem icon={User} label="Seller" value={product.seller} />

              <InfoItem
                icon={Package}
                label="Stock"
                value={`${product.stock} units`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          PERFORMANCE
      ========================================= */}
      <div>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"
            />

            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              Product Performance
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Overview of this product&apos;s sales performance.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <PerformanceCard
            icon={ShoppingCart}
            label="Total Sales"
            value={Number(product.sales || 0).toLocaleString()}
            description="Units sold"
            iconStyle="indigo"
          />

          <PerformanceCard
            icon={DollarSign}
            label="Revenue"
            value={`$${Number(product.revenue || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            description="Total generated"
            iconStyle="green"
          />

          <PerformanceCard
            icon={TrendingUp}
            label="Avg. Price"
            value={formatPrice(product.price)}
            description="Per unit"
            iconStyle="blue"
          />

          <PerformanceCard
            icon={Package}
            label="Current Stock"
            value={Number(product.stock || 0).toLocaleString()}
            description="Units available"
            iconStyle="amber"
          />
        </div>
      </div>

      {/* =========================================
          LOWER CONTENT
      ========================================= */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* PRODUCT INFORMATION */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <Package size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
                  Product Information
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Complete product details.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2 sm:p-6">
            <DetailRow label="Product Name" value={product.name} />

            <DetailRow label="SKU" value={product.sku} />

            <DetailRow label="Category" value={product.category} />

            <DetailRow label="Price" value={formatPrice(product.price)} />

            <DetailRow
              label="Stock Quantity"
              value={`${product.stock} units`}
            />

            <DetailRow label="Status" value={product.status} />

            <DetailRow label="Seller" value={product.seller} />

            <DetailRow label="Created" value={product.created} />
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                <Clock3 size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
                  Recent Activity
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Latest product events.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;

              return (
                <ActivityItem
                  key={activity.id}
                  Icon={Icon}
                  title={activity.title}
                  description={activity.description}
                  time={activity.time}
                  type={activity.type}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================
          BOTTOM ACTIONS
      ========================================= */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => navigate("/admin/all/products")}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 dark:focus:ring-offset-slate-950">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Products
        </button>

        <button
          type="button"
          onClick={handleEdit}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-offset-slate-950">
          <Edit3 size={16} aria-hidden="true" />
          Edit Product
        </button>
      </div>
    </div>
  );
};

/* =========================================
   PRODUCT STATUS
========================================= */
const ProductStatus = ({ status }) => {
  const styles = {
    Active: {
      wrapper:
        "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
      Icon: CheckCircle2,
    },

    "Low stock": {
      wrapper:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
      Icon: AlertTriangle,
    },

    "Out of stock": {
      wrapper: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
      Icon: XCircle,
    },

    Draft: {
      wrapper:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
      Icon: Clock3,
    },
  };

  const current = styles[status] || styles.Draft;
  const Icon = current.Icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${current.wrapper}`}>
      <Icon size={14} aria-hidden="true" />
      {status}
    </span>
  );
};

/* =========================================
   INFO ITEM
========================================= */
const InfoItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950">
      <div
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
        <Icon size={16} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p
          className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-white"
          title={value}>
          {value}
        </p>
      </div>
    </div>
  );
};

/* =========================================
   PERFORMANCE CARD
========================================= */
const PerformanceCard = ({
  icon: Icon,
  label,
  value,
  description,
  iconStyle,
}) => {
  const styles = {
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",

    green:
      "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400",

    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",

    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
  };

  const currentStyle = styles[iconStyle] || styles.indigo;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div
        aria-hidden="true"
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${currentStyle}`}>
        <Icon size={18} />
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-xl font-bold text-slate-950 dark:text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
};

/* =========================================
   DETAIL ROW
========================================= */
const DetailRow = ({ label, value }) => {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-semibold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
};

/* =========================================
   ACTIVITY ITEM
========================================= */
const ActivityItem = ({ Icon, title, description, time, type }) => {
  const styles = {
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",

    green:
      "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400",

    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
  };

  const current = styles[type] || styles.indigo;

  return (
    <div className="flex gap-3 p-4">
      <div
        aria-hidden="true"
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${current}`}>
        <Icon size={15} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-semibold text-slate-900 dark:text-white">
          {title}
        </p>

        <p className="mt-1 break-words text-xs leading-5 text-slate-500 dark:text-slate-400">
          {description}
        </p>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <Clock3 size={12} aria-hidden="true" />
          {time}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
