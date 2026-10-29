import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  Menu,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import profile from "../assets/profile.jpg";
import SearchBox from "../components/Search";
import { useTheme } from "../context/ThemeContext";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

const Header = ({ setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const navigate = useNavigate();

  // ==========================================
  // User Data
  // ==========================================

  const userName = user?.name || "Admin";
  const userEmail = user?.email || "admin@example.com";
  const userRole = user?.role || "Web Developer";

  // ==========================================
  // Close Dropdowns
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // ==========================================
  // Profile
  // ==========================================

  const toggleProfile = () => {
    setProfileOpen((prev) => !prev);
    setNotificationOpen(false);
  };

  // ==========================================
  // Notifications
  // ==========================================

  const toggleNotifications = () => {
    setNotificationOpen((prev) => !prev);
    setProfileOpen(false);
  };

  const handleNotificationClick = (id) => {
    markAsRead(id);
  };

  const handleViewAllNotifications = () => {
    setNotificationOpen(false);
    navigate("/admin/notifications");
  };

  // ==========================================
  // Profile Actions
  // ==========================================

  const handleProfile = () => {
    setProfileOpen(false);
    navigate("/admin/profile");
  };

  const handleSettings = () => {
    setProfileOpen(false);
    navigate("/admin/settings");
  };

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login");
  };

  // ==========================================
  // JSX
  // ==========================================

  return (
    <header className="relative z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-3 dark:border-gray-800 dark:bg-gray-950 sm:px-6">
      {/* ==========================================
          LEFT SIDE
      ========================================== */}

      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        {/* Mobile Menu
            Visible below md
            Hidden on md and larger
        */}

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex shrink-0 items-center justify-center rounded-lg p-2 text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 md:hidden dark:text-gray-200 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
          aria-label="Open sidebar"
          title="Open sidebar">
          <Menu size={21} />
        </button>

        {/* Dashboard Title */}

        <h1 className="truncate text-base font-bold tracking-tight text-gray-900 dark:text-white sm:text-xl">
          Dashboard
        </h1>
      </div>

      {/* ==========================================
          RIGHT SIDE
      ========================================== */}

      <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-4">
        {/* ==========================================
            SEARCH
        ========================================== */}

        <div className="hidden sm:block">
          <SearchBox />
        </div>

        {/* ==========================================
            NOTIFICATIONS
        ========================================== */}

        <div ref={notificationRef} className="relative">
          {/* Notification Button */}

          <button
            type="button"
            onClick={toggleNotifications}
            className="relative flex items-center justify-center rounded-lg p-2 text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-gray-200 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
            aria-label={
              unreadCount > 0
                ? `${unreadCount} unread notifications`
                : "Notifications"
            }
            aria-expanded={notificationOpen}
            aria-haspopup="true"
            title="Notifications">
            <Bell size={20} />

            {/* Notification Badge */}

            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white shadow-sm">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}

          {notificationOpen && (
            <div className="absolute right-0 top-12 z-50 w-[340px] max-w-[calc(100vw-1rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl shadow-gray-900/10 dark:border-gray-700 dark:bg-gray-900 dark:shadow-black/30">
              {/* Header */}

              <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-5">
                <div className="min-w-0">
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h2>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${
                          unreadCount > 1 ? "s" : ""
                        }`
                      : "You're all caught up"}
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300">
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification List */}

              {notifications.length > 0 ? (
                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => handleNotificationClick(notification.id)}
                      className={`flex w-full gap-3 border-b border-gray-100 px-4 py-4 text-left transition last:border-b-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 dark:border-gray-800 sm:px-5 ${
                        notification.read
                          ? "bg-white hover:bg-indigo-50/50 dark:bg-gray-900 dark:hover:bg-indigo-950/20"
                          : "bg-indigo-50/60 hover:bg-indigo-50 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/50"
                      }`}>
                      {/* Status */}

                      <div className="pt-1.5">
                        <span
                          className={`block h-2.5 w-2.5 rounded-full ${
                            notification.read
                              ? "bg-gray-300 dark:bg-gray-600"
                              : "bg-indigo-600 dark:bg-indigo-400"
                          }`}
                        />
                      </div>

                      {/* Content */}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm ${
                              notification.read
                                ? "font-medium text-gray-700 dark:text-gray-300"
                                : "font-semibold text-gray-900 dark:text-white"
                            }`}>
                            {notification.title}
                          </p>

                          {!notification.read && (
                            <span className="shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                              New
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                          {notification.message}
                        </p>

                        <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                          {notification.time}
                        </p>
                      </div>

                      {/* Read */}

                      {notification.read && (
                        <Check
                          size={15}
                          className="mt-1 shrink-0 text-indigo-400 dark:text-indigo-500"
                        />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                /* Empty State */

                <div className="px-5 py-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/50">
                    <Bell
                      size={23}
                      className="text-indigo-500 dark:text-indigo-400"
                    />
                  </div>

                  <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">
                    No notifications
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    You don't have any notifications right now.
                  </p>
                </div>
              )}

              {/* View All */}

              <div className="border-t border-gray-200 p-3 text-center dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleViewAllNotifications}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ==========================================
            THEME TOGGLE
        ========================================== */}

        <button
          type="button"
          onClick={toggleTheme}
          className="flex shrink-0 items-center justify-center rounded-lg p-2 text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-gray-200 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Light mode" : "Dark mode"}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* ==========================================
            PROFILE
        ========================================== */}

        <div ref={profileRef} className="relative">
          {/* Profile Button */}

          <button
            type="button"
            onClick={toggleProfile}
            className="group flex items-center gap-1 rounded-lg p-1.5 text-gray-900 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-gray-100 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 sm:gap-3"
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            aria-haspopup="true"
            title="Profile menu">
            <img
              src={profile}
              alt={`${userName} profile`}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-transparent transition group-hover:ring-indigo-200 sm:h-9 sm:w-9 dark:group-hover:ring-indigo-900"
            />

            <div className="hidden min-w-0 text-left sm:block">
              <h2 className="max-w-[120px] truncate text-sm font-semibold text-gray-900 dark:text-white">
                {userName}
              </h2>

              <p className="max-w-[120px] truncate text-xs text-gray-500 dark:text-gray-400">
                {userRole}
              </p>
            </div>

            <ChevronDown
              size={18}
              className={`hidden text-gray-500 transition-transform duration-200 dark:text-gray-400 sm:block ${
                profileOpen
                  ? "rotate-180 text-indigo-600 dark:text-indigo-400"
                  : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}

          {profileOpen && (
            <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-xl shadow-gray-900/10 dark:border-gray-700 dark:bg-gray-900 dark:shadow-black/30">
              {/* Profile Header */}

              <div className="border-b border-gray-100 px-3 py-3 dark:border-gray-800">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {userName}
                </p>

                <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                  {userEmail}
                </p>
              </div>

              {/* Links */}

              <div className="py-2">
                <button
                  type="button"
                  onClick={handleProfile}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-gray-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300">
                  <User size={17} />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  onClick={handleSettings}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-gray-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300">
                  <Settings size={17} />
                  <span>Account Settings</span>
                </button>
              </div>

              {/* Logout */}

              <div className="border-t border-gray-100 pt-2 dark:border-gray-800">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-gray-400 dark:hover:bg-red-950/30 dark:hover:text-red-400">
                  <LogOut size={17} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
