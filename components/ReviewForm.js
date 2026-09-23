"use client";

import { useState } from "react";
import { useUser } from "@/components/UserContexts";

export default function ReviewForm({ id_barang, onSubmit }) {
  const { user } = useUser();
  const [rating, setRating] = useState(5);
  const [komentar, setKomentar] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!komentar.trim()) return;

    // Gunakan FormData agar sesuai dengan standar Server Action Next.js
    const formData = new FormData();
    
    // Jika belum login, gunakan ID 1 sebagai user tamu (dummy)
    const userId = user ? (user.id_user || user.id) : 1;
    
    formData.append("id_user", userId);
    formData.append("id_barang", id_barang);
    formData.append("rating", rating);
    formData.append("komentar", komentar);

    await onSubmit(formData);

    setRating(5);
    setKomentar("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2 border-t border-slate-100 pt-3">
      <p className="text-xs text-slate-500">
        Ulasan sebagai <span className="font-semibold text-slate-900">
          {user ? (user.nama_user || user.nama || `User #${user.id_user}`) : "Tamu (Belum Login)"}
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
        className="text-xs font-semibold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
      >
        Kirim Ulasan
      </button>
    </form>
  );
}