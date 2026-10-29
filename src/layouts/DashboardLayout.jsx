import { useState } from "react";
import { Outlet } from "react-router-dom";

import { Sidebar } from "./Sidebar";
import Header from "./Header";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* Sidebar */}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Application Area */}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {/* Header */}

        <Header setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}

        <main className="min-h-0 flex-1 overflow-x-hidden bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
