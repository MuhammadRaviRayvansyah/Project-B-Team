"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/UserContexts";
import { getUserProfile, clearToken, setUserProfile as setLocalUserProfile } from "@/lib/token";
import { getUser, updateUser } from "@/lib/api";

export default function EditProfile({ onClose }) {
  const router = useRouter();
  const { user, setUser, updateProfile } = useUser();
  const activeUser = user || getUserProfile();

  const userId = activeUser?.id_user || activeUser?.id || activeUser?.id_users;

  const [nama, setNama] = useState(activeUser?.nama || activeUser?.nama_user || "");
  const [email, setEmail] = useState(activeUser?.email || "");
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch detail user berdasarkan ID saat modal dibuka
  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async () => {
      // Jika tidak ada userId di session/localstorage
      if (!userId) {
        if (isMounted) setIsFetching(false);
        return;
      }

      setIsFetching(true);
      setErrorMsg("");

      try {
        // Menggunakan helper getUser(id) dari lib/api.js -> GET /users/{id}
        const data = await getUser(userId);

        if (isMounted && data) {
          const userNama = data.nama || data.nama_user || data.name || "";
          const userEmail = data.email || "";

          setNama(userNama);
          setEmail(userEmail);

          // Update state global & localStorage
          const updatedUserData = { ...activeUser, ...data };
          if (setUser) setUser(updatedUserData);
          setLocalUserProfile(updatedUserData);
        }
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
        // Fallback ke data lokal jika fetch gagal
        if (isMounted && activeUser) {
          setNama(activeUser.nama || activeUser.nama_user || "");
          setEmail(activeUser.email || "");
        }
      } finally {
        if (isMounted) setIsFetching(false);
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama.trim()) {
      setErrorMsg("Nama tidak boleh kosong.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (userId) {
        // Panggil updateUser(id, data) dari lib/api.js -> PUT /users/{id}
        const updatedData = await updateUser(userId, { nama: nama.trim() });
        
        const newProfile = {
          ...activeUser,
          ...updatedData,
          nama: nama.trim(),
          nama_user: nama.trim(),
        };

        if (setUser) setUser(newProfile);
        setLocalUserProfile(newProfile);
      } else if (updateProfile) {
        // Fallback ke fungsi updateProfile dari context
        await updateProfile({ nama: nama.trim() });
      }

      setSuccessMsg("Nama profil berhasil diperbarui!");
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || "Gagal memperbarui profil. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    if (setUser) setUser(null);
    document.cookie = "user_profile=; path=/; max-age=0;";
    document.cookie = "session_token=; path=/; max-age=0;";
    onClose();
    router.push("/login");
  };

  if (!activeUser && !isFetching) {
    return (
      <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-sm p-6 text-center">
          <p className="text-sm font-semibold text-slate-700 mb-4">Sesi login tidak ditemukan.</p>
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-md p-6 sm:p-7 relative transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 font-extrabold flex items-center justify-center text-sm shadow-sm">
              {nama ? nama.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Pengaturan Profil</h3>
              <p className="text-[11px] text-slate-500">Kelola informasi akun Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading || isFetching}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 mb-4 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            <span className="material-symbols-outlined text-rose-600 text-[18px]">error</span>
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-3 mb-4 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Nama Lengkap
            </label>
            <div className="relative">
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                disabled={isLoading || isFetching}
                required
                placeholder={isFetching ? "Memuat nama..." : "Masukkan nama lengkap"}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 disabled:bg-slate-100 transition-all shadow-xs"
              />
              {isFetching && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-slate-300 border-t-amber-500 rounded-full animate-spin" />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Email Akun
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                disabled
                placeholder={isFetching ? "Memuat email..." : "Email terdaftar"}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed select-none shadow-xs font-medium"
              />
              {isFetching && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-slate-300 border-t-amber-500 rounded-full animate-spin" />
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Email terikat secara permanen sebagai identitas akun login Anda.
            </p>
          </div>

          <div className="pt-2 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading || isFetching}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || isFetching}
              className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Perubahan</span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoading || isFetching}
            className="w-full py-2.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
}