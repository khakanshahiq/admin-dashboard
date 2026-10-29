import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Package,
  Save,
  Tag,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { useCategories } from "../../context/CategoryContext";
const EditProduct = () => {
  const { products, getProductById, updateProduct } = useProducts();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const { id } = useParams();
  const product = getProductById(id);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    status: "Active",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState("");
  const [saved, setSaved] = useState(false);

  /* =========================================
     LOAD PRODUCT DATA
  ========================================= */

  useEffect(() => {
    if (!product) return;

    setFormData({
      name: product.name || "",
      sku: product.sku || "",
      category: product.category || "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      status:
        product.status === "Low stock" || product.status === "Out of stock"
          ? "Active"
          : product.status || "Active",
      description: product.description || "",
    });

    setImage(
      product.image
        ? {
            preview: product.image,
          }
        : null,
    );

    setErrors({});
    setImageError("");
    setSaved(false);
  }, [id]);

  /* =========================================
     REDIRECT AFTER SAVE
  ========================================= */

  useEffect(() => {
    if (!saved || !product) return;

    const timer = setTimeout(() => {
      navigate(`/admin/all/products`);
    }, 800);

    return () => clearTimeout(timer);
  }, [saved, product, navigate]);

  /* =========================================
     CLEANUP IMAGE PREVIEW
  ========================================= */

  useEffect(() => {
    return () => {
      if (image?.file && image.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [image]);

  /* =========================================
     HANDLE INPUT CHANGE
  ========================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /* =========================================
     HANDLE IMAGE CHANGE
  ========================================= */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImage({
          file,
          preview: reader.result,
        });
      }
    };

    reader.readAsDataURL(file);
  };

  /* =========================================
     REMOVE IMAGE
  ========================================= */

  const removeImage = () => {
    if (image?.file && image.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(image.preview);
    }

    setImage(null);
    setImageError("");
  };

  /* =========================================
     VALIDATION
  ========================================= */

  const validateForm = () => {
    const newErrors = {};

    const name = formData.name.trim();
    const category = formData.category;
    const price = formData.price;
    const stock = formData.stock;

    if (!name) {
      newErrors.name = "Product name is required.";
    } else if (name.length < 2) {
      newErrors.name = "Product name must be at least 2 characters.";
    }

    if (!category) {
      newErrors.category = "Please select a category.";
    }

    if (price === "") {
      newErrors.price = "Price is required.";
    } else if (!Number.isFinite(Number(price))) {
      newErrors.price = "Please enter a valid price.";
    } else if (Number(price) < 0) {
      newErrors.price = "Price cannot be negative.";
    }

    if (stock === "") {
      newErrors.stock = "Stock quantity is required.";
    } else if (!Number.isInteger(Number(stock))) {
      newErrors.stock = "Stock quantity must be a whole number.";
    } else if (Number(stock) < 0) {
      newErrors.stock = "Stock quantity cannot be negative.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (saved) return;

    if (!validateForm()) return;

    const normalizedSku = formData.sku.trim().toLowerCase();

    const duplicateSku = normalizedSku
      ? products.some(
          (item) =>
            item.id !== product.id &&
            item.sku?.trim().toLowerCase() === normalizedSku,
        )
      : false;

    if (duplicateSku) {
      setErrors((prev) => ({
        ...prev,
        sku: "This SKU is already in use.",
      }));
      return;
    }

    updateProduct(product.id, {
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      status: formData.status,
      description: formData.description.trim(),
      image: image?.preview || "",
    });

    setSaved(true);
  };

  /* =========================================
     INPUT CLASSES
  ========================================= */

  const inputClass = (fieldName) =>
    `
      h-11 w-full rounded-lg border bg-white px-3.5 text-sm
      text-slate-900 outline-none transition
      placeholder:text-slate-400
      dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500
      ${
        errors[fieldName]
          ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-red-800 dark:focus:border-red-500 dark:focus:ring-red-950"
          : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
      }
    `;

  const selectClass = (fieldName) =>
    `
      h-11 w-full rounded-lg border bg-white px-3.5 text-sm
      text-slate-700 outline-none transition
      dark:bg-slate-950 dark:text-slate-300
      ${
        errors[fieldName]
          ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-red-800 dark:focus:border-red-500 dark:focus:ring-red-950"
          : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
      }
    `;

  /* =========================================
     PRODUCT NOT FOUND
  ========================================= */

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Package size={28} aria-hidden="true" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
            Product not found
          </h2>

          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
            The product you are trying to edit does not exist.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/all/products")}
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate(`/admin/all/products/${product.id}`)}
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 dark:focus:ring-offset-slate-950"
            aria-label="Back to product details">
            <ArrowLeft size={18} aria-hidden="true" />
          </button>

          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />

              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Product Management
              </p>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                #{String(product.id).padStart(4, "0")}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              Edit Product
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Update your product information and inventory.
            </p>
          </div>
        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      {saved && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900/50 dark:bg-green-950/20">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400">
            <Check size={17} aria-hidden="true" />
          </div>

          <div>
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">
              Product updated successfully
            </p>

            <p className="mt-0.5 text-xs text-green-700/70 dark:text-green-400/70">
              Redirecting to product details...
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* MAIN CONTENT */}
          <div className="space-y-6 xl:col-span-2">
            {/* PRODUCT INFORMATION */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-900/50">
                    <Package size={19} aria-hidden="true" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-950 dark:text-white">
                      Product Information
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      Update the basic information for your product.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-5 sm:p-6">
                {/* PRODUCT NAME */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Product Name
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Wireless Headphones"
                    maxLength={100}
                    autoComplete="off"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={inputClass("name")}
                  />

                  {errors.name && (
                    <p
                      id="name-error"
                      role="alert"
                      className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* SKU + CATEGORY */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="sku"
                      className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      SKU
                    </label>

                    <input
                      id="sku"
                      name="sku"
                      type="text"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder="e.g. WH-1001"
                      maxLength={50}
                      autoComplete="off"
                      className={inputClass("sku")}
                    />

                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                      Unique identifier for this product.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Category
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.category)}
                      aria-describedby={
                        errors.category ? "category-error" : undefined
                      }
                      className={selectClass("category")}>
                      <option value="">Select category</option>

                      {categories
                        .filter(
                          (category) =>
                            category.status === "Active" ||
                            category.name === formData.category,
                        )
                        .map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}

                      {formData.category &&
                        !categories.some(
                          (category) => category.name === formData.category,
                        ) && (
                          <option value={formData.category}>
                            {formData.category}
                          </option>
                        )}
                    </select>

                    {errors.category && (
                      <p
                        id="category-error"
                        role="alert"
                        className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
                        {errors.category}
                      </p>
                    )}
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Description
                    </label>

                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {formData.description.length}/1000
                    </span>
                  </div>

                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    maxLength={1000}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Write a description for your product..."
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
                  />

                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                    Describe the product, its features, and key benefits.
                  </p>
                </div>
              </div>
            </section>

            {/* PRICING & INVENTORY */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 ring-1 ring-green-100 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-900/40">
                    <Tag size={19} aria-hidden="true" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-950 dark:text-white">
                      Pricing & Inventory
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      Update the price and available stock.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
                {/* PRICE */}
                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Price
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400"
                      aria-hidden="true">
                      $
                    </span>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      autoComplete="off"
                      aria-invalid={Boolean(errors.price)}
                      aria-describedby={
                        errors.price ? "price-error" : undefined
                      }
                      className={`${inputClass("price")} pl-8`}
                    />
                  </div>

                  {errors.price && (
                    <p
                      id="price-error"
                      role="alert"
                      className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
                      {errors.price}
                    </p>
                  )}
                </div>

                {/* STOCK */}
                <div>
                  <label
                    htmlFor="stock"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Stock Quantity
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    autoComplete="off"
                    aria-invalid={Boolean(errors.stock)}
                    aria-describedby={errors.stock ? "stock-error" : undefined}
                    className={inputClass("stock")}
                  />

                  {errors.stock && (
                    <p
                      id="stock-error"
                      role="alert"
                      className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
                      {errors.stock}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* PRODUCT IMAGE */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                    <ImagePlus size={18} aria-hidden="true" />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
                      Product Image
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Replace the main image if needed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {image ? (
                  <div className="relative overflow-hidden rounded-xl border border-indigo-100 bg-slate-50 ring-1 ring-indigo-100 dark:border-indigo-900/50 dark:bg-slate-950 dark:ring-indigo-900/40">
                    <img
                      src={image.preview}
                      alt={formData.name || "Product preview"}
                      className="aspect-square w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 shadow-md transition hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:text-red-400 dark:focus:ring-offset-slate-950"
                      aria-label="Remove product image">
                      <X size={17} aria-hidden="true" />
                    </button>

                    <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm">
                      <Check size={13} aria-hidden="true" />
                      Image selected
                    </div>
                  </div>
                ) : (
                  <label className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100 transition group-hover:scale-105 group-hover:ring-indigo-200 dark:bg-slate-900 dark:text-indigo-400 dark:ring-slate-800 dark:group-hover:ring-indigo-900">
                      <ImagePlus size={21} aria-hidden="true" />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-700 transition group-hover:text-indigo-600 dark:text-slate-300 dark:group-hover:text-indigo-400">
                      Upload new image
                    </p>

                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      PNG, JPG or WEBP
                    </p>

                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      Maximum 2MB
                    </p>

                    <p className="mt-3 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
                      Click to browse
                    </p>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                      aria-label="Upload product image"
                    />
                  </label>
                )}

                {imageError && (
                  <p
                    role="alert"
                    className="mt-3 text-xs font-medium text-red-600 dark:text-red-400">
                    {imageError}
                  </p>
                )}
              </div>
            </section>

            {/* PRODUCT STATUS */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                    <Check size={17} aria-hidden="true" />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
                      Product Status
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Control product visibility.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={selectClass("status")}>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <div className="mt-3">
                  {formData.status === "Active" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Visible in store
                    </span>
                  )}

                  {formData.status === "Draft" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Not published
                    </span>
                  )}

                  {formData.status === "Inactive" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      Hidden from store
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* PRODUCT SUMMARY */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
                <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
                  Product Summary
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Current product information.
                </p>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Product ID
                  </span>

                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    #{String(product.id).padStart(4, "0")}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    SKU
                  </span>

                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {formData.sku || "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Category
                  </span>

                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                    {formData.category || "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Current stock
                  </span>

                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {formData.stock || "0"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Price
                  </span>

                  <span className="text-sm font-bold text-slate-950 dark:text-white">
                    $
                    {formData.price
                      ? Number(formData.price).toFixed(2)
                      : "0.00"}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* FORM ACTIONS */}
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate(`/admin/all/products/${product.id}`)}
            disabled={saved}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 dark:focus:ring-offset-slate-950">
            <X size={17} aria-hidden="true" />
            Cancel
          </button>

          <button
            type="submit"
            disabled={saved}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:hover:shadow-indigo-950/40 dark:focus:ring-offset-slate-950">
            {saved ? (
              <Check size={17} aria-hidden="true" />
            ) : (
              <Save size={17} aria-hidden="true" />
            )}

            {saved ? "Product Saved" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
