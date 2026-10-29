import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Eye,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { useCategories } from "../../context/CategoryContext";

const statuses = ["All", "Active", "Draft"];
const PRODUCTS_PER_PAGE = 5;

const getStockStatus = (stock) => {
  const quantity = Number(stock) || 0;

  if (quantity <= 0) return "Out of stock";
  if (quantity <= 5) return "Low stock";

  return "In stock";
};

const getProductStatus = (status) => (status === "Active" ? "Active" : "Draft");

const formatPrice = (price) => {
  const numericPrice = Number(price);

  return Number.isFinite(numericPrice)
    ? `$${numericPrice.toFixed(2)}`
    : "$0.00";
};

export default function AllProducts() {
  const navigate = useNavigate();

  const { products, deleteProduct: deleteProductById } = useProducts();
  const { categories: availableCategories } = useCategories();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Use category names from CategoryContext only.
  const categoryOptions = useMemo(() => {
    const names = availableCategories
      .filter((category) => category.status === "Active")
      .map((category) => category.name?.trim())
      .filter(Boolean);

    return ["All", ...new Set(names)];
  }, [availableCategories]);

  const filteredProducts = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return products.filter((product) => {
      const name = product.name?.toLowerCase() || "";
      const category = product.category?.toLowerCase() || "";
      const sku = product.sku?.toLowerCase() || "";

      const matchesSearch =
        name.includes(searchValue) ||
        category.includes(searchValue) ||
        sku.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        getProductStatus(product.status) === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        product.category?.trim().toLowerCase() ===
          categoryFilter.trim().toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, search, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const startItem =
    filteredProducts.length === 0
      ? 0
      : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;

  const endItem = Math.min(
    currentPage * PRODUCTS_PER_PAGE,
    filteredProducts.length,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, categoryFilter]);

  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(1);
    } else if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const productStats = useMemo(
    () => ({
      total: products.length,
      active: products.filter(
        (product) => getProductStatus(product.status) === "Active",
      ).length,
      lowStock: products.filter(
        (product) => getStockStatus(product.stock) === "Low stock",
      ).length,
      outOfStock: products.filter(
        (product) => getStockStatus(product.stock) === "Out of stock",
      ).length,
    }),
    [products],
  );

  const hasFilters =
    search.trim() !== "" || statusFilter !== "All" || categoryFilter !== "All";

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setCurrentPage(1);
  };

  const handleDeleteProduct = () => {
    if (!deleteProduct) return;

    deleteProductById(deleteProduct.id);
    setDeleteProduct(null);
    setOpenMenu(null);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Product Management
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Products
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your products and inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/add/product")}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:focus:ring-offset-slate-950">
          <Plus size={17} />
          Add Product
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <ProductStat
          label="Total Products"
          value={productStats.total}
          icon={<Package size={19} />}
          iconClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
        />

        <ProductStat
          label="Active"
          value={productStats.active}
          icon={<span className="h-2.5 w-2.5 rounded-full bg-green-500" />}
          iconClass="bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400"
        />

        <ProductStat
          label="Low Stock"
          value={productStats.lowStock}
          icon={<span className="h-2.5 w-2.5 rounded-full bg-amber-500" />}
          iconClass="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
        />

        <ProductStat
          label="Out of Stock"
          value={productStats.outOfStock}
          icon={<span className="h-2.5 w-2.5 rounded-full bg-red-500" />}
          iconClass="bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
        />
      </div>

      {/* Products table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Search and filters */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <SlidersHorizontal
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                aria-label="Filter by category"
                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-700 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 sm:w-44">
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category === "All" ? "All categories" : category}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by product status"
                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-9 text-sm text-slate-700 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 sm:w-36">
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "All" ? "All statuses" : status}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-indigo-950/40">
                <X size={14} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px]">
            <caption className="sr-only">Product inventory list</caption>

            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/40">
                <TableHeader>Product</TableHeader>
                <TableHeader>Category</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader>Stock</TableHeader>
                <TableHeader>Status</TableHeader>
                <th scope="col" className="w-16 px-5 py-3.5">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="transition hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <ProductImage
                          image={product.image}
                          name={product.name}
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {product.name}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                            {product.sku ||
                              `Product #${String(product.id).padStart(4, "0")}`}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {product.category || "Uncategorized"}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                      {formatPrice(product.price)}
                    </td>

                    <td className="px-5 py-4">
                      <StockValue stock={product.stock} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-col items-start gap-1.5">
                        <ProductStatus status={product.status} />
                        <InventoryStatus stock={product.stock} />
                      </div>
                    </td>

                    <td className="relative px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === product.id ? null : product.id,
                          )
                        }
                        aria-label={`Actions for ${product.name}`}
                        aria-expanded={openMenu === product.id}
                        aria-haspopup="menu"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400">
                        <MoreHorizontal size={18} />
                      </button>

                      {openMenu === product.id && (
                        <div
                          role="menu"
                          className="absolute right-5 top-12 z-20 w-36 rounded-lg border border-slate-200 bg-white p-1.5 text-left shadow-xl dark:border-slate-700 dark:bg-slate-900">
                          <ProductAction
                            icon={<Eye size={15} />}
                            label="View"
                            onClick={() => {
                              setOpenMenu(null);
                              navigate(`/admin/all/products/${product.id}`);
                            }}
                          />

                          <ProductAction
                            icon={<Pencil size={15} />}
                            label="Edit"
                            onClick={() => {
                              setOpenMenu(null);
                              navigate(`/admin/product/${product.id}/edit`);
                            }}
                          />

                          <ProductAction
                            danger
                            icon={<Trash2 size={15} />}
                            label="Delete"
                            onClick={() => {
                              setOpenMenu(null);
                              setDeleteProduct(product);
                            }}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-14">
                    <EmptyProducts hasFilters={hasFilters} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <div key={product.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <ProductImage image={product.image} name={product.name} />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                        {product.category || "Uncategorized"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(openMenu === product.id ? null : product.id)
                    }
                    aria-label={`Actions for ${product.name}`}
                    aria-expanded={openMenu === product.id}
                    aria-haspopup="menu"
                    className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                      Price
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                      Stock
                    </p>
                    <StockValue stock={product.stock} />
                  </div>

                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                      Status
                    </p>
                    <div className="flex flex-col items-start gap-1">
                      <ProductStatus status={product.status} mobile />
                      <InventoryStatus stock={product.stock} mobile />
                    </div>
                  </div>
                </div>

                {openMenu === product.id && (
                  <div
                    role="menu"
                    className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <MobileAction
                      icon={<Eye size={14} />}
                      label="View"
                      onClick={() => {
                        setOpenMenu(null);
                        navigate(`/admin/all/products/${product.id}`);
                      }}
                    />

                    <MobileAction
                      icon={<Pencil size={14} />}
                      label="Edit"
                      onClick={() => {
                        setOpenMenu(null);
                        navigate(`/admin/product/${product.id}/edit`);
                      }}
                    />

                    <MobileAction
                      danger
                      icon={<Trash2 size={14} />}
                      label="Delete"
                      onClick={() => {
                        setOpenMenu(null);
                        setDeleteProduct(product);
                      }}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="px-5 py-14">
              <EmptyProducts hasFilters={hasFilters} />
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing{" "}
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {startItem}-{endItem}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300">
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    aria-label={`Go to page ${page}`}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      currentPage === page
                        ? "bg-indigo-600 text-white dark:bg-indigo-500"
                        : "border border-slate-200 text-slate-600 hover:bg-indigo-50 dark:border-slate-700 dark:text-slate-300"
                    }`}>
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(page + 1, totalPages))
                }
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300">
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteProduct(null);
            }
          }}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
            aria-describedby="delete-product-description"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400">
                  <Trash2 size={20} />
                </div>

                <div>
                  <h2
                    id="delete-product-title"
                    className="text-lg font-semibold text-slate-950 dark:text-white">
                    Delete product?
                  </h2>

                  <p
                    id="delete-product-description"
                    className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {deleteProduct.name}
                    </span>
                    ?
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDeleteProduct(null)}
                aria-label="Close delete confirmation"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>

            <div className="mx-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 dark:border-red-900/40 dark:bg-red-950/20">
              <p className="text-xs leading-5 text-red-600 dark:text-red-400">
                This action cannot be undone. The product will be removed from
                your product list.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 p-6 dark:border-slate-800 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteProduct(null)}
                className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteProduct}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-500 px-4 text-sm font-semibold text-white hover:bg-red-600">
                <Trash2 size={16} />
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductImage({ image, name }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
      {image && !imageFailed ? (
        <img
          src={image}
          alt={name || "Product"}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <Package size={18} aria-hidden="true" />
      )}
    </div>
  );
}

function TableHeader({ children }) {
  return (
    <th
      scope="col"
      className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
      {children}
    </th>
  );
}

function ProductStat({ label, value, icon, iconClass }) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
          {label}
        </p>
        <div
          aria-hidden="true"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

function ProductStatus({ status, mobile = false }) {
  const isActive = getProductStatus(status) === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${
        isActive
          ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
      } ${mobile ? "px-2 py-1 text-[10px]" : "px-2.5 py-1 text-xs"}`}>
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-green-500" : "bg-slate-400"
        }`}
      />
      {getProductStatus(status)}
    </span>
  );
}

function StockValue({ stock }) {
  const quantity = Number(stock) || 0;

  let className = "text-sm font-medium text-slate-700 dark:text-slate-300";

  if (quantity <= 0) {
    className = "text-sm font-semibold text-red-600 dark:text-red-400";
  } else if (quantity <= 5) {
    className = "text-sm font-semibold text-amber-600 dark:text-amber-400";
  }

  return <span className={className}>{quantity}</span>;
}

function InventoryStatus({ stock, mobile = false }) {
  const status = getStockStatus(stock);

  const styles = {
    "In stock": {
      wrapper:
        "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
      dot: "bg-green-500",
    },
    "Low stock": {
      wrapper:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
      dot: "bg-amber-500",
    },
    "Out of stock": {
      wrapper: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
      dot: "bg-red-500",
    },
  };

  const style = styles[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${
        style.wrapper
      } ${mobile ? "px-2 py-1 text-[10px]" : "px-2.5 py-1 text-xs"}`}>
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
      />
      {status}
    </span>
  );
}

function ProductAction({ icon, label, onClick, danger = false }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
        danger
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
          : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
      }`}>
      {icon}
      {label}
    </button>
  );
}

function MobileAction({ icon, label, onClick, danger = false }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition ${
        danger
          ? "border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
          : "border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
      }`}>
      {icon}
      {label}
    </button>
  );
}

function EmptyProducts({ hasFilters = false }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400">
        <Package size={23} />
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
        No products found
      </p>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {hasFilters
          ? "Try changing your search or filters."
          : "There are no products available yet."}
      </p>
    </div>
  );
}
