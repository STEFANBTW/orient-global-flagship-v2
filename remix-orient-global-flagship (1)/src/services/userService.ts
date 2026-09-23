import { db } from '../firebase';
import { collection, doc, setDoc, getDocs, Timestamp } from 'firebase/firestore';

export interface AppUser {
  id: string;
  name: string;
  surname?: string;
  email?: string;
  password?: string;
  phone: string;
  role: 'boss' | 'hod' | 'staff' | 'customer';
  division?: string;
  dob?: string;
  avatar: string;
  deliveryAddress?: string;
  city?: string;
  whatsappConsent?: boolean;
  hasActiveOrder?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Backward-compatible type alias
export type MockConsumerUser = AppUser;

export const INITIAL_ADMIN_USER: AppUser = {
  id: "usr_admin_boss",
  name: "Boss",
  surname: "Boss",
  email: "boss@orientglobal.ng",
  phone: "+2348000000001",
  role: "boss",
  division: "global",
  dob: "1985-01-01",
  avatar: "BA",
  deliveryAddress: "Orient Global HQ, Jos",
  city: "Jos (North-Central)",
  hasActiveOrder: false
};

// Default system directory contains the Initial Admin
export const SYSTEM_DEFAULT_USERS: AppUser[] = [INITIAL_ADMIN_USER];
export const MOCK_NIGERIAN_USERS: AppUser[] = [INITIAL_ADMIN_USER];

const STORAGE_KEY = "orient_active_consumer_user";
const SESSION_KEY = "orient_active_consumer_user_session";

const ADMIN_STORAGE_KEY = "orient_active_admin_user";
const ADMIN_SESSION_KEY = "orient_active_admin_user_session";

export const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 1 week session expiration duration

/**
 * Standardize Nigerian and international phone numbers into clean digits.
 * e.g. "+234 701 841 6894" -> "7018416894"
 * e.g. "07018416894" -> "7018416894"
 */
export const normalizePhone = (phone: string): string => {
  if (!phone) return "";
  let digits = phone.replace(/\D/g, ""); // Strip non-digits
  if (digits.startsWith("234")) {
    digits = digits.slice(3);
  }
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits;
};

/**
 * Checks if two phone number strings represent the same phone user
 */
export const phonesMatch = (p1?: string, p2?: string): boolean => {
  if (!p1 || !p2) return false;
  const norm1 = normalizePhone(p1);
  const norm2 = normalizePhone(p2);
  if (!norm1 || !norm2) return false;
  return norm1 === norm2 || norm1.endsWith(norm2) || norm2.endsWith(norm1);
};

export const getAllUsers = (): AppUser[] => {
  let list: AppUser[] = [];
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("orient_all_users");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          list = parsed;
        }
      }
    } catch (e) {}
  }
  
  // Ensure Boss admin always exists in directory
  if (!list.some(u => phonesMatch(u.phone, INITIAL_ADMIN_USER.phone))) {
    list = [INITIAL_ADMIN_USER, ...list];
  }
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("orient_all_users", JSON.stringify(list));
    } catch (e) {}
  }
  return list;
};

export const deleteAllUsersFromSystem = (): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("orient_all_users");
      localStorage.removeItem("orient_active_consumer_user");
      sessionStorage.removeItem("orient_active_consumer_user_session");
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      window.dispatchEvent(new CustomEvent("orient_all_users_changed", { detail: [INITIAL_ADMIN_USER] }));
      window.dispatchEvent(new CustomEvent("orient_consumer_user_changed", { detail: null }));
      window.dispatchEvent(new CustomEvent("orient_admin_user_changed", { detail: null }));
    } catch (e) {}
  }
};

export const saveUser = async (user: AppUser): Promise<AppUser[]> => {
  const currentUsers = getAllUsers();
  const index = currentUsers.findIndex(u => u.id === user.id || phonesMatch(u.phone, user.phone));
  let updatedList: AppUser[];
  if (index !== -1) {
    updatedList = [...currentUsers];
    updatedList[index] = { ...updatedList[index], ...user };
  } else {
    updatedList = [user, ...currentUsers];
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("orient_all_users", JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent("orient_all_users_changed", { detail: updatedList }));
    } catch (e) {}
  }

  try {
    const userRef = doc(db, "users", user.id);
    await setDoc(userRef, {
      ...user,
      updatedAt: Timestamp.now()
    }, { merge: true });
  } catch (e) {
    console.warn("Could not save user to Firestore:", e);
  }

  return updatedList;
};

