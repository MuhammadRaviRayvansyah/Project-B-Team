"use client";

import { createContext, useContext, useState } from "react";
import { users } from "@/app/data";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(users[0]);

  const updateProfile = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <UserContext.Provider value={{ user, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}