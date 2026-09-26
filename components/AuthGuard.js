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
    const isPublicPage =
      pathname === "/" ||
      pathname === "/barang" ||
      pathname.startsWith("/detail-barang") ||
      pathname === "/review";
    const isAdminPage = pathname.startsWith("/dashboard") || pathname.startsWith("/manajemen-");
    const isUserOnlyPage = pathname === "/peminjaman" || pathname === "/riwayat";

    if (!token || !currentUser) {
      if (!isPublicPage && !isAuthPage) {
        router.replace("/login");
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsAuthorized(true);
      }
      return;
    }

    const role = String(currentUser.role || "").trim().toLowerCase() === "admin" ? "admin" : "user";

    if (role === "admin") {
      if (isAuthPage) {
        router.replace("/dashboard");
      } else if (isUserOnlyPage) {
        router.replace("/manajemen-peminjaman");
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