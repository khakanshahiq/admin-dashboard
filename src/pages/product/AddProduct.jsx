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
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { useCategories } from "../../context/CategoryContext";
const Product = () => {
  const navigate = useNavigate();
  const { products, addProduct } = useProducts();
  const { categories } = useCategories();

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

  /* -----------------------------------------
     REDIRECT AFTER SAVE
  ----------------------------------------- */
  useEffect(() => {
    if (!saved) return;

    const timer = setTimeout(() => {
      navigate("/admin/all/products");
    }, 700);

    return () => clearTimeout(timer);
  }, [saved, navigate]);

  /* -----------------------------------------
     CLEAN UP IMAGE PREVIEW
  ----------------------------------------- */

  useEffect(() => {
    return () => {
      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [image]);

  /* -----------------------------------------
     HANDLE INPUT CHANGE
  ----------------------------------------- */
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

  /* -----------------------------------------
     HANDLE IMAGE CHANGE
  ----------------------------------------- */
  // const handleImageChange = (event) => {
  //   const file = event.target.files?.[0];

  //   if (!file) return;

  //   setImageError("");

  //   const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

  //   if (!allowedTypes.includes(file.type)) {
  //     setImageError("Please select a PNG, JPG or WEBP image.");
  //     event.target.value = "";
  //     return;
  //   }

  //   if (file.size > 2 * 1024 * 1024) {
  //     setImageError("Image size must be 2 MB or less.");
  //     event.target.value = "";
  //     return;
  //   }

  //   setImage({
  //     file,
  //     preview: URL.createObjectURL(file),
  //   });
  // };

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

  /* -----------------------------------------
     REMOVE IMAGE
  ----------------------------------------- */
  const removeImage = () => {
    setImage(null);
    setImageError("");
  };

  /* -----------------------------------------
     VALIDATE FORM
  ----------------------------------------- */
  const validateForm = () => {
    const nextErrors = {};

    const productName = formData.name.trim();

    if (!productName) {
      nextErrors.name = "Product name is required.";
    } else if (productName.length < 2) {
      nextErrors.name = "Product name must be at least 2 characters.";
    }

    if (!formData.category) {
      nextErrors.category = "Please select a category.";
    }

    if (formData.price === "") {
      nextErrors.price = "Price is required.";
    } else if (
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      nextErrors.price = "Enter a valid, non-negative price.";
    }

    if (formData.stock === "") {
      nextErrors.stock = "Stock quantity is required.";
    } else if (
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      nextErrors.stock = "Stock must be a non-negative whole number.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /* -----------------------------------------
     HANDLE SUBMIT
  ----------------------------------------- */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (saved) return;

    if (!validateForm()) return;

    const normalizedSku = formData.sku.trim().toLowerCase();

    if (
      normalizedSku &&
      products.some(
        (product) => product.sku?.trim().toLowerCase() === normalizedSku,
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        sku: "This SKU is already in use.",
      }));
      return;
    }

    const imageUrl = image?.preview || "";

    addProduct({
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      status: formData.status,
      description: formData.description.trim(),
      image: imageUrl,
    });

    setSaved(true);
  };

  const inputClass =
    "h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-950";

  const selectClass =
    "h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:focus:border-indigo-500 dark:focus:ring-indigo-950";

  return (
    <div className="space-y-6">
      {/* =========================================
          PAGE HEADER
      ========================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/all/products")}
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 dark:focus:ring-offset-slate-950"
            aria-label="Back to products">
            <ArrowLeft size={18} aria-hidden="true" />
          </button>

          <div>
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
              Add Product
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create a new product for your store.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* =========================================
              MAIN INFORMATION
          ========================================= */}
          <div className="space-y-6 xl:col-span-2">
            {/* Product Information */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
                <div className="flex items-center gap-3">
                  <div
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-900/50">
                    <Package size={19} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-950 dark:text-white">
                      Product Information
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      Add the basic information for your product.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-5 sm:p-6">
                {/* Product Name */}
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
                    className={`${inputClass} ${
                      errors.name
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-800 dark:focus:border-red-500 dark:focus:ring-red-950"
                        : ""
                    }`}
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

                {/* SKU + Category */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* SKU */}
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
                      placeholder="e.g. WH-001"
                      maxLength={50}
                      autoComplete="off"
                      aria-invalid={Boolean(errors.sku)}
                      aria-describedby={errors.sku ? "sku-error" : undefined}
                      className={`${inputClass} ${
                        errors.sku
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-800 dark:focus:border-red-500 dark:focus:ring-red-950"
                          : ""
                      }`}
                    />

                    {errors.sku && (
                      <p
                        id="sku-error"
                        role="alert"
                        className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
                        {errors.sku}
                      </p>
                    )}
                  </div>

                  {/* Category */}
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
                      className={`${selectClass} ${
                        errors.category
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-800 dark:focus:border-red-500 dark:focus:ring-red-950"
                          : ""
                      }`}>
                      <option value="">Select category</option>
                      {categories
                        .filter((category) => category.status === "Active")
                        .map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
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

                {/* Description */}
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
                    rows="6"
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

            {/* Pricing & Inventory */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
                <div className="flex items-center gap-3">
                  <div
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 ring-1 ring-green-100 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-900/40">
                    <Tag size={19} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-950 dark:text-white">
                      Pricing & Inventory
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      Set the price and available stock.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
                {/* Price */}
                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Price
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
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
                      aria-invalid={Boolean(errors.price)}
                      aria-describedby={
                        errors.price ? "price-error" : undefined
                      }
                      className={`${inputClass} pl-8 ${
                        errors.price
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-800 dark:focus:border-red-500 dark:focus:ring-red-950"
                          : ""
                      }`}
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

                {/* Stock */}
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
                    aria-invalid={Boolean(errors.stock)}
                    aria-describedby={errors.stock ? "stock-error" : undefined}
                    className={`${inputClass} ${
                      errors.stock
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-800 dark:focus:border-red-500 dark:focus:ring-red-950"
                        : ""
                    }`}
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

          {/* =========================================
              SIDEBAR
          ========================================= */}
          <div className="space-y-6">
            {/* Product Image */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    aria-hidden="true"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                    <ImagePlus size={18} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
                      Product Image
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Upload a main product image.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {image ? (
                  <div className="relative overflow-hidden rounded-xl border border-indigo-100 bg-slate-50 ring-1 ring-indigo-100 dark:border-indigo-900/50 dark:bg-slate-950 dark:ring-indigo-900/40">
                    <img
                      src={image.preview}
                      alt="Selected product preview"
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
                  <label className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-indigo-300 hover:bg-indigo-50/50 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20 dark:focus-within:border-indigo-500 dark:focus-within:ring-indigo-950">
                    <div
                      aria-hidden="true"
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100 transition group-hover:scale-105 group-hover:ring-indigo-200 dark:bg-slate-900 dark:text-indigo-400 dark:ring-slate-800 dark:group-hover:ring-indigo-900">
                      <ImagePlus size={21} />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-700 transition group-hover:text-indigo-600 dark:text-slate-300 dark:group-hover:text-indigo-400">
                      Upload image
                    </p>

                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      PNG, JPG or WEBP
                    </p>

                    <p className="mt-3 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
                      Click to browse
                    </p>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="sr-only"
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

                <p className="mt-3 text-xs leading-5 text-slate-400 dark:text-slate-500">
                  Recommended: square image, up to 2 MB.
                </p>
              </div>
            </section>

            {/* Status */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    aria-hidden="true"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                    <Check size={17} />
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
                  className={selectClass}>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <div className="mt-3">
                  {formData.status === "Active" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-green-500"
                      />
                      Visible in store
                    </span>
                  )}

                  {formData.status === "Draft" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-amber-500"
                      />
                      Not published
                    </span>
                  )}

                  {formData.status === "Inactive" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-slate-400"
                      />
                      Hidden from store
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Helpful Tip */}
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-5 dark:border-indigo-900/50 dark:bg-indigo-950/20">
              <div className="flex gap-3">
                <div
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm dark:bg-indigo-950 dark:text-indigo-400">
                  <Package size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Product tip
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                    Use a clear product name, accurate pricing and a
                    high-quality image to make your products easier to
                    recognize.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            FORM ACTIONS
        ========================================= */}
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/all/products")}
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

            {saved ? "Product Saved" : "Save Product"}
          </button>
        </div>
      </form>

      {/* =========================================
          SUCCESS TOAST
      ========================================= */}
      {saved && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-green-200 bg-white px-5 py-4 shadow-xl dark:border-green-900/50 dark:bg-slate-900">
          <div
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400">
            <Check size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-white">
              Product created
            </p>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Returning to products...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
