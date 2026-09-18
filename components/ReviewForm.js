"use client";

import { useState } from "react";
import { useUser } from "@/components/UserContexts";

export default function ReviewForm({ onSubmit }) {
  const { user } = useUser();
  const [rating, setRating] = useState(5);
  const [komentar, setKomentar] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!komentar.trim()) return;

    const today = new Date();
    const tgl = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    onSubmit({
      id_user: user.id_user,
      nama: user.nama,
      rating: Number(rating),
      komentar,
      tanggal_review: tgl,
    });

    setRating(5);
    setKomentar("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2 border-t border-slate-100 pt-3">
      <p className="text-xs text-slate-500">
        Ulasan sebagai <span className="font-semibold text-slate-900">{user.nama}</span>
      </p>
      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
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
        className="text-xs font-semibold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800"
      >
        Kirim Ulasan
      </button>
    </form>
  );
}