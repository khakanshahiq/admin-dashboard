import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  ShoppingBag,
  DollarSign,
  Package,
  Edit,
  UserRound,
  CheckCircle2,
} from "lucide-react";
import { useUsers } from "../../context/UserContext";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users } = useUsers();

  const normalizeId = (value) => String(value ?? "").replace(/^#/, "");

  const user = users.find((item) => normalizeId(item.id) === normalizeId(id));

  const getInitials = (name = "") =>
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const formatDate = (date) => {
    if (!date) return "Not provided";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not provided";
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const hasImage =
    typeof user?.avatar === "string" &&
    (user.avatar.startsWith("https://") ||
      user.avatar.startsWith("http://") ||
      user.avatar.startsWith("data:image/"));

  if (!user) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
          <UserRound size={25} />
        </div>

        <h1 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
          User not found
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          This user does not exist in your saved user list.
        </p>

        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700">
          <ArrowLeft size={16} />
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/admin/users"
            aria-label="Back to users"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <ArrowLeft size={18} />
          </Link>

          <div className="min-w-0">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              User Management
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              User Details
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              View saved account information.
            </p>
          </div>
        </div>

        <Link
          to={`/admin/user/${id}/edit`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700">
          <Edit size={17} />
          Edit User
        </Link>
      </div>

      {/* Profile */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-xl font-bold text-indigo-600 ring-4 ring-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-950/30">
              {hasImage ? (
                <img
                  src={user.avatar}
                  alt={`${user.name} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(user.name)
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {user.name}
                </h2>

                <StatusBadge status={user.status} />
              </div>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                User ID:{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  #{user.id}
                </span>
              </p>

              <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:flex-wrap sm:gap-4">
                <span className="flex min-w-0 items-center gap-1.5">
                  <Mail size={15} className="shrink-0 text-indigo-500" />
                  <span className="break-all">
                    {user.email || "Not provided"}
                  </span>
                </span>

                <span className="flex items-center gap-1.5">
                  <Phone size={15} className="shrink-0 text-indigo-500" />
                  {user.phone || "Not provided"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 md:w-auto md:min-w-[190px] dark:border-indigo-900/50 dark:bg-indigo-950/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Shield size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-indigo-500 dark:text-indigo-400">
                Account Role
              </p>

              <p className="mt-0.5 truncate text-sm font-semibold text-slate-900 dark:text-white">
                {user.role || "Not assigned"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics: show only data actually available */}
      <section aria-labelledby="user-statistics">
        <h2 id="user-statistics" className="sr-only">
          User statistics
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Orders"
            value="—"
            icon={<ShoppingBag size={20} />}
            iconClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
          />

          <StatCard
            label="Total Spent"
            value="—"
            icon={<DollarSign size={20} />}
            iconClass="bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400"
          />

          <StatCard
            label="Products"
            value="—"
            icon={<Package size={20} />}
            iconClass="bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
          />

          <StatCard
            label="Member Since"
            value={formatDate(user.joined)}
            icon={<Calendar size={20} />}
            iconClass="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
            smallValue
          />
        </div>

        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          Order statistics will be displayed when connected to actual order
          records.
        </p>
      </section>

      {/* Information and activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <SectionHeader
            icon={<UserRound size={16} />}
            title="Personal Information"
          />

          <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 sm:p-6">
            <InfoItem label="Full Name" value={user.name} />
            <InfoItem label="Email Address" value={user.email} />
            <InfoItem label="Phone Number" value={user.phone} />
            <InfoItem label="Role" value={user.role} />

            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Location
              </p>

              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
                <MapPin size={16} className="shrink-0 text-indigo-500" />
                {user.location || "Not provided"}
              </p>
            </div>

            <InfoItem label="Date Joined" value={formatDate(user.joined)} />

            <InfoItem
              label="Account Status"
              value={user.status || "Not provided"}
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <SectionHeader
            icon={<Calendar size={16} />}
            title="Recent Activity"
          />

          <div className="p-5 sm:p-6">
            <div className="flex flex-col items-center py-5 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <Calendar size={21} />
              </div>

              <p className="mt-3 text-sm font-medium text-slate-900 dark:text-white">
                No activity available
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Activity history will appear here when real activity records are
                connected.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Order information */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />

              <h3 className="font-semibold text-slate-900 dark:text-white">
                Order Information
              </h3>
            </div>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Orders associated with this user.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="inline-flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40">
            View all orders
            <ArrowLeft size={14} className="rotate-180" />
          </Link>
        </div>

        <div className="p-8 text-center">
          <Package
            size={28}
            className="mx-auto text-slate-400 dark:text-slate-500"
          />

          <p className="mt-3 text-sm font-medium text-slate-900 dark:text-white">
            No user-specific order data connected
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Link your order records to show this user's orders, dates, and
            statuses here.
          </p>
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ status }) {
  const isActive = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        isActive
          ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
      }`}>
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-green-500" : "bg-slate-400"
        }`}
      />
      {status || "Unknown"}
    </span>
  );
}

function StatCard({ label, value, icon, iconClass, smallValue = false }) {
  return (
    <article className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <p
            className={`mt-2 break-words font-bold tracking-tight text-slate-900 dark:text-white ${
              smallValue ? "text-sm leading-5" : "text-2xl"
            }`}>
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
          {icon}
        </div>
      </div>
    </article>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
        {icon}
      </div>

      <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-900 dark:text-white">
        {value || "Not provided"}
      </p>
    </div>
  );
}
