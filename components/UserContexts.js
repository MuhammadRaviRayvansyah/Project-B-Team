"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { getUserProfile, setUserProfile } from "@/lib/token";
import { updateUser } from "@/lib/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      return getUserProfile();
    }
    return null;
  });

  const updateProfile = useCallback(async (data) => {
    const currentUser = user || getUserProfile();
    if (!currentUser) throw new Error("Pengguna tidak ditemukan");
    
    const userId = currentUser.id_user || currentUser.id;
    if (!userId) throw new Error("ID pengguna tidak valid");

    await updateUser(userId, data);

    const updated = { ...currentUser, ...data };
    setUser(updated);
    setUserProfile(updated);
    
    try {
      document.cookie = `user_profile=${encodeURIComponent(JSON.stringify(updated))}; path=/; max-age=${60 * 60 * 24 * 7};`;
    } catch (e) {}

    return updated;
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    return {
      user: null,
      setUser: () => {},
      updateProfile: async () => {},
    };
  }
  return context;
}