import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users as UsersIcon,
  UserCheck,
  UserX,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { useUsers } from "../../context/UserContext";

const USERS_PER_PAGE = 5;

const normalizeId = (id) =>
  String(id ?? "")
    .trim()
    .replace(/^#/, "");

const normalizeRole = (role) => {
  const value = String(role ?? "")
    .trim()
    .toLowerCase();

  if (["admin", "administrator"].includes(value)) return "Admin";
  return "Customer";
};

const normalizeStatus = (status) => {
  const value = String(status ?? "Active")
    .trim()
    .toLowerCase();

  if (["inactive", "disabled", "blocked"].includes(value)) {
    return "Inactive";
  }

  return "Active";
};

const getInitials = (name) =>
  String(name ?? "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(`${date}`.slice(0, 10) + "T00:00:00");

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function Users() {
  const navigate = useNavigate();
  const { users = [], deleteUser } = useUsers();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [menuId, setMenuId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const normalizedUsers = useMemo(
    () =>
      users.map((user) => ({
        ...user,
        role: normalizeRole(user.role),
        status: normalizeStatus(user.status),
      })),
    [users],
  );

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return normalizedUsers.filter((user) => {
      const matchesSearch =
        !term ||
        [
          user.id,
          user.name,
          user.email,
          user.phone,
          user.role,
          user.status,
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(term),
        );

      const matchesRole = roleFilter === "All" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [normalizedUsers, search, roleFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USERS_PER_PAGE),
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedUsers = filteredUsers.slice(
    (safePage - 1) * USERS_PER_PAGE,
    safePage * USERS_PER_PAGE,
  );

  const activeCount = normalizedUsers.filter(
    (user) => user.status === "Active",
  ).length;

  const inactiveCount = normalizedUsers.filter(
    (user) => user.status === "Inactive",
  ).length;

  const adminCount = normalizedUsers.filter(
    (user) => user.role === "Admin",
  ).length;

  useEffect(() => {
    setCurrentPage(1);
    setMenuId(null);
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (
      menuId &&
      !normalizedUsers.some((user) => normalizeId(user.id) === menuId)
    ) {
      setMenuId(null);
    }
  }, [menuId, normalizedUsers]);

  const viewUser = (id) => {
    setMenuId(null);
    navigate(`/admin/user/${encodeURIComponent(normalizeId(id))}`);
  };

  const editUser = (id) => {
    setMenuId(null);
    navigate(`/admin/user/${encodeURIComponent(normalizeId(id))}/edit`);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;

    if (typeof deleteUser !== "function") {
      setDeleteError("Delete is unavailable. Check your UserContext.");
      return;
    }

    try {
      deleteUser(userToDelete.id);
      setUserToDelete(null);
      setDeleteError("");
      setMenuId(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
      setDeleteError("Could not delete this user. Please try again.");
    }
  };

  const startIndex =
    filteredUsers.length === 0 ? 0 : (safePage - 1) * USERS_PER_PAGE + 1;

  const endIndex = Math.min(safePage * USERS_PER_PAGE, filteredUsers.length);

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 text-slate-800 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Dashboard / Users
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Users Management
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage user accounts, roles, and account status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/add/user")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <Plus size={18} />
          Add New User
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Users"
          value={normalizedUsers.length}
          icon={<UsersIcon size={21} />}
          color="indigo"
        />
        <SummaryCard
          title="Active Users"
          value={activeCount}
          icon={<UserCheck size={21} />}
          color="emerald"
        />
        <SummaryCard
          title="Inactive Users"
          value={inactiveCount}
          icon={<UserX size={21} />}
          color="rose"
        />
        <SummaryCard
          title="Administrators"
          value={adminCount}
          icon={<ShieldCheck size={21} />}
          color="amber"
        />
      </div>

      {/* Main content */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">All Users</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredUsers.length}{" "}
                {filteredUsers.length === 1 ? "user" : "users"} found
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="relative sm:col-span-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search users..."
                  aria-label="Search users"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                aria-label="Filter by role"
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Customer">Customer</option>
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by status"
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.map((user) => {
                const id = normalizeId(user.id);

                return (
                  <tr key={id} className="transition hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar user={user} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-800">
                            {user.name || "Unnamed User"}
                          </p>
                          <p className="mt-1 truncate text-sm text-slate-500">
                            {user.email || "No email"}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={user.status} />
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatDate(user.joined)}
                    </td>

                    <td className="relative px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setMenuId((current) => (current === id ? null : id))
                        }
                        aria-label={`Actions for ${user.name}`}
                        aria-expanded={menuId === id}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
                        <MoreHorizontal size={20} />
                      </button>

                      {menuId === id && (
                        <ActionMenu
                          onView={() => viewUser(user.id)}
                          onEdit={() => editUser(user.id)}
                          onDelete={() => {
                            setMenuId(null);
                            setDeleteError("");
                            setUserToDelete(user);
                          }}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}

              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <EmptyState
                      search={search}
                      onClear={() => {
                        setSearch("");
                        setRoleFilter("All");
                        setStatusFilter("All");
                      }}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 p-4 md:hidden">
          {paginatedUsers.map((user) => {
            const id = normalizeId(user.id);

            return (
              <article
                key={id}
                className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar user={user} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800">
                        {user.name || "Unnamed User"}
                      </p>
                      <p className="break-all text-sm text-slate-500">
                        {user.email || "No email"}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{user.id}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setMenuId((current) => (current === id ? null : id))
                    }
                    aria-label={`Actions for ${user.name}`}
                    className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <RoleBadge role={user.role} />
                  <StatusBadge status={user.status} />
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Joined {formatDate(user.joined)}
                </p>

                {menuId === id && (
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                    <ActionButton
                      icon={<Eye size={15} />}
                      onClick={() => viewUser(user.id)}>
                      View
                    </ActionButton>
                    <ActionButton
                      icon={<Pencil size={15} />}
                      onClick={() => editUser(user.id)}>
                      Edit
                    </ActionButton>
                    <ActionButton
                      danger
                      icon={<Trash2 size={15} />}
                      onClick={() => {
                        setMenuId(null);
                        setDeleteError("");
                        setUserToDelete(user);
                      }}>
                      Delete
                    </ActionButton>
                  </div>
                )}
              </article>
            );
          })}

          {paginatedUsers.length === 0 && (
            <EmptyState
              search={search}
              onClear={() => {
                setSearch("");
                setRoleFilter("All");
                setStatusFilter("All");
              }}
            />
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">{startIndex}</span>{" "}
            to <span className="font-semibold text-slate-700">{endIndex}</span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {filteredUsers.length}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronLeft size={16} />
              Previous
            </button>

            <span className="min-w-20 text-center text-sm text-slate-600">
              Page {safePage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Delete confirmation */}
      {userToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setUserToDelete(null);
              setDeleteError("");
            }
          }}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <Trash2 size={22} />
              </div>

              <button
                type="button"
                onClick={() => {
                  setUserToDelete(null);
                  setDeleteError("");
                }}
                aria-label="Close confirmation"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <h3
              id="delete-user-title"
              className="mt-4 text-xl font-bold text-slate-900">
              Delete user?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {userToDelete.name}
              </span>
              ? This action cannot be undone.
            </p>

            {deleteError && (
              <p role="alert" className="mt-3 text-sm text-rose-600">
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setUserToDelete(null);
                  setDeleteError("");
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700">
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`rounded-xl p-3 ${colors[color]}`}>{icon}</div>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}

function Avatar({ user }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name || "User"}
          className="h-full w-full object-cover"
        />
      ) : (
        getInitials(user.name)
      )}
    </div>
  );
}

function RoleBadge({ role }) {
  const isAdmin = role === "Admin";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        isAdmin
          ? "bg-violet-100 text-violet-700"
          : "bg-slate-100 text-slate-600"
      }`}>
      {role}
    </span>
  );
}

function StatusBadge({ status }) {
  const isActive = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
      }`}>
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />
      {status}
    </span>
  );
}

function ActionMenu({ onView, onEdit, onDelete }) {
  return (
    <div className="absolute right-8 top-12 z-30 w-40 rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-xl">
      <ActionMenuItem icon={<Eye size={15} />} onClick={onView}>
        View details
      </ActionMenuItem>
      <ActionMenuItem icon={<Pencil size={15} />} onClick={onEdit}>
        Edit user
      </ActionMenuItem>
      <div className="my-1 border-t border-slate-100" />
      <ActionMenuItem danger icon={<Trash2 size={15} />} onClick={onDelete}>
        Delete user
      </ActionMenuItem>
    </div>
  );
}

function ActionMenuItem({ children, icon, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
        danger
          ? "text-rose-600 hover:bg-rose-50"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}>
      {icon}
      {children}
    </button>
  );
}

function ActionButton({ children, icon, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
        danger
          ? "border-rose-100 text-rose-600 hover:bg-rose-50"
          : "border-slate-200 text-slate-600 hover:bg-slate-50"
      }`}>
      {icon}
      {children}
    </button>
  );
}

function EmptyState({ search, onClear }) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <UsersIcon size={22} />
      </div>
      <h3 className="mt-3 font-semibold text-slate-800">No users found</h3>
      <p className="mt-1 text-sm text-slate-500">
        {search
          ? "Try a different search or clear your filters."
          : "There are no users matching these filters."}
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
        Clear filters
      </button>
    </div>
  );
}