export const deleteUserFromStore = async (userId: string): Promise<AppUser[]> => {
  const currentUsers = getAllUsers();
  const updatedList = currentUsers.filter(u => u.id !== userId);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("orient_all_users", JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent("orient_all_users_changed", { detail: updatedList }));
    } catch (e) {}
  }

  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { status: "Deleted", isDeleted: true }, { merge: true });
  } catch (e) {
    console.warn("Could not delete user from Firestore:", e);
  }

  return updatedList;
};

export const getMockUsers = (): AppUser[] => {
  return getAllUsers();
};

export const getActiveConsumerUser = (): AppUser | null => {
  if (typeof window !== "undefined") {
    try {
      const sessionSaved = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(STORAGE_KEY);
      if (sessionSaved) {
        const parsed = JSON.parse(sessionSaved);
        if (parsed && parsed.user && parsed.expiresAt) {
          if (Date.now() > parsed.expiresAt) {
            sessionStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(STORAGE_KEY);
            return null;
          }
          if (parsed.user.role && parsed.user.role !== 'customer') {
            sessionStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(STORAGE_KEY);
            return null;
          }
          return parsed.user;
        } else if (parsed && parsed.id) {
          if (parsed.role && parsed.role !== 'customer') {
            sessionStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(STORAGE_KEY);
            return null;
          }
          return parsed;
        }
      }
    } catch (e) {}
  }
  return null;
};

export const setActiveConsumerUser = (user: AppUser | null): void => {
  if (typeof window !== "undefined") {
    try {
      if (user) {
        const sessionPayload = {
          user,
          loginTime: Date.now(),
          expiresAt: Date.now() + ONE_WEEK_MS
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionPayload));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionPayload));
      } else {
        sessionStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(STORAGE_KEY);
      }
      window.dispatchEvent(new CustomEvent("orient_consumer_user_changed", { detail: user }));
    } catch (e) {}
  }
};

export const getActiveAdminUser = (): AppUser | null => {
  if (typeof window !== "undefined") {
    try {
      const sessionSaved = sessionStorage.getItem(ADMIN_SESSION_KEY) || localStorage.getItem(ADMIN_STORAGE_KEY);
      if (sessionSaved) {
        const parsed = JSON.parse(sessionSaved);
        if (parsed && parsed.user && parsed.expiresAt) {
          if (Date.now() > parsed.expiresAt) {
            sessionStorage.removeItem(ADMIN_SESSION_KEY);
            localStorage.removeItem(ADMIN_STORAGE_KEY);
            return null;
          }
          if (parsed.user.role === 'customer') {
            sessionStorage.removeItem(ADMIN_SESSION_KEY);
            localStorage.removeItem(ADMIN_STORAGE_KEY);
            return null;
          }
          return parsed.user;
        } else if (parsed && parsed.id) {
          if (parsed.role === 'customer') {
            sessionStorage.removeItem(ADMIN_SESSION_KEY);
            localStorage.removeItem(ADMIN_STORAGE_KEY);
            return null;
          }
          return parsed;
        }
      }
    } catch (e) {}
  }
  return null;
};

export const setActiveAdminUser = (admin: AppUser | null): void => {
  if (typeof window !== "undefined") {
    try {
      if (admin) {
        const sessionPayload = {
          user: admin,
          loginTime: Date.now(),
          expiresAt: Date.now() + ONE_WEEK_MS
        };
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionPayload));
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionPayload));
      } else {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      }
      window.dispatchEvent(new CustomEvent("orient_admin_user_changed", { detail: admin }));
    } catch (e) {}
  }
};

/**
 * Robust database validation for Customer User Login.
 * Matches by normalized phone number or name in Firestore and local state.
 */
