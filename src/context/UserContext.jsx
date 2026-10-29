import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const UserContext = createContext(null);

const USERS_STORAGE_KEY = "sardar_ks_ui_users";

const initialUsers = [
  {
    id: "USR-001",
    name: "Ali Khan",
    email: "ali@example.com",
    phone: "+92 300 1111111",
    role: "Customer",
    status: "Active",
    joined: "2026-08-01",
    avatar: "",
  },
  {
    id: "USR-002",
    name: "Sara Ahmed",
    email: "sara@example.com",
    phone: "+92 300 2222222",
    role: "Admin",
    status: "Active",
    joined: "2026-08-05",
    avatar: "",
  },
  {
    id: "USR-003",
    name: "Usman Malik",
    email: "usman@example.com",
    phone: "+92 300 3333333",
    role: "Customer",
    status: "Active",
    joined: "2026-08-10",
    avatar: "",
  },
  {
    id: "USR-004",
    name: "Ayesha Noor",
    email: "ayesha@example.com",
    phone: "+92 300 4444444",
    role: "Customer",
    status: "Inactive",
    joined: "2026-08-12",
    avatar: "",
  },
];

const normalizeId = (id) =>
  String(id ?? "")
    .trim()
    .replace(/^#/, "");

const normalizeRole = (role) => {
  const roleAliases = {
    User: "Customer",
    Administrator: "Admin",
  };

  return roleAliases[role] || role || "Customer";
};

const normalizeUser = (user) => ({
  ...user,
  role: normalizeRole(user.role),
  status: user.status || "Active",
  avatar: user.avatar || "",
});

function getInitialUsers() {
  try {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);

    if (savedUsers !== null) {
      const parsedUsers = JSON.parse(savedUsers);

      if (Array.isArray(parsedUsers)) {
        return parsedUsers.map(normalizeUser);
      }
    }
  } catch (error) {
    console.error("Failed to load users:", error);
  }

  return initialUsers;
}

export function UserProvider({ children }) {
  const [users, setUsers] = useState(getInitialUsers);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Failed to save users:", error);
    }
  }, [users]);

  const getUserById = useCallback(
    (id) => users.find((user) => normalizeId(user.id) === normalizeId(id)),
    [users],
  );

  const addUser = useCallback((newUser) => {
    const userWithId = normalizeUser({
      ...newUser,
      id: newUser.id || `USR-${Date.now()}`,
      joined: newUser.joined || new Date().toISOString().slice(0, 10),
    });

    setUsers((currentUsers) => [userWithId, ...currentUsers]);

    return userWithId;
  }, []);

  const updateUser = useCallback((id, updates) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        normalizeId(user.id) === normalizeId(id)
          ? normalizeUser({
              ...user,
              ...updates,
              id: user.id,
            })
          : user,
      ),
    );
  }, []);

  const deleteUser = useCallback((id) => {
    setUsers((currentUsers) =>
      currentUsers.filter((user) => normalizeId(user.id) !== normalizeId(id)),
    );
  }, []);

  const value = {
    users,
    setUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUsers() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUsers must be used inside a UserProvider");
  }

  return context;
}
