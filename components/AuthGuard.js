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
    setIsAuthorized(false);

    const token = getToken();
    let currentUser = user || getUserProfile();

    if (!user && currentUser) {
      setUser(currentUser);
    }

    // Kelompok Halaman
    const isAuthPage = pathname === "/login" || pathname === "/register";
    
    // ------------------------------------------------------------------------
    // /detail-barang DIHAPUS dari isPublicPage agar wajib LOGIN
    // ------------------------------------------------------------------------
    const isPublicPage =
      pathname === "/" ||
      pathname === "/barang" ||
      pathname === "/review";

    const isAdminPage =
      pathname.startsWith("/dashboard") || pathname.startsWith("/manajemen-");
    const isUserOnlyPage =
      pathname === "/peminjaman" || pathname === "/riwayat";

    // 1. Pengguna BELUM LOGIN
    if (!token || !currentUser) {
      if (!isPublicPage && !isAuthPage) {
        // Jika mencoba direct URL ke /detail-barang (atau halaman proteksi lain), lempar ke /login
        router.replace("/login");
      } else {
        setIsAuthorized(true);
      }
      return;
    }

    // 2. Pengguna SUDAH LOGIN
    const role =
      String(currentUser.role || "").trim().toLowerCase() === "admin"
        ? "admin"
        : "user";

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
        // User biasa sekarang BISA mengakses /detail-barang setelah login
        setIsAuthorized(true);
      }
    }
  }, [pathname, user, router, setUser]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9ff]">
        <div className="inline-flex items-center gap-2.5 text-slate-500 text-xs font-semibold">
          <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
          <span>Memeriksa hak akses...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}