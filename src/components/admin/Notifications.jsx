import { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  ShoppingCart,
  UserPlus,
  AlertCircle,
  Info,
  MessageSquare,
} from "lucide-react";

import { useNotifications } from "../../context/NotificationContext";

const Notifications = () => {
  const [filter, setFilter] = useState("all");

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const readCount = notifications.length - unreadCount;

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") {
      return !notification.read;
    }

    if (filter === "read") {
      return notification.read;
    }

    return true;
  });

  const getNotificationIcon = (notification) => {
    const text = `${notification.title} ${notification.message}`.toLowerCase();

    if (
      text.includes("order") ||
      text.includes("purchase") ||
      text.includes("sale")
    ) {
      return <ShoppingCart size={19} />;
    }

    if (
      text.includes("user") ||
      text.includes("member") ||
      text.includes("account")
    ) {
      return <UserPlus size={19} />;
    }

    if (
      text.includes("warning") ||
      text.includes("alert") ||
      text.includes("failed")
    ) {
      return <AlertCircle size={19} />;
    }

    if (
      text.includes("message") ||
      text.includes("comment") ||
      text.includes("reply")
    ) {
      return <MessageSquare size={19} />;
    }

    if (text.includes("info") || text.includes("update")) {
      return <Info size={19} />;
    }

    return <Bell size={19} />;
  };

  const filters = [
    {
      id: "all",
      label: "All",
      count: notifications.length,
    },
    {
      id: "unread",
      label: "Unread",
      count: unreadCount,
    },
    {
      id: "read",
      label: "Read",
      count: readCount,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />

            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              System Activity
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 sm:hidden">
              <Bell size={19} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
                Notifications
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Stay up to date with everything happening in your dashboard.
              </p>
            </div>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
            <CheckCheck size={17} />
            Mark all as read
          </button>
        )}
      </div>

      {/* ================================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<Bell size={19} />}
          label="Total notifications"
          value={notifications.length}
          tone="indigo"
        />

        <SummaryCard
          icon={<span className="h-2.5 w-2.5 rounded-full bg-amber-500" />}
          label="Unread"
          value={unreadCount}
          tone="amber"
        />

        <SummaryCard
          icon={<Check size={19} />}
          label="Read"
          value={readCount}
          tone="green"
        />
      </div>

      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-fit items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition ${
                filter === item.id
                  ? "bg-white text-indigo-700 shadow-sm dark:bg-gray-950 dark:text-indigo-400"
                  : "text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
              }`}>
              {item.label}

              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  filter === item.id
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                }`}>
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {filteredNotifications.length > 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Showing {filteredNotifications.length} notification
            {filteredNotifications.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* ================================================= */}
      {/* NOTIFICATION LIST */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`group flex flex-col gap-4 p-5 transition sm:flex-row sm:items-start ${
                  notification.read
                    ? "bg-white hover:bg-indigo-50/30 dark:bg-gray-900 dark:hover:bg-indigo-950/10"
                    : "bg-indigo-50/40 hover:bg-indigo-50/70 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/30"
                }`}>
                {/* Notification Icon */}

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    notification.read
                      ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                      : "bg-indigo-600 text-white shadow-sm"
                  }`}>
                  {getNotificationIcon(notification)}
                </div>

                {/* Content */}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`text-sm ${
                        notification.read
                          ? "font-medium text-gray-700 dark:text-gray-300"
                          : "font-semibold text-gray-950 dark:text-white"
                      }`}>
                      {notification.title}
                    </h3>

                    {!notification.read && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        NEW
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                    {notification.message}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {notification.time}
                    </span>

                    {!notification.read && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />

                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          Unread
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}

                <div className="flex shrink-0 items-center gap-2 sm:pt-0.5">
                  {!notification.read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(notification.id)}
                      className="inline-flex h-9 items-center gap-2 rounded-lg border border-indigo-200 bg-white px-3 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-900/60 dark:bg-gray-900 dark:text-indigo-400 dark:hover:bg-indigo-950/40">
                      <Check size={15} />
                      <span>Mark read</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteNotification(notification.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-red-900/50 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                    aria-label="Delete notification">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState filter={filter} />
        )}
      </div>
    </div>
  );
};

/* ================================================= */
/* SUMMARY CARD */
/* ================================================= */

const SummaryCard = ({ icon, label, value, tone = "indigo" }) => {
  const tones = {
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400",

    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",

    green:
      "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          {icon}
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {label}
          </p>

          <p className="mt-1 text-xl font-bold text-gray-950 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ================================================= */
/* EMPTY STATE */
/* ================================================= */

const EmptyState = ({ filter }) => {
  const message =
    filter === "unread"
      ? "You're all caught up."
      : filter === "read"
        ? "No read notifications yet."
        : "You don't have any notifications yet.";

  const description =
    filter === "unread"
      ? "There are no unread notifications at the moment."
      : "New notifications will appear here when something needs your attention.";

  return (
    <div className="px-5 py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40">
        <Bell size={24} className="text-indigo-500 dark:text-indigo-400" />
      </div>

      <h3 className="mt-5 text-sm font-semibold text-gray-950 dark:text-white">
        {message}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};

export default Notifications;
