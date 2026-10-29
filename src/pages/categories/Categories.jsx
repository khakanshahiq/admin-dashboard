import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Edit,
  Eye,
  FolderTree,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react";

import { useCategories } from "../../context/CategoryContext";
import { useProducts } from "../../context/ProductContext";

const CATEGORIES_PER_PAGE = 5;

const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } =
    useCategories();

  const { products } = useProducts();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeleteCategory, setSelectedDeleteCategory] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewCategory, setViewCategory] = useState(null);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [formError, setFormError] = useState("");

  // Calculate actual product counts from ProductContext.
  const categoriesWithProductCounts = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      products: products.filter(
        (product) =>
          product.category?.trim().toLowerCase() ===
          category.name.trim().toLowerCase(),
      ).length,
    }));
  }, [categories, products]);

  // Close an open action menu when clicking elsewhere.
  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Statistics.
  const totalCategories = categoriesWithProductCounts.length;

  const activeCategories = categoriesWithProductCounts.filter(
    (category) => category.status === "Active",
  ).length;

  const inactiveCategories = categoriesWithProductCounts.filter(
    (category) => category.status === "Inactive",
  ).length;

  const totalProducts = products.length;

  // Search and status filtering.
  const filteredCategories = useMemo(() => {
    return categoriesWithProductCounts.filter((category) => {
      const searchTerm = search.trim().toLowerCase();

      const matchesSearch =
        category.name.toLowerCase().includes(searchTerm) ||
        (category.description || "").toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" || category.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categoriesWithProductCounts, search, statusFilter]);

  // Reset pagination when filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Keep the current page valid if categories are deleted.
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / CATEGORIES_PER_PAGE),
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * CATEGORIES_PER_PAGE;

    return filteredCategories.slice(
      startIndex,
      startIndex + CATEGORIES_PER_PAGE,
    );
  }, [filteredCategories, currentPage]);

  // Add category.
  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      status: "Active",
    });
    setFormError("");
    setShowFormModal(true);
  };

  // Edit category.
  const openEditModal = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name,
      description: category.description || "",
      status: category.status,
    });

    setFormError("");
    setOpenMenu(null);
    setShowFormModal(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Save new category or update an existing category.
  const handleSaveCategory = (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const description = formData.description.trim();

    if (!name) {
      setFormError("Category name is required.");
      return;
    }

    const duplicateCategory = categories.some(
      (category) =>
        category.name.trim().toLowerCase() === name.toLowerCase() &&
        String(category.id) !== String(editingCategory?.id),
    );

    if (duplicateCategory) {
      setFormError("A category with this name already exists.");
      return;
    }

    const categoryData = {
      name,
      description,
      status: formData.status,
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory({
        ...categoryData,
        createdAt: new Date().toISOString().split("T")[0],
      });
    }

    setShowFormModal(false);
    setEditingCategory(null);
    setFormError("");
  };

  // View details.
  const openViewModal = (category) => {
    setViewCategory(category);
    setOpenMenu(null);
    setShowViewModal(true);
  };

  // Delete category.
  const openDeleteModal = (category) => {
    setSelectedDeleteCategory(category);
    setOpenMenu(null);
    setShowDeleteModal(true);
  };

  const handleDeleteCategory = () => {
    if (!selectedDeleteCategory) return;

    deleteCategory(selectedDeleteCategory.id);

    setShowDeleteModal(false);
    setSelectedDeleteCategory(null);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setEditingCategory(null);
    setFormError("");
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedDeleteCategory(null);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewCategory(null);
  };

  // Format dates.
  const formatDate = (date) => {
    if (!date || date === "—") return "—";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Status badge.
  const StatusBadge = ({ status }) => (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        status === "Active"
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
      }`}>
      {status === "Active" ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
      {status}
    </span>
  );

  // Category action menu.
  const CategoryActions = ({ category }) => (
    <div className="relative flex justify-end">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpenMenu((current) =>
            String(current) === String(category.id) ? null : category.id,
          );
        }}
        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
        aria-label={`Actions for ${category.name}`}>
        <MoreHorizontal size={19} />
      </button>

      {String(openMenu) === String(category.id) && (
        <div
          onClick={(event) => event.stopPropagation()}
          className="absolute right-0 top-10 z-20 w-40 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <button
            type="button"
            onClick={() => openViewModal(category)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
            <Eye size={16} />
            View details
          </button>

          <button
            type="button"
            onClick={() => openEditModal(category)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
            <Edit size={16} />
            Edit category
          </button>

          <button
            type="button"
            onClick={() => openDeleteModal(category)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 dark:bg-gray-900 sm:p-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree
              size={25}
              className="text-indigo-600 dark:text-indigo-400"
            />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Categories
            </h1>
          </div>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Organize and manage your product categories.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Categories
          </p>
          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalCategories}
            </h2>
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <FolderTree size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Active Categories
          </p>
          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {activeCategories}
            </h2>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Inactive Categories
          </p>
          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {inactiveCategories}
            </h2>
            <div className="rounded-xl bg-gray-100 p-3 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              <XCircle size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Products Across Categories
          </p>
          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalProducts.toLocaleString()}
            </h2>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <FolderTree size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {/* Search and filters */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-indigo-500/20"
            />
          </div>

          <div className="relative w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pr-10 text-sm text-gray-700 outline-none focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200">
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Description
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Products
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Created
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {paginatedCategories.map((category) => (
                <tr
                  key={category.id}
                  className="transition hover:bg-gray-50/70 dark:hover:bg-gray-700/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                        <FolderTree size={19} />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {category.name}
                      </span>
                    </div>
                  </td>

                  <td className="max-w-xs px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <p className="truncate">
                      {category.description || "No description"}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category.products}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={category.status} />
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(category.createdAt)}
                  </td>

                  <td className="px-6 py-4">
                    <CategoryActions category={category} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-gray-100 dark:divide-gray-700 md:hidden">
          {paginatedCategories.map((category) => (
            <div key={category.id} className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <FolderTree size={19} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                      {category.description || "No description"}
                    </p>
                  </div>
                </div>
                <CategoryActions category={category} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pl-1">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>Products:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {category.products}
                  </span>
                </div>
                <StatusBadge status={category.status} />
              </div>

              <p className="text-xs text-gray-400">
                Created: {formatDate(category.createdAt)}
              </p>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredCategories.length === 0 && (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-700">
              <FolderTree size={25} />
            </div>
            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
              No categories found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try changing your search or status filter.
            </p>
            {(search || statusFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredCategories.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {(currentPage - 1) * CATEGORIES_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {Math.min(
                  currentPage * CATEGORIES_PER_PAGE,
                  filteredCategories.length,
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {filteredCategories.length}
              </span>{" "}
              categories
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}>
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {editingCategory
                    ? "Update the category details."
                    : "Create a new product category."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeFormModal}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close form">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-5 p-6">
              <div>
                <label
                  htmlFor="category-name"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="category-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Electronics"
                  maxLength={100}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="category-description"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Description
                </label>
                <textarea
                  id="category-description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Describe this category..."
                  rows={3}
                  maxLength={500}
                  className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="category-status"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Status
                </label>
                <select
                  id="category-status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {formError && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  {formError}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View details modal */}
      {showViewModal && viewCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Category Details
              </h2>
              <button
                type="button"
                onClick={closeViewModal}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close details">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <FolderTree size={26} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {viewCategory.name}
                  </h3>
                  <div className="mt-2">
                    <StatusBadge status={viewCategory.status} />
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-900/50">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Description
                  </p>
                  <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                    {viewCategory.description || "No description provided"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Products
                    </p>
                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {
                        products.filter(
                          (product) =>
                            product.category?.trim().toLowerCase() ===
                            viewCategory.name.trim().toLowerCase(),
                        ).length
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Created
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(viewCategory.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeViewModal}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && selectedDeleteCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
              <Trash2 size={25} />
            </div>
            <h2 className="mt-4 text-center text-lg font-bold text-gray-900 dark:text-white">
              Delete Category?
            </h2>
            <p className="mt-2 text-center text-sm leading-6 text-gray-500 dark:text-gray-400">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {selectedDeleteCategory.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCategory}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700">
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
