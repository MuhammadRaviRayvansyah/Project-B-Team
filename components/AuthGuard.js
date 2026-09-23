"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/components/UserContexts";
import { getToken, getUserProfile } from "@/lib/token";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();
    let currentUser = user;

    if (!currentUser) {
      const profile = getUserProfile();
      if (profile) {
        currentUser = profile;
        setUser(profile);
      }
    }

    const isAuthPage = pathname === "/login" || pathname === "/register";
    const isBeranda = pathname === "/";
    const isAdminPage = pathname.startsWith("/dashboard") || pathname.startsWith("/manajemen-");

    if (!token || !currentUser) {
      if (!isBeranda && !isAuthPage) {
        router.replace("/login");
      } else {
        setIsAuthorized(true);
      }
      return;
    }

    const role = currentUser.role === "admin" ? "admin" : "user";

    if (role === "admin") {
      if (isAuthPage) {
        router.replace("/dashboard");
      } else {
        setIsAuthorized(true);
      }
    } else {
      if (isAdminPage || isAuthPage) {
        router.replace("/barang");
      } else {
        setIsAuthorized(true);
      }
    }
  }, [pathname, user, router, setUser]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}