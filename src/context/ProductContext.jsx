
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { productsData } from "../data/productsData";

const ProductContext = createContext(null);
const STORAGE_KEY = "sardar_ks_ui_products";

const normalizeCategory = (category) => {
  const categoryMap = {
    fashion: "Clothing",
    "home & living": "Home & Garden",
  };

  const name = category?.trim() || "";
  return categoryMap[name.toLowerCase()] || name;
};

const normalizeProducts = (items) =>
  items.map((product) => ({
    ...product,
    category: normalizeCategory(product.category),
  }));

const getInitialProducts = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return normalizeProducts(parsed);
      }
    }
  } catch (error) {
    console.error("Failed to load saved products:", error);
  }

  return normalizeProducts(productsData);
};

const getToday = () =>
  new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(getInitialProducts);

  // Save product changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error("Failed to save products:", error);
    }
  }, [products]);

  // Update existing products when a category is renamed.
  useEffect(() => {
    const handleCategoryRenamed = (event) => {
      const { oldName, newName } = event.detail || {};

      if (
        !oldName?.trim() ||
        !newName?.trim() ||
        oldName.trim().toLowerCase() === newName.trim().toLowerCase()
      ) {
        return;
      }

      const oldCategory = oldName.trim().toLowerCase();
      const renamedCategory = newName.trim();

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.category?.trim().toLowerCase() === oldCategory
            ? { ...product, category: renamedCategory }
            : product,
        ),
      );
    };

    window.addEventListener("category-renamed", handleCategoryRenamed);

    return () => {
      window.removeEventListener("category-renamed", handleCategoryRenamed);
    };
  }, []);

  const getProductById = useCallback(
    (id) => products.find((product) => String(product.id) === String(id)),
    [products],
  );

  const addProduct = useCallback((productData) => {
    const today = getToday();

    const newProduct = {
      ...productData,
      category: normalizeCategory(productData.category),
      id: Date.now(),
      created: today,
      updated: today,
      sales: 0,
      revenue: 0,
      seller: "Sardar KS UI Store",
    };

    setProducts((currentProducts) => [newProduct, ...currentProducts]);

    return newProduct;
  }, []);

  const updateProduct = useCallback((id, updates) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        String(product.id) === String(id)
          ? {
              ...product,
              ...updates,
              category:
                updates.category !== undefined
                  ? normalizeCategory(updates.category)
                  : product.category,
              id: product.id,
              updated: getToday(),
            }
          : product,
      ),
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => String(product.id) !== String(id),
      ),
    );
  }, []);

  const value = {
    products,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used inside a ProductProvider");
  }

  return context;
}
