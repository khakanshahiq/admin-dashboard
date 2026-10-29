import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  Shield,
  UserPlus,
  X,
} from "lucide-react";
import { useUsers } from "../../context/UserContext";

const AddUser = () => {
  const navigate = useNavigate();
  const { users, addUser } = useUsers();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Customer",
    status: "Active",
    password: "",
    confirmPassword: "",
  });

  const [avatar, setAvatar] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!avatar) return undefined;

    return () => URL.revokeObjectURL(avatar);
  }, [avatar]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      submit: "",
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatarError("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setAvatarError("Please select a JPG, PNG, or WEBP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Image must be smaller than 2MB.");
      e.target.value = "";
      return;
    }

    setAvatar(URL.createObjectURL(file));
    e.target.value = "";
  };

  const removeAvatar = () => {
    setAvatar("");
    setAvatarError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm the password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (success || !validate()) return;

    const normalizedEmail = formData.email.trim().toLowerCase();

    const emailExists = users.some(
      (user) => user.email?.trim().toLowerCase() === normalizedEmail,
    );

    if (emailExists) {
      setErrors((prev) => ({
        ...prev,
        email: "This email address is already registered.",
      }));
      return;
    }

    const initials = formData.name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const newUser = {
      name: formData.name.trim(),
      email: normalizedEmail,
      phone: formData.phone.trim(),
      role: formData.role,
      status: formData.status,
      joined: new Date().toISOString().slice(0, 10),
      avatar: initials,
    };

    try {
      // Passwords are not stored in this frontend demo context.
      // The selected profile image is a preview only.
      addUser(newUser);
      setSuccess(true);

      navigate("/admin/users", { state: { userCreated: true } });
    } catch (error) {
      console.error("Failed to create user:", error);

      setErrors((prev) => ({
        ...prev,
        submit: "Could not create the user. Please try again.",
      }));
    }
  };

  const inputClass = (field) =>
    `mt-1 block h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 ${
      errors[field]
        ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-800 dark:focus:border-red-700 dark:focus:ring-red-950"
        : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 dark:border-slate-800 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
    }`;

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            aria-label="Back to users"
            title="Back to users"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 dark:focus:ring-offset-slate-950">
            <ArrowLeft size={18} aria-hidden="true" />
          </button>

          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Management
              </p>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Add User
            </h1>

            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Create a new user account for your dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div
          className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
          role="status"
          aria-live="polite">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
            <Check size={15} aria-hidden="true" />
          </div>
          <span>User created successfully.</span>
        </div>
      )}

      {errors.submit && (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
          role="alert">
          {errors.submit}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* MAIN FORM */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.02] dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10 xl:col-span-2">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                User Information
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Enter the basic information for this user.
              </p>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField label="Full Name" htmlFor="name">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    autoComplete="name"
                    className={inputClass("name")}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <ErrorMessage id="name-error">{errors.name}</ErrorMessage>
                  )}
                </FormField>

                <FormField label="Email Address" htmlFor="email">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="user@example.com"
                    autoComplete="email"
                    className={inputClass("email")}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <ErrorMessage id="email-error">{errors.email}</ErrorMessage>
                  )}
                </FormField>

                <FormField label="Phone Number" htmlFor="phone">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    autoComplete="tel"
                    className={inputClass("phone")}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {errors.phone && (
                    <ErrorMessage id="phone-error">{errors.phone}</ErrorMessage>
                  )}
                </FormField>

                <FormField label="Role" htmlFor="role">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={inputClass("role")}>
                    <option value="Customer">Customer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </FormField>

                <FormField label="Password" htmlFor="password">
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                      className={`${inputClass("password")} pr-11`}
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                    />
                    <PasswordToggle
                      visible={showPassword}
                      onClick={() => setShowPassword((prev) => !prev)}
                      label={showPassword ? "Hide password" : "Show password"}
                    />
                  </div>
                  {errors.password && (
                    <ErrorMessage id="password-error">
                      {errors.password}
                    </ErrorMessage>
                  )}
                </FormField>

                <FormField label="Confirm Password" htmlFor="confirmPassword">
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      className={`${inputClass("confirmPassword")} pr-11`}
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={
                        errors.confirmPassword
                          ? "confirm-password-error"
                          : undefined
                      }
                    />
                    <PasswordToggle
                      visible={showConfirmPassword}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    />
                  </div>
                  {errors.confirmPassword && (
                    <ErrorMessage id="confirm-password-error">
                      {errors.confirmPassword}
                    </ErrorMessage>
                  )}
                </FormField>

                <FormField label="Status" htmlFor="status">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={inputClass("status")}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </FormField>
              </div>
            </div>

            {/* FORM ACTIONS */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/30 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 dark:focus:ring-offset-slate-900">
                <X size={16} aria-hidden="true" />
                Cancel
              </button>

              <button
                type="submit"
                disabled={success}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:hover:shadow-indigo-950/40 dark:focus:ring-offset-slate-900">
                <UserPlus size={16} aria-hidden="true" />
                Create User
              </button>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* PROFILE IMAGE */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.02] dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10">
              <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Profile Image
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Upload an optional profile photo.
                </p>
              </div>

              <div className="p-5">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile preview"
                        className="h-28 w-28 rounded-full object-cover ring-4 ring-indigo-50 dark:ring-indigo-950/40"
                      />
                    ) : (
                      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-50 text-indigo-400 ring-4 ring-indigo-50/70 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-950/20">
                        <ImagePlus size={28} aria-hidden="true" />
                      </div>
                    )}

                    {avatar && (
                      <button
                        type="button"
                        onClick={removeAvatar}
                        aria-label="Remove profile image"
                        title="Remove profile image"
                        className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-red-900/50 dark:hover:bg-red-950/30">
                        <X size={14} aria-hidden="true" />
                      </button>
                    )}
                  </div>

                  <label className="mt-4 inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 text-xs font-semibold text-indigo-700 transition-all duration-200 hover:bg-indigo-100 focus-within:ring-2 focus-within:ring-indigo-500 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-950">
                    <ImagePlus size={15} aria-hidden="true" />
                    Choose Image
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarChange}
                      className="sr-only"
                    />
                  </label>

                  <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
                    JPG, PNG or WEBP. Maximum 2MB.
                  </p>

                  {avatarError && (
                    <p className="mt-2 text-center text-xs font-medium text-red-500">
                      {avatarError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ROLE INFORMATION */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.02] dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10">
              <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Shield
                    size={17}
                    aria-hidden="true"
                    className="text-indigo-500 dark:text-indigo-400"
                  />
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    User Role
                  </h2>
                </div>
              </div>

              <div className="p-5">
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Select whether this account is an admin or a customer.
                </p>

                <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50/70 p-3.5 dark:border-indigo-900/50 dark:bg-indigo-950/30">
                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    Selected role
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {formData.role}
                  </p>
                </div>
              </div>
            </div>

            {/* TIP */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.02] dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <UserPlus size={16} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    Quick tip
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Use a valid email address because users may use it to access
                    their account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const FormField = ({ label, htmlFor, children }) => (
  <div>
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium text-slate-700 dark:text-slate-300">
      {label}
    </label>
    {children}
  </div>
);

const ErrorMessage = ({ id, children }) => (
  <p
    id={id}
    className="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400"
    role="alert">
    {children}
  </p>
);

const PasswordToggle = ({ visible, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-500 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400">
    {visible ? (
      <EyeOff size={17} aria-hidden="true" />
    ) : (
      <Eye size={17} aria-hidden="true" />
    )}
  </button>
);

export default AddUser;
