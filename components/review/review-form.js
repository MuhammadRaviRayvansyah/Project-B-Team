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
      <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
        <p className="text-xs text-slate-500">
          Silakan{" "}
          <Link href="/login" className="text-amber-600 font-bold hover:underline">
            masuk ke akun Anda
          </Link>{" "}
          untuk memberikan ulasan pada barang ini.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2 border-t border-slate-100 pt-3">
      <p className="text-xs text-slate-500">
        Ulasan sebagai <span className="font-semibold text-slate-900">
          {activeUser.nama || activeUser.nama_user || "Pengguna"}
        </span>
      </p>
      
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-800"
      >
        <option value={5}>5 — Sangat Bagus</option>
        <option value={4}>4 — Bagus</option>
        <option value={3}>3 — Cukup</option>
        <option value={2}>2 — Kurang</option>
        <option value={1}>1 — Buruk</option>
      </select>
      
      <textarea
        value={komentar}
        onChange={(e) => setKomentar(e.target.value)}
        placeholder="Tulis ulasan kamu..."
        required
        rows={2}
        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-800 resize-none"
      />
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="text-xs font-semibold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
      </button>
    </form>
  );
}