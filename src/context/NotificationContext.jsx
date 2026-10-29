import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New user registered",
      message: "Ahmed has created a new account.",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "New order received",
      message: "Order #1004 has been placed.",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 3,
      title: "Product stock is low",
      message: "Wireless Headphones are running low.",
      time: "30 minutes ago",
      read: false,
    },
    {
      id: 4,
      title: "Report generated",
      message: "Your monthly sales report is ready.",
      time: "1 hour ago",
      read: true,
    },
    {
      id: 5,
      title: "New product added",
      message: "Classic Sneakers were added to your store.",
      time: "2 hours ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};
