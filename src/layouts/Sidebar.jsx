import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  FolderTree,
  FileText,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState("management");
  const [collapsedMenu, setCollapsedMenu] = useState(null);
  const [flyoutPosition, setFlyoutPosition] = useState({
    top: 0,
    left: 0,
  });

  const managementButtonRef = useRef(null);
  const analyticsButtonRef = useRef(null);
  const flyoutRef = useRef(null);

  /*
   * ============================================================
   * ACTIVE ROUTES
   * ============================================================
   */

  const isManagementActive =
    location.pathname.startsWith("/admin/users") ||
    location.pathname.startsWith("/admin/all/products") ||
    location.pathname.startsWith("/admin/orders") ||
    location.pathname.startsWith("/admin/categories");

  const isAnalyticsActive =
    location.pathname.startsWith("/admin/sales") ||
    location.pathname.startsWith("/admin/reports");

  /*
   * ============================================================
   * AUTOMATICALLY OPEN ACTIVE SUBMENU
   * ============================================================
   */

  useEffect(() => {
    if (isManagementActive) {
      setOpenMenu("management");
    } else if (isAnalyticsActive) {
      setOpenMenu("analytics");
    }
  }, [location.pathname, isManagementActive, isAnalyticsActive]);

  /*
   * ============================================================
   * CLOSE COLLAPSED FLYOUT WHEN ROUTE CHANGES
   * ============================================================
   */

  useEffect(() => {
    setCollapsedMenu(null);
  }, [location.pathname]);

  /*
   * ============================================================
   * CLOSE FLYOUT WHEN CLICKING OUTSIDE
   * ============================================================
   */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!collapsedMenu) return;

      const clickedFlyout = flyoutRef.current?.contains(event.target);
      const clickedManagementButton = managementButtonRef.current?.contains(
        event.target,
      );
      const clickedAnalyticsButton = analyticsButtonRef.current?.contains(
        event.target,
      );

      if (
        !clickedFlyout &&
        !clickedManagementButton &&
        !clickedAnalyticsButton
      ) {
        setCollapsedMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [collapsedMenu]);

  /*
   * ============================================================
   * ESCAPE KEY
   * ============================================================
   */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setCollapsedMenu(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /*
   * ============================================================
   * TOGGLE NORMAL SUBMENU
   * ============================================================
   */

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
    setCollapsedMenu(null);
  };

  /*
   * ============================================================
   * TOGGLE DESKTOP SIDEBAR
   * ============================================================
   */

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
    setCollapsedMenu(null);
  };

  /*
   * ============================================================
   * OPEN COLLAPSED FLYOUT
   * ============================================================
   */

  const openCollapsedMenu = (menu, buttonRef) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    setFlyoutPosition({
      top: rect.top,
      left: rect.right + 12,
    });

    setCollapsedMenu((prev) => (prev === menu ? null : menu));
  };

  /*
   * ============================================================
   * CLOSE MOBILE SIDEBAR
   * ============================================================
   */

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  /*
   * ============================================================
   * NAVIGATION STYLES
   * ============================================================
   */

  const navLinkClass = ({ isActive }) =>
    `group relative flex w-full items-center rounded-lg text-sm font-medium transition-all duration-200 ${
      collapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3"
    } ${
      isActive
        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
        : "text-gray-600 hover:bg-indigo-50/70 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
    }`;

  /*
   * ============================================================
   * SUBMENU STYLES
   * ============================================================
   */

  const submenuClass = ({ isActive }) =>
    `group relative flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all duration-200 ${
      isActive
        ? "bg-indigo-50 font-medium text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
        : "text-gray-500 hover:bg-indigo-50/70 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
    }`;

  /*
   * ============================================================
   * PARENT MENU STYLES
   * ============================================================
   */

  const parentMenuClass = (isActive) =>
    `flex w-full items-center rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
      collapsed ? "justify-center px-3 py-3" : "justify-between px-4 py-2.5"
    } ${
      isActive
        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
        : "text-gray-400 hover:bg-indigo-50/70 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
    }`;

  /*
   * ============================================================
   * SCROLLBAR
   * ============================================================
   */

  const scrollbarClasses = `
    [&::-webkit-scrollbar]:w-[4px]
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:bg-slate-300
    hover:[&::-webkit-scrollbar-thumb]:bg-slate-400
    dark:[&::-webkit-scrollbar-thumb]:bg-slate-600
    dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-500
  `;

  /*
   * ============================================================
   * MANAGEMENT SUBMENU
   * ============================================================
   */

  const managementSubmenu = (
    <div className="mt-2 space-y-1 pl-2">
      <NavLink
        to="/admin/users"
        onClick={closeMobileSidebar}
        className={submenuClass}>
        <Users size={17} />
        <span>Users</span>
      </NavLink>

      <NavLink
        to="/admin/categories"
        onClick={closeMobileSidebar}
        className={submenuClass}>
        <FolderTree size={17} />
        <span>Categories</span>
      </NavLink>

      <NavLink
        to="/admin/all/products"
        onClick={closeMobileSidebar}
        className={submenuClass}>
        <Package size={17} />
        <span>Products</span>
      </NavLink>

      <NavLink
        to="/admin/orders"
        onClick={closeMobileSidebar}
        className={submenuClass}>
        <ShoppingCart size={17} />
        <span>Orders</span>
      </NavLink>
    </div>
  );

  /*
   * ============================================================
   * ANALYTICS SUBMENU
   * ============================================================
   */

  const analyticsSubmenu = (
    <div className="mt-2 space-y-1 pl-2">
      <NavLink
        to="/admin/sales"
        onClick={closeMobileSidebar}
        className={submenuClass}>
        <BarChart3 size={17} />
        <span>Sales</span>
      </NavLink>

      <NavLink
        to="/admin/reports"
        onClick={closeMobileSidebar}
        className={submenuClass}>
        <FileText size={17} />
        <span>Reports</span>
      </NavLink>
    </div>
  );

  /*
   * ============================================================
   * COLLAPSED MANAGEMENT FLYOUT
   * ============================================================
   */

  const collapsedManagementSubmenu = (
    <div
      ref={flyoutRef}
      className="fixed z-[100] w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-2xl ring-1 ring-black/5 dark:border-gray-700 dark:bg-gray-900 dark:ring-white/5"
      style={{
        top: `${flyoutPosition.top}px`,
        left: `${flyoutPosition.left}px`,
      }}>
      <div className="mb-1 px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Management
        </p>
      </div>

      <NavLink
        to="/admin/users"
        onClick={() => {
          setCollapsedMenu(null);
          closeMobileSidebar();
        }}
        className={submenuClass}>
        <Users size={17} />
        <span>Users</span>
      </NavLink>

      <NavLink
        to="/admin/categories"
        onClick={() => {
          setCollapsedMenu(null);
          closeMobileSidebar();
        }}
        className={submenuClass}>
        <FolderTree size={17} />
        <span>Categories</span>
      </NavLink>

      <NavLink
        to="/admin/all/products"
        onClick={() => {
          setCollapsedMenu(null);
          closeMobileSidebar();
        }}
        className={submenuClass}>
        <Package size={17} />
        <span>Products</span>
      </NavLink>

      <NavLink
        to="/admin/orders"
        onClick={() => {
          setCollapsedMenu(null);
          closeMobileSidebar();
        }}
        className={submenuClass}>
        <ShoppingCart size={17} />
        <span>Orders</span>
      </NavLink>
    </div>
  );

  /*
   * ============================================================
   * COLLAPSED ANALYTICS FLYOUT
   * ============================================================
   */

  const collapsedAnalyticsSubmenu = (
    <div
      ref={flyoutRef}
      className="fixed z-[100] w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-2xl ring-1 ring-black/5 dark:border-gray-700 dark:bg-gray-900 dark:ring-white/5"
      style={{
        top: `${flyoutPosition.top}px`,
        left: `${flyoutPosition.left}px`,
      }}>
      <div className="mb-1 px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Analytics
        </p>
      </div>

      <NavLink
        to="/admin/sales"
        onClick={() => {
          setCollapsedMenu(null);
          closeMobileSidebar();
        }}
        className={submenuClass}>
        <BarChart3 size={17} />
        <span>Sales</span>
      </NavLink>

      <NavLink
        to="/admin/reports"
        onClick={() => {
          setCollapsedMenu(null);
          closeMobileSidebar();
        }}
        className={submenuClass}>
        <FileText size={17} />
        <span>Reports</span>
      </NavLink>
    </div>
  );

  /*
   * ============================================================
   * RETURN
   * ============================================================
   */

  return (
    <>
      {/* ======================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <aside
        className={`relative hidden h-screen flex-shrink-0 border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-950 md:flex md:flex-col ${
          collapsed ? "w-20" : "w-64"
        }`}>
        {/* ==================================================
            DESKTOP HEADER
        ================================================== */}

        <div
          className={`flex h-20 flex-shrink-0 items-center border-b border-gray-200 px-4 dark:border-gray-800 ${
            collapsed ? "justify-center" : "justify-between"
          }`}>
          {collapsed ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-sm">
              KS
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Sardar KS UI
              </h2>

              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
                React & Tailwind UI
              </p>
            </div>
          )}

          {/* Collapse Button */}

          <button
            type="button"
            onClick={toggleSidebar}
            className="absolute -right-3 top-7 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* ==================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden ${scrollbarClasses}`}>
          <nav className="px-3 py-6">
            {/* Main */}

            {!collapsed && (
              <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Main
              </p>
            )}

            {/* Dashboard */}

            <NavLink
              to="/admin"
              end
              onClick={() => setCollapsedMenu(null)}
              className={navLinkClass}
              title={collapsed ? "Dashboard" : undefined}>
              <LayoutDashboard size={19} />

              {!collapsed && <span>Dashboard</span>}
            </NavLink>

            {/* ==================================================
                MANAGEMENT
            ================================================== */}

            <div className="relative mt-6">
              {!collapsed && (
                <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Management
                </p>
              )}

              {collapsed ? (
                <>
                  <button
                    ref={managementButtonRef}
                    type="button"
                    onClick={() =>
                      openCollapsedMenu("management", managementButtonRef)
                    }
                    className={parentMenuClass(isManagementActive)}
                    title="Management"
                    aria-label="Management"
                    aria-expanded={collapsedMenu === "management"}>
                    <Users size={19} />
                  </button>

                  {collapsedMenu === "management" && collapsedManagementSubmenu}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => toggleMenu("management")}
                    className={parentMenuClass(isManagementActive)}
                    aria-expanded={openMenu === "management"}>
                    <span>Management</span>

                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${
                        openMenu === "management" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openMenu === "management" && managementSubmenu}
                </>
              )}
            </div>

            {/* ==================================================
                ANALYTICS
            ================================================== */}

            <div className="relative mt-6">
              {!collapsed && (
                <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Analytics
                </p>
              )}

              {collapsed ? (
                <>
                  <button
                    ref={analyticsButtonRef}
                    type="button"
                    onClick={() =>
                      openCollapsedMenu("analytics", analyticsButtonRef)
                    }
                    className={parentMenuClass(isAnalyticsActive)}
                    title="Analytics"
                    aria-label="Analytics"
                    aria-expanded={collapsedMenu === "analytics"}>
                    <BarChart3 size={19} />
                  </button>

                  {collapsedMenu === "analytics" && collapsedAnalyticsSubmenu}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => toggleMenu("analytics")}
                    className={parentMenuClass(isAnalyticsActive)}
                    aria-expanded={openMenu === "analytics"}>
                    <span>Analytics</span>

                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${
                        openMenu === "analytics" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openMenu === "analytics" && analyticsSubmenu}
                </>
              )}
            </div>

            {/* ==================================================
                SYSTEM
            ================================================== */}

            <div className="mt-6">
              {!collapsed && (
                <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  System
                </p>
              )}

              <NavLink
                to="/admin/settings"
                end
                onClick={() => setCollapsedMenu(null)}
                className={navLinkClass}
                title={collapsed ? "Settings" : undefined}>
                <Settings size={19} />

                {!collapsed && <span>Settings</span>}
              </NavLink>
            </div>
          </nav>
        </div>

        {/* ==================================================
            DESKTOP FOOTER
        ================================================== */}

        {!collapsed && (
          <div className="flex-shrink-0 border-t border-gray-200 p-4 dark:border-gray-800">
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Sardar KS UI
              </p>

              <p className="mt-0.5 text-[11px] text-gray-400">Version 1.0.0</p>
            </div>
          </div>
        )}
      </aside>

      {/* ======================================================
          MOBILE SIDEBAR
      ====================================================== */}

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}

          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={closeMobileSidebar}
          />

          {/* Sidebar */}

          <aside className="relative flex h-full w-[min(18rem,calc(100vw-1rem))] flex-col overflow-hidden bg-white shadow-2xl dark:bg-gray-950">
            {/* Mobile Header */}

            <div className="flex h-20 flex-shrink-0 items-center justify-between border-b border-gray-200 px-5 dark:border-gray-800">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Sardar KS UI
                </h2>

                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
                  React & Tailwind UI
                </p>
              </div>

              <button
                type="button"
                onClick={closeMobileSidebar}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
                aria-label="Close sidebar"
                title="Close sidebar">
                <X size={21} />
              </button>
            </div>

            {/* Mobile Navigation */}

            <div className={`flex-1 overflow-y-auto ${scrollbarClasses}`}>
              <nav className="px-4 py-6">
                {/* Main */}

                <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Main
                </p>

                {/* Dashboard */}

                <NavLink
                  to="/admin"
                  end
                  onClick={closeMobileSidebar}
                  className={navLinkClass}>
                  <LayoutDashboard size={19} />
                  <span>Dashboard</span>
                </NavLink>

                {/* Management */}

                <div className="mt-6">
                  <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Management
                  </p>

                  <button
                    type="button"
                    onClick={() => toggleMenu("management")}
                    className={parentMenuClass(isManagementActive)}
                    aria-expanded={openMenu === "management"}>
                    <span>Management</span>

                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${
                        openMenu === "management" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openMenu === "management" && managementSubmenu}
                </div>

                {/* Analytics */}

                <div className="mt-6">
                  <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Analytics
                  </p>

                  <button
                    type="button"
                    onClick={() => toggleMenu("analytics")}
                    className={parentMenuClass(isAnalyticsActive)}
                    aria-expanded={openMenu === "analytics"}>
                    <span>Analytics</span>

                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${
                        openMenu === "analytics" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openMenu === "analytics" && analyticsSubmenu}
                </div>

                {/* System */}

                <div className="mt-6">
                  <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    System
                  </p>

                  <NavLink
                    to="/admin/settings"
                    end
                    onClick={closeMobileSidebar}
                    className={navLinkClass}>
                    <Settings size={19} />
                    <span>Settings</span>
                  </NavLink>
                </div>
              </nav>
            </div>

            {/* Mobile Footer */}

            <div className="flex-shrink-0 border-t border-gray-200 p-4 dark:border-gray-800">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Sardar KS UI
              </p>

              <p className="mt-0.5 text-[11px] text-gray-400">Version 1.0.0</p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
