import { useEffect, useMemo, useState } from "react";
import {
  Moon,
  Sun,
  Bell,
  Mail,
  ShoppingCart,
  Megaphone,
  Lock,
  Globe,
  Clock3,
  Save,
  X,
  Eye,
  EyeOff,
  Palette,
  ShieldCheck,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const DEFAULT_NOTIFICATIONS = {
  email: true,
  orders: true,
  marketing: false,
};

const DEFAULT_PREFERENCES = {
  language: "English",
  timezone: "UTC +05:00",
};

const STORAGE_KEYS = {
  notifications: "dashboard-settings-notifications",
  preferences: "dashboard-settings-preferences",
};

const PASSWORD_DEFAULTS = {
  current: "",
  newPassword: "",
  confirm: "",
};

const getStoredData = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);

    if (!stored) {
      return fallback;
    }

    const parsed = JSON.parse(stored);

    return {
      ...fallback,
      ...parsed,
    };
  } catch {
    return fallback;
  }
};

const getPasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      label: "Enter a password",
    };
  }

  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) {
    return {
      score,
      label: "Weak",
    };
  }

  if (score <= 4) {
    return {
      score,
      label: "Medium",
    };
  }

  return {
    score,
    label: "Strong",
  };
};

export default function Settings() {
  const { darkMode, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState(() =>
    getStoredData(STORAGE_KEYS.notifications, DEFAULT_NOTIFICATIONS),
  );

  const [preferences, setPreferences] = useState(() =>
    getStoredData(STORAGE_KEYS.preferences, DEFAULT_PREFERENCES),
  );

  const [savedSettings, setSavedSettings] = useState(() => ({
    notifications: getStoredData(
      STORAGE_KEYS.notifications,
      DEFAULT_NOTIFICATIONS,
    ),
    preferences: getStoredData(STORAGE_KEYS.preferences, DEFAULT_PREFERENCES),
  }));

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [passwordModal, setPasswordModal] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [passwordData, setPasswordData] = useState(PASSWORD_DEFAULTS);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPassword: false,
    confirm: false,
  });

  const hasChanges = useMemo(() => {
    return (
      JSON.stringify(notifications) !==
        JSON.stringify(savedSettings.notifications) ||
      JSON.stringify(preferences) !== JSON.stringify(savedSettings.preferences)
    );
  }, [notifications, preferences, savedSettings]);

  const passwordStrength = useMemo(
    () => getPasswordStrength(passwordData.newPassword),
    [passwordData.newPassword],
  );

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && passwordModal && !passwordUpdating) {
        closePasswordModal();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [passwordModal, passwordUpdating]);

  const updateNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    setSaved(false);
  };

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    if (!hasChanges || saving) {
      return;
    }

    setSaving(true);
    setSaved(false);

    setTimeout(() => {
      localStorage.setItem(
        STORAGE_KEYS.notifications,
        JSON.stringify(notifications),
      );

      localStorage.setItem(
        STORAGE_KEYS.preferences,
        JSON.stringify(preferences),
      );

      setSavedSettings({
        notifications: { ...notifications },
        preferences: { ...preferences },
      });

      setSaving(false);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    }, 700);
  };

  const openPasswordModal = () => {
    setPasswordModal(true);
    setPasswordError("");
    setPasswordData(PASSWORD_DEFAULTS);
    setShowPasswords({
      current: false,
      newPassword: false,
      confirm: false,
    });
  };

  const closePasswordModal = () => {
    if (passwordUpdating) {
      return;
    }

    setPasswordModal(false);
    setPasswordError("");
    setPasswordData(PASSWORD_DEFAULTS);

    setShowPasswords({
      current: false,
      newPassword: false,
      confirm: false,
    });
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (passwordError) {
      setPasswordError("");
    }
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    const { current, newPassword, confirm } = passwordData;

    if (!current || !newPassword || !confirm) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must contain at least 8 characters.");
      return;
    }

    if (current === newPassword) {
      setPasswordError(
        "Your new password must be different from your current password.",
      );
      return;
    }

    if (newPassword !== confirm) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setPasswordUpdating(true);
    setPasswordError("");

    setTimeout(() => {
      setPasswordUpdating(false);
      setPasswordModal(false);
      setPasswordData(PASSWORD_DEFAULTS);

      setShowPasswords({
        current: false,
        newPassword: false,
        confirm: false,
      });

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    }, 800);
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
              System Preferences
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Settings
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Manage your preferences and account settings.
            </p>
          </div>

          {hasChanges && (
            <div className="flex items-center gap-2 self-start rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400 sm:self-auto">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Unsaved changes
            </div>
          )}
        </div>

        {/* Success Message */}
        {saved && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
              <Check size={17} />
            </div>

            <div>
              <p className="font-semibold">Changes saved successfully</p>

              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                Your preferences have been updated.
              </p>
            </div>
          </div>
        )}

        {/* Appearance */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <SectionHeader
            icon={<Palette size={18} />}
            title="Appearance"
            description="Customize how the dashboard looks."
          />

          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Dark mode
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    {darkMode
                      ? "Dark appearance is currently enabled."
                      : "Use a lighter appearance for your dashboard."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  darkMode ? "bg-indigo-600" : "bg-gray-300 dark:bg-slate-700"
                }`}>
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                    darkMode ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <SectionHeader
            icon={<Bell size={18} />}
            title="Notifications"
            description="Choose which notifications you want to receive."
          />

          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            <NotificationRow
              icon={<Mail size={18} />}
              title="Email notifications"
              description="Receive important account updates by email."
              enabled={notifications.email}
              onToggle={() => updateNotification("email")}
            />

            <NotificationRow
              icon={<ShoppingCart size={18} />}
              title="Order notifications"
              description="Get notified when a new order is created or updated."
              enabled={notifications.orders}
              onToggle={() => updateNotification("orders")}
            />

            <NotificationRow
              icon={<Megaphone size={18} />}
              title="Marketing notifications"
              description="Receive product news, promotions and special offers."
              enabled={notifications.marketing}
              onToggle={() => updateNotification("marketing")}
            />
          </div>
        </section>

        {/* Regional Preferences */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <SectionHeader
            icon={<Globe size={18} />}
            title="Regional Preferences"
            description="Set your language and timezone preferences."
          />

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                Language
              </label>

              <div className="relative">
                <Globe
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  value={preferences.language}
                  onChange={(e) => updatePreference("language", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  <option>English</option>
                  <option>Urdu</option>
                  <option>Arabic</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>

                <ChevronDownIcon />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                Timezone
              </label>

              <div className="relative">
                <Clock3
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  value={preferences.timezone}
                  onChange={(e) => updatePreference("timezone", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  <option>UTC +05:00</option>
                  <option>UTC +00:00</option>
                  <option>UTC +01:00</option>
                  <option>UTC +03:00</option>
                  <option>UTC +04:00</option>
                  <option>UTC +06:00</option>
                  <option>UTC +08:00</option>
                  <option>UTC +09:00</option>
                  <option>UTC -05:00</option>
                  <option>UTC -08:00</option>
                </select>

                <ChevronDownIcon />
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <SectionHeader
            icon={<ShieldCheck size={18} />}
            title="Security"
            description="Keep your account secure and protected."
          />

          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-950/60 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                  <Lock size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Password
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    Update your password regularly to keep your account secure.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openPasswordModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400">
                <Lock size={16} />
                Change Password
              </button>
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {hasChanges ? (
              <p className="text-sm text-gray-500 dark:text-slate-400">
                You have changes that haven't been saved yet.
              </p>
            ) : (
              <p className="text-sm text-gray-400 dark:text-slate-500">
                Your settings are up to date.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              !hasChanges || saving
                ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600"
                : "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:scale-[0.98]"
            }`}>
            {saving ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Password Modal */}
      {passwordModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closePasswordModal();
            }
          }}>
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-modal-title">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-slate-800">
              <div>
                <h2
                  id="password-modal-title"
                  className="text-lg font-bold text-gray-900 dark:text-white">
                  Change Password
                </h2>

                <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                  Create a new secure password for your account.
                </p>
              </div>

              <button
                type="button"
                onClick={closePasswordModal}
                disabled={passwordUpdating}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Close modal">
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-5 p-5">
                {/* Error */}
                {passwordError && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />

                    <span>{passwordError}</span>
                  </div>
                )}

                <PasswordInput
                  label="Current Password"
                  value={passwordData.current}
                  onChange={(value) => handlePasswordChange("current", value)}
                  visible={showPasswords.current}
                  onToggle={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                  autoComplete="current-password"
                />

                <div>
                  <PasswordInput
                    label="New Password"
                    value={passwordData.newPassword}
                    onChange={(value) =>
                      handlePasswordChange("newPassword", value)
                    }
                    visible={showPasswords.newPassword}
                    onToggle={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        newPassword: !prev.newPassword,
                      }))
                    }
                    autoComplete="new-password"
                  />

                  {/* Password Strength */}
                  {passwordData.newPassword && (
                    <div className="mt-3">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-slate-400">
                          Password strength
                        </span>

                        <span
                          className={`text-xs font-semibold ${
                            passwordStrength.label === "Strong"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : passwordStrength.label === "Medium"
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-red-600 dark:text-red-400"
                          }`}>
                          {passwordStrength.label}
                        </span>
                      </div>

                      <div className="flex gap-1.5">
                        {[1, 2, 3].map((item) => {
                          const active =
                            passwordStrength.label === "Strong"
                              ? true
                              : passwordStrength.label === "Medium"
                                ? item <= 2
                                : item === 1;

                          return (
                            <div
                              key={item}
                              className={`h-1.5 flex-1 rounded-full transition ${
                                active
                                  ? passwordStrength.label === "Strong"
                                    ? "bg-emerald-500"
                                    : passwordStrength.label === "Medium"
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                  : "bg-gray-200 dark:bg-slate-700"
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <PasswordInput
                    label="Confirm New Password"
                    value={passwordData.confirm}
                    onChange={(value) => handlePasswordChange("confirm", value)}
                    visible={showPasswords.confirm}
                    onToggle={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                    autoComplete="new-password"
                  />

                  {passwordData.confirm && (
                    <p
                      className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${
                        passwordData.newPassword === passwordData.confirm
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}>
                      <Check size={14} />
                      {passwordData.newPassword === passwordData.confirm
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </p>
                  )}
                </div>

                <div className="rounded-xl bg-gray-50 px-3.5 py-3 text-xs leading-5 text-gray-500 dark:bg-slate-950 dark:text-slate-400">
                  Use at least 8 characters with a mix of uppercase letters,
                  lowercase letters, numbers, and symbols for a stronger
                  password.
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={passwordUpdating}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={passwordUpdating}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {passwordUpdating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- */
/* Reusable Components            */
/* ----------------------------- */

function SectionHeader({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4 border-b border-gray-100 px-5 py-5 dark:border-slate-800 sm:px-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
        {icon}
      </div>

      <div>
        <h2 className="text-base font-bold text-gray-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function NotificationRow({ icon, title, description, enabled, onToggle }) {
  return (
    <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500 dark:bg-slate-800 dark:text-slate-400">
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>

          <p className="mt-1 max-w-xl text-sm text-gray-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-label={`Toggle ${title}`}
        aria-pressed={enabled}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          enabled ? "bg-indigo-600" : "bg-gray-300 dark:bg-slate-700"
        }`}>
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
        {label}
      </label>

      <div className="relative">
        <Lock
          size={17}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-11 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-600"
          placeholder={`Enter ${label.toLowerCase()}`}
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label={visible ? "Hide password" : "Show password"}>
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}
