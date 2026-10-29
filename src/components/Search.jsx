import { useEffect, useRef, useState } from "react";
import {
  Search,
  X,
  Users,
  Package,
  ShoppingCart,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const searchRef = useRef(null);
  const navigate = useNavigate();

  // ==========================================
  // Search Items
  // ==========================================

  const searchItems = [
    {
      id: 1,
      title: "Users",
      description: "Manage users",
      path: "/admin/users",
      icon: Users,
    },
    {
      id: 2,
      title: "Products",
      description: "Manage products",
      path: "/admin/all/products",
      icon: Package,
    },
    {
      id: 3,
      title: "Orders",
      description: "Manage orders",
      path: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      id: 4,
      title: "Settings",
      description: "System settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  // ==========================================
  // Filter Results
  // ==========================================

  const filteredItems = searchItems.filter((item) => {
    const searchText = `${item.title} ${item.description}`.toLowerCase();

    return searchText.includes(query.toLowerCase().trim());
  });

  // ==========================================
  // Close Search When Clicking Outside
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ==========================================
  // Select Search Result
  // ==========================================

  const handleSelect = (path) => {
    navigate(path);
    setQuery("");
    setOpen(false);
  };

  // ==========================================
  // Clear Search
  // ==========================================

  const clearSearch = () => {
    setQuery("");
    setOpen(false);
  };

  // ==========================================
  // JSX
  // ==========================================

  return (
    <div ref={searchRef} className="relative hidden sm:block">
      {/* ==========================================
          SEARCH INPUT
      ========================================== */}

      <div
        className={`flex w-64 items-center rounded-full border px-4 py-2 transition-all duration-200 md:w-72 ${
          open && query
            ? "border-indigo-300 bg-white shadow-sm ring-2 ring-indigo-100 dark:border-indigo-700 dark:bg-gray-900 dark:ring-indigo-950"
            : "border-gray-200 bg-gray-50 focus-within:border-indigo-300 focus-within:bg-white dark:border-gray-700 dark:bg-gray-800 dark:focus-within:border-indigo-700 dark:focus-within:bg-gray-900"
        }`}>
        <Search
          size={18}
          className={`shrink-0 transition ${
            open && query
              ? "text-indigo-500 dark:text-indigo-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        />

        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) {
              setOpen(true);
            }
          }}
          placeholder="Search..."
          className="w-full bg-transparent px-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
          aria-label="Search dashboard"
        />

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="rounded-full p-1 text-gray-400 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
            aria-label="Clear search"
            title="Clear search">
            <X size={15} />
          </button>
        )}
      </div>

      {/* ==========================================
          SEARCH RESULTS
      ========================================== */}

      {open && query.trim() && (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl shadow-gray-900/10 dark:border-gray-700 dark:bg-gray-900 dark:shadow-black/30">
          {filteredItems.length > 0 ? (
            <>
              {/* Results Header */}

              <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Search Results
                </p>
              </div>

              {/* Results */}

              <div className="p-2">
                {filteredItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item.path)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-indigo-50 dark:hover:bg-indigo-950/30">
                      {/* Icon */}

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 transition dark:bg-indigo-950/50">
                        <Icon
                          size={18}
                          className="text-indigo-600 dark:text-indigo-400"
                        />
                      </div>

                      {/* Content */}

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>

                      {/* Arrow */}

                      <span className="text-xs text-gray-400 transition group-hover:text-indigo-500">
                        →
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* ==========================================
                EMPTY STATE
            ========================================== */

            <div className="px-5 py-9 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/50">
                <Search
                  size={21}
                  className="text-indigo-500 dark:text-indigo-400"
                />
              </div>

              <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">
                No results found
              </p>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Try searching for users, products, orders or settings.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
