import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { ordersData } from "../data/ordersData";

const OrderContext = createContext(null);

const ORDERS_STORAGE_KEY = "sardar_ks_ui_orders";

const normalizeOrderId = (id) =>
  String(id ?? "")
    .trim()
    .replace(/^#/, "");

const getInitialOrders = () => {
  try {
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);

    if (savedOrders !== null) {
      const parsedOrders = JSON.parse(savedOrders);

      if (Array.isArray(parsedOrders)) {
        return parsedOrders;
      }
    }
  } catch (error) {
    console.error("Failed to load saved orders:", error);
  }

  return ordersData;
};

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(getInitialOrders);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("Failed to save orders:", error);
    }
  }, [orders]);

  const getOrderById = useCallback(
    (id) =>
      orders.find(
        (order) => normalizeOrderId(order.id) === normalizeOrderId(id),
      ),
    [orders],
  );

  const addOrder = useCallback((newOrder) => {
    setOrders((currentOrders) => [newOrder, ...currentOrders]);
  }, []);

  const updateOrder = useCallback((id, updates) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        normalizeOrderId(order.id) === normalizeOrderId(id)
          ? { ...order, ...updates }
          : order,
      ),
    );
  }, []);

  const deleteOrder = useCallback((id) => {
    setOrders((currentOrders) =>
      currentOrders.filter(
        (order) => normalizeOrderId(order.id) !== normalizeOrderId(id),
      ),
    );
  }, []);

  const value = {
    orders,
    setOrders,
    getOrderById,
    addOrder,
    updateOrder,
    deleteOrder,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrders must be used inside an OrderProvider");
  }

  return context;
}
