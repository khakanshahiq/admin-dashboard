import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  ShieldCheck,
  CalendarDays,
  Edit,
  Camera,
  MapPin,
  User,
  BriefcaseBusiness,
  Save,
  X,
  Check,
  UserRound,
} from "lucide-react";
import Hero from "../../assets/hero.png";

const initialProfile = {
  name: "Admin",
  email: "admin@example.com",
  phone: "+92 300 1234567",
  jobTitle: "Web Developer",
  location: "Faisalabad, Pakistan",
  bio: "Passionate web developer focused on building modern and user-friendly digital experiences.",
};

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const avatarUrlRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [draftProfile, setDraftProfile] = useState(initialProfile);

  const [avatar, setAvatar] = useState(Hero);
  const [draftAvatar, setDraftAvatar] = useState(Hero);

  const [saved, setSaved] = useState(false);

  /* ================================================= */
  /* CLEANUP PREVIEW URL */
  /* ================================================= */

  useEffect(() => {
    return () => {
      if (avatarUrlRef.current) {
        URL.revokeObjectURL(avatarUrlRef.current);
      }
    };
  }, []);

  /* ================================================= */
  /* START EDITING */
  /* ================================================= */

  const handleEdit = () => {
    setDraftProfile(profile);
    setDraftAvatar(avatar);
    setSaved(false);
    setEditing(true);
  };

  /* ================================================= */
  /* INPUT CHANGE */
  /* ================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setDraftProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaved(false);
  };

  /* ================================================= */
  /* AVATAR CHANGE */
  /* ================================================= */

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (avatarUrlRef.current) {
      URL.revokeObjectURL(avatarUrlRef.current);
    }

    const preview = URL.createObjectURL(file);

    avatarUrlRef.current = preview;

    setDraftAvatar(preview);
    setSaved(false);

    event.target.value = "";
  };

  /* ================================================= */
  /* SAVE */
  /* ================================================= */

  const handleSave = (event) => {
    event.preventDefault();

    setProfile(draftProfile);
    setAvatar(draftAvatar);

    setEditing(false);
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  /* ================================================= */
  /* CANCEL */
  /* ================================================= */

  const handleCancel = () => {
    setDraftProfile(profile);
    setDraftAvatar(avatar);

    setEditing(false);
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-indigo-500"
            />

            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Account
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your personal information and account details.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300">
          <ArrowLeft size={17} aria-hidden="true" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* ================================================= */}
      {/* SUCCESS MESSAGE */}
      {/* ================================================= */}

      {saved && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
            <Check size={15} aria-hidden="true" />
          </div>

          <div>
            <p className="font-semibold">Profile changes saved successfully.</p>

            <p className="mt-0.5 text-xs font-normal text-green-600 dark:text-green-500">
              Your profile information has been updated.
            </p>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* MAIN GRID */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ================================================= */}
        {/* PROFILE SIDEBAR */}
        {/* ================================================= */}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* Profile Cover */}
          <div className="relative h-24 overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 dark:from-indigo-700 dark:via-indigo-800 dark:to-violet-900">
            <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 -left-8 h-32 w-32 rounded-full bg-white/5" />
          </div>

          <div className="px-5 pb-6 sm:px-6">
            {/* Avatar */}
            <div className="-mt-14 flex justify-center">
              <div className="group relative">
                <img
                  src={editing ? draftAvatar : avatar}
                  alt={`${editing ? draftProfile.name : profile.name} profile`}
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg ring-1 ring-gray-100 dark:border-gray-900 dark:ring-gray-800"
                />

                {editing && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-indigo-950/70 text-white opacity-0 transition duration-200 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      aria-label="Change profile photo">
                      <div className="flex flex-col items-center gap-1">
                        <Camera size={21} aria-hidden="true" />
                        <span className="text-[10px] font-semibold">
                          Change
                        </span>
                      </div>
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </>
                )}
              </div>
            </div>

            {editing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mx-auto mt-3 block text-xs font-semibold text-indigo-600 transition hover:text-indigo-700 focus:outline-none focus:underline dark:text-indigo-400 dark:hover:text-indigo-300">
                Change photo
              </button>
            )}

            {/* User Info */}
            <div className="mt-4 text-center">
              <h2 className="text-xl font-bold tracking-tight text-gray-950 dark:text-white">
                {editing ? draftProfile.name : profile.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {editing ? draftProfile.jobTitle : profile.jobTitle}
              </p>

              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Active
              </span>
            </div>

            {/* Contact Information */}
            <div className="mt-7 border-t border-gray-100 pt-6 dark:border-gray-800">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <UserRound size={15} aria-hidden="true" />
                </div>

                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Contact Information
                </span>
              </div>

              <div className="space-y-3">
                <ContactItem
                  icon={<Mail size={17} />}
                  label="Email"
                  value={editing ? draftProfile.email : profile.email}
                />

                <ContactItem
                  icon={<Phone size={17} />}
                  label="Phone"
                  value={editing ? draftProfile.phone : profile.phone}
                />

                <ContactItem
                  icon={<MapPin size={17} />}
                  label="Location"
                  value={editing ? draftProfile.location : profile.location}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* MAIN CONTENT */}
        {/* ================================================= */}

        <div className="space-y-6 lg:col-span-2">
          {/* ================================================= */}
          {/* PERSONAL INFORMATION */}
          {/* ================================================= */}

          <form
            onSubmit={handleSave}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <User size={18} aria-hidden="true" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Your basic personal and professional information.
                  </p>
                </div>
              </div>

              {!editing ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="inline-flex w-fit items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                  <Edit size={16} aria-hidden="true" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-700">
                    <X size={16} aria-hidden="true" />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                    <Save size={16} aria-hidden="true" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
              <ProfileField
                label="Full Name"
                name="name"
                value={editing ? draftProfile.name : profile.name}
                editing={editing}
                onChange={handleChange}
                icon={<User size={17} />}
              />

              <ProfileField
                label="Email Address"
                name="email"
                type="email"
                value={editing ? draftProfile.email : profile.email}
                editing={editing}
                onChange={handleChange}
                icon={<Mail size={17} />}
              />

              <ProfileField
                label="Phone Number"
                name="phone"
                type="tel"
                value={editing ? draftProfile.phone : profile.phone}
                editing={editing}
                onChange={handleChange}
                icon={<Phone size={17} />}
              />

              <ProfileField
                label="Job Title"
                name="jobTitle"
                value={editing ? draftProfile.jobTitle : profile.jobTitle}
                editing={editing}
                onChange={handleChange}
                icon={<BriefcaseBusiness size={17} />}
              />

              <ProfileField
                label="Location"
                name="location"
                value={editing ? draftProfile.location : profile.location}
                editing={editing}
                onChange={handleChange}
                icon={<MapPin size={17} />}
                fullWidth
              />

              {/* Bio */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="bio"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bio
                </label>

                {editing ? (
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={draftProfile.bio}
                    onChange={handleChange}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3.5 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-600 dark:hover:border-gray-600 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
                    placeholder="Tell us a little about yourself..."
                  />
                ) : (
                  <p className="rounded-lg bg-gray-50 px-3.5 py-3 text-sm leading-6 text-gray-700 dark:bg-gray-950 dark:text-gray-300">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>
          </form>

          {/* ================================================= */}
          {/* ACCOUNT DETAILS */}
          {/* ================================================= */}

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <ShieldCheck size={18} aria-hidden="true" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                    Account Details
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Information about your account.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
              <AccountCard
                icon={<ShieldCheck size={19} />}
                label="Role"
                value="Administrator"
                tone="indigo"
              />

              <AccountCard
                icon={<span className="h-3 w-3 rounded-full bg-green-500" />}
                label="Status"
                value="Active"
                tone="green"
              />

              <AccountCard
                icon={<CalendarDays size={19} />}
                label="Joined"
                value="January 2026"
                tone="amber"
              />
            </div>
          </div>

          {/* ================================================= */}
          {/* PROFILE TIP */}
          {/* ================================================= */}

          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-5 dark:border-indigo-900/50 dark:bg-indigo-950/20">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <User size={17} aria-hidden="true" />
              </div>

              <div>
                <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                  Keep your profile up to date
                </p>

                <p className="mt-1 text-xs leading-5 text-indigo-700/80 dark:text-indigo-300/80">
                  A complete profile helps your team identify you quickly and
                  keeps your account information organized.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================================================= */
/* PROFILE FIELD */
/* ================================================= */

const ProfileField = ({
  label,
  name,
  type = "text",
  value,
  editing,
  onChange,
  icon,
  fullWidth = false,
}) => {
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {editing ? (
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition peer-focus:text-indigo-500">
            {icon}
          </div>

          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            autoComplete="off"
            className="peer h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3.5 text-sm text-gray-900 outline-none transition hover:border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:border-gray-600 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
          />
        </div>
      ) : (
        <p className="flex min-h-11 items-center rounded-lg bg-gray-50 px-3.5 py-2.5 text-sm font-medium text-gray-900 dark:bg-gray-950 dark:text-white">
          {value}
        </p>
      )}
    </div>
  );
};

/* ================================================= */
/* CONTACT ITEM */
/* ================================================= */

const ContactItem = ({ icon, label, value }) => {
  return (
    <div className="group flex items-center gap-3 rounded-lg p-1.5 transition hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:group-hover:bg-indigo-950">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>

        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

/* ================================================= */
/* ACCOUNT CARD */
/* ================================================= */

const AccountCard = ({ icon, label, value, tone }) => {
  const tones = {
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400",
    green:
      "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  };

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-gray-200 hover:bg-white hover:shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700 dark:hover:bg-gray-900">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>

        <p className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

export default Profile;
