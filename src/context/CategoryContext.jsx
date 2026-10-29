import { createContext, useContext, useEffect, useState } from "react";

const CategoryContext = createContext(null);

const initialCategories = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and accessories.",
    status: "Active",
    products: 120,
    createdAt: "2026-01-12",
  },
  {
    id: 2,
    name: "Clothing",
    description: "Clothing, fashion, and apparel.",
    status: "Active",
    products: 85,
    createdAt: "2026-01-18",
  },
  {
    id: 3,
    name: "Home & Garden",
    description: "Home improvement and garden products.",
    status: "Active",
    products: 64,
    createdAt: "2026-02-02",
  },
  {
    id: 4,
    name: "Sports",
    description: "Sports equipment and fitness accessories.",
    status: "Active",
    products: 42,
    createdAt: "2026-02-11",
  },
  {
    id: 5,
    name: "Books",
    description: "Books and educational materials.",
    status: "Active",
    products: 37,
    createdAt: "2026-02-19",
  },
  {
    id: 6,
    name: "Beauty",
    description: "Beauty and personal care products.",
    status: "Inactive",
    products: 29,
    createdAt: "2026-03-04",
  },
  {
    id: 7,
    name: "Automotive",
    description: "Automotive parts and accessories.",
    status: "Active",
    products: 18,
    createdAt: "2026-03-15",
  },
  {
    id: 8,
    name: "Toys",
    description: "Toys, games, and children's products.",
    status: "Inactive",
    products: 15,
    createdAt: "2026-03-21",
  },
  {
    id: 9,
    name: "Accessories",
    description: "Bags, wallets, and everyday accessories.",
    status: "Active",
    products: 0,
    createdAt: "2026-04-01",
  },
  {
    id: 10,
    name: "Wearables",
    description: "Wearable technology and smart devices.",
    status: "Active",
    products: 0,
    createdAt: "2026-04-01",
  },
];

const STORAGE_KEY = "admin_categories";

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState(() => {
    try {
      const savedCategories = localStorage.getItem(STORAGE_KEY);

      if (savedCategories !== null) {
        const parsedCategories = JSON.parse(savedCategories);
        if (Array.isArray(parsedCategories)) {
          const savedCategories = parsedCategories.map((category) => ({
            ...category,
            createdAt:
              category.createdAt ||
              initialCategories.find(
                (initialCategory) =>
                  String(initialCategory.id) === String(category.id),
              )?.createdAt ||
              "—",
          }));

          const savedCategoryNames = new Set(
            savedCategories.map((category) =>
              category.name?.trim().toLowerCase(),
            ),
          );

          const savedCategoryIds = new Set(
            savedCategories.map((category) => String(category.id)),
          );

          const missingCategories = initialCategories.filter(
            (initialCategory) =>
              !savedCategoryIds.has(String(initialCategory.id)) &&
              !savedCategoryNames.has(
                initialCategory.name.trim().toLowerCase(),
              ),
          );

          return [...savedCategories, ...missingCategories];
        }
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    }

    return initialCategories;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error("Failed to save categories:", error);
    }
  }, [categories]);

  const addCategory = (categoryData) => {
    const today = new Date().toISOString().split("T")[0];

    const newCategory = {
      ...categoryData,
      id: `category-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      products: 0,
      createdAt: categoryData.createdAt || today,
    };

    setCategories((currentCategories) => [newCategory, ...currentCategories]);

    return newCategory;
  };

  const updateCategory = (categoryId, updatedData) => {
    const currentCategory = categories.find(
      (category) => String(category.id) === String(categoryId),
    );

    if (!currentCategory) return;

    const oldName = currentCategory.name.trim();
    const newName = updatedData.name.trim();

    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        String(category.id) === String(categoryId)
          ? {
              ...category,
              ...updatedData,
              name: newName,
              id: category.id,
              createdAt: category.createdAt,
            }
          : category,
      ),
    );

    if (oldName.toLowerCase() !== newName.toLowerCase()) {
      window.dispatchEvent(
        new CustomEvent("category-renamed", {
          detail: { oldName, newName },
        }),
      );
    }
  };

  const deleteCategory = (categoryId) => {
    setCategories((currentCategories) =>
      currentCategories.filter(
        (category) => String(category.id) !== String(categoryId),
      ),
    );
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
      }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);

  if (!context) {
    throw new Error("useCategories must be used inside a CategoryProvider.");
  }

  return context;
};
