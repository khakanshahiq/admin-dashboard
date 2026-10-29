import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  Lock,
  Save,
  Shield,
  X,
} from "lucide-react";
import { useUsers } from "../../context/UserContext";

const ROLES = ["Admin", "Customer"];

const normalizeId = (value) => String(value ?? "").replace(/^#/, "");

const normalizeRole = (role) => {
  const value = String(role ?? "")
    .trim()
    .toLowerCase();

  if (value === "admin" || value === "administrator") {
    return "Admin";
  }

  return "Customer";
};

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { users = [], updateUser } = useUsers();

  const existingUser = users.find(
    (user) => normalizeId(user.id) === normalizeId(id),
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Customer",
    status: "Active",
    password: "",
    confirmPassword: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!existingUser) return;

    setFormData({
      name: existingUser.name || "",
      email: existingUser.email || "",
      phone: existingUser.phone || "",
      role: normalizeRole(existingUser.role),
      status:
        String(existingUser.status || "Active").toLowerCase() === "inactive"
          ? "Inactive"
          : "Active",
      password: "",
      confirmPassword: "",
    });

    setAvatar(existingUser.avatar || null);
    setErrors({});
    setSuccess(false);
    setSaving(false);
  }, [existingUser?.id]);

  const inputClass = (field) =>
    `mt-1 block h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 ${
      errors[field]
        ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-800"
        : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 dark:border-slate-800 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
    }`;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      ...(name === "password" || name === "confirmPassword"
        ? { password: "", confirmPassword: "" }
        : {}),
      form: "",
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors((previous) => ({
        ...previous,
        avatar: "Choose a JPG, PNG, or WEBP image.",
      }));
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((previous) => ({
        ...previous,
        avatar: "Image must be smaller than 2MB.",
      }));
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
        setErrors((previous) => ({
          ...previous,
          avatar: "",
        }));
      }
    };

    reader.onerror = () => {
      setErrors((previous) => ({
        ...previous,
        avatar: "Unable to read this image. Please try another.",
      }));
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const removeAvatar = () => {
    setAvatar(null);

    setErrors((previous) => ({
      ...previous,
      avatar: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!name) {
      nextErrors.name = "Name is required.";
    }

    if (!email) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!phone) {
      nextErrors.phone = "Phone number is required.";
    }

    if (formData.password && formData.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.password && formData.confirmPassword) {
      nextErrors.confirmPassword =
        "Enter a new password or clear the confirmation field.";
    }

    const duplicateEmail = users.some(
      (user) =>
        normalizeId(user.id) !== normalizeId(existingUser?.id) &&
        user.email?.trim().toLowerCase() === email.toLowerCase(),
    );

    if (duplicateEmail) {
      nextErrors.email = "This email address is already in use.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving || success) return;

    if (!existingUser) {
      setErrors({ form: "The user could not be found." });
      return;
    }

    if (!validate()) return;

    setSaving(true);
    setErrors({});

    try {
      const updatedUser = {
        ...existingUser,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        status: formData.status,
        avatar,
      };

      // Password fields are deliberately not added to the user record.
      // Password changes must be handled by a secure backend endpoint.
      const result = updateUser(existingUser.id, updatedUser);

      // Support synchronous context updates and promise-based updates.
      if (result && typeof result.then === "function") {
        await result;
      }

      setSuccess(true);

      window.setTimeout(() => {
        navigate(`/admin/user/${id}`);
      }, 800);
    } catch (error) {
      console.error("Unable to update user:", error);

      setErrors({
        form: "Unable to update the user. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) =>
    String(name || "?")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const fieldError = (field) =>
    errors[field] ? (
      <p className="mt-1.5 text-xs text-red-500" role="alert">
        {errors[field]}
      </p>
    ) : null;

  if (!existingUser) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
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
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(`/admin/user/${id}`)}
          aria-label="Back to user details"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <ArrowLeft size={18} />
        </button>

        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Edit User
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Update {existingUser.name}'s account information.
          </p>
        </div>
      </div>

      {success && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          <Check size={18} />
          User updated successfully. Redirecting...
        </div>
      )}

      {errors.form && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Main form */}
          <div className="space-y-6 xl:col-span-2">
            {/* User information */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  User Information
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Update the user's basic information.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    className={inputClass("name")}
                  />

                  {fieldError("name")}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    className={inputClass("email")}
                  />

                  {fieldError("email")}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    aria-invalid={Boolean(errors.phone)}
                    className={inputClass("phone")}
                  />

                  {fieldError("phone")}
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Role
                  </label>

                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={inputClass("role")}>
                    {!ROLES.includes(formData.role) && (
                      <option value={formData.role}>{formData.role}</option>
                    )}

                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={inputClass("status")}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Password */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Lock
                    size={16}
                    className="text-indigo-600 dark:text-indigo-400"
                  />

                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Change Password
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Leave both fields empty to keep the current password. Password
                  changes require a secure backend endpoint.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      aria-invalid={Boolean(errors.password)}
                      className={`${inputClass("password")} pr-11`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-slate-400 hover:text-indigo-600">
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>

                  {fieldError("password")}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat new password"
                      autoComplete="new-password"
                      aria-invalid={Boolean(errors.confirmPassword)}
                      className={`${inputClass("confirmPassword")} pr-11`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-slate-400 hover:text-indigo-600">
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>

                  {fieldError("confirmPassword")}
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate(`/admin/user/${id}`)}
                disabled={saving}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">
                <X size={16} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving || success}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                <Save size={16} />
                {saving ? "Saving..." : success ? "Saved" : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Profile image */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Profile Image
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Change the user's profile photo.
                </p>
              </div>

              <div className="flex flex-col items-center p-5">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={`${formData.name || "User"} profile`}
                    className="h-28 w-28 rounded-full object-cover ring-4 ring-indigo-50 dark:ring-indigo-950/40"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-50 text-2xl font-semibold text-indigo-600 ring-4 ring-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400">
                    {getInitials(formData.name)}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-400">
                    <ImagePlus size={15} />
                    Change Image
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarChange}
                      className="sr-only"
                    />
                  </label>

                  {avatar && (
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:text-slate-300">
                      <X size={14} />
                      Remove
                    </button>
                  )}
                </div>

                <p className="mt-3 text-center text-xs text-slate-400">
                  JPG, PNG or WEBP. Maximum 2MB.
                </p>

                {fieldError("avatar")}
              </div>
            </section>

            {/* Role information */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Shield
                    size={16}
                    className="text-indigo-600 dark:text-indigo-400"
                  />

                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    User Role
                  </h2>
                </div>
              </div>

              <div className="p-5">
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                  The selected role determines the user's access level.
                </p>

                <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50/70 p-3.5 dark:border-indigo-900/50 dark:bg-indigo-950/30">
                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    Current role
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {formData.role}
                  </p>
                </div>
              </div>
            </section>

            {/* Account status */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    Account Status
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Current account state
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    formData.status === "Active"
                      ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                  {formData.status}
                </span>
              </div>
            </section>
          </aside>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
