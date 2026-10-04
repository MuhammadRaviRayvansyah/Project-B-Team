"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/components/UserContexts";
import { getUserProfile } from "@/lib/token";

export default function ReviewForm({ id_barang, onSubmit }) {
  const { user } = useUser();
  const activeUser = user || getUserProfile();
  const [rating, setRating] = useState(5);
  const [komentar, setKomentar] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!komentar.trim() || !activeUser) return;

    setIsSubmitting(true);
    const userId = activeUser.id_user || activeUser.id;

    const formData = new FormData();
    formData.append("id_user", userId);
    formData.append("id_barang", id_barang);
    formData.append("rating", rating);
    formData.append("komentar", komentar.trim());

    try {
      await onSubmit(formData);
      setRating(5);
      setKomentar("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!activeUser) {
    return (
      <div className="mt-4 p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-center">
        <p className="text-xs text-slate-400">
          Silakan{" "}
          <Link
            href="/login"
            className="text-amber-400 font-bold hover:underline"
          >
            masuk ke akun Anda
          </Link>{" "}
          untuk memberikan ulasan pada barang ini.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-3 border-t border-slate-800/80 pt-4"
    >
      <p className="text-xs text-slate-400">
        Ulasan sebagai{" "}
        <span className="font-semibold text-amber-400">
          {activeUser.nama || activeUser.nama_user || "Pengguna"}
        </span>
      </p>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="w-full px-3 py-2 bg-slate-900/90 text-slate-200 border border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-400 transition-all cursor-pointer"
      >
        <option value={5} className="bg-[#091823] text-slate-200">
          5 — Sangat Bagus
        </option>
        <option value={4} className="bg-[#091823] text-slate-200">
          4 — Bagus
        </option>
        <option value={3} className="bg-[#091823] text-slate-200">
          3 — Cukup
        </option>
        <option value={2} className="bg-[#091823] text-slate-200">
          2 — Kurang
        </option>
        <option value={1} className="bg-[#091823] text-slate-200">
          1 — Buruk
        </option>
      </select>

      <textarea
        value={komentar}
        onChange={(e) => setKomentar(e.target.value)}
        placeholder="Tulis ulasan kamu..."
        required
        rows={3}
        className="w-full px-3.5 py-2.5 bg-slate-900/90 text-slate-100 placeholder-slate-500 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all resize-none"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto text-xs font-extrabold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all duration-200 disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
      </button>
    </form>
  );
}