export const validateUserLogin = async (phone: string, name: string): Promise<AppUser> => {
  const cleanPhone = phone.trim();
  const cleanName = name.trim().toLowerCase();

  let matched: AppUser | null = null;

  // 1. Check local storage
  const allLocal = getAllUsers();
  
  // First attempt: match by phone number
  matched = allLocal.find(u => phonesMatch(u.phone, cleanPhone)) || null;

  // Second attempt: match by name if phone matching didn't yield a result
  if (!matched && cleanName) {
    matched = allLocal.find(u => {
      const uName = u.name.trim().toLowerCase();
      const uSurname = u.surname?.trim().toLowerCase() || "";
      return uName.includes(cleanName) || cleanName.includes(uName) || (uSurname && cleanName.includes(uSurname));
    }) || null;
  }

  // 2. Query Firestore database
  if (!matched) {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as AppUser;
        if (
          (data.phone && phonesMatch(data.phone, cleanPhone)) ||
          (data.name && data.name.trim().toLowerCase().includes(cleanName))
        ) {
          matched = data;
        }
      });
    } catch (e) {
      console.warn("Firestore query error during user validation:", e);
    }
  }

  if (!matched) {
    throw new Error("ACCOUNT_NOT_FOUND");
  }

  if (matched.role !== 'customer') {
    throw new Error("ADMIN_ACCOUNT_REJECTED");
  }

  await saveUser(matched);
  return matched;
};

/**
 * Robust database validation for Admin Login.
 */
export const validateAdminLogin = async (
  phone: string, 
  name: string, 
  role: 'boss' | 'hod' | 'staff'
): Promise<AppUser> => {
  const cleanPhone = phone.trim();
  const cleanName = name.trim().toLowerCase();

  // If Boss details or default boss phone/name, return Boss admin
  const isBossPhoneMatch = phonesMatch(cleanPhone, INITIAL_ADMIN_USER.phone) || 
                           normalizePhone(cleanPhone).endsWith("8000000001") || 
                           normalizePhone(cleanPhone).endsWith("000000001");
                           
  if (isBossPhoneMatch || (cleanName === "boss" && role === "boss")) {
    await saveUser(INITIAL_ADMIN_USER);
    return INITIAL_ADMIN_USER;
  }

  let matched: AppUser | null = null;

  // 1. Check local storage
  const allLocal = getAllUsers();
  matched = allLocal.find(u => 
    phonesMatch(u.phone, cleanPhone) ||
    u.name.trim().toLowerCase().includes(cleanName) ||
    (u.surname && u.surname.trim().toLowerCase().includes(cleanName))
  ) || null;

  // 2. Query Firestore database
  if (!matched) {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as AppUser;
        if (
          (data.phone && phonesMatch(data.phone, cleanPhone)) ||
          (data.name && data.name.trim().toLowerCase().includes(cleanName))
        ) {
          matched = data;
        }
      });
    } catch (e) {
      console.warn("Firestore query error during admin validation:", e);
    }
  }

  if (!matched) {
    throw new Error("ADMIN_NOT_FOUND");
  }

  if (matched.role === 'customer') {
    throw new Error("CUSTOMER_ACCOUNT_REJECTED");
  }

  await saveUser(matched);
  return matched;
};

export const updateActiveConsumerUserDetails = (updates: Partial<AppUser>): AppUser | null => {
  const current = getActiveConsumerUser();
  if (!current) return null;
  const initials = updates.name 
    ? updates.name.trim().split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : current.avatar;
  const updated: AppUser = {
    ...current,
    ...updates,
    avatar: initials || current.avatar
  };
  setActiveConsumerUser(updated);
  saveUser(updated);
  return updated;
};

export const seedAdminUserToFirestore = async (): Promise<void> => {
  try {
    const userRef = doc(db, "users", INITIAL_ADMIN_USER.id);
    await setDoc(userRef, {
      ...INITIAL_ADMIN_USER,
      updatedAt: Timestamp.now()
    }, { merge: true });
    console.log("Successfully seeded Boss Admin into Firestore 'users' collection!");
  } catch (error) {
    console.warn("Could not seed Boss admin to Firestore:", error);
  }
};

if (typeof window !== "undefined") {
  setTimeout(() => {
    seedAdminUserToFirestore().catch(() => {});
  }, 500);
}
